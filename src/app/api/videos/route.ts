import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import defaultVideos from "@/data/videos.json";

// In-memory runtime cache for serverless environments
let serverVideosCache: unknown[] = [];

const DEMO_VIDEO_IDS = new Set([
  "V-01",
  "V-02",
  "V-03",
  "V-04",
  "V-05",
  "V-REIHO-01",
  "V-PINAN-01",
  "V-BASSAI-01",
]);

function getWritablePath() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "sosakai_videos.json");
  }
  return path.join(process.cwd(), "src", "data", "videos.json");
}

function getFallbackPath() {
  return path.join(process.cwd(), "src", "data", "videos.json");
}

function readVideosFromFile() {
  try {
    const writablePath = getWritablePath();
    if (fs.existsSync(writablePath)) {
      const data = fs.readFileSync(writablePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = parsed.filter(
          (v: { id?: string }) => v && v.id && !DEMO_VIDEO_IDS.has(v.id)
        );
        serverVideosCache = clean;
        return clean;
      }
    }
  } catch {}

  try {
    const fallbackPath = getFallbackPath();
    if (fs.existsSync(fallbackPath)) {
      const data = fs.readFileSync(fallbackPath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = parsed.filter(
          (v: { id?: string }) => v && v.id && !DEMO_VIDEO_IDS.has(v.id)
        );
        serverVideosCache = clean;
        return clean;
      }
    }
  } catch {}

  return (serverVideosCache as { id?: string }[]).filter(
    (v) => v && v.id && !DEMO_VIDEO_IDS.has(v.id)
  );
}

function saveVideosToFile(videos: unknown[]) {
  serverVideosCache = videos as typeof serverVideosCache;
  try {
    const writablePath = getWritablePath();
    fs.writeFileSync(writablePath, JSON.stringify(videos, null, 2), "utf-8");
  } catch {}

  // Also try saving to data/videos.json in local environments
  try {
    const fallbackPath = getFallbackPath();
    if (fallbackPath !== getWritablePath()) {
      fs.writeFileSync(fallbackPath, JSON.stringify(videos, null, 2), "utf-8");
    }
  } catch {}
}

export async function GET() {
  const videos = readVideosFromFile();
  return NextResponse.json(videos, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ error: "Datos de video inválidos" }, { status: 400 });
    }

    const current = readVideosFromFile();
    let updated: any[] = [];

    // Support batch sync from client devices
    if (data.syncBatch && Array.isArray(data.syncBatch)) {
      const map = new Map<string, any>();
      current.forEach((v: { id: string }) => map.set(v.id, v));
      data.syncBatch.forEach((v: { id: string }) => {
        if (v && v.id && !DEMO_VIDEO_IDS.has(v.id)) {
          map.set(v.id, v);
        }
      });
      updated = Array.from(map.values());
    } else if (data.title) {
      updated = [data, ...current.filter((v: { id: string }) => v.id !== data.id)];
    } else {
      return NextResponse.json({ error: "Datos de video inválidos" }, { status: 400 });
    }

    saveVideosToFile(updated);
    return NextResponse.json(updated);
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
    const current = readVideosFromFile();
    const updated = current.map((v: { id: string; instructor?: string; title?: string }) => {
      if (v.id === id) {
        return {
          ...v,
          ...(instructor !== undefined ? { instructor } : {}),
          ...(title !== undefined ? { title } : {}),
        };
      }
      return v;
    });
    saveVideosToFile(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error al actualizar video" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID de video requerido" }, { status: 400 });
    }
    const current = readVideosFromFile();
    const updated = current.filter((v: { id: string }) => v.id !== id);
    saveVideosToFile(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error al eliminar video" }, { status: 500 });
  }
}

