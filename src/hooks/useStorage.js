import { useState } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function useStorage() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Faz upload de um arquivo para o Cloudinary.
   * @param {File} file - Arquivo a ser enviado
   * @param {string} folder - Pasta no Cloudinary (ex: "ministerios/capas")
   * @returns {Promise<string>} URL pública do arquivo
   */
  const upload = (file, folder = "adcm") => {
    return new Promise((resolve, reject) => {
      if (!file) { reject(new Error("Nenhum arquivo fornecido")); return; }

      setUploading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setUploading(false);
          setProgress(100);
          resolve(data.secure_url);
        } else {
          const msg = "Erro ao fazer upload.";
          setError(msg);
          setUploading(false);
          reject(new Error(msg));
        }
      });

      xhr.addEventListener("error", () => {
        const msg = "Erro de conexão no upload.";
        setError(msg);
        setUploading(false);
        reject(new Error(msg));
      });

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    });
  };

  /**
   * No Cloudinary o delete requer autenticação no backend.
   * Por ora apenas remove a referência local — a URL do Firestore é apagada normalmente.
   */
  const remove = async (url) => {
    // Sem backend, não é possível deletar do Cloudinary pelo frontend.
    // A imagem some do site assim que a URL for removida do Firestore.
    console.info("Cloudinary: imagem removida da referência. Arquivo no CDN mantido.", url);
  };

  return { upload, remove, progress, uploading, error };
}