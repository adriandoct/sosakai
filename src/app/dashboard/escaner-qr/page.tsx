"use client";

import { useState } from "react";
import { QrCode, CheckCircle2, Clock, Camera, RefreshCw, Zap } from "lucide-react";
import styles from "../dojo-modules.module.css";

interface ScanRecord {
  id: string;
  name: string;
  belt: string;
  time: string;
  type: "Entrada" | "Salida";
  status: "A tiempo" | "Retardo";
}

const DEMO_STUDENTS = [
  { id: "K-01", name: "Hiroshi Silva", belt: "Cinta Marrón" },
  { id: "K-02", name: "Valeria Mendoza", belt: "Cinta Verde" },
  { id: "K-03", name: "Mateo Hernández", belt: "Cinta Azul" },
  { id: "K-04", name: "Renata Castillo", belt: "Cinta Negra" },
  { id: "K-05", name: "Santiago Ruiz", belt: "Cinta Amarilla" },
];

export default function EscanerQRPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [lastScanned, setLastScanned] = useState<ScanRecord | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([
    { id: "K-01", name: "Hiroshi Silva", belt: "Cinta Marrón", time: "05:02 PM", type: "Entrada", status: "A tiempo" },
    { id: "K-04", name: "Renata Castillo", belt: "Cinta Negra", time: "05:05 PM", type: "Entrada", status: "A tiempo" },
    { id: "K-02", name: "Valeria Mendoza", belt: "Cinta Verde", time: "05:14 PM", type: "Entrada", status: "Retardo" },
  ]);

  const triggerScan = (studentIndex?: number) => {
    const student =
      studentIndex !== undefined
        ? DEMO_STUDENTS[studentIndex]
        : DEMO_STUDENTS[Math.floor(Math.random() * DEMO_STUDENTS.length)];

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newRecord: ScanRecord = {
      id: student.id,
      name: student.name,
      belt: student.belt,
      time: timeStr,
      type: "Entrada",
      status: now.getMinutes() > 10 ? "Retardo" : "A tiempo",
    };

    setLastScanned(newRecord);
    setHistory([newRecord, ...history]);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode) return;
    triggerScan(0);
    setManualCode("");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>
            <QrCode size={30} color="#e60026" />
            Escáner QR • Control de Asistencia
          </h1>
          <p>Lector inteligente de credenciales QR para registro automático de entradas y salidas al tatami.</p>
        </div>

        <div className={styles.topActions}>
          <button 
            className={styles.btnSecondary}
            onClick={() => setIsScanning(!isScanning)}
          >
            <Camera size={18} />
            {isScanning ? "Cámara Activa" : "Activar Cámara"}
          </button>
        </div>
      </div>

      {/* Main Grid: Scanner Viewport + Live Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.5rem" }}>
        {/* Scanner Box */}
        <div style={{ background: "#141822", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }}></span>
              LECTOR ÓPTICO CONECTADO
            </span>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Tatami Central • Sosa-Kai</span>
          </div>

          {/* Viewfinder */}
          <div style={{ position: "relative", width: "100%", height: "300px", background: "#0a0c10", borderRadius: "16px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed rgba(230,0,38,0.4)" }}>
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: 20, left: 20, width: 30, height: 30, borderTop: "3px solid #e60026", borderLeft: "3px solid #e60026" }}></div>
            <div style={{ position: "absolute", top: 20, right: 20, width: 30, height: 30, borderTop: "3px solid #e60026", borderRight: "3px solid #e60026" }}></div>
            <div style={{ position: "absolute", bottom: 20, left: 20, width: 30, height: 30, borderBottom: "3px solid #e60026", borderLeft: "3px solid #e60026" }}></div>
            <div style={{ position: "absolute", bottom: 20, right: 20, width: 30, height: 30, borderBottom: "3px solid #e60026", borderRight: "3px solid #e60026" }}></div>

            {/* Laser Line */}
            {isScanning && (
              <div 
                style={{ 
                  position: "absolute", 
                  top: "20%", 
                  left: "15%", 
                  width: "70%", 
                  height: "2px", 
                  background: "#e60026", 
                  boxShadow: "0 0 15px #e60026, 0 0 30px #e60026", 
                  animation: "scanLine 2.2s ease-in-out infinite alternate" 
                }}
              ></div>
            )}

            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              <QrCode size={70} color="#cbd5e1" style={{ opacity: 0.25, marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.9rem" }}>Coloca el código QR de la credencial del karateka frente a la cámara</p>
            </div>
          </div>

          {/* Last Scanned Result Banner */}
          {lastScanned && (
            <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "14px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "1.05rem" }}>
                  ¡Asistencia Registrada: {lastScanned.name}!
                </div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  {lastScanned.belt} • Entrada a las {lastScanned.time} ({lastScanned.status})
                </div>
              </div>
            </div>
          )}

          {/* Quick Simulation Buttons */}
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.6rem" }}>
              Simular Lectura Rápida de Credencial:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {DEMO_STUDENTS.map((s, idx) => (
                <button
                  key={s.id}
                  className={styles.btnSecondary}
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                  onClick={() => triggerScan(idx)}
                >
                  <Zap size={14} color="#e60026" />
                  {s.name} ({s.belt})
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input */}
          <form onSubmit={handleManualSubmit} style={{ display: "flex", gap: "0.6rem" }}>
            <input
              type="text"
              placeholder="Ingresar matrícula manual (Ej. K-01)..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              style={{ flex: 1, background: "#0f1218", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.65rem 1rem", color: "#fff", fontSize: "0.9rem", outline: "none" }}
            />
            <button type="submit" className={styles.btnPrimary}>
              Registrar
            </button>
          </form>
        </div>

        {/* Live Attendance Stream */}
        <div style={{ background: "#141822", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc" }}>
              Asistencias del Día ({history.length})
            </h2>
            <button 
              className={styles.btnSecondary} 
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
              onClick={() => triggerScan()}
            >
              <RefreshCw size={14} /> Actualizar
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", maxHeight: "500px" }}>
            {history.map((rec, i) => (
              <div 
                key={i}
                style={{ 
                  background: "#0f1218", 
                  border: "1px solid rgba(255,255,255,0.05)", 
                  borderRadius: "12px", 
                  padding: "0.9rem 1.1rem", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#f8fafc" }}>{rec.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{rec.belt} • Matrícula: {rec.id}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", color: "#f8fafc", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={13} color="#94a3b8" />
                    {rec.time}
                  </div>
                  <span 
                    style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: 600, 
                      color: rec.status === "A tiempo" ? "#10b981" : "#eab308" 
                    }}
                  >
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanLine {
          0% { top: 20%; }
          100% { top: 80%; }
        }
      `}</style>
    </div>
  );
}

