import { createContext, useContext, useState, type PropsWithChildren } from 'react';

type AuthValue = {
  usuario: string | null;
  entrar: (login: string, senha: string) => boolean;
  sair: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [usuario, setUsuario] = useState<string | null>(null);

  function entrar(login: string, senha: string) {
    if (login.trim().toLowerCase() !== 'aluno' || senha !== '123456') return false;
    setUsuario('Administrador');
    return true;
  }

  function sair() {
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('AuthProvider nao encontrado');
  return contexto;
}
