import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import styles from "../dashboard.module.css";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  Settings,
  LogOut,
  BrainCircuit,
  CreditCard,
  Video,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("sosakai_admin_session");

  let currentUser: { full_name?: string; email?: string } | null = null;

  if (adminSession?.value === "superadmin_active_token") {
    currentUser = {
      full_name: "Super Administrador",
      email: "superadmin@admin.com",
    };
  } else {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        currentUser = {
          full_name: user.user_metadata?.full_name || user.email || "Director",
          email: user.email,
        };
      }
    } catch {
      currentUser = null;
    }
  }

  if (!currentUser) {
    return redirect("/login");
  }

  // Admin/Director layout based on requested modules
  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image 
            src="/logo-sosa-kai.png" 
            alt="Sosa Kai Logo" 
            width={38} 
            height={38} 
            style={{ objectFit: 'contain' }}
            priority
          />
          <div>
            <span className={styles.logoText}>SOSA</span>
            <span className={styles.logoAccent}> KAI</span>
          </div>
        </div>
        
        <nav className={styles.navMenu}>
          <div className={styles.navSectionTitle}>Principal</div>
          <Link href="/dashboard" className={`${styles.navItem} ${styles.active}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/ia" className={styles.navItem}>
            <BrainCircuit size={20} />
            <span>IA Integrada</span>
          </Link>

          <div className={styles.navSectionTitle} style={{ marginTop: '1rem' }}>Académico</div>
          <Link href="/dashboard/alumnos" className={styles.navItem}>
            <Users size={20} />
            <span>Alumnos y Padres</span>
          </Link>
          <Link href="/dashboard/estructura" className={styles.navItem}>
            <GraduationCap size={20} />
            <span>Estructura Académica</span>
          </Link>
          <Link href="/dashboard/asistencia" className={styles.navItem}>
            <Calendar size={20} />
            <span>Asistencia Inteligente</span>
          </Link>
          
          <div className={styles.navSectionTitle} style={{ marginTop: '1rem' }}>Recursos</div>
          <Link href="/dashboard/archivos" className={styles.navItem}>
            <FileText size={20} />
            <span>Archivo Digital</span>
          </Link>
          <Link href="/dashboard/clases" className={styles.navItem}>
            <Video size={20} />
            <span>Aula Virtual</span>
          </Link>
          <Link href="/dashboard/pagos" className={styles.navItem}>
            <CreditCard size={20} />
            <span>Finanzas</span>
          </Link>

          <div style={{ flex: 1 }}></div>

          <Link href="/dashboard/settings" className={styles.navItem}>
            <Settings size={20} />
            <span>Configuración</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {currentUser.full_name ? currentUser.full_name[0].toUpperCase() : "A"}
            </div>
            <div className={styles.userInfo}>
              <h4>{currentUser.full_name || "Super Admin"}</h4>
              <p>{currentUser.email || "Administrador"}</p>
            </div>
          </div>
          <form action="/auth/signout" method="post" style={{ marginTop: '1rem' }}>
            <button type="submit" className={styles.navItem} style={{ width: '100%', border: 'none', background: 'transparent' }}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
