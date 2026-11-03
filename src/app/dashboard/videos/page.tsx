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
} from "lucide-react";
import styles from "../dojo-modules.module.css";
import { useUser } from "../UserContext";

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

const INITIAL_VIDEOS: DojoVideo[] = [
  {
    id: "V-01",
    title: "Kata Bassai Dai: Desglose Técnico Completo",
    category: "Katas Avanzados",
    duration: "14:20",
    level: "Avanzado",
    instructor: "Sensei Adrian Silva (4to Dan)",
    description: "Análisis punto por punto de las posturas, cambios de ritmo y el Kime característico del kata cumbre de Shito-Ryu.",
    videoUrl: "https://www.youtube-nocookie.com/embed/n4fCq7QdDks?autoplay=1",
    thumbnail: "/karate-action.jpg",
  },
  {
    id: "V-02",
    title: "Pinan Shodan y Pinan Nidan: Forma y Embusen",
    category: "Katas Básicos",
    duration: "09:45",
    level: "Principiante",
    instructor: "Sensei Carlos Mendoza",
    description: "Los fundamentos esenciales de la línea Shito-Ryu explicados para alumnos principiantes que aspiran a cinta amarilla y naranja.",
    videoUrl: "https://www.youtube-nocookie.com/embed/n4fCq7QdDks?autoplay=1",
    thumbnail: "/karate-action.jpg",
  },
  {
    id: "V-03",
    title: "Tácticas de Kumite: Desplazamientos y Anticipación (Deai)",
    category: "Kumite & Combate",
    duration: "12:15",
    level: "Intermedio",
    instructor: "Sensei Roberto Tanaka",
    description: "Cómo entrar en la distancia del oponente, cortar ángulos de ataque y conectar Gyaku Tsuki con velocidad de competición.",
    videoUrl: "https://www.youtube-nocookie.com/embed/n4fCq7QdDks?autoplay=1",
    thumbnail: "/karate-action.jpg",
  },
  {
    id: "V-04",
    title: "Bunkai Aplicado de Kata Seienchin: Derribos y Llaves",
    category: "Bunkai & Defensa Personal",
    duration: "16:50",
    level: "Avanzado",
    instructor: "Sensei Adrian Silva",
    description: "Desmitificando los movimientos de Seienchin para aplicaciones reales de defensa personal, control articular y proyecciones.",
    videoUrl: "https://www.youtube-nocookie.com/embed/n4fCq7QdDks?autoplay=1",
    thumbnail: "/karate-action.jpg",
  },
  {
    id: "V-05",
    title: "Acondicionamiento Físico y Movilidad para Karatekas",
    category: "Acondicionamiento",
    duration: "18:30",
    level: "Todos",
    instructor: "Preparador Físico Dojo",
    description: "Rutina específica de flexibilidad de cadera para patadas altas, potencia isométrica en Shiko Dachi y resistencia aeróbica.",
    videoUrl: "https://www.youtube-nocookie.com/embed/n4fCq7QdDks?autoplay=1",
    thumbnail: "/karate-action.jpg",
  },
];

// Helper to convert YouTube/Vimeo URLs to embeddable URLs and extract thumbnails
function parseVideoInput(url: string) {
  const trimmed = url.trim();

  // YouTube matchers (standard, short, embed, shorts)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // Vimeo matcher
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      thumbnail: "/karate-action.jpg",
    };
  }

  // Direct embed or default fallback
  return {
    embedUrl: trimmed.includes("embed") ? trimmed : `https://www.youtube-nocookie.com/embed/n4fCq7QdDks?autoplay=1`,
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
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
    instructor: "Sensei Adrian Silva",
    level: "Todos",
    duration: "10:00",
    description: "",
  });

  // Load persisted videos from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sosakai_videos_library");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVideos(parsed);
        }
      }
    } catch {
      // Ignorar error de parsing en localStorage
    }
  }, []);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setNotification({ type: "error", text: "Acción no autorizada: Solo Super Admin y Admin pueden agregar videos." });
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
      instructor: formData.instructor.trim() || "Sensei Sosa-Kai",
      description: formData.description.trim() || "Video instructivo oficial del Dojo Shito-Ryu Sosa-Kai.",
      videoUrl: embedUrl,
      thumbnail: thumbnail,
    };

    const updated = [newVideo, ...videos];
    setVideos(updated);

    try {
      localStorage.setItem("sosakai_videos_library", JSON.stringify(updated));
    } catch {}

    // Reset Form & show notification
    setFormData({
      title: "",
      category: "Katas Básicos",
      videoUrl: "",
      instructor: "Sensei Adrian Silva",
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

  const handleConfirmDelete = () => {
    if (!videoToDelete) return;

    if (!isAdmin) {
      setNotification({ type: "error", text: "Permiso denegado: Solo Super Admin y Admin pueden eliminar videos." });
      setVideoToDelete(null);
      return;
    }

    const updated = videos.filter((v) => v.id !== videoToDelete.id);
    setVideos(updated);

    try {
      localStorage.setItem("sosakai_videos_library", JSON.stringify(updated));
    } catch {}

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
      v.instructor.toLowerCase().includes(searchTerm.toLowerCase());
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

        {/* Add video button: ONLY visible for Super Admin and Admin */}
        {isAdmin && (
          <div className={styles.topActions}>
            <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
              <Plus size={18} />
              Agregar Video
            </button>
          </div>
        )}
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
                  color: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Award size={14} color="#e60026" />
                {item.instructor}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {/* Delete button: ONLY visible for Superadmin and Admin */}
                {isAdmin && (
                  <button
                    className={styles.btnDelete}
                    onClick={() => setVideoToDelete(item)}
                    title="Eliminar este video (Solo Administradores)"
                  >
                    <Trash2 size={14} />
                    <span>Eliminar</span>
                  </button>
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
          <h3>No se encontraron videos en esta categoría</h3>
          <p style={{ fontSize: "0.9rem", marginTop: "0.4rem" }}>
            Prueba seleccionando otra categoría o agrega un nuevo video con el botón superior.
          </p>
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
                  {activeVideo.category} • Impartido por {activeVideo.instructor}
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
                  Categoría: {videoToDelete.category} • {videoToDelete.instructor}
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
                  <label>Sensei / Instructor</label>
                  <input
                    type="text"
                    placeholder="Sensei Adrian Silva"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  />
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
    </div>
  );
}
