"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  X,
  Key,
  Eye,
  EyeOff,
  Power,
  PowerOff,
  Lock,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import styles from "../dojo-modules.module.css";

interface Karateka {
  id: string;
  name: string;
  belt: string;
  beltColor: string;
  tutor: string;
  phone: string;
  email: string;
  password?: string;
  attendance: string;
  status: "Activo" | "Inactivo" | "Examen Pendiente";
  joinedDate: string;
}

const INITIAL_KARATEKAS: Karateka[] = [
  {
    id: "K-01",
    name: "Hiroshi Silva",
    belt: "Cinta Marrón (1er Kyu)",
    beltColor: "#8B4513",
    tutor: "Adrian Silva (Padre)",
    phone: "+52 664 123 4567",
    email: "adrian.silva@cecytebc.edu.mx",
    password: "12345678Cecyte",
    attendance: "96%",
    status: "Examen Pendiente",
    joinedDate: "15/01/2023",
  },
  {
    id: "K-02",
    name: "Valeria Mendoza",
    belt: "Cinta Verde (4to Kyu)",
    beltColor: "#10B981",
    tutor: "Claudia Morales (Madre)",
    phone: "+52 664 987 6543",
    email: "claudia.mendoza@gmail.com",
    password: "12345678Cecyte",
    attendance: "92%",
    status: "Activo",
    joinedDate: "10/06/2023",
  },
  {
    id: "K-03",
    name: "Mateo Hernández",
    belt: "Cinta Azul (5to Kyu)",
    beltColor: "#3B82F6",
    tutor: "Roberto Hernández",
    phone: "+52 664 456 7890",
    email: "rhernandez@hotmail.com",
    password: "12345678Cecyte",
    attendance: "88%",
    status: "Activo",
    joinedDate: "20/09/2023",
  },
  {
    id: "K-04",
    name: "Renata Castillo",
    belt: "Cinta Negra (1er Dan)",
    beltColor: "#111827",
    tutor: "Alumna Adulta",
    phone: "+52 664 321 0987",
    email: "renata.castillo@outlook.com",
    password: "12345678Cecyte",
    attendance: "98%",
    status: "Activo",
    joinedDate: "05/02/2021",
  },
  {
    id: "K-05",
    name: "Santiago Ruiz",
    belt: "Cinta Amarilla (7mo Kyu)",
    beltColor: "#EAB308",
    tutor: "Mariana Ruiz (Madre)",
    phone: "+52 664 789 0123",
    email: "mariana.ruiz@gmail.com",
    password: "12345678Cecyte",
    attendance: "85%",
    status: "Activo",
    joinedDate: "12/01/2026",
  },
  {
    id: "K-06",
    name: "Camila Torres",
    belt: "Cinta Blanca (Principiante)",
    beltColor: "#E2E8F0",
    tutor: "Esteban Torres",
    phone: "+52 664 234 5678",
    email: "esteban.torres@gmail.com",
    password: "12345678Cecyte",
    attendance: "90%",
    status: "Activo",
    joinedDate: "01/03/2026",
  },
];

export default function KaratekasPage() {
  const [karatekas, setKaratekas] = useState<Karateka[]>(INITIAL_KARATEKAS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBelt, setSelectedBelt] = useState("Todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [editingPasswordKarateka, setEditingPasswordKarateka] = useState<{
    id: string;
    name: string;
    password: string;
  } | null>(null);
  const [karatekaToDelete, setKaratekaToDelete] = useState<Karateka | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state for new karateka
  const [formData, setFormData] = useState({
    name: "",
    belt: "Cinta Blanca (Principiante)",
    tutor: "",
    phone: "",
    email: "",
    password: "12345678Cecyte",
  });

  // Load persisted karatekas from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sosakai_karatekas_list");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setKaratekas(parsed);
        }
      }
    } catch {}
  }, []);

  const getBeltColor = (belt: string) => {
    if (belt.includes("Negra")) return "#111827";
    if (belt.includes("Marrón")) return "#8B4513";
    if (belt.includes("Azul")) return "#3B82F6";
    if (belt.includes("Verde")) return "#10B981";
    if (belt.includes("Naranja")) return "#F97316";
    if (belt.includes("Amarilla")) return "#EAB308";
    return "#E2E8F0";
  };

  const handleToggleStatus = (id: string) => {
    const updated = karatekas.map((k) => {
      if (k.id === id) {
        const nextStatus = k.status === "Inactivo" ? "Activo" : "Inactivo";
        return { ...k, status: nextStatus as Karateka["status"] };
      }
      return k;
    });

    setKaratekas(updated);
    try {
      localStorage.setItem("sosakai_karatekas_list", JSON.stringify(updated));
    } catch {}

    const target = karatekas.find((k) => k.id === id);
    const willBeActive = target?.status === "Inactivo";
    setNotification({
      type: "success",
      text: `${target?.name || "Karateka"} ha sido ${willBeActive ? "activado" : "desactivado"} correctamente.`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPasswordKarateka) return;

    const newPass = editingPasswordKarateka.password.trim();
    if (!newPass) return;

    const updated = karatekas.map((k) =>
      k.id === editingPasswordKarateka.id ? { ...k, password: newPass } : k
    );

    setKaratekas(updated);
    try {
      localStorage.setItem("sosakai_karatekas_list", JSON.stringify(updated));
    } catch {}

    const targetName = editingPasswordKarateka.name;
    setEditingPasswordKarateka(null);

    setNotification({
      type: "success",
      text: `Contraseña de acceso actualizada para ${targetName}.`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleConfirmDelete = () => {
    if (!karatekaToDelete) return;

    const updated = karatekas.filter((k) => k.id !== karatekaToDelete.id);
    setKaratekas(updated);
    try {
      localStorage.setItem("sosakai_karatekas_list", JSON.stringify(updated));
    } catch {}

    const deletedName = karatekaToDelete.name;
    setKaratekaToDelete(null);

    setNotification({
      type: "success",
      text: `El karateka "${deletedName}" ha sido eliminado del registro.`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newK: Karateka = {
      id: `K-0${karatekas.length + 1}`,
      name: formData.name,
      belt: formData.belt,
      beltColor: getBeltColor(formData.belt),
      tutor: formData.tutor || "Tutor Particular",
      phone: formData.phone || "+52 664 000 0000",
      email: formData.email || "contacto@dojo.com",
      password: formData.password.trim() || "12345678Cecyte",
      attendance: "100%",
      status: "Activo",
      joinedDate: new Date().toLocaleDateString("es-MX"),
    };

    const updated = [newK, ...karatekas];
    setKaratekas(updated);
    try {
      localStorage.setItem("sosakai_karatekas_list", JSON.stringify(updated));
    } catch {}

    setFormData({
      name: "",
      belt: "Cinta Blanca (Principiante)",
      tutor: "",
      phone: "",
      email: "",
      password: "12345678Cecyte",
    });
    setIsModalOpen(false);

    setNotification({
      type: "success",
      text: `¡${newK.name} inscrito exitosamente en el dojo!`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredKaratekas = karatekas.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.tutor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBelt =
      selectedBelt === "Todas" || k.belt.toLowerCase().includes(selectedBelt.toLowerCase());
    return matchesSearch && matchesBelt;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>
            <Users size={30} color="#e60026" />
            Karatekas y Tutores
          </h1>
          <p>Directorio integral de alumnos del Dojo Shito-Ryu, grados marciales y tutores responsables.</p>
        </div>

        <div className={styles.topActions}>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} />
            Inscribir Karateka
          </button>
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
            marginBottom: "1.25rem",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <CheckCircle2 size={20} />
          <span>{notification.text}</span>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Users size={24} /></div>
          <div className={styles.statInfo}>
            <h3>{karatekas.length}</h3>
            <p>Alumnos Inscritos</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#EAB308' }}>
            <Award size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>1</h3>
            <p>Examen Próximo (1er Dan)</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>93%</h3>
            <p>Asistencia Promedio</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
            <Shield size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Shito-Ryu</h3>
            <p>Línea Oficial Sosa-Kai</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por alumno o tutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterTabs}>
          {["Todas", "Blanca", "Amarilla", "Verde", "Azul", "Marrón", "Negra"].map((belt) => (
            <button
              key={belt}
              className={`${styles.filterTab} ${selectedBelt === belt ? styles.filterTabActive : ""}`}
              onClick={() => setSelectedBelt(belt)}
            >
              {belt}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID / Karateka</th>
              <th>Cinta / Grado</th>
              <th>Tutor / Padre</th>
              <th>Contacto</th>
              <th>Contraseña</th>
              <th>Asistencia</th>
              <th>Estado y Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredKaratekas.map((k) => (
              <tr key={k.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.userAvatar}>
                      {k.name[0]}
                    </div>
                    <div>
                      <div className={styles.userName}>{k.name}</div>
                      <div className={styles.userSub}>{k.id} • Alta: {k.joinedDate}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={styles.beltBadge}
                    style={{
                      background: `${k.beltColor}20`,
                      borderColor: `${k.beltColor}60`,
                      color: k.beltColor === "#111827" ? "#ffffff" : k.beltColor,
                    }}
                  >
                    <span className={styles.beltDot} style={{ background: k.beltColor }}></span>
                    {k.belt}
                  </span>
                </td>
                <td>
                  <div style={{ color: "#f8fafc", fontWeight: 500 }}>{k.tutor}</div>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", fontSize: "0.82rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Phone size={13} color="#94a3b8" /> {k.phone}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Mail size={13} color="#94a3b8" /> {k.email}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.82rem",
                        background: "rgba(0, 0, 0, 0.45)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        padding: "0.25rem 0.55rem",
                        borderRadius: "6px",
                        color: visiblePasswords[k.id] ? "#38bdf8" : "#94a3b8",
                        letterSpacing: visiblePasswords[k.id] ? "normal" : "2px",
                      }}
                    >
                      {visiblePasswords[k.id] ? (k.password || "12345678Cecyte") : "••••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setVisiblePasswords((prev) => ({ ...prev, [k.id]: !prev[k.id] }))}
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#cbd5e1",
                        borderRadius: "6px",
                        padding: "0.25rem 0.35rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      title={visiblePasswords[k.id] ? "Ocultar" : "Mostrar contraseña"}
                    >
                      {visiblePasswords[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPasswordKarateka({
                          id: k.id,
                          name: k.name,
                          password: k.password || "12345678Cecyte",
                        })
                      }
                      style={{
                        background: "rgba(230, 0, 38, 0.12)",
                        border: "1px solid rgba(230, 0, 38, 0.3)",
                        color: "#ff6b81",
                        borderRadius: "6px",
                        padding: "0.25rem 0.5rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                      }}
                      title="Editar contraseña de este alumno"
                    >
                      <Key size={12} />
                      <span>Editar</span>
                    </button>
                  </div>
                </td>
                <td>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>{k.attendance}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        background:
                          k.status === "Activo"
                            ? "rgba(16, 185, 129, 0.15)"
                            : k.status === "Inactivo"
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(234, 179, 8, 0.15)",
                        color:
                          k.status === "Activo"
                            ? "#10B981"
                            : k.status === "Inactivo"
                            ? "#f87171"
                            : "#EAB308",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background:
                            k.status === "Activo"
                              ? "#10B981"
                              : k.status === "Inactivo"
                              ? "#f87171"
                              : "#EAB308",
                        }}
                      ></span>
                      {k.status}
                    </span>

                    <button
                      type="button"
                      className={k.status === "Inactivo" ? styles.btnSuccess : styles.btnSecondary}
                      style={{
                        padding: "0.3rem 0.6rem",
                        fontSize: "0.78rem",
                        color: k.status === "Inactivo" ? "#10b981" : "#f59e0b",
                        borderColor: k.status === "Inactivo" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)",
                        background: k.status === "Inactivo" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      }}
                      onClick={() => handleToggleStatus(k.id)}
                      title={k.status === "Inactivo" ? "Activar karateka" : "Desactivar karateka"}
                    >
                      {k.status === "Inactivo" ? (
                        <>
                          <Power size={12} />
                          <span>Activar</span>
                        </>
                      ) : (
                        <>
                          <PowerOff size={12} />
                          <span>Desactivar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className={styles.btnDelete}
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}
                      onClick={() => setKaratekaToDelete(k)}
                      title="Eliminar este karateka permanentemente"
                    >
                      <Trash2 size={12} />
                      <span>Borrar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Karateka Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Inscribir Nuevo Karateka</h2>
              <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Nombre Completo del Karateka</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Kenji Tanaka"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Grado / Cinta Inicial</label>
                  <select
                    value={formData.belt}
                    onChange={(e) => setFormData({ ...formData, belt: e.target.value })}
                  >
                    <option value="Cinta Blanca (Principiante)">Cinta Blanca (Principiante)</option>
                    <option value="Cinta Amarilla (7mo Kyu)">Cinta Amarilla (7mo Kyu)</option>
                    <option value="Cinta Naranja (6to Kyu)">Cinta Naranja (6to Kyu)</option>
                    <option value="Cinta Verde (4to Kyu)">Cinta Verde (4to Kyu)</option>
                    <option value="Cinta Azul (3er Kyu)">Cinta Azul (3er Kyu)</option>
                    <option value="Cinta Marrón (1er Kyu)">Cinta Marrón (1er Kyu)</option>
                    <option value="Cinta Negra (1er Dan)">Cinta Negra (1er Dan)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Nombre del Padre o Tutor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Roberto Tanaka"
                    value={formData.tutor}
                    onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Teléfono Celular de Contacto</label>
                  <input
                    type="text"
                    required
                    placeholder="+52 664 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="tutor@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Contraseña de Acceso al Portal</label>
                  <input
                    type="text"
                    required
                    placeholder="12345678Cecyte"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <small style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Contraseña inicial para que el alumno o tutor pueda ingresar al dojo.
                  </small>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Completar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Password Modal */}
      {editingPasswordKarateka && (
        <div className={styles.modalOverlay} onClick={() => setEditingPasswordKarateka(null)}>
          <div className={styles.modalBox} style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Key size={20} color="#e60026" />
                Editar Contraseña
              </h2>
              <button className={styles.modalClose} onClick={() => setEditingPasswordKarateka(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePassword}>
              <div className={styles.modalBody}>
                <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  Modifica la contraseña de acceso para el karateka:
                  <br />
                  <strong style={{ color: "#f8fafc", fontSize: "1.05rem" }}>{editingPasswordKarateka.name}</strong>
                </p>

                <div className={styles.formGroup}>
                  <label>Nueva Contraseña de Acceso *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Ingresa la nueva contraseña..."
                    value={editingPasswordKarateka.password}
                    onChange={(e) =>
                      setEditingPasswordKarateka({ ...editingPasswordKarateka, password: e.target.value })
                    }
                  />
                  <small style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Esta clave servirá para el acceso del alumno o su tutor en la plataforma.
                  </small>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setEditingPasswordKarateka(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Guardar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {karatekaToDelete && (
        <div className={styles.modalOverlay} onClick={() => setKaratekaToDelete(null)}>
          <div className={styles.modalBox} style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ color: "#f87171", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <AlertTriangle size={22} color="#f87171" />
                Confirmar Eliminación
              </h2>
              <button className={styles.modalClose} onClick={() => setKaratekaToDelete(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6 }}>
                ¿Estás seguro de que deseas eliminar permanentemente del dojo al karateka:
              </p>
              <div
                style={{
                  background: "#0a0c10",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  marginTop: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "1.05rem" }}>
                  {karatekaToDelete.name}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                  {karatekaToDelete.id} • {karatekaToDelete.belt} • Tutor: {karatekaToDelete.tutor}
                </div>
              </div>

              <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: 0 }}>
                Esta acción removerá su historial, asistencia y credenciales del listado oficial.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setKaratekaToDelete(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={handleConfirmDelete}
              >
                <Trash2 size={15} />
                Eliminar Karateka
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

