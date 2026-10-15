import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';

export type DadosAluno = {
  nome: string;
  matricula: string;
  turma: string;
  email: string;
  telefone: string;
};

export type Aluno = DadosAluno & {
  id: string;
  criadoEm: string;
};

type Resultado = { ok: true } | { ok: false; mensagem: string };

type AlunosValue = {
  alunos: Aluno[];
  carregando: boolean;
  erroLeitura: string;
  salvando: boolean;
  salvarAluno: (dados: DadosAluno, id?: string) => Promise<Resultado>;
  excluirAluno: (id: string) => Promise<Resultado>;
};

const CHAVE = '@edugestao/alunos/v1';
const AlunosContext = createContext<AlunosValue | null>(null);

export function AlunosProvider({ children }: PropsWithChildren) {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroLeitura, setErroLeitura] = useState('');
  const operacaoAtiva = useRef(false);
  const listaAtual = useRef<Aluno[]>([]);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE);
        if (!ativo) return;
        const lista = salvo ? JSON.parse(salvo) : [];
        if (!Array.isArray(lista)) throw new Error('Formato de dados invalido');
        listaAtual.current = lista as Aluno[];
        setAlunos(lista as Aluno[]);
      } catch {
        if (ativo) setErroLeitura('Não foi possível ler os cadastros salvos neste dispositivo.');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => { ativo = false; };
  }, []);

  async function persistir(novaLista: Aluno[]): Promise<Resultado> {
    if (operacaoAtiva.current) return { ok: false, mensagem: 'Aguarde a operação anterior terminar.' };
    operacaoAtiva.current = true;
    setSalvando(true);
    try {
      await AsyncStorage.setItem(CHAVE, JSON.stringify(novaLista));
      listaAtual.current = novaLista;
      setAlunos(novaLista);
      setErroLeitura('');
      return { ok: true };
    } catch {
      return { ok: false, mensagem: 'Não foi possível salvar neste dispositivo. Tente novamente.' };
    } finally {
      operacaoAtiva.current = false;
      setSalvando(false);
    }
  }

  async function salvarAluno(dados: DadosAluno, id?: string): Promise<Resultado> {
    if (carregando || erroLeitura) return { ok: false, mensagem: 'O armazenamento não está disponível. Reabra o aplicativo.' };
    const registro = {
      nome: dados.nome.trim().replace(/\s+/g, ' '),
      matricula: dados.matricula.trim(),
      turma: dados.turma.trim(),
      email: dados.email.trim().toLowerCase(),
      telefone: dados.telefone.trim(),
    };
    if (!registro.nome || !registro.matricula || !registro.turma) {
      return { ok: false, mensagem: 'Preencha nome, matrícula e turma.' };
    }
    if (registro.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registro.email)) {
      return { ok: false, mensagem: 'Informe um e-mail válido.' };
    }
    if (listaAtual.current.some(aluno => aluno.matricula.toLowerCase() === registro.matricula.toLowerCase() && aluno.id !== id)) {
      return { ok: false, mensagem: 'Já existe um aluno com essa matrícula.' };
    }
    if (id) {
      if (!listaAtual.current.some(aluno => aluno.id === id)) {
        return { ok: false, mensagem: 'Este aluno não foi encontrado.' };
      }
      return persistir(listaAtual.current.map(aluno => aluno.id === id ? { ...aluno, ...registro } : aluno));
    }
    const novo: Aluno = {
      ...registro,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      criadoEm: new Date().toISOString(),
    };
    return persistir([novo, ...listaAtual.current]);
  }

  async function excluirAluno(id: string): Promise<Resultado> {
    if (carregando || erroLeitura) return { ok: false, mensagem: 'O armazenamento não está disponível.' };
    return persistir(listaAtual.current.filter(aluno => aluno.id !== id));
  }

  return (
    <AlunosContext.Provider value={{ alunos, carregando, salvando, erroLeitura, salvarAluno, excluirAluno }}>
      {children}
    </AlunosContext.Provider>
  );
}

export function useAlunos() {
  const contexto = useContext(AlunosContext);
  if (!contexto) throw new Error('AlunosProvider nao encontrado');
  return contexto;
}
