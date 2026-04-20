/**
 * Converte uma URL do YouTube (watch ou youtu.be) em URL de embed.
 * Suporta:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/live/VIDEO_ID
 *
 * @param {string} url - URL original do YouTube
 * @param {Object} params - Parâmetros adicionais do player (ex: { autoplay: 1 })
 * @returns {string|null} URL de embed ou null se inválida
 */
export function toEmbedUrl(url, params = {}) {
  if (!url || typeof url !== "string") return null;

  // Validação básica: deve ser uma URL do YouTube
  const isYoutube = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url);
  if (!isYoutube) return null;

  const match = url.match(/(?:v=|youtu\.be\/|\/live\/)([A-Za-z0-9_-]{11})/);
  if (!match) return null;

  const videoId = match[1];
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();

  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ""}`;
}

/**
 * Valida se uma string é uma URL do YouTube válida.
 * Útil para validar antes de salvar no Firestore.
 */
export function isValidYoutubeUrl(url) {
  return toEmbedUrl(url) !== null;
}
