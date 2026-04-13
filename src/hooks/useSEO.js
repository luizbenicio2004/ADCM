// src/hooks/useSEO.js
import { useEffect } from "react";

export function useSEO({ title, description, image, url } = {}) {
  useEffect(() => {
    const siteName = "ADCM Poá";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDesc = "Igreja Assembleia de Deus em Poá, SP. Venha fazer parte desta família!";
    const finalDesc = description || defaultDesc;

    // Title
    document.title = fullTitle;

    // Meta description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = finalDesc;

    // OG tags
    const og = (property, content) => {
      let tag = document.querySelector(`meta[property='${property}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    og("og:title", fullTitle);
    og("og:description", finalDesc);
    og("og:type", "website");
    if (url) og("og:url", url);
    if (image) og("og:image", image);
  }, [title, description, image, url]);
}
