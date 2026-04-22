// src/hooks/useStorage.js
import { useState } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Comprime uma imagem no browser antes do upload.
 * Retorna um novo File/Blob com tamanho reduzido.
 */
async function comprimirImagem(file, maxWidthOrHeight = 1600, qualidade = 0.82) {
  // GIFs animados não suportam compressão via canvas — retorna original
  if (file.type === "image/gif") return file;
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
        if (width >= height) { height = Math.round((height / width) * maxWidthOrHeight); width = maxWidthOrHeight; }
        else { width = Math.round((width / height) * maxWidthOrHeight); height = maxWidthOrHeight; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file),
        "image/jpeg",
        qualidade
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export function useStorage() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = (file, folder = "adcm") => {
    return new Promise(async (resolve, reject) => {
      if (!file) { reject(new Error("Nenhum arquivo fornecido")); return; }

      if (!ALLOWED_TYPES.includes(file.type)) {
        const msg = `Tipo de arquivo não permitido. Use: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}.`;
        setError(msg); reject(new Error(msg)); return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        const msg = `Arquivo muito grande. Tamanho máximo: 5 MB.`;
        setError(msg); reject(new Error(msg)); return;
      }

      setUploading(true); setError(null); setProgress(0);

      // Compressão automática — reduz fotos grandes antes do upload
      let fileParaEnviar = file;
      try { fileParaEnviar = await comprimirImagem(file); } catch { /* usa original se falhar */ }

      const formData = new FormData();
      formData.append("file", fileParaEnviar);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setUploading(false); setProgress(100); resolve(data.secure_url);
        } else {
          const msg = "Erro ao fazer upload. Tente novamente.";
          setError(msg); setUploading(false); reject(new Error(msg));
        }
      });
      xhr.addEventListener("error", () => {
        const msg = "Erro de conexão no upload.";
        setError(msg); setUploading(false); reject(new Error(msg));
      });
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    });
  };

  const remove = async (url) => {
    console.info("Cloudinary: referência removida. Arquivo no CDN mantido (delete requer backend).", url);
  };

  return { upload, remove, progress, uploading, error };
}

