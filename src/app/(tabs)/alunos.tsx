import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Aviso, Cabecalho, Pagina, estilosBase } from '../../components/UI';
import { useAlunos, type Aluno } from '../../context/AlunosContext';
import { cores } from '../../theme';

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function iniciais(nome: string) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

export default function ListaAlunos() {
  const router = useRouter();
  const { sucesso } = useLocalSearchParams<{ sucesso?: string }>();
  const { alunos, excluirAluno, carregando, salvando, erroLeitura } = useAlunos();
  const [busca, setBusca] = useState('');
  const [idExclusao, setIdExclusao] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const filtrados = useMemo(() => {
    const texto = normalizar(busca.trim());
    if (!texto) return alunos;
    return alunos.filter(aluno => normalizar(`${aluno.nome} ${aluno.matricula} ${aluno.turma}`).includes(texto));
  }, [alunos, busca]);

  async function confirmarExclusao(id: string) {
    const resultado = await excluirAluno(id);
    if (!resultado.ok) {
      setErro(resultado.mensagem);
      return;
    }
    setIdExclusao(null);
    setMensagem('Aluno excluído com sucesso.');
    setErro('');
  }

  function editar(aluno: Aluno) {
    router.push({ pathname: '/cadastro', params: { id: aluno.id } });
  }

  return (
    <Pagina>
      <Cabecalho etiqueta="CONSULTA DE REGISTROS" titulo="Alunos cadastrados" descricao="Encontre, atualize e organize as informações dos estudantes." />
      {erroLeitura ? <Aviso erro texto={erroLeitura} /> : null}
      {sucesso === 'cadastrado' ? <Aviso texto="Aluno cadastrado com sucesso!" /> : null}
      {sucesso === 'editado' ? <Aviso texto="Informações atualizadas com sucesso!" /> : null}
      {mensagem ? <Aviso texto={mensagem} /> : null}
      {erro ? <Aviso erro texto={erro} /> : null}
      <View style={styles.filtros}>
        <View style={styles.busca}>
          <Ionicons name="search-outline" size={20} color={cores.secundario} />
          <TextInput
            placeholder="Buscar por nome, matrícula ou turma"
            placeholderTextColor="#97A5B4"
            style={styles.buscaCampo}
            value={busca}
            onChangeText={setBusca}
            autoCorrect={false}
            accessibilityLabel="Pesquisar alunos"
          />
          {busca ? <Pressable onPress={() => setBusca('')} accessibilityLabel="Limpar pesquisa"><Ionicons name="close-circle" size={19} color="#9DAAB4" /></Pressable> : null}
        </View>
        <View style={styles.linhaContador}>
          <Text style={styles.contador}>{carregando ? 'Carregando...' : `${filtrados.length} ${filtrados.length === 1 ? 'aluno encontrado' : 'alunos encontrados'}`}</Text>
          <Pressable onPress={() => router.push('/cadastro')} style={styles.novo} accessibilityRole="button">
            <Ionicons name="add" size={18} color={cores.primaria} />
            <Text style={styles.novoTexto}>Novo aluno</Text>
          </Pressable>
        </View>
      </View>
      {carregando ? (
        <View style={[estilosBase.cartao, styles.centro]}><Text style={styles.mensagemVazia}>Carregando alunos...</Text></View>
      ) : filtrados.length === 0 ? (
        <View style={[estilosBase.cartao, styles.centro]}>
          <View style={styles.iconeVazio}><Ionicons name={busca ? 'search-outline' : 'people-outline'} size={33} color={cores.primaria} /></View>
          <Text style={styles.tituloVazio}>{busca ? 'Nenhum resultado' : 'Sua lista está vazia'}</Text>
          <Text style={styles.mensagemVazia}>{busca ? 'Tente pesquisar usando outro nome, turma ou matrícula.' : 'Cadastre o primeiro aluno para visualizar os registros aqui.'}</Text>
          {!busca ? <Pressable onPress={() => router.push('/cadastro')} style={[estilosBase.botao, styles.botaoCadastrar]}><Text style={estilosBase.botaoTexto}>Cadastrar primeiro aluno</Text></Pressable> : null}
        </View>
      ) : filtrados.map(aluno => (
        <View key={aluno.id} style={[estilosBase.cartao, styles.cartaoAluno]}>
          <View style={styles.alunoTopo}>
            <View style={styles.avatar}><Text style={styles.iniciais}>{iniciais(aluno.nome)}</Text></View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.nome} numberOfLines={2}>{aluno.nome}</Text>
              <Text style={styles.matricula}>Matrícula: {aluno.matricula}</Text>
            </View>
            <View style={styles.turma}><Text style={styles.turmaTexto} numberOfLines={1}>{aluno.turma}</Text></View>
          </View>
          <View style={styles.detalhes}>
            {aluno.email ? <View style={styles.detalhe}><Ionicons name="mail-outline" size={15} color={cores.secundario} /><Text style={styles.detalheTexto} numberOfLines={1}>{aluno.email}</Text></View> : null}
            {aluno.telefone ? <View style={styles.detalhe}><Ionicons name="call-outline" size={15} color={cores.secundario} /><Text style={styles.detalheTexto}>{aluno.telefone}</Text></View> : null}
            <View style={styles.detalhe}><Ionicons name="calendar-outline" size={15} color={cores.secundario} /><Text style={styles.detalheTexto}>Cadastrado em {new Date(aluno.criadoEm).toLocaleDateString('pt-BR')}</Text></View>
          </View>
          {idExclusao === aluno.id ? (
            <View style={styles.confirmacao}>
              <Text style={styles.confirmacaoTexto}>Deseja excluir este aluno? A ação não pode ser desfeita.</Text>
              <View style={styles.acoes}>
                <Pressable onPress={() => setIdExclusao(null)} style={styles.acaoNeutra} disabled={salvando}><Text style={styles.textoNeutro}>Cancelar</Text></Pressable>
                <Pressable onPress={() => confirmarExclusao(aluno.id)} style={styles.acaoExcluir} disabled={salvando}><Text style={styles.textoExcluir}>{salvando ? 'Excluindo...' : 'Confirmar exclusão'}</Text></Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.acoes}>
              <Pressable style={styles.acaoNeutra} onPress={() => editar(aluno)} accessibilityRole="button"><Ionicons name="create-outline" size={17} color={cores.primaria} /><Text style={styles.textoEditar}>Editar</Text></Pressable>
              <Pressable style={styles.acaoNeutra} onPress={() => { setIdExclusao(aluno.id); setMensagem(''); setErro(''); }} accessibilityRole="button"><Ionicons name="trash-outline" size={17} color={cores.vermelho} /><Text style={styles.textoExclusao}>Excluir</Text></Pressable>
            </View>
          )}
        </View>
      ))}
    </Pagina>
  );
}

const styles = StyleSheet.create({
  filtros: { gap: 12 },
  busca: { height: 53, backgroundColor: cores.branco, borderWidth: 1, borderColor: cores.borda, borderRadius: 13, paddingHorizontal: 14, alignItems: 'center', flexDirection: 'row', gap: 9 },
  buscaCampo: { color: cores.texto, fontSize: 13, flex: 1, minWidth: 0, height: '100%' },
  linhaContador: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contador: { color: cores.secundario, fontSize: 12, fontWeight: '700' },
  novo: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  novoTexto: { color: cores.primaria, fontSize: 12, fontWeight: '900' },
  cartaoAluno: { gap: 14 },
  alunoTopo: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  avatar: { height: 48, width: 48, backgroundColor: cores.primariaSuave, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  iniciais: { color: cores.primaria, fontSize: 15, fontWeight: '900' },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '900' },
  matricula: { color: cores.secundario, fontSize: 12, marginTop: 3 },
  turma: { backgroundColor: cores.primariaSuave, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, maxWidth: 115 },
  turmaTexto: { color: cores.primariaEscura, fontSize: 10, fontWeight: '800' },
  detalhes: { gap: 8, paddingVertical: 11, borderTopWidth: 1, borderBottomWidth: 1, borderColor: cores.borda },
  detalhe: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  detalheTexto: { color: cores.secundario, fontSize: 12, flexShrink: 1 },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: 18 },
  acaoNeutra: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingVertical: 6 },
  textoNeutro: { color: cores.secundario, fontWeight: '800', fontSize: 12 },
  textoEditar: { color: cores.primaria, fontWeight: '800', fontSize: 12 },
  textoExclusao: { color: cores.vermelho, fontWeight: '800', fontSize: 12 },
  confirmacao: { gap: 10 },
  confirmacaoTexto: { color: cores.vermelho, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  acaoExcluir: { backgroundColor: cores.vermelho, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 9 },
  textoExcluir: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  centro: { minHeight: 235, alignItems: 'center', justifyContent: 'center', gap: 11 },
  iconeVazio: { height: 67, width: 67, borderRadius: 22, backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center' },
  tituloVazio: { color: cores.texto, fontSize: 19, fontWeight: '900' },
  mensagemVazia: { color: cores.secundario, textAlign: 'center', fontSize: 13, lineHeight: 19 },
  botaoCadastrar: { marginTop: 10, paddingHorizontal: 22 },
});
