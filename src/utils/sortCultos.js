const ORDEM_DIAS = {
  domingo: 0,
  segunda: 1, "segunda-feira": 1,
  terça: 2,   "terça-feira": 2, terca: 2, "terca-feira": 2,
  quarta: 3,  "quarta-feira": 3,
  quinta: 4,  "quinta-feira": 4,
  sexta: 5,   "sexta-feira": 5,
  sábado: 6,  sabado: 6,
};

function normalizar(texto = "") {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function sortCultos(cultos = []) {
  return [...cultos].sort((a, b) => {
    const diaA = ORDEM_DIAS[normalizar(a?.dia)] ?? 99;
    const diaB = ORDEM_DIAS[normalizar(b?.dia)] ?? 99;
    if (diaA !== diaB) return diaA - diaB;
    return (a?.horario ?? "").localeCompare(b?.horario ?? "");
  });
}
