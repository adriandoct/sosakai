"use client";

import React, { createContext, useContext } from "react";

interface UserContextType {
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const UserContext = createContext<UserContextType>({
  email: "",
  name: "",
  role: "",
  isAdmin: false,
  isSuperAdmin: false,
});

export function UserProvider({
  user,
  children,
}: {
  user: { email?: string; full_name?: string; role?: string } | null;
  children: React.ReactNode;
}) {
  const email = (user?.email || "").toLowerCase();
  const rawRole = user?.role || "";

  // Senseis, Alumnos, Tutores y Sensei Adrian Silva NUNCA deben activar Super Admin ni ser Admin
  const isSenseiOrStudent =
    email.includes("adriandoct") ||
    email.includes("adrian.silva") ||
    rawRole.toLowerCase().includes("sensei") ||
    rawRole.toLowerCase().includes("instructor") ||
    rawRole.toLowerCase().includes("alumno") ||
    rawRole.toLowerCase().includes("student") ||
    rawRole.toLowerCase().includes("karateka") ||
    rawRole.toLowerCase().includes("tutor") ||
    rawRole.toLowerCase().includes("padre");

  // Únicamente las cuentas maestras de administración son Super Admin / Admin
  const isMasterSuperAdmin =
    !isSenseiOrStudent && email === "superadmin@admin.com";

  const isMasterAdmin =
    !isSenseiOrStudent &&
    (email === "admin@admin.com" || email === "admin@sosakai.com");

  const isSuperAdmin =
    !isSenseiOrStudent &&
    (isMasterSuperAdmin || rawRole.toLowerCase().includes("super"));

  const isAdmin =
    !isSenseiOrStudent &&
    (isSuperAdmin ||
      isMasterAdmin ||
      rawRole.toLowerCase() === "admin" ||
      rawRole.toLowerCase() === "administrador" ||
      rawRole.toLowerCase().includes("admin"));

  // Resolver rol descriptivo
  let effectiveRole = rawRole;
  if (isSenseiOrStudent) {
    if (
      email.includes("adriandoct") ||
      email.includes("adrian.silva") ||
      rawRole.toLowerCase().includes("sensei") ||
      rawRole.toLowerCase().includes("instructor")
    ) {
      effectiveRole = "Sensei";
    } else if (
      rawRole.toLowerCase().includes("alumno") ||
      rawRole.toLowerCase().includes("student") ||
      rawRole.toLowerCase().includes("karateka")
    ) {
      effectiveRole = "Alumno";
    } else if (
      rawRole.toLowerCase().includes("tutor") ||
      rawRole.toLowerCase().includes("padre")
    ) {
      effectiveRole = "Tutor";
    }
  } else if (!effectiveRole) {
    effectiveRole = isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Sensei";
  }

  const effectiveName =
    email.includes("adriandoct") || email.includes("adrian.silva")
      ? "Sensei Adrian Silva"
      : user?.full_name || (isAdmin ? "Administrador" : "Usuario");

  return (
    <UserContext.Provider
      value={{
        email,
        name: effectiveName,
        role: effectiveRole,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

