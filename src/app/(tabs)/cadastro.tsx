import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { Aviso, Cabecalho, Pagina, estilosBase } from '../../components/UI';
import { useAlunos, type DadosAluno } from '../../context/AlunosContext';
import { cores } from '../../theme';

const FORMULARIO_VAZIO: DadosAluno = { nome: '', matricula: '', turma: '', email: '', telefone: '' };

type CampoProps = {
  titulo: string;
  placeholder: string;
  valor: string;
  alterar: (valor: string) => void;
  obrigatorio?: boolean;
  teclado?: KeyboardTypeOptions;
  capitalizacao?: 'none' | 'sentences' | 'words' | 'characters';
};

function Campo({ titulo, placeholder, valor, alterar, obrigatorio, teclado, capitalizacao }: CampoProps) {
  return (
    <View>
      <Text style={estilosBase.label}>{titulo} {obrigatorio ? <Text style={styles.obrigatorio}>*</Text> : null}</Text>
      <TextInput
        style={estilosBase.input}
        placeholder={placeholder}
        placeholderTextColor="#9BAAB8"
        value={valor}
        onChangeText={alterar}
        keyboardType={teclado ?? 'default'}
        autoCapitalize={capitalizacao ?? 'words'}
        autoCorrect={false}
        accessibilityLabel={titulo}
      />
    </View>
  );
}

export default function Cadastro() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idEdicao = typeof id === 'string' ? id : undefined;
  const { alunos, salvarAluno, salvando, carregando, erroLeitura } = useAlunos();
  const [formulario, setFormulario] = useState<DadosAluno>(FORMULARIO_VAZIO);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const alunoEmEdicao = idEdicao ? alunos.find(a => a.id === idEdicao) : undefined;

  useEffect(() => {
    setFormulario(alunoEmEdicao ? {
      nome: alunoEmEdicao.nome,
      matricula: alunoEmEdicao.matricula,
      turma: alunoEmEdicao.turma,
      email: alunoEmEdicao.email,
      telefone: alunoEmEdicao.telefone,
    } : FORMULARIO_VAZIO);
    setErro('');
    setMensagem('');
  }, [idEdicao, alunoEmEdicao?.id]);

  function alterarCampo(campo: keyof DadosAluno, valor: string) {
    setFormulario(atual => ({ ...atual, [campo]: valor }));
    setErro('');
    setMensagem('');
  }

  async function salvar() {
    setErro('');
    setMensagem('');
    if (carregando) return;
    const resultado = await salvarAluno(formulario, idEdicao);
    if (!resultado.ok) {
      setErro(resultado.mensagem);
      return;
    }
    setFormulario(FORMULARIO_VAZIO);
    router.replace({ pathname: '/alunos', params: { sucesso: idEdicao ? 'editado' : 'cadastrado' } });
  }

  return (
    <Pagina>
      <Cabecalho
        etiqueta="GESTÃO DE ALUNOS"
        titulo={idEdicao ? 'Editar aluno' : 'Cadastrar aluno'}
        descricao={idEdicao ? 'Atualize as informações deste estudante.' : 'Preencha os dados abaixo para adicionar um novo estudante.'}
      />
      {erroLeitura ? <Aviso erro texto={erroLeitura} /> : null}
      {mensagem ? <Aviso texto={mensagem} /> : null}
      {erro ? <Aviso texto={erro} erro /> : null}
      {idEdicao && !alunoEmEdicao && !carregando ? <Aviso texto="Aluno não encontrado. Volte para a lista e tente novamente." erro /> : null}
      <View style={[estilosBase.cartao, { gap: 4 }]}>
        <View style={styles.tituloCard}>
          <View style={styles.tituloIcone}><Ionicons name="person-outline" size={21} color={cores.primaria} /></View>
          <View>
            <Text style={styles.cardTitulo}>Dados do estudante</Text>
            <Text style={styles.cardSubtitulo}>Informações para identificação e contato</Text>
          </View>
        </View>
        <Campo titulo="Nome completo" placeholder="Ex.: Maria Oliveira" valor={formulario.nome} alterar={v => alterarCampo('nome', v)} obrigatorio />
        <Campo titulo="Matrícula" placeholder="Ex.: 2026001" valor={formulario.matricula} alterar={v => alterarCampo('matricula', v)} obrigatorio capitalizacao="characters" />
        <Campo titulo="Turma" placeholder="Ex.: 2º Ano A" valor={formulario.turma} alterar={v => alterarCampo('turma', v)} obrigatorio />
        <View style={styles.divisor} />
        <Text style={styles.secao}>CONTATO (OPCIONAL)</Text>
        <Campo titulo="E-mail" placeholder="aluno@email.com" valor={formulario.email} alterar={v => alterarCampo('email', v)} teclado="email-address" capitalizacao="none" />
        <Campo titulo="Telefone" placeholder="(85) 99999-9999" valor={formulario.telefone} alterar={v => alterarCampo('telefone', v)} teclado="phone-pad" capitalizacao="none" />
        <Text style={styles.dica}>* Campos obrigatórios. A matrícula não pode se repetir.</Text>
        <Pressable
          onPress={salvar}
          disabled={salvando || carregando || !!erroLeitura || (!!idEdicao && !alunoEmEdicao)}
          style={({ pressed }) => [estilosBase.botao, styles.botaoSalvar, (pressed || salvando || carregando || !!erroLeitura) && { opacity: 0.6 }]}
          accessibilityRole="button"
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={estilosBase.botaoTexto}>{salvando ? 'Salvando...' : idEdicao ? 'Salvar alterações' : 'Cadastrar aluno'}</Text>
        </Pressable>
        {idEdicao ? (
          <Pressable onPress={() => router.replace('/alunos')} style={styles.cancelar} accessibilityRole="button">
            <Text style={styles.cancelarTexto}>Cancelar edição</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => { setFormulario(FORMULARIO_VAZIO); setErro(''); setMensagem('Campos limpos.'); }} style={styles.cancelar} accessibilityRole="button">
            <Text style={styles.cancelarTexto}>Limpar formulário</Text>
          </Pressable>
        )}
      </View>
    </Pagina>
  );
}

const styles = StyleSheet.create({
  obrigatorio: { color: cores.vermelho },
  tituloCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 19 },
  tituloIcone: { height: 44, width: 44, borderRadius: 13, backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center' },
  cardTitulo: { color: cores.texto, fontSize: 17, fontWeight: '900' },
  cardSubtitulo: { color: cores.secundario, fontSize: 11, marginTop: 4 },
  divisor: { height: 1, backgroundColor: cores.borda, marginVertical: 7 },
  secao: { fontSize: 11, color: cores.secundario, letterSpacing: 1.2, fontWeight: '800', marginTop: 8, marginBottom: 13 },
  dica: { fontSize: 12, color: cores.secundario, marginBottom: 11 },
  botaoSalvar: { marginTop: 3 },
  cancelar: { height: 43, alignItems: 'center', justifyContent: 'center' },
  cancelarTexto: { color: cores.secundario, fontWeight: '800', fontSize: 13 },
});
