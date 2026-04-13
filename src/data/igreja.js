// ============================================================
//  src/data/igreja.js
//  Fonte única de verdade para todos os dados da ADCM Poá.
//  Edite aqui — os componentes consomem automaticamente.
// ============================================================

// ------------------------------------------------------------
// CONTATOS E REDES SOCIAIS
// ------------------------------------------------------------
export const CONTATOS = {
  whatsapp:  "5511999999999",  // só números, com DDI
  instagram: "https://www.instagram.com/adcmpoa",
  facebook:  "https://www.facebook.com/adcmpoa",
  youtube:   "",               // deixe vazio para ocultar o ícone
  email:     "",               // deixe vazio para ocultar
};

// ------------------------------------------------------------
// ENDEREÇO
// ------------------------------------------------------------
export const ENDERECO = {
  rua:    "R. Mal. Deodoro, 100",
  bairro: "Centro",
  cidade: "Poá",
  estado: "SP",
  cep:    "08565-520",
  mapsUrl:  "https://www.google.com/maps?q=R.+Mal.+Deodoro,+100,+Poá,+SP",
  embedUrl: "https://www.google.com/maps?q=R.+Mal.+Deodoro,+100,+Poá,+SP&output=embed",
};

// ------------------------------------------------------------
// CULTOS
// ------------------------------------------------------------
export const CULTOS = [
  {
    id: 1,
    dia:       "Quinta-feira",
    horario:   "19h30",
    nome:      "Culto de Palavra e Oração",
    descricao: "Um momento de ensino bíblico profundo e intercessão coletiva.",
    destaque:  false,
  },
  {
    id: 2,
    dia:       "Domingo",
    horario:   "18h30",
    nome:      "Culto de Celebração",
    descricao: "Nosso culto principal: adoração, Palavra e comunhão entre irmãos.",
    destaque:  true,
  },
  {
    id: 3,
    dia:       "Terça-feira",
    horario:   "19h30",
    nome:      "Escola de Teologia",
    descricao: "Encontro quinzenal de ensino bíblico e teológico aprofundado.",
    destaque:  false,
    obs:       "Quinzenal — acompanhe as redes sociais para confirmar as datas.",
  },
];

// ------------------------------------------------------------
// MINISTÉRIOS
// ------------------------------------------------------------
export const MINISTERIOS = [
  {
    id:        1,
    titulo:    "Louvor",
    descricao: "Conduzindo a igreja em adoração e louvor a Deus com excelência e reverência.",
    cor:       "blue",
  },
  {
    id:        2,
    titulo:    "Infantil",
    descricao: "Cuidando e ensinando as crianças nos caminhos do Senhor com amor e dedicação.",
    cor:       "yellow",
  },
  {
    id:        3,
    titulo:    "Jovens",
    descricao: "Um espaço de comunhão, ensino e crescimento espiritual para a juventude.",
    cor:       "red",
  },
  {
    id:        4,
    titulo:    "Ação Social",
    descricao: "Levando amor e apoio prático à comunidade, refletindo o cuidado de Cristo.",
    cor:       "green",
  },
];

// ------------------------------------------------------------
// NÚMEROS / ESTATÍSTICAS (seção Sobre)
// ------------------------------------------------------------
export const NUMEROS = [
  { valor: "10+", label: "Anos de História" },
  { valor: "200+", label: "Famílias" },
  { valor: "4",   label: "Ministérios" },
  { valor: "3",   label: "Cultos por Semana" },
];

// ------------------------------------------------------------
// ESCOLA DE TEOLOGIA
// ------------------------------------------------------------
export const TEOLOGIA = {
  plataformaUrl: "https://escola.adcmpoa.com",
};

// ------------------------------------------------------------
// AVISOS
// Para ocultar a seção inteira, deixe o array vazio: []
// Para ocultar um aviso específico, adicione: ativo: false
// Tipos: "evento" | "aviso" | "urgente" | "info"
// ------------------------------------------------------------
export const AVISOS = [
  {
    id: 1,
    tipo: "evento",
    titulo: "Culto de Aniversário da Igreja",
    mensagem: "Celebração especial com louvores, homenagens e uma mensagem marcante. Traga sua família!",
    data: "2025-06-15",
    horario: "18h30",
    local: "Templo Principal",
    ativo: true,
  },
  {
    id: 2,
    tipo: "aviso",
    titulo: "Escola de Teologia — Nova Turma",
    mensagem: "Estão abertas as inscrições para a nova turma da Escola de Teologia. Vagas limitadas.",
    data: "",
    horario: "",
    local: "",
    ativo: true,
  },
  {
    id: 3,
    tipo: "urgente",
    titulo: "Corrente de Oração",
    mensagem: "Nesta quinta-feira teremos uma corrente de oração especial. Contamos com sua presença e intercessão.",
    data: "2025-06-12",
    horario: "19h30",
    local: "",
    ativo: true,
  },
];

// ------------------------------------------------------------
// TESTEMUNHOS (fallback estático)
// ------------------------------------------------------------
export const TESTEMUNHOS = [
  {
    id: 1,
    nome: "Ana Paula S.",
    texto: "Cheguei na ADCM em um dos momentos mais difíceis da minha vida. Fui recebida com tanto amor que não consegui mais parar de voltar. Hoje tenho uma família aqui.",
    tempo: "Membro há 3 anos",
    ativo: true,
  },
  {
    id: 2,
    nome: "Ricardo M.",
    texto: "Nunca imaginei que uma igreja pudesse mudar tanto minha visão de vida. Os cultos de quinta me recarregam para toda semana. É imperdível.",
    tempo: "Membro há 5 anos",
    ativo: true,
  },
  {
    id: 3,
    nome: "Josiane L.",
    texto: "Meus filhos adoram o ministério infantil. Ver eles crescendo na fé com tanto cuidado é uma bênção que não tem preço. Obrigada, ADCM.",
    tempo: "Membro há 2 anos",
    ativo: true,
  },
];
