import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
} from "react";

interface IUser {
  id: string;
  name: string;
  email: string;
  token: string;
  admin: boolean;
}

interface IUserContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const isLogin = localStorage.getItem("user");
    if (isLogin) {
      setUser(JSON.parse(isLogin));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
