import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import defaultVideos from "@/data/videos.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface VideoRecord {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  instructor: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
}

// In-memory runtime cache for serverless environments
let serverVideosCache: VideoRecord[] = [];
let serverDeletedCache: Set<string> = new Set();

const DEMO_VIDEO_IDS = new Set([
  "V-01",
  "V-02",
  "V-03",
  "V-04",
  "V-05",
  "V-REIHO-01",
  "V-PINAN-01",
  "V-BASSAI-01",
  "SR-PINAN-01",
  "SR-BASSAI-01",
]);

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|e\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  return match ? match[1] : null;
}

function getVideoUniqueKey(v: { id?: string; videoUrl?: string; title?: string }): string {
  const ytId = extractYouTubeId(v.videoUrl);
  if (ytId) return `yt:${ytId}`;
  if (v.videoUrl && v.videoUrl.trim()) return `url:${v.videoUrl.trim().toLowerCase()}`;
  return `id:${v.id || v.title || ""}`;
}

function isBlacklisted(v?: Partial<VideoRecord> | null): boolean {
  if (!v || !v.id) return true;
  if (DEMO_VIDEO_IDS.has(v.id)) return true;
  if (v.videoUrl && v.videoUrl.includes("51VZdzaDPro")) return true;
  const t = (v.title || "").toLowerCase();
  if (t.includes("pinan shodan") || t.includes("bassai dai")) return true;
  return false;
}

function deduplicateVideos(list: VideoRecord[]): VideoRecord[] {
  const map = new Map<string, VideoRecord>();
  for (const v of list) {
    if (!v || isBlacklisted(v) || !v.videoUrl) continue;
    const key = getVideoUniqueKey(v);
    if (!map.has(key)) {
      map.set(key, v);
    }
  }
  return Array.from(map.values());
}

// =========================================================================
// GLOBAL PERSISTENT STORAGE ADAPTERS (works across ALL countries & devices)
// Priority: 1) Upstash / Vercel KV  2) GitHub Repo  3) Supabase  4) File/Static
// =========================================================================

function getKvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url: url.replace(/\/$/, ""), token };
  return null;
}

async function readFromKv(): Promise<VideoRecord[] | null> {
  const kv = getKvConfig();
  if (!kv) return null;
  try {
    const res = await fetch(`${kv.url}/get/sosakai:videos`, {
      headers: { Authorization: `Bearer ${kv.token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || !json.result) return null;
    const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function writeToKv(videos: VideoRecord[]): Promise<boolean> {
  const kv = getKvConfig();
  if (!kv) return false;
  try {
    const res = await fetch(`${kv.url}/set/sosakai:videos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kv.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videos),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function getGithubConfig() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.GITHUB_REPO || "adriandoct/sosakai";
  const branch = process.env.GITHUB_BRANCH || "main";
  if (token) return { token, repo, branch, filePath: "src/data/videos.json" };
  return null;
}

async function readFromGithub(): Promise<{ videos: VideoRecord[]; sha: string } | null> {
  const gh = getGithubConfig();
  if (!gh) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${gh.repo}/contents/${gh.filePath}?ref=${gh.branch}`,
      {
        headers: {
          Authorization: `Bearer ${gh.token}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || !json.content) return null;
    const decoded = Buffer.from(json.content, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (Array.isArray(parsed)) {
      return { videos: parsed, sha: json.sha };
    }
    return null;
  } catch {
    return null;
  }
}

async function writeToGithub(videos: VideoRecord[], message: string): Promise<boolean> {
  const gh = getGithubConfig();
  if (!gh) return false;
  try {
    const existing = await readFromGithub();
    const contentB64 = Buffer.from(JSON.stringify(videos, null, 2) + "\n", "utf-8").toString("base64");
    const res = await fetch(
      `https://api.github.com/repos/${gh.repo}/contents/${gh.filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${gh.token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: contentB64,
          branch: gh.branch,
          ...(existing?.sha ? { sha: existing.sha } : {}),
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && !url.includes("xebnswbzcylfnuffyfjf")) {
    return { url: url.replace(/\/$/, ""), key };
  }
  return null;
}

async function readFromSupabase(): Promise<VideoRecord[] | null> {
  const sb = getSupabaseConfig();
  if (!sb) return null;
  try {
    const res = await fetch(`${sb.url}/rest/v1/dojo_videos?select=*&order=created_at.asc`, {
      headers: {
        apikey: sb.key,
        Authorization: `Bearer ${sb.key}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows.map((r: Record<string, string>) => ({
      id: r.id,
      title: r.title,
      category: r.category || "Katas Básicos",
      duration: r.duration || "10:00",
      level: r.level || "Todos",
      instructor: r.instructor || "Hanshi Jorge Jr.",
      description: r.description || "Video instructivo oficial del Dojo Shito-Ryu Sosa-Kai.",
      videoUrl: r.video_url || r.videoUrl || "",
      thumbnail: r.thumbnail || "/karate-action.jpg",
    }));
  } catch {
    return null;
  }
}

async function writeToSupabase(videos: VideoRecord[]): Promise<boolean> {
  const sb = getSupabaseConfig();
  if (!sb) return false;
  try {
    // Upsert all current videos
    const payload = videos.map((v) => ({
      id: v.id,
      title: v.title,
      category: v.category,
      duration: v.duration,
      level: v.level,
      instructor: v.instructor,
      description: v.description,
      video_url: v.videoUrl,
      thumbnail: v.thumbnail,
    }));
    const res = await fetch(`${sb.url}/rest/v1/dojo_videos?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: sb.key,
        Authorization: `Bearer ${sb.key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function deleteFromSupabase(id: string): Promise<boolean> {
  const sb = getSupabaseConfig();
  if (!sb) return false;
  try {
    const res = await fetch(
      `${sb.url}/rest/v1/dojo_videos?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          apikey: sb.key,
          Authorization: `Bearer ${sb.key}`,
        },
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

function getWritablePath() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "sosakai_videos.json");
  }
  return path.join(process.cwd(), "src", "data", "videos.json");
}

function getFallbackPath() {
  return path.join(process.cwd(), "src", "data", "videos.json");
}

function readVideosFromFile(): VideoRecord[] {
  const defaults = (defaultVideos as VideoRecord[]).filter((v) => !isBlacklisted(v));

  const combined: VideoRecord[] = [...defaults];

  // Merge in-memory server cache
  if (Array.isArray(serverVideosCache) && serverVideosCache.length > 0) {
    combined.push(...serverVideosCache);
  }

  // Merge disk cache if available
  try {
    const writablePath = getWritablePath();
    if (fs.existsSync(writablePath)) {
      const data = fs.readFileSync(writablePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        combined.push(...parsed);
      }
    }
  } catch {}

  const merged = deduplicateVideos(combined).filter((v) => !serverDeletedCache.has(v.id));
  serverVideosCache = merged;
  return merged;
}

function saveVideosToFile(videos: VideoRecord[]) {
  const clean = deduplicateVideos(videos);
  serverVideosCache = clean;
  try {
    const writablePath = getWritablePath();
    fs.writeFileSync(writablePath, JSON.stringify(clean, null, 2), "utf-8");
  } catch {}

  try {
    const fallbackPath = getFallbackPath();
    if (fallbackPath !== getWritablePath()) {
      fs.writeFileSync(fallbackPath, JSON.stringify(clean, null, 2), "utf-8");
    }
  } catch {}
}

async function readGlobalVideos(): Promise<{ videos: VideoRecord[]; mode: string }> {
  const defaults = (defaultVideos as VideoRecord[]).filter((v) => !isBlacklisted(v));

  // 1. Upstash / Vercel KV
  const kvVideos = await readFromKv();
  if (kvVideos && kvVideos.length > 0) {
    const merged = deduplicateVideos(kvVideos);
    serverVideosCache = merged;
    return { videos: merged, mode: "kv" };
  }

  // 2. GitHub Repository Contents API
  const gh = await readFromGithub();
  if (gh && gh.videos.length > 0) {
    const merged = deduplicateVideos(gh.videos);
    serverVideosCache = merged;
    return { videos: merged, mode: "github" };
  }

  // 3. Supabase
  const sbVideos = await readFromSupabase();
  if (sbVideos && sbVideos.length > 0) {
    const merged = deduplicateVideos([...defaults, ...sbVideos]);
    serverVideosCache = merged;
    return { videos: merged, mode: "supabase" };
  }

  // 4. Local / static fallback
  return { videos: readVideosFromFile(), mode: "static" };
}

async function persistGlobalVideos(videos: VideoRecord[], commitMessage: string): Promise<string> {
  const clean = deduplicateVideos(videos);
  saveVideosToFile(clean);

  if (await writeToKv(clean)) return "kv";
  if (await writeToGithub(clean, commitMessage)) return "github";
  if (await writeToSupabase(clean)) return "supabase";
  return "static";
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  const { videos, mode } = await readGlobalVideos();
  return NextResponse.json(videos, {
    headers: {
      ...NO_CACHE_HEADERS,
      "X-Storage-Mode": mode,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ error: "Datos de video inválidos" }, { status: 400 });
    }

    const { videos: current } = await readGlobalVideos();
    let updated: VideoRecord[] = [...current];
    let commitMsg = "Actualizar videoteca oficial Sosa-Kai";

    if (data.title && data.videoUrl) {
      serverDeletedCache.delete(data.id);
      const newRec: VideoRecord = {
        id: data.id || `V-${Date.now()}`,
        title: data.title,
        category: data.category || "Katas Básicos",
        duration: data.duration || "10:00",
        level: data.level || "Todos",
        instructor: data.instructor || "Hanshi Jorge Jr.",
        description: data.description || "Video instructivo oficial del Dojo Shito-Ryu Sosa-Kai.",
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail || "/karate-action.jpg",
      };
      const newKey = getVideoUniqueKey(newRec);
      updated = [...updated.filter((v) => v.id !== newRec.id && getVideoUniqueKey(v) !== newKey), newRec];
      commitMsg = `Agregar video: ${newRec.title}`;
    }

    // Support batch sync from client devices
    if (data.syncBatch && Array.isArray(data.syncBatch)) {
      const existingKeys = new Set(updated.map((v) => getVideoUniqueKey(v)));
      for (const v of data.syncBatch as VideoRecord[]) {
        if (v && v.id && v.videoUrl && !isBlacklisted(v) && !serverDeletedCache.has(v.id)) {
          const key = getVideoUniqueKey(v);
          if (!existingKeys.has(key)) {
            updated.push(v);
            existingKeys.add(key);
          }
        }
      }
    }

    updated = deduplicateVideos(updated);
    const mode = await persistGlobalVideos(updated, commitMsg);
    return NextResponse.json(updated, {
      headers: {
        ...NO_CACHE_HEADERS,
        "X-Storage-Mode": mode,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error al guardar video" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, instructor, title } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID de video requerido" }, { status: 400 });
    }
    const { videos: current } = await readGlobalVideos();
    const updated = current.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          ...(instructor !== undefined ? { instructor } : {}),
          ...(title !== undefined ? { title } : {}),
        };
      }
      return v;
    });
    const mode = await persistGlobalVideos(updated, `Actualizar video ${id}`);
    return NextResponse.json(updated, {
      headers: {
        ...NO_CACHE_HEADERS,
        "X-Storage-Mode": mode,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error al actualizar video" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, videoUrl } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID de video requerido" }, { status: 400 });
    }
    serverDeletedCache.add(id);
    const targetYtId = extractYouTubeId(videoUrl);
    const { videos: current } = await readGlobalVideos();
    const updated = current.filter((v) => {
      if (v.id === id) return false;
      if (targetYtId && extractYouTubeId(v.videoUrl) === targetYtId) return false;
      return true;
    });
    await deleteFromSupabase(id);
    const mode = await persistGlobalVideos(updated, `Eliminar video ${id}`);
    return NextResponse.json(updated, {
      headers: {
        ...NO_CACHE_HEADERS,
        "X-Storage-Mode": mode,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error al eliminar video" }, { status: 500 });
  }
}
