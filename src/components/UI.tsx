import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../theme';

export function Pagina({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={estilos.area}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.conteudo}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Cabecalho({ titulo, descricao, etiqueta }: { titulo: string; descricao: string; etiqueta?: string }) {
  return (
    <View style={estilos.cabecalho}>
      <Text style={estilos.marca}>EDUGESTÃO <Text style={estilos.ponto}>●</Text></Text>
      {etiqueta ? <Text style={estilos.etiqueta}>{etiqueta.toUpperCase()}</Text> : null}
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.descricao}>{descricao}</Text>
    </View>
  );
}

export function Aviso({ texto, erro = false }: { texto: string; erro?: boolean }) {
  return (
    <View style={[estilos.aviso, erro && estilos.avisoErro]}>
      <Text style={[estilos.avisoTexto, erro && estilos.avisoErroTexto]}>{texto}</Text>
    </View>
  );
}

export const estilosBase = StyleSheet.create({
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 20,
    borderColor: cores.borda,
    borderWidth: 1,
    padding: 20,
  },
  botao: {
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.primaria,
    flexDirection: 'row',
    gap: 8,
  },
  botaoTexto: { color: cores.branco, fontSize: 15, fontWeight: '800' },
  label: { color: cores.texto, fontWeight: '700', fontSize: 13, marginBottom: 7 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    backgroundColor: '#FBFCFE',
    color: cores.texto,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 17,
  },
});

const estilos = StyleSheet.create({
  area: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 850, alignSelf: 'center', padding: 22, paddingBottom: 38, gap: 20 },
  cabecalho: { gap: 6, marginTop: 6 },
  marca: { color: cores.primaria, letterSpacing: 1.3, fontSize: 12, fontWeight: '900', marginBottom: 14 },
  ponto: { color: '#F3A737', fontSize: 10 },
  etiqueta: { color: cores.primaria, fontSize: 11, letterSpacing: 1.5, fontWeight: '800' },
  titulo: { color: cores.texto, fontSize: 28, fontWeight: '900', lineHeight: 35 },
  descricao: { color: cores.secundario, fontSize: 14, lineHeight: 21 },
  aviso: { borderRadius: 12, padding: 13, backgroundColor: cores.primariaSuave },
  avisoErro: { backgroundColor: cores.vermelhoSuave },
  avisoTexto: { color: cores.primariaEscura, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  avisoErroTexto: { color: cores.vermelho },
});
