"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const VALID_PASSWORDS = [
  "12345678cecyte",
  "12345678",
  "admin",
  "admin123",
  "cecyte123",
];

const ADMIN_ACCOUNTS: Record<string, { name: string; role: string }> = {
  "superadmin@admin.com": { name: "Super Administrador", role: "Super Admin" },
  "admin@admin.com": { name: "Administrador Dojo", role: "Admin" },
  "admin@sosakai.com": { name: "Administrador General", role: "Super Admin" },
  "adrian.silva@cecytebc.edu.mx": { name: "Sensei Adrian Silva", role: "Super Admin" },
};

function isRedirectError(err: unknown): boolean {
  if (typeof err === "object" && err !== null && "digest" in err) {
    return String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT");
  }
  return false;
}

export async function login(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
  const rawPassword = (formData.get("password") as string) || "";
  const password = rawPassword.trim();
  const passwordLower = password.toLowerCase();

  // 1. Verificación directa para Super Admin y Admin (sin depender de Supabase)
  const isAuthorizedEmail =
    ADMIN_ACCOUNTS[email] !== undefined ||
    email.startsWith("admin") ||
    email.startsWith("superadmin");

  const isPasswordMatch =
    password === "12345678Cecyte" ||
    passwordLower === "12345678cecyte" ||
    VALID_PASSWORDS.includes(passwordLower) ||
    VALID_PASSWORDS.includes(password);

  if (isAuthorizedEmail && isPasswordMatch) {
    const account = ADMIN_ACCOUNTS[email] || {
      name: email.includes("super") ? "Super Administrador" : "Administrador Dojo",
      role: email.includes("super") ? "Super Admin" : "Admin",
    };

    const cookieStore = await cookies();
    cookieStore.set(
      "sosakai_admin_session",
      JSON.stringify({
        email: email || "admin@admin.com",
        name: account.name,
        role: account.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: "/",
      }
    );

    // Intentar sincronizar sesión en Supabase en background si está activo
    try {
      const supabase = await createClient();
      await supabase.auth.signInWithPassword({ email, password }).catch(() => {});
    } catch {
      // Ignorar fallo si Supabase no está disponible
    }

    revalidatePath("/", "layout");
    return redirect("/dashboard");
  }

  // 2. Si no coincide con las credenciales maestras, intentar Supabase
  let loginFailed = false;
  let errorMsg = "Credenciales incorrectas. Verifica tu correo y contraseña.";

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loginFailed = true;
      errorMsg = error.message;
    }
  } catch (err: unknown) {
    if (isRedirectError(err)) {
      throw err;
    }
    loginFailed = true;
    errorMsg = "Error al conectar con el servicio. Por favor intenta de nuevo.";
  }

  if (loginFailed) {
    return redirect(`/login?error=${encodeURIComponent(errorMsg)}`);
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
        role: "parent",
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
