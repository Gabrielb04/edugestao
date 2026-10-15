import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { cores } from '../theme';
import { Aviso, estilosBase } from '../components/UI';

export default function Login() {
  const router = useRouter();
  const { entrar } = useAuth();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  function acessar() {
    if (!login.trim() || !senha.trim()) {
      setErro('Informe seu login e sua senha.');
      return;
    }
    if (!entrar(login, senha)) {
      setErro('Login ou senha incorretos. Confira os dados e tente novamente.');
      return;
    }
    setErro('');
    router.replace('/dashboard');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <View style={styles.topo}>
            <View style={styles.logo}>
              <Ionicons name="school" size={31} color="#FFFFFF" />
            </View>
            <Text style={styles.marca}>EDUGESTÃO</Text>
            <Text style={styles.titulo}>Sua escola, mais organizada.</Text>
            <Text style={styles.subtitulo}>Gerencie os cadastros de alunos em um só lugar.</Text>
          </View>
          <View style={styles.cartao}>
            <Text style={styles.formTitulo}>Acessar sistema</Text>
            <Text style={styles.formDescricao}>Entre com suas credenciais para continuar.</Text>
            <Text style={estilosBase.label}>Login</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={cores.secundario} />
              <TextInput
                style={styles.input}
                placeholder="Digite seu login"
                placeholderTextColor="#8D9CAC"
                value={login}
                onChangeText={valor => { setLogin(valor); setErro(''); }}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                accessibilityLabel="Login"
              />
            </View>
            <Text style={estilosBase.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={cores.secundario} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#8D9CAC"
                value={senha}
                onChangeText={valor => { setSenha(valor); setErro(''); }}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoComplete="current-password"
                onSubmitEditing={acessar}
                returnKeyType="go"
                accessibilityLabel="Senha"
              />
              <Pressable onPress={() => setMostrarSenha(valor => !valor)} accessibilityRole="button" accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>
                <Ionicons name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} size={21} color={cores.secundario} />
              </Pressable>
            </View>
            {erro ? <Aviso texto={erro} erro /> : null}
            <Pressable style={({ pressed }) => [estilosBase.botao, styles.botao, pressed && { opacity: 0.84 }]} onPress={acessar} accessibilityRole="button">
              <Text style={estilosBase.botaoTexto}>Entrar no sistema</Text>
              <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
            </Pressable>
          </View>
          <Text style={styles.rodape}>EduGestão · Gestão de alunos</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#F4F8FA' },
  conteudo: { minHeight: '100%', width: '100%', maxWidth: 470, alignSelf: 'center', justifyContent: 'center', paddingHorizontal: 22, paddingVertical: 34, gap: 23 },
  topo: { alignItems: 'center', gap: 9 },
  logo: { width: 66, height: 66, borderRadius: 21, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  marca: { color: cores.primaria, letterSpacing: 2.2, fontWeight: '900', fontSize: 12 },
  titulo: { fontSize: 27, fontWeight: '900', color: cores.texto, textAlign: 'center', marginTop: 5 },
  subtitulo: { fontSize: 14, color: cores.secundario, textAlign: 'center', lineHeight: 21, maxWidth: 300 },
  cartao: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: cores.borda, gap: 9 },
  formTitulo: { fontSize: 21, fontWeight: '900', color: cores.texto },
  formDescricao: { color: cores.secundario, fontSize: 13, marginBottom: 16 },
  inputContainer: { height: 54, borderRadius: 13, borderWidth: 1, borderColor: cores.borda, backgroundColor: '#FAFCFD', flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14, marginBottom: 11 },
  input: { flex: 1, minWidth: 0, height: '100%', color: cores.texto, fontSize: 15 },
  botao: { marginTop: 12 },
  rodape: { textAlign: 'center', color: '#9BACB7', fontSize: 12 },
});
