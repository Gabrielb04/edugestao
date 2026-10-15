import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Aviso, Cabecalho, Pagina, estilosBase } from '../../components/UI';
import { useAlunos } from '../../context/AlunosContext';
import { useAuth } from '../../context/AuthContext';
import { cores } from '../../theme';

function primeiroNome(nome: string) { return nome.split(' ')[0]; }

export default function Dashboard() {
  const router = useRouter();
  const { usuario, sair } = useAuth();
  const { alunos, carregando, erroLeitura } = useAlunos();
  const turmas = new Set(alunos.map(a => a.turma.trim().toLowerCase())).size;
  const hoje = new Date().toLocaleDateString('pt-BR');
  const novosHoje = alunos.filter(a => new Date(a.criadoEm).toLocaleDateString('pt-BR') === hoje).length;

  return (
    <Pagina>
      <View style={styles.barra}>
        <View style={styles.avatar}><Ionicons name="school-outline" size={24} color={cores.primaria} /></View>
        <View style={styles.usuarioTexto}>
          <Text style={styles.bomDia}>Olá, {usuario ?? 'Administrador'}! 👋</Text>
          <Text style={styles.bomDiaSub}>Painel de gestão escolar</Text>
        </View>
        <Pressable onPress={sair} style={styles.sair} accessibilityLabel="Sair da conta" accessibilityRole="button">
          <Ionicons name="log-out-outline" size={22} color={cores.vermelho} />
        </Pressable>
      </View>

      <Cabecalho etiqueta="VISÃO GERAL" titulo="Início" descricao="Acompanhe os cadastros e mantenha tudo em ordem." />
      {erroLeitura ? <Aviso erro texto={erroLeitura} /> : null}

      <View style={styles.metricas}>
        <View style={styles.metrica}>
          <View style={[styles.icone, { backgroundColor: cores.primariaSuave }]}>
            <Ionicons name="people-outline" size={22} color={cores.primaria} />
          </View>
          <Text style={styles.numero}>{carregando ? '—' : alunos.length}</Text>
          <Text style={styles.metricaLabel}>Alunos</Text>
        </View>
        <View style={styles.metrica}>
          <View style={[styles.icone, { backgroundColor: cores.azulSuave }]}>
            <Ionicons name="library-outline" size={22} color="#5075D6" />
          </View>
          <Text style={styles.numero}>{carregando ? '—' : turmas}</Text>
          <Text style={styles.metricaLabel}>Turmas</Text>
        </View>
        <View style={styles.metrica}>
          <View style={[styles.icone, { backgroundColor: cores.amareloSuave }]}>
            <Ionicons name="calendar-outline" size={22} color="#B77914" />
          </View>
          <Text style={styles.numero}>{carregando ? '—' : novosHoje}</Text>
          <Text style={styles.metricaLabel}>Hoje</Text>
        </View>
      </View>

      <View style={styles.destaque}>
        <View style={styles.destaqueIcone}><Ionicons name="person-add-outline" color="#FFFFFF" size={26} /></View>
        <Text style={styles.destaqueTitulo}>Novo aluno?</Text>
        <Text style={styles.destaqueDescricao}>Adicione os dados de um estudante em poucos passos.</Text>
        <Pressable style={styles.botaoClaro} onPress={() => router.push('/cadastro')} accessibilityRole="button">
          <Text style={styles.botaoClaroTexto}>Cadastrar aluno</Text>
          <Ionicons name="arrow-forward" size={17} color={cores.primariaEscura} />
        </Pressable>
      </View>

      <View style={[estilosBase.cartao, { gap: 14 }]}>
        <View style={styles.linhaTitulo}>
          <Text style={styles.secaoTitulo}>Últimos cadastros</Text>
          <Pressable onPress={() => router.push('/alunos')} accessibilityRole="button"><Text style={styles.verTodos}>Ver todos →</Text></Pressable>
        </View>
        {carregando ? <Text style={styles.vazio}>Carregando informações...</Text> : alunos.length === 0 ? (
          <View style={styles.vazioBloco}>
            <Ionicons name="folder-open-outline" size={30} color="#9BA9B7" />
            <Text style={styles.vazio}>Nenhum aluno cadastrado ainda.</Text>
          </View>
        ) : alunos.slice(0, 3).map(aluno => (
          <View style={styles.aluno} key={aluno.id}>
            <View style={styles.alunoAvatar}><Text style={styles.iniciais}>{primeiroNome(aluno.nome).charAt(0).toUpperCase()}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alunoNome} numberOfLines={1}>{aluno.nome}</Text>
              <Text style={styles.alunoTurma}>{aluno.turma} · Matrícula {aluno.matricula}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={21} color={cores.primaria} />
          </View>
        ))}
      </View>
    </Pagina>
  );
}

const styles = StyleSheet.create({
  barra: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  avatar: { width: 47, height: 47, backgroundColor: cores.primariaSuave, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  usuarioTexto: { flex: 1, gap: 3 },
  bomDia: { fontSize: 16, fontWeight: '800', color: cores.texto },
  bomDiaSub: { fontSize: 12, color: cores.secundario },
  sair: { width: 42, height: 42, borderRadius: 13, backgroundColor: cores.vermelhoSuave, justifyContent: 'center', alignItems: 'center' },
  metricas: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metrica: { flexGrow: 1, flexBasis: 100, minWidth: 88, backgroundColor: cores.branco, borderWidth: 1, borderColor: cores.borda, borderRadius: 19, padding: 15, gap: 9 },
  icone: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  numero: { fontSize: 27, fontWeight: '900', color: cores.texto },
  metricaLabel: { color: cores.secundario, fontSize: 12, fontWeight: '700' },
  destaque: { backgroundColor: cores.primaria, padding: 23, borderRadius: 22, gap: 9 },
  destaqueIcone: { width: 44, height: 44, backgroundColor: '#FFFFFF20', alignItems: 'center', justifyContent: 'center', borderRadius: 13, marginBottom: 8 },
  destaqueTitulo: { color: '#FFFFFF', fontSize: 23, fontWeight: '900' },
  destaqueDescricao: { color: '#D8F1ED', fontSize: 14, maxWidth: 290, lineHeight: 21, marginBottom: 9 },
  botaoClaro: { backgroundColor: '#FFFFFF', paddingHorizontal: 19, paddingVertical: 13, alignSelf: 'flex-start', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  botaoClaroTexto: { color: cores.primariaEscura, fontWeight: '800', fontSize: 13 },
  linhaTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secaoTitulo: { color: cores.texto, fontSize: 17, fontWeight: '900' },
  verTodos: { color: cores.primaria, fontSize: 12, fontWeight: '800' },
  vazioBloco: { alignItems: 'center', gap: 10, paddingVertical: 22 },
  vazio: { color: cores.secundario, fontSize: 13, textAlign: 'center' },
  aluno: { flexDirection: 'row', alignItems: 'center', gap: 11, borderTopWidth: 1, borderTopColor: cores.borda, paddingTop: 13 },
  alunoAvatar: { width: 40, height: 40, borderRadius: 13, backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center' },
  iniciais: { fontWeight: '900', color: cores.primaria },
  alunoNome: { fontWeight: '800', fontSize: 13, color: cores.texto },
  alunoTurma: { color: cores.secundario, fontSize: 11, marginTop: 4 },
});
