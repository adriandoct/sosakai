"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  QrCode,
  Award,
  BookOpen,
  Video,
  CheckSquare,
} from "lucide-react";
import styles from "../dashboard.module.css";

export default function SidebarNav() {
  const pathname = usePathname();

  const isPrincipalActive = pathname === "/dashboard";

  const dojoMenuItems = [
    {
      title: "Karatekas y Tutores",
      href: "/dashboard/karatekas",
      icon: <Users size={20} />,
    },
    {
      title: "Escáner QR",
      href: "/dashboard/escaner-qr",
      icon: <QrCode size={20} />,
    },
    {
      title: "Horarios y Programa",
      href: "/dashboard/horarios",
      icon: <Award size={20} />,
    },
    {
      title: "Manuales PDF",
      href: "/dashboard/manuales",
      icon: <BookOpen size={20} />,
    },
    {
      title: "Videos y Categorías",
      href: "/dashboard/videos",
      icon: <Video size={20} />,
    },
    {
      title: "Revisar Exámenes",
      href: "/dashboard/examenes",
      icon: <CheckSquare size={20} />,
    },
  ];

  return (
    <nav className={styles.navMenu}>
      <div className={styles.navSectionTitle}>PRINCIPAL</div>
      <Link
        href="/dashboard"
        className={`${styles.navItem} ${isPrincipalActive ? styles.active : ""}`}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </Link>

      <div className={styles.navSectionTitle} style={{ marginTop: "1.75rem" }}>
        GESTIÓN DOJO
      </div>
      {dojoMenuItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

