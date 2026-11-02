"use client";

import { useState } from "react";
import { BookOpen, Download, Eye, FileText, Upload, Search, X, CheckCircle, Shield } from "lucide-react";
import styles from "../dojo-modules.module.css";

interface ManualDoc {
  id: string;
  title: string;
  category: "Katas" | "Arbitraje" | "Grados" | "Protocolo" | "Técnica";
  pages: number;
  size: string;
  updated: string;
  description: string;
  previewChapters: string[];
}

const MANUALS: ManualDoc[] = [
  {
    id: "M-01",
    title: "Manual Oficial de Katas Shito-Ryu Sosa-Kai",
    category: "Katas",
    pages: 84,
    size: "14.2 MB",
    updated: "Octubre 2026",
    description: "Guía ilustrada con embusen, secuencias de movimiento, puntos de kime y bunkai de los katas Pinan, Bassai Dai, Seienchin y Rohai.",
    previewChapters: ["1. Historia y Linaje Shito-Ryu", "2. Katas Básicos Pinan 1-5", "3. Katas Maestros: Bassai Dai & Seienchin", "4. Aplicación de Bunkai"],
  },
  {
    id: "M-02",
    title: "Reglamento Oficial de Arbitraje y Competición WKF",
    category: "Arbitraje",
    pages: 52,
    size: "6.8 MB",
    updated: "Agosto 2026",
    description: "Criterios de puntuación en Kata y Kumite, penalizaciones (Senshu, Chui, Hansoku), señalética de árbitros y jueces de esquina.",
    previewChapters: ["1. Área y Vestimenta Oficial", "2. Puntuaciones Ippon, Waza-Ari, Yuko", "3. Criterios de Evaluación en Kata", "4. Protocolo de Reclamaciones"],
  },
  {
    id: "M-03",
    title: "Guía Curricular y Requisitos de Examen Kyu y Dan",
    category: "Grados",
    pages: 36,
    size: "4.5 MB",
    updated: "Septiembre 2026",
    description: "Tabla técnica completa con las exigencias para cada pase de cinta, desde Cinta Blanca hasta 5to Dan Shito-Ryu.",
    previewChapters: ["1. Objetivos Pedagógicos", "2. Programa por Kyu (Blanca a Marrón)", "3. Requisitos para Cinta Negra Shodan", "4. Examen Teórico y Budo"],
  },
  {
    id: "M-04",
    title: "Manual de Protocolo del Dojo, Filosofía y Terminología Japonesa",
    category: "Protocolo",
    pages: 28,
    size: "3.2 MB",
    updated: "Enero 2026",
    description: "Diccionario de términos marciales, etiqueta del tatami (Reishiki), órdenes del sensei, juramento del dojo (Dojo Kun).",
    previewChapters: ["1. El Dojo Kun de Sosa-Kai", "2. Ceremonial de Saludo (Seiza, Mokuso, Rei)", "3. Glosario Japonés de Técnicas", "4. Código Moral del Karateka"],
  },
  {
    id: "M-05",
    title: "Tratado de Bunkai: Defensa Personal Real Aplicada",
    category: "Técnica",
    pages: 64,
    size: "18.5 MB",
    updated: "Julio 2026",
    description: "Desglose práctico de luxaciones (Kansetsu Waza), estrangulaciones (Shime Waza) y derribos ocultos en las formas tradicionales.",
    previewChapters: ["1. Principios de Palanca y Distancia", "2. Liberación de agarres comunes", "3. Bunkai Oculto en Pinan Sandan", "4. Respuestas ante agresiones múltiples"],
  },
];

export default function ManualesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [previewManual, setPreviewManual] = useState<ManualDoc | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filtered = MANUALS.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (title: string) => {
    alert(`Iniciando descarga segura de: ${title}\nArchivo verificado con firma oficial Sosa-Kai.`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>
            <BookOpen size={30} color="#e60026" />
            Manuales PDF y Biblioteca Técnica
          </h1>
          <p>Compendio de manuales reglamentarios, guías de katas y bibliografía marcial oficial del Dojo.</p>
        </div>

        <div className={styles.topActions}>
          <button className={styles.btnPrimary} onClick={() => setIsUploadOpen(true)}>
            <Upload size={18} />
            Subir Nuevo Manual
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por manual o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterTabs}>
          {["Todas", "Katas", "Arbitraje", "Grados", "Protocolo", "Técnica"].map((cat) => (
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

      {/* Cards Grid */}
      <div className={styles.cardsGrid}>
        {filtered.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(230,0,38,0.12)", color: "#e60026", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={24} />
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#e60026", textTransform: "uppercase" }}>
                    {item.category} • PDF Oficial
                  </span>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{item.size} • {item.pages} páginas</div>
                </div>
              </div>

              <span style={{ fontSize: "0.75rem", color: "#94a3b8", background: "#0f1218", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
                {item.updated}
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.4rem" }}>
                {item.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", marginTop: "auto", paddingTop: "0.5rem" }}>
              <button 
                className={styles.btnSecondary} 
                style={{ flex: 1, justifyContent: "center", padding: "0.55rem 0.8rem", fontSize: "0.85rem" }}
                onClick={() => setPreviewManual(item)}
              >
                <Eye size={15} /> Ver Manual
              </button>
              <button 
                className={styles.btnPrimary} 
                style={{ flex: 1, justifyContent: "center", padding: "0.55rem 0.8rem", fontSize: "0.85rem" }}
                onClick={() => handleDownload(item.title)}
              >
                <Download size={15} /> Descargar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Preview Modal */}
      {previewManual && (
        <div className={styles.modalOverlay} onClick={() => setPreviewManual(null)}>
          <div className={styles.modalBox} style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{previewManual.title}</h2>
                <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                  Categoría: {previewManual.category} • {previewManual.pages} páginas • {previewManual.size}
                </p>
              </div>
              <button className={styles.modalClose} onClick={() => setPreviewManual(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ background: "#0f1218", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.25rem" }}>
                <h4 style={{ color: "#f8fafc", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Shield size={18} color="#e60026" />
                  Índice de Contenidos Oficial:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {previewManual.previewChapters.map((ch, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#cbd5e1", fontSize: "0.9rem" }}>
                      <CheckCircle size={15} color="#10b981" />
                      <span>{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "rgba(230,0,38,0.08)", border: "1px solid rgba(230,0,38,0.2)", borderRadius: "12px", padding: "1rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
                🔒 Este documento es propiedad intelectual de <strong>Sosa-Kai World Union Budo</strong>. Autorizado para entrenamiento y docencia de instructores certificados.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setPreviewManual(null)}>
                Cerrar Visor
              </button>
              <button className={styles.btnPrimary} onClick={() => handleDownload(previewManual.title)}>
                <Download size={16} /> Descargar Archivo PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsUploadOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Subir Nuevo Manual Técnico</h2>
              <button className={styles.modalClose} onClick={() => setIsUploadOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Título del Documento</label>
                <input type="text" placeholder="Ej. Guía de Katas Superiores 2026" />
              </div>
              <div className={styles.formGroup}>
                <label>Categoría</label>
                <select>
                  <option>Katas</option>
                  <option>Arbitraje</option>
                  <option>Grados</option>
                  <option>Protocolo</option>
                  <option>Técnica</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Archivo PDF</label>
                <input type="file" accept=".pdf" style={{ padding: "0.5rem" }} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setIsUploadOpen(false)}>Cancelar</button>
              <button className={styles.btnPrimary} onClick={() => { alert("Documento subido con éxito al repositorio del Dojo."); setIsUploadOpen(false); }}>
                Publicar Manual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
