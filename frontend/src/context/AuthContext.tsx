import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, role?: Role) => void;
  logout: () => void;
  switchRole: (newRole: Role) => void;
}

const DEFAULT_USERS: Record<Role, User> = {
  ROLE_CUSTOMER: {
    id: 3,
    email: 'customer@edrisperfume.et',
    firstName: 'Selamawit',
    lastName: 'Tadesse',
    phoneNumber: '+251933445566',
    role: 'ROLE_CUSTOMER',
    status: 'ACTIVE',
  },
  ROLE_MERCHANT: {
    id: 2,
    email: 'merchant@edrisperfume.et',
    firstName: 'Abebe',
    lastName: 'Kebede',
    phoneNumber: '+251922334455',
    role: 'ROLE_MERCHANT',
    status: 'ACTIVE',
  },
  ROLE_ADMIN: {
    id: 1,
    email: 'admin@edrisperfume.et',
    firstName: 'Edris',
    lastName: 'Administrator',
    phoneNumber: '+251911223344',
    role: 'ROLE_ADMIN',
    status: 'ACTIVE',
  },
  ROLE_DELIVERY_PARTNER: {
    id: 4,
    email: 'delivery@edrisperfume.et',
    firstName: 'Dawit',
    lastName: 'Haile',
    phoneNumber: '+251944556677',
    role: 'ROLE_DELIVERY_PARTNER',
    status: 'ACTIVE',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('edris_current_user');
      return saved ? JSON.parse(saved) : DEFAULT_USERS.ROLE_CUSTOMER;
    } catch {
      return DEFAULT_USERS.ROLE_CUSTOMER;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('edris_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edris_current_user');
    }
  }, [user]);

  const login = (email: string, designatedRole?: Role) => {
    let chosenRole: Role = designatedRole || 'ROLE_CUSTOMER';
    if (email.includes('admin')) chosenRole = 'ROLE_ADMIN';
    else if (email.includes('merchant')) chosenRole = 'ROLE_MERCHANT';
    else if (email.includes('delivery')) chosenRole = 'ROLE_DELIVERY_PARTNER';

    const newUser: User = {
      ...DEFAULT_USERS[chosenRole],
      email,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: Role) => {
    setUser(DEFAULT_USERS[newRole]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'ROLE_CUSTOMER',
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
