import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { User } from "../types";

interface GetUserProps {
  username: string;
  onError: (message: string) => void;
}

interface LoginProps {
  onError: (message: string) => void;
}

interface AuthContextData {
  user: User;
  getUser: ({ username, onError }: GetUserProps) => Promise<void>;
  login: ({ onError }: LoginProps) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);

  const router = useRouter();

  function login({ onError }: LoginProps) {
    if (user) {
      localStorage.setItem("@alurawitcher:user", JSON.stringify(user));
      router.push("/chat");
    } else {
      onError("Usuário inválido");
    }
  }

  function logout() {
    localStorage.removeItem("@alurawitcher:user");
    setUser(null);
    router.push("/");
  }

  async function getUser({ username, onError }: GetUserProps) {
    if (username === "") {
      setUser(null);
      return;
    }

    try {
      const { data } = await api.get(username);
      setUser(data);

    } catch (error) {
      onError(error.message);
      setUser(null);
    }
  }

  useEffect(() => {
    if (router.asPath === "/") {
      localStorage.removeItem("@alurawitcher:user");
      setUser(null);
    }

    const storageUser = localStorage.getItem("@alurawitcher:user");
    setUser(JSON.parse(storageUser));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, getUser, login, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}