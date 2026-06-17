"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { TokenResponse, Student } from "@/lib/types";

interface StudentAuthContextType {
  student: Student | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(
  undefined
);

export function StudentAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("studentToken");
    if (savedToken) {
      setToken(savedToken);
      // Fetch student info
      api
        .get<Student>("/students/account")
        .then(setStudent)
        .catch(() => {
          localStorage.removeItem("studentToken");
          setToken(null);
        });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<TokenResponse>("/students/sign-in", {
      email,
      password,
    });
    localStorage.setItem("studentToken", res.accessToken);
    localStorage.setItem("studentRefreshToken", res.refreshToken);
    setToken(res.accessToken);
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("/students/sign-up", { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentRefreshToken");
    setToken(null);
    setStudent(null);
  };

  return (
    <StudentAuthContext.Provider
      value={{ student, token, login, register, logout, isLoading }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error(
      "useStudentAuth must be used within a StudentAuthProvider"
    );
  }
  return context;
}
