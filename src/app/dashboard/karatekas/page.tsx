"use client";

import { useState } from "react";
import { Users, UserPlus, Search, Shield, Phone, Mail, Award, CheckCircle2, X } from "lucide-react";
import styles from "../dojo-modules.module.css";

interface Karateka {
  id: string;
  name: string;
  belt: string;
  beltColor: string;
  tutor: string;
  phone: string;
  email: string;
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

  // Form state for new karateka
  const [formData, setFormData] = useState({
    name: "",
    belt: "Cinta Blanca (Principiante)",
    tutor: "",
    phone: "",
    email: "",
  });

  const getBeltColor = (belt: string) => {
    if (belt.includes("Negra")) return "#111827";
    if (belt.includes("Marrón")) return "#8B4513";
    if (belt.includes("Azul")) return "#3B82F6";
    if (belt.includes("Verde")) return "#10B981";
    if (belt.includes("Naranja")) return "#F97316";
    if (belt.includes("Amarilla")) return "#EAB308";
    return "#E2E8F0";
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
      attendance: "100%",
      status: "Activo",
      joinedDate: new Date().toLocaleDateString("es-MX"),
    };

    setKaratekas([newK, ...karatekas]);
    setFormData({ name: "", belt: "Cinta Blanca (Principiante)", tutor: "", phone: "", email: "" });
    setIsModalOpen(false);
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
              <th>Asistencia</th>
              <th>Estado</th>
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
                  <span style={{ color: "#10b981", fontWeight: 700 }}>{k.attendance}</span>
                </td>
                <td>
                  <span
                    style={{
                      background: k.status === "Examen Pendiente" ? "rgba(234, 179, 8, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: k.status === "Examen Pendiente" ? "#EAB308" : "#10B981",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {k.status}
                  </span>
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
    </div>
  );
}
