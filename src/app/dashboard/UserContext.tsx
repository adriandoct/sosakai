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

  const isSuperAdmin =
    role.toLowerCase().includes("super") || email === "superadmin@admin.com";

  const isAdmin =
    isSuperAdmin ||
    role.toLowerCase().includes("admin") ||
    email === "admin@admin.com" ||
    email === "admin@sosakai.com";

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

