export type ProjectCategory =
  | "fullStack"
  | "clientWork"
  | "fintech"
  | "academic"
  | "systemDesign"
  | "desktopApp"
  | "mobileApp"
  | "backend";

export interface ProjectLink {
  labelKey: string;
  url: string;
}

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  images?: string[];
  categories: ProjectCategory[];
  tags: string[];
  featured?: boolean;
  links: ProjectLink[];
}

export const projectCategories: ProjectCategory[] = [
  "fullStack",
  "clientWork",
  "fintech",
  "academic",
  "systemDesign",
  "desktopApp",
  "mobileApp",
  "backend",
];

export const projects: Project[] = [
  {
    id: "eotra",
    titleKey: "eotra.title",
    descriptionKey: "eotra.description",
    image: "/eotra1.png",
    images: ["/eotra1.png", "/eotra2.png"],
    categories: ["fullStack"],
    tags: [
      "SaaS",
      "Multi-tenant",
      "Next.js",
      "PostgreSQL",
      "Payments",
      "QR Menu",
      "i18n",
      "Analytics",
    ],
    featured: true,
    links: [{ labelKey: "liveSite", url: "https://menu.eotra.com" }],
  },
  {
    id: "ibosh",
    titleKey: "ibosh.title",
    descriptionKey: "ibosh.description",
    image: "/newProjects/LUXURY BAGS STORE.png",
    categories: ["fullStack", "clientWork"],
    tags: ["Next.js", "Shopify", "i18n", "SEO", "Dark/Light Theme", "CDN"],
    featured: true,
    links: [{ labelKey: "liveSite", url: "https://ibosh.store" }],
  },
  {
    id: "velura",
    titleKey: "velura.title",
    descriptionKey: "velura.description",
    image: "/newProjects/admin.png",
    categories: ["fullStack"],
    tags: ["React", "Node.js", "SQL", "REST API", "Email Service", "Analytics", "i18n"],
    featured: true,
    links: [{ labelKey: "liveSite", url: "https://velura-hotel.vercel.app/en" }],
  },
  {
    id: "tradespilot",
    titleKey: "tradespilot.title",
    descriptionKey: "tradespilot.description",
    image: "/newProjects/TradesPilotAI.png",
    categories: ["fullStack", "fintech", "clientWork"],
    tags: ["Next.js", "Fintech", "SaaS", "AI", "i18n", "Dark/Light Theme", "SEO"],
    links: [{ labelKey: "liveSite", url: "https://tradespilot-ai.com" }],
  },
  {
    id: "forex",
    titleKey: "forex.title",
    descriptionKey: "forex.description",
    image: "/newProjects/charts.png",
    categories: ["fintech", "fullStack", "clientWork"],
    tags: ["React", "TradingView API", "i18n", "Dark/Light Theme", "Fintech"],
    links: [{ labelKey: "visitProject", url: "https://aboudyfx.vercel.app/en" }],
  },
  {
    id: "testing",
    titleKey: "testing.title",
    descriptionKey: "testing.description",
    image: "/newProjects/Top-Down-With-Stubs.jpeg",
    images: [
      "/newProjects/Top-Down-With-Stubs.jpeg",
      "/newProjects/testing-all-sessions.png",
      "/newProjects/decompostion tree.jpeg",
      "/newProjects/1.png",
      "/newProjects/2.png",
    ],
    categories: ["academic"],
    tags: ["Integration Testing", "Top-Down", "Stubs", "Node.js", "SWE431"],
    links: [
      {
        labelKey: "viewLinkedIn",
        url: "https://www.linkedin.com/in/mg-mns-coding/details/projects/",
      },
    ],
  },
  {
    id: "latosta",
    titleKey: "latosta.title",
    descriptionKey: "latosta.description",
    image: "/newProjects/firstyy.png",
    categories: ["clientWork", "fullStack"],
    tags: ["Next.js", "i18n", "QR Menu", "Mobile-First", "Responsive"],
    links: [
      { labelKey: "liveEn", url: "https://latosta.vercel.app/en" },
      { labelKey: "liveAr", url: "https://latosta.vercel.app/ar" },
      { labelKey: "location", url: "https://maps.app.goo.gl/4nVMtPU6yPxe8DSf9" },
    ],
  },
  {
    id: "altava",
    titleKey: "altava.title",
    descriptionKey: "altava.description",
    image: "/systemDesign/C4 MODEL LEVEL1 CONTEXT Diagram_.jpg",
    images: [
      "/systemDesign/C4 MODEL LEVEL1 CONTEXT Diagram_.jpg",
      "/systemDesign/container.png",
      "/systemDesign/Component Diagram V7.png",
      "/systemDesign/UML CLASS Diagram.png",
      "/systemDesign/Altava E- Commerce System , Sequence Diagram.png",
      "/systemDesign/ER Diagram.png",
      "/systemDesign/Deployment Diagaram MNS V.jpg",
      "/systemDesign/use case v5.png",
      "/systemDesign/Activity Diagrams.jpeg",
    ],
    categories: ["systemDesign"],
    tags: ["C4 Model", "Architecture", "SOLID", "PostgreSQL", "MongoDB"],
    links: [
      {
        labelKey: "fullWalkthrough",
        url: "https://librotrack.my.canva.site/altava-e-commerce-system-architecture",
      },
    ],
  },
  {
    id: "ibo",
    titleKey: "ibo.title",
    descriptionKey: "ibo.description",
    image: "/IboPortfolio.png",
    categories: ["clientWork"],
    tags: ["Next.js", "Framer Motion", "i18n", "Responsive"],
    links: [{ labelKey: "liveSite", url: "https://ibo-mu.vercel.app/" }],
  },
  {
    id: "librotrack",
    titleKey: "librotrack.title",
    descriptionKey: "librotrack.description",
    image: "/projects/librotrack.png",
    categories: ["desktopApp"],
    tags: ["Java", "JavaFX", "Swing", "MySQL"],
    links: [
      { labelKey: "viewProject", url: "https://librotrack.my.canva.site/" },
    ],
  },
  {
    id: "vigor",
    titleKey: "vigor.title",
    descriptionKey: "vigor.description",
    image: "/projects/vigor.png",
    categories: ["mobileApp"],
    tags: ["React Native", "Expo", "Mobile", "Fitness"],
    links: [
      { labelKey: "github", url: "https://github.com/MnsDew/Vigor-App.git" },
    ],
  },
  {
    id: "bus",
    titleKey: "bus.title",
    descriptionKey: "bus.description",
    image: "/projects/bus.png",
    categories: ["backend"],
    tags: ["Java", "OOP", "File I/O"],
    links: [
      {
        labelKey: "github",
        url: "https://github.com/MnsDew/Bus-Reservation-System.git",
      },
    ],
  },
  {
    id: "bookstore",
    titleKey: "bookstore.title",
    descriptionKey: "bookstore.description",
    image: "/projects/bookstore.png",
    categories: ["backend"],
    tags: ["JavaScript", "Node.js", "CLI"],
    links: [
      {
        labelKey: "github",
        url: "https://github.com/MnsDew/bookstore-management-system.git",
      },
    ],
  },
];
