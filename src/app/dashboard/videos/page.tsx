"use client";

import { useState, useEffect } from "react";
import {
  Video,
  Play,
  Plus,
  Search,
  X,
  Clock,
  Award,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Edit3,
  Smartphone,
  Share2,
  Copy,
  QrCode,
} from "lucide-react";
import styles from "../dojo-modules.module.css";
import { useUser } from "../UserContext";
import defaultVideos from "@/data/videos.json";

type VideoCategory =
  | "Katas Básicos"
  | "Katas Avanzados"
  | "Kumite & Combate"
  | "Bunkai & Defensa Personal"
  | "Acondicionamiento";

type VideoLevel = "Principiante" | "Intermedio" | "Avanzado" | "Todos";

interface DojoVideo {
  id: string;
  title: string;
  category: VideoCategory;
  duration: string;
  level: VideoLevel;
  instructor: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
}

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

// Helper to export videos to compact URL payload for QR code & mobile sync
function exportVideosPayload(videos: DojoVideo[]): string {
  try {
    const compact = videos
      .filter((v) => v && v.id && !DEMO_VIDEO_IDS.has(v.id))
      .map((v) => ({
        i: v.id,
        t: v.title,
        c: v.category,
        d: v.duration,
        l: v.level,
        n: v.instructor,
        e: v.description,
        u: v.videoUrl,
        m: v.thumbnail,
      }));
    const json = JSON.stringify(compact);
    if (typeof window !== "undefined") {
      return btoa(unescape(encodeURIComponent(json)));
    }
  } catch {}
  return "";
}

// Helper to import videos from compact URL payload
function importVideosPayload(payload: string): DojoVideo[] {
  try {
    const json = decodeURIComponent(escape(atob(payload)));
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item: any) => ({
          id: item.i || item.id || `V-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: item.t || item.title || "",
          category: (item.c || item.category || "Katas Básicos") as VideoCategory,
          duration: item.d || item.duration || "10:00",
          level: (item.l || item.level || "Todos") as VideoLevel,
          instructor: item.n || item.instructor || "",
          description: item.e || item.description || "",
          videoUrl: item.u || item.videoUrl || "",
          thumbnail: item.m || item.thumbnail || "/karate-action.jpg",
        }))
        .filter((v: DojoVideo) => v.title && v.videoUrl && !DEMO_VIDEO_IDS.has(v.id));
    }
  } catch {}
  return [];
}

// Load persisted videos from local/session storage
function loadPersistedVideos(): DojoVideo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      localStorage.getItem("sosakai_videos_library") ||
      localStorage.getItem("sosakai_videos_library_backup") ||
      sessionStorage.getItem("sosakai_videos_library");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(
          (v: DojoVideo) => v && v.id && !DEMO_VIDEO_IDS.has(v.id)
        );
        return cleaned;
      }
    }
  } catch {}
  return [];
}

function savePersistedVideos(list: DojoVideo[]) {
  if (typeof window === "undefined") return;
  try {
    const cleaned = list.filter((v) => v && v.id && !DEMO_VIDEO_IDS.has(v.id));
    const json = JSON.stringify(cleaned);
    localStorage.setItem("sosakai_videos_library", json);
    localStorage.setItem("sosakai_videos_library_backup", json);
    sessionStorage.setItem("sosakai_videos_library", json);
  } catch {}
}

const INITIAL_VIDEOS: DojoVideo[] = [];

// Helper to convert YouTube/Vimeo URLs to embeddable URLs and extract thumbnails
function parseVideoInput(url: string) {
  const trimmed = url.trim();

  // YouTube matchers (standard, short, embed, shorts, live, mobile)
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // Vimeo matcher
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      thumbnail: "/karate-action.jpg",
    };
  }

  // Direct embed or direct link
  return {
    embedUrl: trimmed,
    thumbnail: "/karate-action.jpg",
  };
}

export default function VideosPage() {
  const { isAdmin, isSuperAdmin, role } = useUser();

  const [videos, setVideos] = useState<DojoVideo[]>(INITIAL_VIDEOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [activeVideo, setActiveVideo] = useState<DojoVideo | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<DojoVideo | null>(null);
  const [editingInstructorVideo, setEditingInstructorVideo] = useState<{
    id: string;
    title: string;
    instructor: string;
  } | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const getSyncUrl = () => {
    if (typeof window === "undefined") return "";
    const payload = exportVideosPayload(videos);
    return `${window.location.origin}/dashboard/videos?sync=${encodeURIComponent(payload)}`;
  };

  const handleCopySyncLink = () => {
    const url = getSyncUrl();
    if (!url) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: VideoCategory;
    videoUrl: string;
    instructor: string;
    level: VideoLevel;
    duration: string;
    description: string;
  }>({
    title: "",
    category: "Katas Básicos",
    videoUrl: "",
    instructor: "",
    level: "Todos",
    duration: "10:00",
    description: "",
  });

  // Load persisted videos from storage, check URL ?sync= parameter, and sync with server API
  useEffect(() => {
    let baseVideos = loadPersistedVideos();

    // 1. Check if URL has ?sync= parameter (from QR code scan or WhatsApp link)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const syncPayload = urlParams.get("sync");
      if (syncPayload) {
        const imported = importVideosPayload(syncPayload);
        if (imported.length > 0) {
          const map = new Map<string, DojoVideo>();
          baseVideos.forEach((v) => map.set(v.id, v));
          imported.forEach((v) => map.set(v.id, v));
          baseVideos = Array.from(map.values());
          savePersistedVideos(baseVideos);
          setVideos(baseVideos);

          // Sync to server API in background
          fetch("/api/videos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ syncBatch: baseVideos }),
          }).catch(() => {});

          setNotification({
            type: "success",
            text: `¡${imported.length} video(s) sincronizados con éxito en este dispositivo!`,
          });
          setTimeout(() => setNotification(null), 5000);

          // Clean up the URL parameter without reloading
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }
      }
    }

    setVideos(baseVideos);
    savePersistedVideos(baseVideos);

    // 2. If computer already has videos, automatically push them to server
    if (baseVideos.length > 0) {
      fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncBatch: baseVideos }),
      }).catch(() => {});
    }

    // 3. Sync with server API
    fetch("/api/videos")
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (Array.isArray(serverData)) {
          const validServer = serverData.filter(
            (v: DojoVideo) => v && v.id && !DEMO_VIDEO_IDS.has(v.id)
          );
          if (validServer.length > 0) {
            setVideos((current) => {
              const map = new Map<string, DojoVideo>();
              current.filter((v) => !DEMO_VIDEO_IDS.has(v.id)).forEach((v) => map.set(v.id, v));
              validServer.forEach((v: DojoVideo) => map.set(v.id, v));
              const merged = Array.from(map.values());
              savePersistedVideos(merged);
              return merged;
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setNotification({
        type: "error",
        text: "Acción no autorizada: Los Senseis y Alumnos solo pueden ver videos. Únicamente Super Admin y Admin pueden subir videos.",
      });
      return;
    }

    if (!formData.title || !formData.videoUrl) return;

    const { embedUrl, thumbnail } = parseVideoInput(formData.videoUrl);

    const newVideo: DojoVideo = {
      id: `V-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      duration: formData.duration.trim() || "10:00",
      level: formData.level,
      instructor: formData.instructor.trim(),
      description: formData.description.trim() || "Video instructivo oficial del Dojo Shito-Ryu Sosa-Kai.",
      videoUrl: embedUrl,
      thumbnail: thumbnail,
    };

    setVideos((prev) => {
      const currentPersisted = loadPersistedVideos();
      const base = currentPersisted.length > 0 ? currentPersisted : prev;
      const updated = [newVideo, ...base.filter((v) => v.id !== newVideo.id)];
      savePersistedVideos(updated);
      return updated;
    });

    // Guardar permanentemente en el servidor
    fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVideo),
    }).catch(() => {});

    // Reset Form & show notification
    setFormData({
      title: "",
      category: "Katas Básicos",
      videoUrl: "",
      instructor: "",
      level: "Todos",
      duration: "10:00",
      description: "",
    });
    setIsAddOpen(false);

    setNotification({
      type: "success",
      text: `¡Video "${newVideo.title}" agregado con éxito a la videoteca!`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstructorVideo) return;

    const newInstructor = editingInstructorVideo.instructor.trim();
    setVideos((prev) => {
      const updated = prev.map((v) =>
        v.id === editingInstructorVideo.id ? { ...v, instructor: newInstructor } : v
      );
      savePersistedVideos(updated);
      return updated;
    });

    // Actualizar en el servidor
    fetch("/api/videos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingInstructorVideo.id,
        instructor: newInstructor,
      }),
    }).catch(() => {});

    const title = editingInstructorVideo.title;
    setEditingInstructorVideo(null);

    setNotification({
      type: "success",
      text: newInstructor
        ? `Instructor "${newInstructor}" asignado a "${title}".`
        : `Se dejó en blanco el instructor de "${title}".`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleConfirmDelete = () => {
    if (!videoToDelete) return;

    if (!isAdmin) {
      setNotification({
        type: "error",
        text: "Permiso denegado: Los Senseis y Alumnos solo pueden ver videos. Únicamente Super Admin y Admin pueden eliminar videos.",
      });
      setVideoToDelete(null);
      return;
    }

    setVideos((prev) => {
      const updated = prev.filter((v) => v.id !== videoToDelete.id);
      savePersistedVideos(updated);
      return updated;
    });

    // Eliminar en el servidor
    fetch("/api/videos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: videoToDelete.id }),
    }).catch(() => {});

    const deletedTitle = videoToDelete.title;
    setVideoToDelete(null);

    setNotification({
      type: "success",
      text: `El video "${deletedTitle}" ha sido eliminado de la videoteca.`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const filtered = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Boolean(v.instructor && v.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === "Todas" || v.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>
            <Video size={30} color="#e60026" />
            Videos y Categorías Técnicas
          </h1>
          <p>
            Videoteca marcial interactiva organizada por niveles y temas para el entrenamiento continuo de los karatekas.
            {isAdmin && (
              <span style={{ marginLeft: "0.5rem", color: "#e60026", fontWeight: 700 }}>
                • Modo {isSuperAdmin ? "Super Admin" : "Admin"} Activo
              </span>
            )}
          </p>
        </div>

        {/* Actions: Sincronizar Celular + Agregar Video */}
        <div className={styles.topActions} style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
          {videos.length > 0 && (
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setIsSyncOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                borderColor: "rgba(59, 130, 246, 0.4)",
                color: "#60a5fa",
                background: "rgba(59, 130, 246, 0.12)",
                fontWeight: 600,
              }}
              title="Sincronizar estos videos con tu celular"
            >
              <Smartphone size={18} />
              <span>Sincronizar Celular</span>
            </button>
          )}

          {isAdmin && (
            <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
              <Plus size={18} />
              Agregar Video
            </button>
          )}
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          style={{
            background: notification.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: `1px solid ${notification.type === "success" ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
            color: notification.type === "success" ? "#10b981" : "#f87171",
            padding: "0.85rem 1.25rem",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontWeight: 600,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {notification.type === "success" ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar videos por título, kata o sensei..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterTabs}>
          {[
            "Todas",
            "Katas Básicos",
            "Katas Avanzados",
            "Kumite & Combate",
            "Bunkai & Defensa Personal",
            "Acondicionamiento",
          ].map((cat) => (
            <button
              key={cat}
              className={`${styles.filterTab} ${selectedCategory === cat ? styles.filterTabActive : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className={styles.cardsGrid}>
        {filtered.map((item) => (
          <div key={item.id} className={styles.itemCard} style={{ padding: "1rem" }}>
            {/* Thumbnail with Play Trigger */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "190px",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                background: "#0a0c10",
              }}
              onClick={() => setActiveVideo(item)}
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src = "/karate-action.jpg";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "#e60026",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: "0 4px 18px rgba(230,0,38,0.7)",
                  }}
                >
                  <Play size={22} fill="#fff" style={{ marginLeft: 3 }} />
                </div>
              </div>

              <span
                style={{
                  position: "absolute",
                  bottom: "0.6rem",
                  right: "0.6rem",
                  background: "rgba(0,0,0,0.85)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <Clock size={12} />
                {item.duration}
              </span>

              <span
                style={{
                  position: "absolute",
                  top: "0.6rem",
                  left: "0.6rem",
                  background: "#e60026",
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.65rem",
                  borderRadius: "4px",
                }}
              >
                {item.level}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#e60026", fontWeight: 700, textTransform: "uppercase" }}>
                {item.category}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", lineHeight: 1.3 }}>
                {item.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>

            {/* Card Footer Actions */}
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "0.75rem",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: item.instructor ? "#cbd5e1" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Award size={14} color={item.instructor ? "#e60026" : "#64748b"} />
                {item.instructor ? item.instructor : "Instructor por asignar"}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {/* Admin actions: Edit instructor + Delete */}
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      style={{
                        padding: "0.4rem 0.65rem",
                        fontSize: "0.78rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                      onClick={() =>
                        setEditingInstructorVideo({
                          id: item.id,
                          title: item.title,
                          instructor: item.instructor || "",
                        })
                      }
                      title="Asignar o modificar instructor"
                    >
                      <Edit3 size={13} />
                      <span>{item.instructor ? "Editar" : "Asignar"}</span>
                    </button>

                    <button
                      type="button"
                      className={styles.btnDelete}
                      onClick={() => setVideoToDelete(item)}
                      title="Eliminar este video (Solo Administradores)"
                    >
                      <Trash2 size={14} />
                      <span>Eliminar</span>
                    </button>
                  </>
                )}

                <button
                  className={styles.btnPrimary}
                  style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem" }}
                  onClick={() => setActiveVideo(item)}
                >
                  Reproducir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#94a3b8" }}>
          <Video size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
          <h3>
            {videos.length === 0
              ? isAdmin
                ? "Videoteca lista para tus videos"
                : "Videoteca Oficial Sosa Kai"
              : "No se encontraron videos con ese filtro"}
          </h3>
          <p style={{ fontSize: "0.9rem", marginTop: "0.4rem" }}>
            {videos.length === 0
              ? isAdmin
                ? "Aún no hay videos en la videoteca oficial. Haz clic en 'Agregar Video' para publicar el primero."
                : "Aún no hay videos publicados en la videoteca oficial por la administración."
              : "Prueba seleccionando otra categoría o limpiando la búsqueda."}
          </p>
          {videos.length === 0 && isAdmin && (
            <button
              className={styles.btnPrimary}
              style={{ marginTop: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              onClick={() => setIsAddOpen(true)}
            >
              <Plus size={18} />
              Agregar Primer Video
            </button>
          )}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div className={styles.modalOverlay} onClick={() => setActiveVideo(null)}>
          <div className={styles.modalBox} style={{ maxWidth: "850px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{activeVideo.title}</h2>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                  {activeVideo.category}
                  {activeVideo.instructor ? ` • Impartido por ${activeVideo.instructor}` : " • Instructor por asignar"}
                </p>
              </div>
              <button className={styles.modalClose} onClick={() => setActiveVideo(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000" }}>
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              ></iframe>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Admin only) */}
      {videoToDelete && (
        <div className={styles.modalOverlay} onClick={() => setVideoToDelete(null)}>
          <div className={styles.modalBox} style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ color: "#f87171", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <AlertTriangle size={22} color="#f87171" />
                Confirmar Eliminación de Video
              </h2>
              <button className={styles.modalClose} onClick={() => setVideoToDelete(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6 }}>
                ¿Estás seguro de que deseas eliminar permanentemente de la videoteca oficial el video:
              </p>
              <div
                style={{
                  background: "#0a0c10",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "1rem" }}>{videoToDelete.title}</div>
                <div style={{ fontSize: "0.82rem", color: "#e60026", marginTop: "0.2rem" }}>
                  Categoría: {videoToDelete.category}
                  {videoToDelete.instructor ? ` • ${videoToDelete.instructor}` : ""}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  color: "#fca5a5",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <ShieldAlert size={18} />
                <span>Esta acción solo está autorizada para cuentas <strong>Super Admin</strong> y <strong>Admin</strong>.</span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setVideoToDelete(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} />
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal (Admin only) */}
      {isAddOpen && isAdmin && (
        <div className={styles.modalOverlay} onClick={() => setIsAddOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Agregar Video a la Videoteca</h2>
              <button className={styles.modalClose} onClick={() => setIsAddOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVideo}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Título del Video *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Kata Rohai: Aplicaciones de Bunkai"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Categoría Marcial *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as VideoCategory })}
                  >
                    <option value="Katas Básicos">Katas Básicos</option>
                    <option value="Katas Avanzados">Katas Avanzados</option>
                    <option value="Kumite & Combate">Kumite & Combate</option>
                    <option value="Bunkai & Defensa Personal">Bunkai & Defensa Personal</option>
                    <option value="Acondicionamiento">Acondicionamiento</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>URL del Video de YouTube o Vimeo *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  />
                  <small style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Puedes pegar cualquier enlace de YouTube o Vimeo; se convertirá y extraerá la miniatura automáticamente.
                  </small>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formGroup}>
                    <label>Nivel Técnico</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as VideoLevel })}
                    >
                      <option value="Todos">Todos los Grados</option>
                      <option value="Principiante">Principiante (Blancas/Amarillas)</option>
                      <option value="Intermedio">Intermedio (Naranjas/Verdes/Azules)</option>
                      <option value="Avanzado">Avanzado (Marrón/Negra)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Duración Aprox.</label>
                    <input
                      type="text"
                      placeholder="12:30"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Sensei / Instructor Asignado</label>
                  <input
                    type="text"
                    placeholder="Instructor asignado (opcional)..."
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  />
                  <small style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Déjalo en blanco si aún no tiene instructor asignado o escribe el Sensei a cargo.
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción Técnica</label>
                  <textarea
                    rows={3}
                    placeholder="Explica las técnicas tratadas, puntos clave de kime o precauciones..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Guardar y Publicar Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Assign / Edit Instructor Modal (Admin only) */}
      {editingInstructorVideo && isAdmin && (
        <div className={styles.modalOverlay} onClick={() => setEditingInstructorVideo(null)}>
          <div className={styles.modalBox} style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Asignar / Modificar Instructor</h2>
              <button className={styles.modalClose} onClick={() => setEditingInstructorVideo(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveInstructor}>
              <div className={styles.modalBody}>
                <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  Define o actualiza el instructor asignado para el video:
                  <br />
                  <strong style={{ color: "#f8fafc" }}>{editingInstructorVideo.title}</strong>
                </p>

                <div className={styles.formGroup}>
                  <label>Sensei / Instructor Asignado</label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Instructor asignado (o déjalo en blanco)..."
                    value={editingInstructorVideo.instructor}
                    onChange={(e) =>
                      setEditingInstructorVideo({ ...editingInstructorVideo, instructor: e.target.value })
                    }
                  />
                  <small style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Puedes dejar este campo en blanco para que quede pendiente de asignar, o escribir el nombre del Sensei.
                  </small>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setEditingInstructorVideo(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Guardar Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Sincronizar Celular QR */}
      {isSyncOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSyncOpen(false)}>
          <div
            className={styles.modalBox}
            style={{ maxWidth: "480px", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div style={{ textAlign: "left" }}>
                <h2>
                  <Smartphone size={22} color="#3b82f6" style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                  Sincronizar con tu Celular
                </h2>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                  Transfiere los {videos.length} videos de tu computadora a tu teléfono en segundos.
                </p>
              </div>
              <button className={styles.modalClose} onClick={() => setIsSyncOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "1.5rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "0.85rem",
                  borderRadius: "16px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                  display: "inline-block",
                }}
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(getSyncUrl())}`}
                  alt="Código QR para sincronizar videos"
                  width={240}
                  height={240}
                  style={{ display: "block", borderRadius: "8px" }}
                />
              </div>

              <div style={{ fontSize: "0.88rem", color: "#cbd5e1", maxWidth: "380px", lineHeight: "1.4" }}>
                <strong>Paso 1:</strong> Abre la cámara de tu celular y apunta hacia este código QR.
                <br />
                <strong>Paso 2:</strong> Toca el enlace emergente en tu celular. ¡Todos tus videos se guardarán automáticamente en tu teléfono!
              </div>

              <div style={{ width: "100%", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  style={{ width: "100%", justifyContent: "center", gap: "0.5rem" }}
                  onClick={handleCopySyncLink}
                >
                  {copiedLink ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
                  <span>{copiedLink ? "¡Enlace copiado al portapapeles!" : "Copiar Enlace para WhatsApp / Celular"}</span>
                </button>
                <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  También puedes pegarte este enlace por WhatsApp y abrirlo en tu móvil.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
