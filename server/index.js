import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid"; // Gera IDs curtos

const app = express();
const PORT = 4000; // Porta única e consistente
const UPLOAD_DIR = path.resolve("uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(cors());
app.use(express.json());

// Configuração do Multer para salvar arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
// Limite de tamanho: 100MB
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

// Mapa para associar shortId às informações do arquivo
const linkMap = new Map();

// Função para detectar se a requisição vem de um bot/crawler
function isBotOrCrawler(req) {
  const userAgent = req.get("user-agent") || "";
  const botPatterns = [
    /whatsapp/i,
    /facebookexternalhit/i,
    /facebook/i,
    /twitterbot/i,
    /linkedinbot/i,
    /slackbot/i,
    /telegrambot/i,
    /discordbot/i,
    /googlebot/i,
    /bingbot/i,
    /crawler/i,
    /spider/i,
    /bot/i
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

// Rota raiz (opcional)
app.get("/", (req, res) => {
  res.send("Servidor está funcionando! 🚀");
});

// Upload com link curto
app.post("/api/upload", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    // Tratamento de erro do multer
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "Arquivo muito grande. Tamanho máximo: 100MB" });
      }
      return res.status(400).json({ error: `Erro no upload: ${err.message}` });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }
    
    // Validação adicional de tamanho
    if (req.file.size > 100 * 1024 * 1024) {
      return res.status(400).json({ error: "Arquivo muito grande. Tamanho máximo: 100MB" });
    }

    const actualFilename = req.file.filename;
    const originalName = req.file.originalname;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    const shortId = nanoid(7);

    // Armazenar informações completas do arquivo
    linkMap.set(shortId, {
      filename: actualFilename,
      originalName: originalName,
      size: fileSize,
      mimeType: mimeType
    });

    const PUBLIC_URL = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;

    res.json({
      link: `${PUBLIC_URL}/api/s/${shortId}`,
      shortId
    });
  });
});

// Download via shortId
app.get("/api/s/:shortId", (req, res) => {
  const { shortId } = req.params;
  const fileInfo = linkMap.get(shortId);

  if (!fileInfo) {
    return res.status(404).send("Link não encontrado ou expirado.");
  }

  const filePath = path.join(UPLOAD_DIR, fileInfo.filename);
  if (!fs.existsSync(filePath)) {
    linkMap.delete(shortId);
    return res.status(404).send("Arquivo não encontrado.");
  }

  // Se for um bot/crawler (WhatsApp, Facebook, etc.), retornar preview HTML sem fazer download
  if (isBotOrCrawler(req)) {
    const PUBLIC_URL = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
    const fileSizeMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
    
    const previewHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download: ${fileInfo.originalName}</title>
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Download: ${fileInfo.originalName}">
  <meta property="og:description" content="Arquivo para download (${fileSizeMB} MB) - Link de uso único">
  <meta property="og:url" content="${PUBLIC_URL}/api/s/${shortId}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Download: ${fileInfo.originalName}">
  <meta name="twitter:description" content="Arquivo para download (${fileSizeMB} MB) - Link de uso único">
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 500px;
    }
    h1 {
      margin: 0 0 1rem 0;
      color: #667eea;
    }
    .file-info {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
    }
    .download-btn {
      display: inline-block;
      margin-top: 1rem;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: background 0.3s;
    }
    .download-btn:hover {
      background: #5568d3;
    }
    .warning {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📥 Arquivo para Download</h1>
    <div class="file-info">
      <p><strong>Nome:</strong> ${fileInfo.originalName}</p>
      <p><strong>Tamanho:</strong> ${fileSizeMB} MB</p>
      <p><strong>Tipo:</strong> ${fileInfo.mimeType}</p>
    </div>
    <a href="${PUBLIC_URL}/api/s/${shortId}" class="download-btn">Baixar Arquivo</a>
    <div class="warning">
      ⚠️ Este link só pode ser usado uma vez. Após o download, o arquivo será removido.
    </div>
  </div>
</body>
</html>`;

    return res.send(previewHTML);
  }

  // Se for um usuário real, fazer o download normalmente e deletar o arquivo
  res.download(filePath, fileInfo.originalName, err => {
    if (!err) {
      fs.unlink(filePath, unlinkErr => {
        if (unlinkErr) {
          console.error("Erro ao deletar o arquivo:", unlinkErr);
        } else {
          console.log("Arquivo deletado:", filePath);
        }
      });
      linkMap.delete(shortId);
    } else {
      console.error("Erro durante o download:", err);
    }
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
