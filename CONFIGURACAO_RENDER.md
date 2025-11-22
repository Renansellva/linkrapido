# 🔧 Configuração do Render para Frontend

## ⚠️ IMPORTANTE

O **frontend deve estar na Vercel**, não no Render! O Render é apenas para o **backend (servidor)**.

---

## Se você QUISER fazer deploy do frontend no Render (não recomendado):

### Configurações no Render Dashboard:

1. **Build Command:**
   ```
   cd client && npm install && npm run build
   ```

2. **Publish Directory:**
   ```
   client/dist
   ```

3. **Start Command:**
   ```
   cd client && npm start
   ```
   OU
   ```
   npx serve -s client/dist -l $PORT
   ```

4. **Environment:** `Static Site`

---

## ✅ Configuração CORRETA (Recomendada):

### Frontend → Vercel
- Conecte o repositório GitHub na Vercel
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: `Vite`

### Backend → Render
- Conecte o repositório GitHub no Render
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: `Node`
- Port: `4000`

---

## 🚨 Erro Atual

O erro "O diretório de publicação .npm run start não existe" acontece porque:

1. O Render está interpretando o comando `start` como um diretório
2. A configuração de "Publish Directory" está errada
3. O Render precisa saber que é um site estático

---

## 🔍 Como Corrigir no Render:

1. Vá nas configurações do serviço no Render
2. Em **"Publish Directory"**, coloque: `client/dist`
3. Em **"Start Command"**, coloque: `cd client && npx serve -s dist -l $PORT`
4. OU mude o tipo de serviço para **"Static Site"**

---

## 💡 Recomendação Final:

**Use Vercel para o frontend** - é mais fácil e rápido para sites React/Vite!

