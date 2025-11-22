# 🔧 Solução para "Network Error"

## O que significa "Network Error"?

O erro "Network Error" significa que o **frontend (cliente)** não conseguiu se comunicar com o **backend (servidor)**. Isso geralmente acontece quando:

1. ❌ O servidor não está rodando
2. ❌ A URL da API está incorreta
3. ❌ O servidor está em uma porta diferente
4. ❌ Problema de firewall ou antivírus bloqueando a conexão

---

## ✅ Como Resolver

### Passo 1: Verificar se o servidor está rodando

Abra um terminal e execute:

```bash
cd server
npm start
```

Você deve ver a mensagem:
```
Servidor rodando em http://localhost:4000
```

**Se não aparecer essa mensagem**, o servidor não está rodando!

---

### Passo 2: Verificar a porta

O servidor deve estar rodando na porta **4000**. Se estiver em outra porta, você precisa:

1. Mudar a porta no arquivo `server/index.js` (linha 9)
2. OU mudar a URL no arquivo `client/src/app.jsx` (linha 9)

---

### Passo 3: Verificar se ambos estão rodando

Você precisa ter **2 terminais abertos**:

**Terminal 1 - Servidor (Backend):**
```bash
cd server
npm start
```

**Terminal 2 - Cliente (Frontend):**
```bash
cd client
npm run dev
```

---

### Passo 4: Verificar a URL no navegador

O frontend deve estar rodando em algo como:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (outros)

E o backend em:
- `http://localhost:4000`

---

## 🚨 Problemas Comuns

### Problema: "Servidor não encontrado"
**Solução:** Certifique-se de que o servidor está rodando na porta 4000

### Problema: "CORS Error"
**Solução:** O servidor já tem CORS configurado. Se ainda aparecer, verifique se `app.use(cors())` está no `server/index.js`

### Problema: "Connection refused"
**Solução:** 
1. Verifique se a porta 4000 não está sendo usada por outro programa
2. Tente mudar a porta no servidor

### Problema: Funciona no localhost mas não em produção
**Solução:** Certifique-se de mudar a URL da API no `client/src/app.jsx`:
```javascript
const API_URL = "https://linkp2p.onrender.com/api";
```

---

## 🔍 Como Testar se o Servidor Está Funcionando

Abra o navegador e acesse:
```
http://localhost:4000
```

Se aparecer: `Servidor está funcionando! 🚀` → O servidor está OK!

Se der erro → O servidor não está rodando.

---

## 💡 Dica

Sempre inicie o **servidor primeiro**, depois o cliente!

