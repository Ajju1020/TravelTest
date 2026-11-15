import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "usr_qa_lead",
    name: "Alex Mercer",
    email: "alex.mercer@traveltest.com",
    role: "Senior QA Automation Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = (newUser) => {
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser({
      id: "usr_guest",
      name: "Guest Explorer",
      email: "guest@traveltest.com",
      role: "Observer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthModalOpen, setIsAuthModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
