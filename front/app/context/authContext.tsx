"use client";
import { UserDto } from "@/app/schemas/model";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createContext, useContext, useState } from "react";

interface AuthContextProps {
  user: UserDto | undefined;
  setUser: (e: UserDto | undefined) => void;
  setToken: (e: string) => void;
  getUser: () => Promise<UserDto | undefined>;
}

const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  setUser: () => {},
  getUser: () => Promise.resolve(undefined),
  setToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | undefined>(() => {
    if (typeof window !== "undefined") {
      const user = getCookie("user");
      if (user) {
        return JSON.parse(user) as UserDto;
      }
    }
    return undefined;
  });

  function updateUser(user: UserDto | undefined) {
    setUser(user);
    if (user === undefined) {
      deleteCookie("user");
      return;
    }
    setCookie("user", JSON.stringify(user), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }

  function updateToken(token: string) {
    setCookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }

  const getUser = async () => {
    const user = getCookie("user");
    if (!user) return undefined;

    return JSON.parse(user) as UserDto;
  };

  return (
    <AuthContext.Provider
      value={{ getUser, user, setUser: updateUser, setToken: updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
