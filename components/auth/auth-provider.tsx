"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { authService } from "@/lib/services/auth/AuthService";
import type {
  AuthLoginResult,
  AuthSession,
  ManagementAuthSession,
  LoginRequest,
  RegisterPatientRequest,
} from "@/types/auth";
import type { PatientProfile } from "@/types/models";

type AuthContextValue = {
  session: AuthSession | null;
  managementSession: ManagementAuthSession | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthLoginResult>;
  register: (request: RegisterPatientRequest) => Promise<void>;
  logout: () => Promise<void>;
  syncPatientProfile: (
    profile: PatientProfile,
    expectedSession: AuthSession,
  ) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [managementSession, setManagementSession] =
    useState<ManagementAuthSession | null>(null);
  const sessionRef = useRef<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const result = authService.getStoredLoginResult();
    const patientSession = result?.type === "patient" ? result.session : null;
    const storedManagementSession =
      result?.type === "management" ? result.session : null;
    sessionRef.current = patientSession;
    setSession(patientSession);
    setManagementSession(storedManagementSession);
    setIsLoading(false);
  }, []);

  async function login(credentials: LoginRequest) {
    const result = await authService.login(credentials);
    const nextSession = result.type === "patient" ? result.session : null;
    sessionRef.current = nextSession;
    setSession(nextSession);
    setManagementSession(
      result.type === "management" ? result.session : null,
    );
    return result;
  }

  async function register(request: RegisterPatientRequest) {
    await authService.register(request);
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      sessionRef.current = null;
      setSession(null);
      setManagementSession(null);
    }
  }

  function syncPatientProfile(
    profile: PatientProfile,
    expectedSession: AuthSession,
  ) {
    const currentSession = sessionRef.current;
    if (
      !currentSession ||
      currentSession !== expectedSession ||
      currentSession.account.uuid !== profile.accountUuid
    ) {
      return;
    }
    const nextSession = { ...currentSession, patientProfile: profile };
    authService.persistPatientProfile(profile);
    sessionRef.current = nextSession;
    setSession(nextSession);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        managementSession,
        isLoading,
        login,
        register,
        logout,
        syncPatientProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider.");
  }

  return context;
}
