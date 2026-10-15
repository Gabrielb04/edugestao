# EduGestão — Gestão de Alunos

Aplicativo demonstrativo de gestão escolar desenvolvido em React Native, Expo SDK 54, TypeScript e Expo Router. Interface em português, sem textos sobre o desafio dentro do aplicativo. A versão web está configurada para pt-BR e não solicita tradução automática do Chrome.

## Funcionalidades

- Tela de login com usuário e senha, senha oculta e validação.
- Dashboard com total de alunos, quantidade de turmas e cadastros do dia.
- Cadastro de alunos: nome completo, matrícula, turma, e-mail opcional e telefone opcional.
- Validação dos campos obrigatórios, e-mail e matrícula duplicada.
- Lista de alunos com pesquisa por nome, matrícula ou turma.
- Edição e exclusão com confirmação.
- Persistência local com AsyncStorage (mantém os registros após fechar e reabrir o app).
- Três abas inferiores: Início, Cadastrar e Alunos.
- Botão Sair e navegação protegida por estado local da sessão.


## Idioma do aplicativo no navegador

O arquivo `src/app/+html.tsx` configura o idioma como `pt-BR` e marca a interface como não traduzível (`translate="no"` e `meta name="google"`). Em `app.json`, `web.output` está definido como `static` para que o Expo Router aplique o documento HTML personalizado na versão web. Essa alteração não afeta as telas do Android/iOS.

Se o navegador tiver traduzido a versão anterior, selecione **Mostrar original**, reinicie o Expo com `npx expo start -c` e atualize a página com `Ctrl + Shift + R`. A configuração diminui a interferência da tradução automática, mas extensões ou traduções forçadas pelo navegador podem ignorá-la.

## Credenciais demonstrativas

- **Login:** `aluno`
- **Senha:** `123456`

> A autenticação é simulada para fins de aprendizado. Não insira dados reais ou sensíveis de estudantes: o armazenamento é local e não criptografado, sem controle real de contas e sem sincronização.

## Instalar e executar

Abra a pasta `edugestao` no VS Code e rode:

```bash
npm install
npx expo start -c
```

Pressione **w** no terminal para testar na Web ou abra com o Expo Go no celular (versão compatível com SDK 54).

Para verificar a compatibilidade das dependências:

```bash
npx expo install --check
```

## Atualizar o `meu-app` já criado com Expo SDK 54

Se você já tem a pasta `meu-app` do desafio instalada e não quer reinstalar tudo:

1. Pare o servidor Expo com `Ctrl + C`.
2. No projeto `meu-app`, apague a pasta `app` antiga (que contém o índice de demonstração).
3. Copie **a pasta `src` inteira** deste pacote para a raiz do `meu-app`.
4. Garanta que `meu-app/app` tenha sido removida: use **apenas** `src/app`, sem duas pastas de rotas.
5. Dentro do `meu-app`, instale as dependências adicionais:

   ```bash
   npx expo install @react-native-async-storage/async-storage @expo/vector-icons
   ```

6. Rode `npx expo start -c` novamente.

O Expo Router já está presente no template padrão. Não execute `reset-project` depois de copiar os arquivos.

## Estrutura

```text
edugestao/
├── src/
│   ├── app/
│   │   ├── +html.tsx              # Idioma pt-BR na web
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # Login
│   │   └── (tabs)/
│   │       ├── _layout.tsx         # Configuração das três abas
│   │       ├── dashboard.tsx       # Painel inicial
│   │       ├── cadastro.tsx        # Cadastro e edição
│   │       └── alunos.tsx          # Pesquisa e exclusão
│   ├── components/UI.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── AlunosContext.tsx
│   └── theme.ts
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## GitHub

Na raiz do projeto:

```bash
git init
git add .
git commit -m "feat: implementa sistema de gestao de alunos"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/edugestao.git
git push -u origin main
```

Substitua `SEU-USUARIO` pelo seu usuário e crie primeiro o repositório público na plataforma.

## Observações

- Os dados são salvos **no dispositivo/navegador utilizado**. Não há servidor, banco de dados remoto nem sincronização entre aparelhos.
- No navegador, limpar os dados do site pode apagar os alunos cadastrados.
- Se um registro falhar ao salvar, a interface informa o erro.
- Para uso real com dados pessoais de estudantes seria necessário backend, autenticação segura, autorização e política de privacidade.
