// src/hooks/useSEO.js
import { useEffect } from "react";

// Utilitário para criar/atualizar meta tags
function setMeta(selector, attr, value) {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    const [attrName, attrValue] = attr.split("=");
    tag.setAttribute(attrName, attrValue.replace(/['"]/g, ""));
    document.head.appendChild(tag);
  }
  tag.content = value;
  return tag;
}

export function useSEO({ title, description, image, url } = {}) {
  useEffect(() => {
    const siteName = "ADCM Poá";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDesc =
      "Igreja Assembleia de Deus em Poá, SP. Venha fazer parte desta família!";
    const finalDesc = description || defaultDesc;
    const finalUrl = url || window.location.href;

    // Title
    document.title = fullTitle;

    // Meta description
    setMeta("meta[name='description']", "name=description", finalDesc);

    // Canonical — CORRIGIDO: adicionado
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = finalUrl;

    // Open Graph
    setMeta("meta[property='og:title']", "property=og:title", fullTitle);
    setMeta("meta[property='og:description']", "property=og:description", finalDesc);
    setMeta("meta[property='og:type']", "property=og:type", "website");
    setMeta("meta[property='og:url']", "property=og:url", finalUrl);
    if (image) {
      setMeta("meta[property='og:image']", "property=og:image", image);
    }

    // Twitter Card — CORRIGIDO: adicionado
    setMeta("meta[name='twitter:card']", "name=twitter:card", "summary_large_image");
    setMeta("meta[name='twitter:title']", "name=twitter:title", fullTitle);
    setMeta("meta[name='twitter:description']", "name=twitter:description", finalDesc);
    if (image) {
      setMeta("meta[name='twitter:image']", "name=twitter:image", image);
    }
  }, [title, description, image, url]);
}
