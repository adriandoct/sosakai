"use client";

import { useState } from "react";
import { CheckSquare, Award, CheckCircle2, X, Star, FileCheck, Shield, AlertCircle } from "lucide-react";
import styles from "../dojo-modules.module.css";

interface Candidate {
  id: string;
  name: string;
  currentBelt: string;
  targetBelt: string;
  targetBeltColor: string;
  attendance: string;
  hoursCompleted: number;
  hoursRequired: number;
  kataAssigned: string;
  status: "Pendiente" | "Evaluando" | "Aprobado";
  scoreKihon?: number;
  scoreKata?: number;
  scoreKumite?: number;
  scoreReishiki?: number;
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "K-01",
    name: "Hiroshi Silva",
    currentBelt: "Cinta Marrón (1er Kyu)",
    targetBelt: "Cinta Negra (1er Dan Shodan)",
    targetBeltColor: "#111827",
    attendance: "96%",
    hoursCompleted: 240,
    hoursRequired: 200,
    kataAssigned: "Bassai Dai & Seienchin",
    status: "Evaluando",
    scoreKihon: 9.5,
    scoreKata: 9.8,
    scoreKumite: 9.2,
    scoreReishiki: 10,
  },
  {
    id: "K-02",
    name: "Valeria Mendoza",
    currentBelt: "Cinta Verde (4to Kyu)",
    targetBelt: "Cinta Azul (3er Kyu)",
    targetBeltColor: "#3B82F6",
    attendance: "92%",
    hoursCompleted: 95,
    hoursRequired: 90,
    kataAssigned: "Pinan Godan",
    status: "Pendiente",
  },
  {
    id: "K-03",
    name: "Mateo Hernández",
    currentBelt: "Cinta Azul (5to Kyu)",
    targetBelt: "Cinta Verde (4to Kyu)",
    targetBeltColor: "#10B981",
    attendance: "88%",
    hoursCompleted: 75,
    hoursRequired: 80,
    kataAssigned: "Pinan Yondan",
    status: "Pendiente",
  },
  {
    id: "K-05",
    name: "Santiago Ruiz",
    currentBelt: "Cinta Blanca (Principiante)",
    targetBelt: "Cinta Amarilla (7mo Kyu)",
    targetBeltColor: "#EAB308",
    attendance: "90%",
    hoursCompleted: 35,
    hoursRequired: 30,
    kataAssigned: "Pinan Nidan",
    status: "Aprobado",
    scoreKihon: 8.5,
    scoreKata: 9.0,
    scoreKumite: 8.0,
    scoreReishiki: 9.5,
  },
];

export default function ExamenesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [diplomaCandidate, setDiplomaCandidate] = useState<Candidate | null>(null);

  // Evaluation state
  const [evalScores, setEvalScores] = useState({
    kihon: 9.0,
    kata: 9.5,
    kumite: 8.5,
    reishiki: 10,
    notes: "Excelente postura y concentración. Fuerte Kime en transiciones.",
  });

  const handleOpenEvaluation = (cand: Candidate) => {
    setSelectedCandidate(cand);
    setEvalScores({
      kihon: cand.scoreKihon || 9.0,
      kata: cand.scoreKata || 9.0,
      kumite: cand.scoreKumite || 8.5,
      reishiki: cand.scoreReishiki || 10,
      notes: "Demuestra solidez técnica y respeto en el tatami.",
    });
  };

  const handleSaveEvaluation = (approve: boolean) => {
    if (!selectedCandidate) return;

    const updated = candidates.map((c) => {
      if (c.id === selectedCandidate.id) {
        return {
          ...c,
          status: (approve ? "Aprobado" : "Evaluando") as "Pendiente" | "Evaluando" | "Aprobado",
          scoreKihon: evalScores.kihon,
          scoreKata: evalScores.kata,
          scoreKumite: evalScores.kumite,
          scoreReishiki: evalScores.reishiki,
        };
      }
      return c;
    });

    setCandidates(updated);
    if (approve) {
      setDiplomaCandidate({
        ...selectedCandidate,
        status: "Aprobado",
        scoreKihon: evalScores.kihon,
        scoreKata: evalScores.kata,
        scoreKumite: evalScores.kumite,
        scoreReishiki: evalScores.reishiki,
      });
    }
    setSelectedCandidate(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>
            <CheckSquare size={30} color="#e60026" />
            Revisar Exámenes y Promociones de Grado
          </h1>
          <p>Módulo de evaluación para sinodales y directores técnicos de Sosa-Kai Shito-Ryu.</p>
        </div>

        <div className={styles.topActions}>
          <span style={{ background: "rgba(230,0,38,0.12)", color: "#ff4d6d", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700 }}>
            🥋 Próximo Periodo de Examen: 15 de Noviembre
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Award size={24} /></div>
          <div className={styles.statInfo}>
            <h3>{candidates.length}</h3>
            <p>Aspirantes Convocados</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{candidates.filter(c => c.status === "Aprobado").length}</h3>
            <p>Grados Aprobados</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(234, 179, 8, 0.15)", color: "#EAB308" }}>
            <AlertCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{candidates.filter(c => c.status !== "Aprobado").length}</h3>
            <p>Evaluaciones Pendientes</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3B82F6" }}>
            <Shield size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>1</h3>
            <p>Candidato a Cinturón Negro</p>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Karateka / ID</th>
              <th>Grado Actual</th>
              <th>Aspiración a</th>
              <th>Horas Tatami</th>
              <th>Kata Asignado</th>
              <th>Estado</th>
              <th>Acción Sinodal</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((cand) => (
              <tr key={cand.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.userAvatar} style={{ background: "#e60026" }}>
                      {cand.name[0]}
                    </div>
                    <div>
                      <div className={styles.userName}>{cand.name}</div>
                      <div className={styles.userSub}>{cand.id} • Asist: {cand.attendance}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ color: "#cbd5e1", fontSize: "0.88rem" }}>{cand.currentBelt}</span>
                </td>
                <td>
                  <span
                    className={styles.beltBadge}
                    style={{
                      background: `${cand.targetBeltColor}20`,
                      borderColor: `${cand.targetBeltColor}60`,
                      color: cand.targetBeltColor === "#111827" ? "#ffffff" : cand.targetBeltColor,
                    }}
                  >
                    <span className={styles.beltDot} style={{ background: cand.targetBeltColor }}></span>
                    {cand.targetBelt}
                  </span>
                </td>
                <td>
                  <span style={{ color: cand.hoursCompleted >= cand.hoursRequired ? "#10b981" : "#eab308", fontWeight: 700 }}>
                    {cand.hoursCompleted} / {cand.hoursRequired} hrs
                  </span>
                </td>
                <td>
                  <span style={{ color: "#f8fafc", fontWeight: 500 }}>{cand.kataAssigned}</span>
                </td>
                <td>
                  <span
                    style={{
                      background:
                        cand.status === "Aprobado"
                          ? "rgba(16, 185, 129, 0.15)"
                          : cand.status === "Evaluando"
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(234, 179, 8, 0.15)",
                      color:
                        cand.status === "Aprobado"
                          ? "#10B981"
                          : cand.status === "Evaluando"
                          ? "#3B82F6"
                          : "#EAB308",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {cand.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                      onClick={() => handleOpenEvaluation(cand)}
                    >
                      <CheckSquare size={14} /> Evaluar
                    </button>
                    {cand.status === "Aprobado" && (
                      <button
                        className={styles.btnPrimary}
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                        onClick={() => setDiplomaCandidate(cand)}
                      >
                        <FileCheck size={14} /> Diploma
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evaluation Modal */}
      {selectedCandidate && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCandidate(null)}>
          <div className={styles.modalBox} style={{ maxWidth: "620px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Ficha de Evaluación Técnica</h2>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Aspirante: <strong>{selectedCandidate.name}</strong> ➔ {selectedCandidate.targetBelt}
                </p>
              </div>
              <button className={styles.modalClose} onClick={() => setSelectedCandidate(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ background: "#0f1218", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                <div><strong>Grado Actual:</strong> {selectedCandidate.currentBelt}</div>
                <div><strong>Kata Principal:</strong> {selectedCandidate.kataAssigned}</div>
                <div><strong>Horas Acumuladas:</strong> {selectedCandidate.hoursCompleted} hrs</div>
                <div><strong>Cumplimiento de Asistencia:</strong> {selectedCandidate.attendance}</div>
              </div>

              {/* Rubric Sliders */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className={styles.formGroup}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>1. Kihon (Posturas, Puños y Patadas)</label>
                    <span style={{ color: "#e60026", fontWeight: 700 }}>{evalScores.kihon} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={evalScores.kihon}
                    onChange={(e) => setEvalScores({ ...evalScores, kihon: parseFloat(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>2. Kata (Ritmo, Embusen y Kime)</label>
                    <span style={{ color: "#e60026", fontWeight: 700 }}>{evalScores.kata} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={evalScores.kata}
                    onChange={(e) => setEvalScores({ ...evalScores, kata: parseFloat(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>3. Kumite (Distancia y Control de Combate)</label>
                    <span style={{ color: "#e60026", fontWeight: 700 }}>{evalScores.kumite} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={evalScores.kumite}
                    onChange={(e) => setEvalScores({ ...evalScores, kumite: parseFloat(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>4. Reishiki (Disciplina, Respeto y Espíritu Marcial)</label>
                    <span style={{ color: "#e60026", fontWeight: 700 }}>{evalScores.reishiki} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={evalScores.reishiki}
                    onChange={(e) => setEvalScores({ ...evalScores, reishiki: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              {/* Total Average */}
              <div style={{ background: "rgba(230,0,38,0.1)", border: "1px solid rgba(230,0,38,0.25)", padding: "0.85rem 1.25rem", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "#f8fafc" }}>Promedio General del Examen:</span>
                <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ff4d6d" }}>
                  {((evalScores.kihon + evalScores.kata + evalScores.kumite + evalScores.reishiki) / 4).toFixed(1)} / 10
                </span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setSelectedCandidate(null)}>
                Cancelar
              </button>
              <button className={styles.btnSecondary} onClick={() => handleSaveEvaluation(false)}>
                Guardar Borrador
              </button>
              <button className={styles.btnPrimary} onClick={() => handleSaveEvaluation(true)}>
                <CheckCircle2 size={16} /> Aprobar y Ascender Grado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Modal */}
      {diplomaCandidate && (
        <div className={styles.modalOverlay} onClick={() => setDiplomaCandidate(null)}>
          <div className={styles.modalBox} style={{ maxWidth: "650px", background: "#0b0e14", border: "2px solid #EAB308" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader} style={{ borderBottom: "1px solid rgba(234, 179, 8, 0.3)" }}>
              <h2 style={{ color: "#EAB308", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={22} color="#EAB308" />
                Certificado Oficial de Grado • Sosa-Kai
              </h2>
              <button className={styles.modalClose} onClick={() => setDiplomaCandidate(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody} style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
              <div style={{ fontSize: "1rem", letterSpacing: "3px", textTransform: "uppercase", color: "#EAB308", fontWeight: 700 }}>
                WORLD UNION BUDO • SOSA-KAI
              </div>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
                Dojo Central Shito-Ryu Internacional
              </div>

              <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                Por haber demostrado disciplina inquebrantable, dominio de las formas tradicionales y superado satisfactoriamente los exámenes de rigor, se confiere el grado de:
              </p>

              <div style={{ margin: "1.5rem 0", padding: "1rem", background: "rgba(234, 179, 8, 0.08)", border: "1px dashed #EAB308", borderRadius: "12px" }}>
                <h1 style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, marginBottom: "0.3rem" }}>
                  {diplomaCandidate.name}
                </h1>
                <div style={{ fontSize: "1.35rem", color: "#EAB308", fontWeight: 800, letterSpacing: "1px" }}>
                  {diplomaCandidate.targetBelt}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-around", marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
                <div>
                  <div style={{ width: 140, borderBottom: "1px solid #94a3b8", marginBottom: "0.4rem" }}></div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Shihan Fundador</div>
                  <div style={{ fontSize: "0.85rem", color: "#f8fafc", fontWeight: 600 }}>Sosa-Kai Union</div>
                </div>
                <div>
                  <div style={{ width: 140, borderBottom: "1px solid #94a3b8", marginBottom: "0.4rem" }}></div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Director Sinodal</div>
                  <div style={{ fontSize: "0.85rem", color: "#f8fafc", fontWeight: 600 }}>Sensei Adrian Silva</div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ borderTop: "1px solid rgba(234, 179, 8, 0.3)" }}>
              <button className={styles.btnSecondary} onClick={() => setDiplomaCandidate(null)}>
                Cerrar
              </button>
              <button className={styles.btnPrimary} onClick={() => alert("Imprimiendo diploma oficial en alta resolución...")}>
                Imprimir Diploma Oficial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

