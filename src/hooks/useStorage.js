// src/hooks/useStorage.js
import { useState } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Tipos de imagem permitidos
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
// Tamanho máximo: 5 MB
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function useStorage() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Faz upload de um arquivo para o Cloudinary com validação prévia.
   * @param {File} file - Arquivo a ser enviado
   * @param {string} folder - Pasta no Cloudinary (ex: "ministerios/capas")
   * @returns {Promise<string>} URL pública do arquivo
   */
  const upload = (file, folder = "adcm") => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Nenhum arquivo fornecido"));
        return;
      }

      // CORRIGIDO: validação de tipo MIME
      if (!ALLOWED_TYPES.includes(file.type)) {
        const msg = `Tipo de arquivo não permitido. Use: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}.`;
        setError(msg);
        reject(new Error(msg));
        return;
      }

      // CORRIGIDO: validação de tamanho
      if (file.size > MAX_SIZE_BYTES) {
        const msg = `Arquivo muito grande. Tamanho máximo: 5 MB.`;
        setError(msg);
        reject(new Error(msg));
        return;
      }

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
          const msg = "Erro ao fazer upload. Tente novamente.";
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

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
      );
      xhr.send(formData);
    });
  };

  /**
   * NOTA: No Cloudinary, o delete requer autenticação server-side (signed request).
   * Sem um backend, não é possível deletar imagens pelo frontend com segurança.
   * As imagens são removidas da referência no Firestore (e somem do site),
   * mas o arquivo original permanece no CDN.
   *
   * Para implementar a deleção real, crie um Firebase Cloud Function que assine
   * a requisição de delete para a API do Cloudinary.
   */
  const remove = async (url) => {
    console.info(
      "Cloudinary: referência removida. Arquivo no CDN mantido (delete requer backend).",
      url
    );
  };

  return { upload, remove, progress, uploading, error };
}
