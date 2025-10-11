"use client";
import { AuthUserDto } from "@/app/schemas/model";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createContext, useContext, useState } from "react";

interface AuthContextProps {
  user: AuthUserDto | undefined;
  setUser: (e: AuthUserDto | undefined) => void;
  setToken: (e: string) => void;
  getUser: () => Promise<AuthUserDto | undefined>;
}

const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  setUser: () => {},
  getUser: () => Promise.resolve(undefined),
  setToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUserDto | undefined>(() => {
    if (typeof window !== "undefined") {
      const cookieUser = getCookie("user");
      if (cookieUser) {
        try {
          return JSON.parse(cookieUser as string) as AuthUserDto;
        } catch {
          // ignore malformed cookie
        }
      }
    }
    return undefined;
  });

  function updateUser(next: AuthUserDto | undefined) {
    setUser(next);
    if (next === undefined) {
      deleteCookie("user");
      return;
    }
    setCookie("user", JSON.stringify(next), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }

  function updateToken(token: string) {
    setCookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }

  const getUser = async () => {
    const cookieUser = getCookie("user");
    if (!cookieUser) return undefined;
    try {
      return JSON.parse(cookieUser as string) as AuthUserDto;
    } catch {
      return undefined;
    }
  };

  return (
    <AuthContext.Provider value={{ getUser, user, setUser: updateUser, setToken: updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
