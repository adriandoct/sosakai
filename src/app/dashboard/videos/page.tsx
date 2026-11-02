"use client";

import { useState } from "react";
import { Video, Play, Plus, Search, X, Clock, Award, Shield } from "lucide-react";
import Image from "next/image";
import styles from "../dojo-modules.module.css";

interface DojoVideo {
  id: string;
  title: string;
  category: "Katas Básicos" | "Katas Avanzados" | "Kumite & Combate" | "Bunkai & Defensa Personal" | "Acondicionamiento";
  duration: string;
  level: "Principiante" | "Intermedio" | "Avanzado" | "Todos";
  instructor: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
}

const VIDEOS: DojoVideo[] = [
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

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [activeVideo, setActiveVideo] = useState<DojoVideo | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = VIDEOS.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.description.toLowerCase().includes(searchTerm.toLowerCase());
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
          <p>Videoteca marcial interactiva organizada por niveles y temas para el entrenamiento continuo de los karatekas.</p>
        </div>

        <div className={styles.topActions}>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <Plus size={18} />
            Agregar Video
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar videos por título o técnica..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterTabs}>
          {["Todas", "Katas Básicos", "Katas Avanzados", "Kumite & Combate", "Bunkai & Defensa Personal", "Acondicionamiento"].map((cat) => (
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
              style={{ position: "relative", width: "100%", height: "180px", borderRadius: "12px", overflow: "hidden", cursor: "pointer", background: "#000" }}
              onClick={() => setActiveVideo(item)}
            >
              <Image 
                src={item.thumbnail} 
                alt={item.title} 
                fill 
                style={{ objectFit: "cover" }} 
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e60026", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 15px rgba(230,0,38,0.6)" }}>
                  <Play size={20} fill="#fff" style={{ marginLeft: 2 }} />
                </div>
              </div>

              <span style={{ position: "absolute", bottom: "0.6rem", right: "0.6rem", background: "rgba(0,0,0,0.8)", color: "#fff", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "4px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Clock size={12} />
                {item.duration}
              </span>

              <span style={{ position: "absolute", top: "0.6rem", left: "0.6rem", background: "rgba(230,0,38,0.9)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "4px" }}>
                {item.level}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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

            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.8rem", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Award size={14} color="#e60026" />
                {item.instructor}
              </span>

              <button 
                className={styles.btnPrimary} 
                style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
                onClick={() => setActiveVideo(item)}
              >
                Reproducir
              </button>
            </div>
          </div>
        ))}
      </div>

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

      {/* Add Video Modal */}
      {isAddOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Agregar Video a la Videoteca</h2>
              <button className={styles.modalClose} onClick={() => setIsAddOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Título del Video</label>
                <input type="text" placeholder="Ej. Kata Rohai: Aplicaciones de Bunkai" />
              </div>
              <div className={styles.formGroup}>
                <label>Categoría</label>
                <select>
                  <option>Katas Básicos</option>
                  <option>Katas Avanzados</option>
                  <option>Kumite & Combate</option>
                  <option>Bunkai & Defensa Personal</option>
                  <option>Acondicionamiento</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>URL del Video (YouTube o Vimeo)</label>
                <input type="url" placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className={styles.formGroup}>
                <label>Sensei / Instructor</label>
                <input type="text" placeholder="Sensei Adrian Silva" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setIsAddOpen(false)}>Cancelar</button>
              <button className={styles.btnPrimary} onClick={() => { alert("Video agregado a la videoteca oficial."); setIsAddOpen(false); }}>
                Guardar Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
