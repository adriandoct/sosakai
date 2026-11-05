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
  const role = user?.role || "";
  const email = (user?.email || "").toLowerCase();

  // Cuentas maestras autorizadas expresamente como Super Admin
  const isMasterAdminEmail =
    email === "superadmin@admin.com" ||
    email === "adriandoct@gmail.com" ||
    email === "adrian.silva@cecytebc.edu.mx" ||
    email.includes("adriandoct");

  const isMasterAdmin =
    email === "admin@admin.com" || email === "admin@sosakai.com";

  // Los senseis, alumnos, karatekas y tutores NUNCA son administradores
  const isRestrictedRole =
    role.toLowerCase().includes("sensei") ||
    role.toLowerCase().includes("instructor") ||
    role.toLowerCase().includes("alumno") ||
    role.toLowerCase().includes("student") ||
    role.toLowerCase().includes("karateka") ||
    role.toLowerCase().includes("tutor") ||
    role.toLowerCase().includes("padre");

  const isSuperAdmin =
    isMasterAdminEmail ||
    (!isRestrictedRole && role.toLowerCase().includes("super"));

  const isAdmin =
    isSuperAdmin ||
    isMasterAdmin ||
    (!isRestrictedRole &&
      (role.toLowerCase() === "admin" ||
        role.toLowerCase() === "administrador" ||
        role.toLowerCase().includes("admin")));

  return (
    <UserContext.Provider
      value={{
        email,
        name: user?.full_name || "Usuario",
        role: role || (isAdmin ? "Admin" : "Alumno"),
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

