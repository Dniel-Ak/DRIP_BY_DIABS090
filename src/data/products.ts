import type { CategoryInfo, Product } from "@/types/product";

export const categories: CategoryInfo[] = [
  { value: "polos", label: "Polos" },
  { value: "bonnets", label: "Bonnets" },
  { value: "hoodies", label: "Hoodies" },
  { value: "t-shirts", label: "T-Shirts" },
  { value: "vestes", label: "Vestes" },
  { value: "accessoires", label: "Accessoires" },
];

export const products: Product[] = [
  {
    slug: "young-rich-papi-fc",
    name: "Young Rich Papi FC",
    category: "polos",
    price: 15000,
    colors: ["Noir"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    shortDescription:
      "Polo jersey inspiré de la mentalité Young Rich 090, entre ambition, confiance et culture streetwear.",
    description:
      "Young Rich Papi FC représente l'état d'esprit Young Rich 090 : viser plus haut, avancer avec ambition et construire son propre chemin. Son esthétique football mêlée aux codes DIABS en fait une pièce forte, pensée pour ceux qui portent cette mentalité au quotidien.",
    images: [
      "/products/young-rich-papi-fc/mannequin-recto-verso.jpg",
      "/products/young-rich-papi-fc/modeles-ensemble.jpg",
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    slug: "fc-diabs-golden-era",
    name: "Golden Era",
    category: "polos",
    price: 15000,
    colors: ["Blanc"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    shortDescription:
      "Polo jersey signature du FC DIABS, inspiré de l'identité football et de l'univers DIABS.",
    description:
      "FC DIABS mêle les codes du football à l'identité visuelle de la marque, avec une esthétique noire, blanche et dorée. La mention Golden Era symbolise cette nouvelle ère de DIABS et affirme une vision tournée vers la culture, l'ambition et l'héritage ivoirien.",
    images: ["/products/fc-diabs-golden-era/modeles-ensemble.jpg"],
    isNew: true,
    isFeatured: true,
  },
  {
    slug: "bonnet-diabs-090",
    name: "Bonnet DIABS 090",
    category: "bonnets",
    price: 6000,
    colors: ["Noir", "Blanc", "Doré"],
    sizes: ["Taille unique"],
    shortDescription:
      "Bonnet en crochet signature DIABS, marqué par l'identité 090 et ses détails dorés.",
    description:
      "Confectionné en crochet, ce bonnet reprend l'identité forte de DIABS avec un contraste noir, blanc et doré. Les détails brillants et le marquage DIABS 090 lui donnent une finition distinctive, pensée pour compléter un look streetwear.",
    images: ["/products/bonnet-diabs-090/bonnet-090-noir.jpg"],
    isNew: true,
  },
  {
    slug: "bonnet-diabs-090-beige",
    name: "Bonnet DIABS 090 — Édition Beige",
    category: "bonnets",
    price: 6000,
    colors: ["Beige", "Blanc"],
    sizes: ["Taille unique"],
    shortDescription:
      "Bonnet en crochet aux tons beige et blanc, pensé dans l'univers premium de DIABS.",
    description:
      "Une pièce en crochet aux nuances naturelles, rehaussée de détails subtils pour conserver l'identité DIABS. Son esthétique minimaliste et texturée apporte une touche premium et polyvalente à la silhouette.",
    images: ["/products/bonnet-diabs-090-beige/bonnet-090-beige.jpg"],
    isNew: true,
  },
];
