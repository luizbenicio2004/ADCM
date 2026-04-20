# ADCM Poá — Changelog de Correções

## Resumo das alterações aplicadas

---

### 🔴 SEGURANÇA

#### `firestore.rules`
- **Antes:** `allow write: if request.auth != null` — qualquer conta autenticada podia escrever em tudo.
- **Depois:** Escrita restrita via função `isAdmin()` que verifica a coleção `/admins/{uid}`.
- **Como ativar:** No Console do Firebase, crie manualmente o documento `/admins/{SEU_UID}` com `{ isAdmin: true }`.

#### `src/hooks/useStorage.js`
- Adicionada **validação de tipo MIME** antes do upload (aceita apenas jpeg, png, webp, gif).
- Adicionado **limite de tamanho**: máximo 5 MB por arquivo.
- Erros de validação agora são exibidos ao usuário com mensagem clara.

#### `src/components/Header/Header.jsx`
- **Link "⚙️ Admin" removido** da navegação pública — não deve ser exposto a visitantes.
- Corrigido: `aria-expanded` no botão hamburguer, `aria-controls` e `role="dialog"` no drawer mobile.
- Altura mínima de toque aumentada para 44px (WCAG) nos links mobile.

#### `src/components/Footer/Footer.jsx`
- **Link "Painel Admin" removido** do rodapé público.
- `react-icons/fa` **substituído por `lucide-react`** — elimina duas libs de ícones no bundle.

---

### 🟡 BUGS CORRIGIDOS

#### `src/hooks/useDoc.js`
- **Bug crítico:** `save()` engolia erros silenciosamente. O caller via "Salvo com sucesso!" mesmo quando a gravação havia falhado.
- **Correção:** `save()` agora relança o erro (`throw err`) para que os componentes possam reagir corretamente.

#### `src/hooks/useCollection.js`
- **Bug:** Cache em memória nunca expirava — dados podiam ficar obsoletos indefinidamente.
- **Correção:** Cache agora tem TTL de 5 minutos. Após expirar, o próximo render busca dados frescos.

#### `src/pages/admin/Cultos.jsx`
- **Bug:** Campo horário era texto livre ("19h30", "7:30pm", "19:30") — `sortCultos` ordenava errado em alguns casos.
- **Correção:** Campo trocado para `input type="time"` (formato HH:MM padronizado).
- **Bug:** `tornarPrincipal` fazia N+1 writes individuais para cada culto.
- **Correção:** Usa `writeBatch` — todas as atualizações em uma única operação atômica.
- **Bug:** `id="ativo"` duplicado com outros formulários.
- **Correção:** Alterado para `id="culto-ativo"`.

#### `src/pages/admin/Ministerios.jsx`
- **Inconsistência:** Usava `addDoc/updateDoc/deleteDoc` direto do Firebase enquanto todos os outros admins usam `useCollection`.
- **Correção:** Refatorado para usar `adicionar/atualizar/remover` do hook.
- **Bug:** `id="ativo"` duplicado.
- **Correção:** Alterado para `id="ministerio-ativo"`.
- Adicionada validação de URL do YouTube com `isValidYoutubeUrl`.

#### `src/pages/admin/Eventos.jsx`
- **Bug:** `id="ativo"` duplicado.
- **Correção:** Alterado para `id="evento-ativo"`.
- Erros de upload agora exibem a mensagem real (ex: "Arquivo muito grande. Máx 5MB").
- Adicionado aviso visual quando evento não tem data definida.

#### `src/pages/admin/Live.jsx`
- Adicionada validação de URL antes de salvar no Firestore.
- Preview do admin usa embed **sem autoplay** (antes abria com autoplay ao entrar na página).

---

### 🔵 QUALIDADE & REFATORAÇÃO

#### `src/utils/youtube.js` ← NOVO ARQUIVO
- Função `toEmbedUrl()` extraída e centralizada (estava duplicada em `Live.jsx`, `AdminLive.jsx` e `Ministerio.jsx`).
- Nova função `isValidYoutubeUrl()` para validação antes de salvar.

#### `src/components/admin/Field.jsx` ← NOVO ARQUIVO
- Componente `Field` extraído e centralizado (estava redefinido localmente em `Hero.jsx`, `AdminConfig.jsx` e `Endereco.jsx`).

#### `src/hooks/useSEO.js`
- Adicionado `twitter:card` e `twitter:image`.
- Adicionada tag `canonical` automática por página.
- `og:image` agora é definido em páginas dinâmicas (Ministério, Evento).

#### `src/components/Toast/Toast.jsx`
- Adicionado `role="alert"` e `aria-live="assertive"` — leitores de tela agora anunciam os toasts.

#### `src/components/Lightbox/Lightbox.jsx`
- Adicionados `role="dialog"`, `aria-modal="true"`, `aria-label`.
- Foco inicial no botão de fechar ao abrir.
- `document.body.overflow = "hidden"` enquanto aberto (evita scroll do fundo).
- `alt` descritivo nas imagens.

#### `src/pages/Ministerio.jsx`
- Usa `toEmbedUrl` centralizado de `utils/youtube.js`.
- SEO dinâmico com `og:image` passando a foto de capa do ministério.

---

### 📦 DEPENDÊNCIAS

Remover `react-icons` do `package.json` após verificar que não há mais imports:
```
npm uninstall react-icons
```

O Footer foi o único lugar que usava `react-icons/fa`. Agora usa `lucide-react`.

---

### 🔧 PASSOS PÓS-DEPLOY

1. **Criar admin no Firestore:**
   - Acesse o Console do Firebase → Firestore → crie a coleção `admins`
   - Crie um documento com o UID do usuário administrador
   - Adicione o campo: `isAdmin: true` (tipo boolean)

2. **Fazer deploy das novas Security Rules:**
   ```
   firebase deploy --only firestore:rules
   ```

3. **Remover react-icons:**
   ```
   npm uninstall react-icons
   ```

4. **Testar o login admin** após deploy das rules para confirmar que o acesso funciona.
