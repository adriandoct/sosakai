"use client";

import { useState } from "react";
import { Award, Clock, Users, Calendar, Plus, BookOpen, X, Check } from "lucide-react";
import styles from "../dojo-modules.module.css";

interface ClassSchedule {
  id: string;
  day: string;
  time: string;
  name: string;
  beltCategory: string;
  sensei: string;
  tatami: string;
  capacity: string;
  focus: string;
}

const SCHEDULES: ClassSchedule[] = [
  {
    id: "H-01",
    day: "Lunes",
    time: "04:00 PM - 05:00 PM",
    name: "Karate Infantil (Semillero)",
    beltCategory: "Cintas Blancas y Amarillas (4 a 8 años)",
    sensei: "Sensei Carlos Mendoza (3er Dan)",
    tatami: "Tatami 1",
    capacity: "16 / 20 Alumnos",
    focus: "Kihon básico, postura Zenkutsu Dachi, respeto y disciplina.",
  },
  {
    id: "H-02",
    day: "Lunes",
    time: "05:15 PM - 06:30 PM",
    name: "Karate Juvenil Intermedio",
    beltCategory: "Cintas Naranjas a Azules",
    sensei: "Sensei Adrian Silva (4to Dan)",
    tatami: "Tatami 1",
    capacity: "18 / 20 Alumnos",
    focus: "Katas Pinan (Heian), combinaciones de Gohon Kumite.",
  },
  {
    id: "H-03",
    day: "Lunes",
    time: "06:45 PM - 08:15 PM",
    name: "Avanzados y Adultos (Alta Intensidad)",
    beltCategory: "Cintas Marrón y Negra",
    sensei: "Sensei Adrian Silva (4to Dan)",
    tatami: "Tatami Central",
    capacity: "14 / 15 Alumnos",
    focus: "Bassai Dai, Seienchin, Bunkai aplicado y combate libre.",
  },
  {
    id: "H-04",
    day: "Miércoles",
    time: "05:00 PM - 06:15 PM",
    name: "Técnicas de Kumite y Distancia",
    beltCategory: "Todos los Grados (Separados por nivel)",
    sensei: "Sensei Roberto Tanaka",
    tatami: "Tatami 2",
    capacity: "20 / 22 Alumnos",
    focus: "Desplazamientos, esquivas Tenshin, contraataque Deai.",
  },
  {
    id: "H-05",
    day: "Viernes",
    time: "06:00 PM - 07:30 PM",
    name: "Katas de Competición Shito-Ryu",
    beltCategory: "Equipo Representativo Sosa-Kai",
    sensei: "Sensei Adrian Silva",
    tatami: "Tatami Central",
    capacity: "12 / 12 Alumnos",
    focus: "Rohai, Kosokun Dai, Annan, ritmo y kime para torneo.",
  },
  {
    id: "H-06",
    day: "Sábado",
    time: "09:00 AM - 11:00 AM",
    name: "Clase Magistral y Bunkai Shito-Ryu",
    beltCategory: "Clase General Familiar y Adultos",
    sensei: "Shihan Invitado Sosa-Kai",
    tatami: "Todo el Dojo",
    capacity: "35 / 40 Alumnos",
    focus: "Defensa personal real, caídas Ukemi y filosofía Budo.",
  },
];

const BELT_PROGRAMS = [
  {
    belt: "Cinta Amarilla (7mo Kyu)",
    katas: "Heian Nidan / Pinan Nidan",
    kihon: "Oi Tsuki, Age Uke, Mae Geri, Zenkutsu Dachi",
    kumite: "Yakusoku Kumite (3 ataques pactados)",
    duration: "3 meses de asistencia mínima (24 clases)",
  },
  {
    belt: "Cinta Naranja (6to Kyu)",
    katas: "Pinan Shodan y Pinan Sandan",
    kihon: "Gyaku Tsuki, Soto Uke, Mawashi Geri, Kokutsu Dachi",
    kumite: "Kihon Ippon Kumite",
    duration: "4 meses de asistencia mínima",
  },
  {
    belt: "Cinta Verde (4to Kyu)",
    katas: "Pinan Yondan y Pinan Godan",
    kihon: "Uchi Uke, Yoko Geri Kekomi, Shiko Dachi profundo",
    kumite: "Jiyu Ippon Kumite básico",
    duration: "6 meses de asistencia mínima",
  },
  {
    belt: "Cinta Azul (3er Kyu)",
    katas: "Bassai Dai (Katas Clásico Shito-Ryu)",
    kihon: "Combinaciones triples con Kime y respiración Ibuki",
    kumite: "Combate controlado con protecciones WKF",
    duration: "6 meses de asistencia mínima",
  },
  {
    belt: "Cinta Marrón (1er Kyu)",
    katas: "Seienchin y Jitte",
    kihon: "Transiciones rápidas de postura Neko Ashi a Moto Dachi",
    kumite: "Ju-Kumite táctico y Bunkai de Bassai Dai",
    duration: "9 meses de entrenamiento intensivo",
  },
  {
    belt: "Cinta Negra (1er Dan Shodan)",
    katas: "Bassai Dai, Seienchin, Rohai y Kata Libre",
    kihon: "Maestría total de todas las técnicas fundamentales",
    kumite: "5 combates continuos con cintas avanzadas",
    duration: "Mínimo 1 año como 1er Kyu y tesis marcial",
  },
];

export default function HorariosPage() {
  const [activeTab, setActiveTab] = useState<"horarios" | "programa">("horarios");
  const [selectedDay, setSelectedDay] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSchedules = SCHEDULES.filter((s) => {
    return selectedDay === "Todos" || s.day === selectedDay;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>
            <Award size={30} color="#e60026" />
            Horarios y Programa Técnico
          </h1>
          <p>Organización semanal de entrenamientos y plan curricular oficial de grados Shito-Ryu Sosa-Kai.</p>
        </div>

        <div className={styles.topActions}>
          <div style={{ display: "flex", gap: "0.4rem", background: "#141822", padding: "0.3rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              className={styles.filterTab}
              style={{ background: activeTab === "horarios" ? "#e60026" : "transparent", color: activeTab === "horarios" ? "#fff" : "#94a3b8" }}
              onClick={() => setActiveTab("horarios")}
            >
              <Calendar size={15} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
              Horarios Semanales
            </button>
            <button
              className={styles.filterTab}
              style={{ background: activeTab === "programa" ? "#e60026" : "transparent", color: activeTab === "programa" ? "#fff" : "#94a3b8" }}
              onClick={() => setActiveTab("programa")}
            >
              <BookOpen size={15} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
              Programa de Grados
            </button>
          </div>

          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Nueva Clase
          </button>
        </div>
      </div>

      {activeTab === "horarios" && (
        <>
          {/* Day Filters */}
          <div className={styles.filterBar}>
            <div className={styles.filterTabs}>
              {["Todos", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
                <button
                  key={day}
                  className={`${styles.filterTab} ${selectedDay === day ? styles.filterTabActive : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              Mostrando {filteredSchedules.length} clases programadas
            </div>
          </div>

          {/* Schedules Cards Grid */}
          <div className={styles.cardsGrid}>
            {filteredSchedules.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#e60026", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {item.day} • {item.tatami}
                    </span>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f8fafc", marginTop: "0.2rem" }}>
                      {item.name}
                    </h3>
                  </div>

                  <span style={{ background: "rgba(230,0,38,0.12)", color: "#ff4d6d", padding: "0.25rem 0.65rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600 }}>
                    {item.capacity}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Clock size={14} color="#e60026" />
                    <strong>Horario:</strong> {item.time}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Users size={14} color="#e60026" />
                    <strong>Dirigido a:</strong> {item.beltCategory}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Award size={14} color="#e60026" />
                    <strong>Instructor:</strong> {item.sensei}
                  </div>
                </div>

                <div style={{ background: "#0f1218", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)", fontSize: "0.85rem", color: "#94a3b8" }}>
                  <strong style={{ color: "#f8fafc" }}>Enfoque técnico:</strong> {item.focus}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "programa" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ background: "#141822", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>
              Estructura Oficial de Exámenes • Shito-Ryu Sosa-Kai
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Para aspirar a la siguiente cinta, cada karateka debe acumular el tiempo mínimo de práctica y demostrar solidez en los tres pilares: <strong>Kihon</strong> (Básicos), <strong>Kata</strong> (Formas) y <strong>Kumite</strong> (Combate).
            </p>
          </div>

          <div className={styles.cardsGrid}>
            {BELT_PROGRAMS.map((prog, index) => (
              <div key={index} className={styles.itemCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Award size={20} color="#e60026" />
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f8fafc" }}>
                    {prog.belt}
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem" }}>
                  <div>
                    <strong style={{ color: "#e60026" }}>🥋 Katas Requeridos:</strong>
                    <div style={{ color: "#cbd5e1", marginTop: "0.15rem" }}>{prog.katas}</div>
                  </div>
                  <div>
                    <strong style={{ color: "#3b82f6" }}>👊 Kihon (Técnica):</strong>
                    <div style={{ color: "#cbd5e1", marginTop: "0.15rem" }}>{prog.kihon}</div>
                  </div>
                  <div>
                    <strong style={{ color: "#10b981" }}>⚔️ Kumite (Combate):</strong>
                    <div style={{ color: "#cbd5e1", marginTop: "0.15rem" }}>{prog.kumite}</div>
                  </div>
                  <div style={{ background: "#0f1218", padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", fontSize: "0.8rem", color: "#94a3b8" }}>
                    <strong>Requisito temporal:</strong> {prog.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nueva Clase */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Agregar Nueva Clase al Horario</h2>
              <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Nombre de la Clase</label>
                <input type="text" placeholder="Ej. Kumite Táctico Avanzado" />
              </div>
              <div className={styles.formGroup}>
                <label>Día de la Semana</label>
                <select>
                  <option>Lunes</option>
                  <option>Martes</option>
                  <option>Miércoles</option>
                  <option>Jueves</option>
                  <option>Viernes</option>
                  <option>Sábado</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Horario (Hora de inicio y término)</label>
                <input type="text" placeholder="Ej. 06:00 PM - 07:30 PM" />
              </div>
              <div className={styles.formGroup}>
                <label>Sensei Responsable</label>
                <input type="text" placeholder="Sensei Adrian Silva" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className={styles.btnPrimary} onClick={() => setIsModalOpen(false)}>Guardar Horario</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

