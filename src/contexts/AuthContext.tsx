import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { User } from "../types";

interface GetUserProps {
  username: string;
  onError: (message: string) => void;
}

interface AuthContextData {
  user: User;
  getUser: ({ username }: GetUserProps) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);

  const router = useRouter();

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

  function logout() {
    setUser(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{
      user, getUser, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}