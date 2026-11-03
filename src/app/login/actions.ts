"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const ADMIN_CREDENTIALS: Record<string, { name: string; role: string }> = {
  "superadmin@admin.com": { name: "Super Administrador", role: "Super Admin" },
  "admin@admin.com": { name: "Administrador Dojo", role: "Admin" },
  "admin@sosakai.com": { name: "Administrador General", role: "Super Admin" },
};
const MASTER_PASSWORD = "12345678Cecyte";

export async function login(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  // Verificación de credenciales de Superadministrador y Administrador
  if (email && ADMIN_CREDENTIALS[email] && password === MASTER_PASSWORD) {
    const adminInfo = ADMIN_CREDENTIALS[email];
    const cookieStore = await cookies();
    cookieStore.set("sosakai_admin_session", JSON.stringify({ email, name: adminInfo.name, role: adminInfo.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    // Intentar sincronizar registro en Supabase en segundo plano si está disponible
    try {
      const supabase = await createClient();
      await supabase.auth.signInWithPassword({ email, password }).catch(() => {});
    } catch {
      // Si Supabase está en pausa o inactivo, la sesión continúa vía cookie de admin
    }

    revalidatePath("/", "layout");
    return redirect("/dashboard");
  }

  // Flujo estándar con Supabase Auth
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return redirect("/login?error=Credenciales inválidas. Por favor intenta de nuevo.");
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Error de conexión con el servidor";
    return redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("fullName") as string,
        role: "parent", // Por defecto creamos cuenta de padre en B2C
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect("/register?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard?welcome=true");
}
