# 🚀 Como Testar o Site no Localhost

## Passo a Passo

### 1️⃣ Instalar Dependências (se ainda não instalou)

**No terminal, na pasta do servidor:**
```bash
cd server
npm install
```

**Em outro terminal, na pasta do cliente:**
```bash
cd client
npm install
```

### 2️⃣ Iniciar o Servidor Backend

**No terminal, na pasta `server`:**
```bash
npm start
```

Você deve ver: `Servidor rodando em http://localhost:4000`

### 3️⃣ Iniciar o Cliente Frontend

**Em outro terminal, na pasta `client`:**
```bash
npm run dev
```

Você deve ver algo como: `Local: http://localhost:5173` (ou outra porta)

### 4️⃣ Abrir no Navegador

Abra o navegador e acesse a URL que apareceu no terminal do cliente (geralmente `http://localhost:5173`)

---

## ⚠️ Importante

- O arquivo `client/src/app.jsx` está configurado para usar `localhost:4000` para testes
- **Antes de fazer commit**, lembre-se de voltar a URL para produção:
  ```javascript
  const API_URL = "https://linkp2p.onrender.com/api";
  //const API_URL = "http://localhost:4000/api";
  ```

## 🛑 Para Parar os Servidores

Pressione `Ctrl + C` em cada terminal que está rodando.

