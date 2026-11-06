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

function getFilePath() {
  return path.join(process.cwd(), "src", "data", "videos.json");
}

function readVideosFromFile() {
  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
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
    const filePath = getFilePath();
    fs.writeFileSync(filePath, JSON.stringify(videos, null, 2), "utf-8");
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
    const newVideo = await req.json();
    if (!newVideo || !newVideo.title) {
      return NextResponse.json({ error: "Datos de video inválidos" }, { status: 400 });
    }
    const current = readVideosFromFile();
    const updated = [newVideo, ...current.filter((v: { id: string }) => v.id !== newVideo.id)];
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

