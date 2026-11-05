import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import styles from "../dashboard.module.css";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { cookies } from "next/headers";
import SidebarNav from "./SidebarNav";
import { UserProvider } from "./UserContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("sosakai_admin_session");

  let currentUser: { full_name?: string; email?: string; role?: string } | null = null;

  if (adminSession?.value) {
    try {
      const parsed = JSON.parse(adminSession.value);
      const emailLower = (parsed.email || "").toLowerCase();
      const isAdrianSensei =
        emailLower.includes("adriandoct") ||
        emailLower.includes("adrian.silva");

      currentUser = {
        full_name: isAdrianSensei
          ? "Sensei Adrian Silva"
          : parsed.name || "Administrador",
        email: parsed.email || "admin@admin.com",
        role: isAdrianSensei ? "Sensei" : parsed.role || "Admin",
      };
    } catch {
      currentUser = {
        full_name: "Super Administrador",
        email: "superadmin@admin.com",
        role: "Super Admin",
      };
    }
  } else {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const userEmail = (user.email || "").toLowerCase();
        const isAdrianSensei =
          userEmail.includes("adriandoct") ||
          userEmail.includes("adrian.silva");

        currentUser = {
          full_name: isAdrianSensei
            ? "Sensei Adrian Silva"
            : user.user_metadata?.full_name || user.email || "Director",
          email: user.email,
          role: isAdrianSensei
            ? "Sensei"
            : user.user_metadata?.role || "Admin",
        };
      }
    } catch {
      currentUser = null;
    }
  }

  if (!currentUser) {
    return redirect("/login");
  }

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
        
        <SidebarNav />

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {currentUser.full_name ? currentUser.full_name[0].toUpperCase() : "A"}
            </div>
            <div className={styles.userInfo}>
              <h4>{currentUser.full_name || "Super Admin"}</h4>
              <p>{currentUser.role ? `${currentUser.role} • ${currentUser.email}` : currentUser.email}</p>
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
        <UserProvider user={currentUser}>
          {children}
        </UserProvider>
      </main>
    </div>
  );
}
