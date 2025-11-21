// Arquivo: src/app.jsx

import React, { useState } from "react";
import axios from "axios";
// import './App.css'; // ou './style.css'


//const API_URL = "https://linkp2p.onrender.com/api";
const API_URL = "http://localhost:4000/api";

// Definição do componente PixCafezinho (como já tínhamos)
function PixCafezinho() {
  const [feedbackPixCopia, setFeedbackPixCopia] = useState('');
  const pixLink = "00020126580014BR.GOV.BCB.PIX013690a011cb-034e-4c2e-b09e-6fb4025b07985204000053039865802BR5920Renan Costa da Silva6009SAO PAULO62140510W2AWVsMnQ1630449C9";

  const copiarLinkPix = async () => {
    try {
      await navigator.clipboard.writeText(pixLink);
      setFeedbackPixCopia('Link PIX copiado!');
      setTimeout(() => setFeedbackPixCopia(''), 2000);
    } catch (err) {
      console.error('Falha ao copiar o link PIX: ', err);
      setFeedbackPixCopia('Falha ao copiar!');
      setTimeout(() => setFeedbackPixCopia(''), 2000);
    }
  };

  return (
    <div className="pix-cafezinho">
      <img src="/pixQrCode.jpeg" alt="QR Code Pix para um cafezinho" />
      <span>Pix para um cafezinho ☕</span>
      
      <div style={{ marginTop: '10px', width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#f4f6fa', fontWeight: '500' }}>
          Link do PIX:
        </label>
        <input
          type="text"
          value={pixLink}
          readOnly
          onClick={(e) => e.target.select()}
          style={{
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box',
            borderRadius: '8px',
            border: '1.8px solid #313b5f',
            background: '#1a1c29',
            color: '#f4f6fa',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            wordBreak: 'break-all'
          }}
        />
        <button
          onClick={copiarLinkPix}
          className="button"
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            fontSize: '0.9rem'
          }}
        >
          Copiar Link PIX
        </button>
        {feedbackPixCopia && (
          <p
            style={{
              marginTop: '10px',
              fontSize: '0.85rem',
              color: feedbackPixCopia.includes('Falha') ? '#ff8a8a' : '#30e88b',
              fontWeight: '600',
              textAlign: 'center'
            }}
          >
            {feedbackPixCopia}
          </p>
        )}
      </div>
    </div>
  );
}

// Componente principal da sua aplicação
export default function App() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [feedbackCopia, setFeedbackCopia] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (!file) return { valid: false, message: '' };
    
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        message: `Arquivo muito grande! Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}` 
      };
    }
    
    return { valid: true, message: '' };
  };

  const handleFile = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (validation.valid) {
        setFile(selectedFile);
        setError('');
      } else {
        setError(validation.message);
        setFile(null);
      }
    }
    setLink("");
    setProgress(0);
    setFeedbackCopia("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (validation.valid) {
        setFile(droppedFile);
        setError('');
      } else {
        setError(validation.message);
        setFile(null);
      }
    }
    setLink("");
    setProgress(0);
    setFeedbackCopia("");
  };

  const uploadFile = async e => {
    e.preventDefault();
    if (!file) return;
    
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setUploading(true);
    setProgress(0);
    setLink("");
    setFeedbackCopia("");
    setError("");
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/upload`, data, {
        onUploadProgress: p => {
          if (p.total) {
            setProgress(Math.round((p.loaded / p.total) * 100));
          } else {
            setProgress(0);
          }
        }
      });
      setLink(res.data.link);
    } catch (err) {
      console.error("Erro ao enviar arquivo:", err);
      const errorMessage = err.response?.data?.error || 
                           err.message || 
                           "Erro ao enviar arquivo. Tente novamente.";
      setError(errorMessage);
      setLink("");
    }
    setUploading(false);
  };

  const copiarLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setFeedbackCopia('Link copiado!');
      setTimeout(() => setFeedbackCopia(''), 2000);
    } catch (err) {
      console.error('Falha ao copiar o link: ', err);
      setFeedbackCopia('Falha ao copiar!');
      setTimeout(() => setFeedbackCopia(''), 2000);
    }
  };

  const compartilharWhatsApp = () => {
    if (!link) return;
    const message = encodeURIComponent(`📎 Arquivo para download\n\n${link}\n\n⚠️ Este link só pode ser usado uma vez!`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Função para o botão de sugestões
  const handleSugestoesClick = () => {
    const seuEmail = ""; 
    const assunto = encodeURIComponent("Sugestão para o Linkp2p");
    const corpoEmail = encodeURIComponent("Olá,\n\nEu tenho a seguinte sugestão para o site Linkp2p:\n\n");
    window.location.href = `mailto:${seuEmail}?subject=${assunto}&body=${corpoEmail}`;
  };

  return (
    <>
      <div className="container" style={{ fontFamily: "sans-serif" }}>
        <h2>linkp2p</h2>
        <form onSubmit={uploadFile}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed #30e88b' : '2px dashed #313b5f',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px',
              backgroundColor: isDragging ? 'rgba(48, 232, 139, 0.1)' : 'transparent',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <input
                id="file-upload"
                type="file"
                onChange={handleFile}
                disabled={uploading}
                style={{ 
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}
              />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#8a93b3', marginTop: '10px', margin: 0 }}>
              {isDragging ? 'Solte o arquivo aqui' : 'Ou arraste e solte o arquivo aqui'}
            </p>
          </div>

          {file && (
            <div style={{
              background: 'rgba(26, 28, 41, 0.7)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid #313b5f'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#f4f6fa', fontWeight: '600' }}>
                📄 {file.name}
              </p>
              <p style={{ margin: '0', fontSize: '0.85rem', color: '#8a93b3' }}>
                Tamanho: {formatFileSize(file.size)}
              </p>
            </div>
          )}

          {error && (
            <div className="error-message" style={{ marginBottom: '15px' }}>
              ⚠️ {error}
            </div>
          )}

          {uploading && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#1a1c29',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '10px',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <div 
                  className={progress === 100 ? 'progress-bar-complete' : ''}
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 50%, #16a34a 100%)',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '6px',
                    position: 'relative',
                    boxShadow: progress === 100 
                      ? '0 2px 16px rgba(34, 197, 94, 0.6)' 
                      : '0 2px 8px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  {/* Efeito de brilho animado */}
                  {progress > 0 && progress < 100 && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 2s infinite',
                      borderRadius: '6px'
                    }}></div>
                  )}
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '8px'
              }}>
                <p style={{ 
                  textAlign: 'left', 
                  fontSize: '0.9rem', 
                  color: '#8a93b3', 
                  margin: 0,
                  fontWeight: '500'
                }}>
                  📤 Enviando arquivo...
                </p>
                <p style={{ 
                  textAlign: 'right', 
                  fontSize: '0.95rem', 
                  color: '#30e88b', 
                  margin: 0,
                  fontWeight: '700',
                  fontFamily: 'monospace'
                }}>
                  {progress}%
                </p>
              </div>
            </div>
          )}

          <button type="submit" className="btn-enviar" disabled={!file || uploading}>
            {uploading ? `Enviando: ${progress}%` : "Enviar"}
          </button>
        </form>

        {link && (
          <div className="link-container" style={{ marginTop: '20px' }}>
            <b>Link para compartilhar:</b>
            <div style={{ margin: '10px 0' }}>
              <input
                type="text"
                value={link}
                readOnly
                onClick={(e) => e.target.select()}
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1.8px solid #313b5f', background: '#1a1c29', color: '#f4f6fa' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={copiarLink} className="button" style={{ flex: 1 }}>
                📋 Copiar Link
              </button>
              <button 
                onClick={compartilharWhatsApp} 
                className="button" 
                style={{ 
                  flex: 1,
                  background: 'linear-gradient(90deg, #25D366 0%, #128C7E 100%)',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
                }}
              >
                💬 WhatsApp
              </button>
            </div>
            {feedbackCopia && (
              <p className="feedback-message" style={{ marginTop: '10px', fontSize: '0.9rem', color: feedbackCopia.includes('Falha') ? '#ff8a8a' : '#30e88b', fontWeight: '600' }}>
                {feedbackCopia}
              </p>
            )}
            <div className="download-once-message" style={{ color: "gray", fontSize: '0.85rem', marginTop: '15px', textAlign: 'center' }}>
              ⚠️ O arquivo só pode ser baixado uma vez!
            </div>
          </div>
        )}
      </div>

      {/* Botão de Sugestões */}
      <button onClick={handleSugestoesClick} className="sugestoes-button">
        Sugestões
      </button>

      <PixCafezinho />
    </>
  );
}