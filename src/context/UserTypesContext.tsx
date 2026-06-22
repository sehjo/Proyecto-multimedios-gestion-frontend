import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type UserType = {
  id: number;
  name: string;
};

type UserTypesContextType = {
  userTypes: UserType[];
  addUserType: (name: string) => void;
  updateUserType: (id: number, name: string) => void;
  deleteUserType: (id: number) => void;
};

// TODO: replace with API calls (getUserTypes, createUserType, etc.) once disponibles
const MOCK_USER_TYPES: UserType[] = [
  { id: 1, name: 'Doctor' },
  { id: 2, name: 'Recepcionista' },
  { id: 3, name: 'Admin' },
  { id: 4, name: 'Enfermera' },
];

const UserTypesContext = createContext<UserTypesContextType | undefined>(undefined);

export function UserTypesProvider({ children }: { children: ReactNode }) {
  const [userTypes, setUserTypes] = useState<UserType[]>(MOCK_USER_TYPES);
  const [nextId, setNextId] = useState(MOCK_USER_TYPES.length + 1);

  const addUserType = (name: string) => {
    setUserTypes((prev) => [...prev, { id: nextId, name }]);
    setNextId((n) => n + 1);
  };

  const updateUserType = (id: number, name: string) => {
    setUserTypes((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const deleteUserType = (id: number) => {
    setUserTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const value = useMemo(
    () => ({ userTypes, addUserType, updateUserType, deleteUserType }),
    [userTypes, nextId]
  );

  return <UserTypesContext.Provider value={value}>{children}</UserTypesContext.Provider>;
}

export function useUserTypes() {
  const ctx = useContext(UserTypesContext);
  if (!ctx) throw new Error('useUserTypes must be used within a UserTypesProvider');
  return ctx;
}
