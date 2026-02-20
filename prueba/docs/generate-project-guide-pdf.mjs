import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

const docsDir = path.resolve("docs");
fs.mkdirSync(docsDir, { recursive: true });

const pdfOutputPath = path.join(docsDir, "Guia-Astro-Tailwind-Vue-Orbit.pdf");
const markdownOutputPath = path.join(docsDir, "Guia-Astro-Tailwind-Vue-Orbit.md");

const projectDate = new Date().toLocaleDateString("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const sections = [
  {
    title: "1. Objetivo de esta guía",
    paragraphs: [
      "Esta documentación explica cómo está montado tu proyecto actual y cómo trabajan juntas las tres piezas clave: Astro, Tailwind y Vue.",
      "Está pensada para que puedas leer archivo por archivo y entender para qué sirve cada uno, cómo se conecta con los demás y dónde tocar cuando quieras cambiar algo.",
    ],
  },
  {
    title: "2. Mapa general del proyecto",
    bullets: [
      "Astro se encarga del enrutado, del render base y de la composición de páginas.",
      "Tailwind se usa para todo el estilo visual mediante clases utilitarias.",
      "Vue se usa para las islas interactivas (solo donde hay comportamiento dinámico real).",
      "La estructura principal vive dentro de src/ y se divide en layouts, pages, components y styles.",
    ],
  },
  {
    title: "3. Flujo de render (de arriba a abajo)",
    bullets: [
      "Cada página (src/pages/*.astro) importa un layout base y varios componentes.",
      "El layout base define HTML global, meta tags y estilos compartidos.",
      "Los componentes .astro renderizan contenido estático o semiestático.",
      "Los componentes .vue se hidratan en cliente con directivas client:* y funcionan como islas interactivas.",
    ],
    paragraphs: [
      "Idea clave: todo lo que no necesita JavaScript en cliente se queda en Astro. Lo que sí necesita interacción viva se pasa a Vue.",
    ],
  },
  {
    title: "4. Configuración del stack",
    files: [
      {
        path: "astro.config.mjs",
        purpose:
          "Activa integraciones del proyecto. Aquí se registra @astrojs/vue y el plugin de Tailwind para Vite.",
        howItWorks:
          "Astro usa este archivo al arrancar dev/build para saber cómo transformar archivos .astro y .vue.",
      },
      {
        path: "package.json",
        purpose:
          "Define scripts del proyecto y dependencias principales (astro, tailwindcss, @tailwindcss/vite, vue, @astrojs/vue).",
        howItWorks:
          "npm run dev y npm run build usan estos scripts; las dependencias habilitan todo el entorno de trabajo.",
      },
    ],
  },
  {
    title: "5. Layout y estilos globales",
    files: [
      {
        path: "src/layouts/BaseSiteLayout.astro",
        purpose:
          "Plantilla base reutilizada por todas las páginas. Define estructura HTML global y metadatos SEO básicos.",
        howItWorks:
          "Recibe title y description por props; si no se pasan, usa valores por defecto.",
      },
      {
        path: "src/styles/base-theme.css",
        purpose:
          "Estilos base del proyecto (import de fuentes, import de Tailwind, variables CSS y reglas globales).",
        howItWorks:
          "Se importa desde el layout base para que toda la web comparta tipografías, fondo y comportamiento común.",
      },
    ],
  },
  {
    title: "6. Páginas y su responsabilidad",
    files: [
      {
        path: "src/pages/index.astro",
        purpose:
          "Página principal. Orquesta HomeHeroSection, HomeProcessSection y HomeTestimonialsSection.",
        howItWorks:
          "Monta la experiencia de inicio usando el layout base y componentes reutilizables.",
      },
      {
        path: "src/pages/servicios.astro",
        purpose:
          "Página de servicios con scroll interno y snap vertical.",
        howItWorks:
          "Renderiza ServicesBentoSections dentro de un main con altura controlada para snap por bloques.",
      },
      {
        path: "src/pages/contacto.astro",
        purpose:
          "Página de contacto con bloque informativo + formulario.",
        howItWorks:
          "Integra la isla Vue ContactScheduleSelectorIsland para elegir horario dentro del formulario.",
      },
    ],
  },
  {
    title: "7. Componentes de estructura visual",
    files: [
      {
        path: "src/components/SiteHeader.astro",
        purpose:
          "Cabecera global. Incluye navegación desktop, menú móvil y marcado de ruta activa.",
        howItWorks:
          "Compara Astro.url.pathname con cada enlace para aplicar estado activo.",
      },
      {
        path: "src/components/SiteFooter.astro",
        purpose:
          "Pie global con enlaces agrupados y copyright.",
        howItWorks:
          "Render dinámico de grupos de links (navegación, legal y comunidad).",
      },
      {
        path: "src/components/HomeHeroSection.astro",
        purpose:
          "Primer bloque del inicio con propuesta de valor y CTAs principales.",
        howItWorks:
          "Usa diseño estático optimizado sin JavaScript cliente.",
      },
      {
        path: "src/components/HomeProcessSection.astro",
        purpose:
          "Bloque que explica la metodología de trabajo en 4 pasos.",
        howItWorks:
          "Crea tarjetas por mapeo de un array local processSteps.",
      },
      {
        path: "src/components/HomeTestimonialsSection.astro",
        purpose:
          "Prueba social con testimonios en tarjetas.",
        howItWorks:
          "Mismo patrón de render por mapeo de datos con estructura limpia y reutilizable.",
      },
    ],
  },
  {
    title: "8. Servicios: Astro + isla Vue",
    files: [
      {
        path: "src/components/ServicesBentoSections.astro",
        purpose:
          "Componente contenedor de secciones de servicio. Define contenido, tonos de fondo y estructura snap.",
        howItWorks:
          "Por cada bloque de servicio pasa las cards a ServiceCardsBentoIsland con client:visible.",
      },
      {
        path: "src/components/ServiceCardsBentoIsland.vue",
        purpose:
          "Isla Vue que gestiona la interacción de las tarjetas bento.",
        howItWorks:
          "Desktop: hover/focus por CSS. Móvil: click/tap para abrir/cerrar tarjeta. Incluye soporte Enter/Espacio/Escape y control de viewport.",
      },
    ],
    paragraphs: [
      "Usar client:visible aquí es buena práctica: no cargas la lógica Vue de tarjetas hasta que esa parte entra en pantalla.",
    ],
  },
  {
    title: "9. Contacto: isla Vue del selector de horario",
    files: [
      {
        path: "src/components/ContactScheduleSelectorIsland.vue",
        purpose:
          "Isla Vue para mostrar panel flotante de horarios y seleccionar uno.",
        howItWorks:
          "Controla estado del panel, slot activo y valor final en un input hidden para que viaje con el submit del formulario.",
      },
    ],
    paragraphs: [
      "Aquí usas client:load porque la interacción debe estar disponible nada más entrar en la página de contacto.",
    ],
  },
  {
    title: "10. Dónde tocar según lo que quieras cambiar",
    bullets: [
      "Cambiar copy de inicio: HomeHeroSection.astro, HomeProcessSection.astro, HomeTestimonialsSection.astro.",
      "Cambiar estructura visual global: BaseSiteLayout.astro y base-theme.css.",
      "Cambiar navegación o enlaces globales: SiteHeader.astro y SiteFooter.astro.",
      "Cambiar servicios (bloques y contenido): ServicesBentoSections.astro.",
      "Cambiar comportamiento interactivo de cards: ServiceCardsBentoIsland.vue.",
      "Cambiar selector de horario: ContactScheduleSelectorIsland.vue.",
    ],
  },
  {
    title: "11. Conceptos clave de Astro, Tailwind y Vue en este proyecto",
    bullets: [
      "Astro te da páginas rápidas porque lo estático se renderiza sin enviar JS innecesario.",
      "Tailwind te permite construir UI consistente sin CSS tradicional por componente.",
      "Vue se usa como isla solo donde hay estado/interacción real en cliente.",
      "La combinación ideal: Astro para estructura, Tailwind para diseño, Vue para interactividad puntual.",
    ],
  },
  {
    title: "12. Siguiente nivel recomendado",
    bullets: [
      "Añadir TypeScript estricto en componentes Vue para reforzar tipos de props y eventos.",
      "Separar datos de servicios/testimonios en archivos data/ para escalabilidad.",
      "Añadir pruebas E2E básicas (por ejemplo navegación y selector de horario).",
      "Introducir validación del formulario de contacto y envío real a backend/API.",
    ],
    paragraphs: [
      "Con esto ya tienes una base profesional: estructura clara, diseño consistente y uso correcto de islas interactivas.",
    ],
  },
];

const markdownLines = [];
markdownLines.push("# Guía de Arquitectura del Proyecto (Astro + Tailwind + Vue)");
markdownLines.push("");
markdownLines.push(`Fecha de generación: ${projectDate}`);
markdownLines.push("");

for (const section of sections) {
  markdownLines.push(`## ${section.title}`);
  markdownLines.push("");
  if (section.paragraphs) {
    for (const paragraph of section.paragraphs) {
      markdownLines.push(paragraph);
      markdownLines.push("");
    }
  }
  if (section.bullets) {
    for (const bullet of section.bullets) {
      markdownLines.push(`- ${bullet}`);
    }
    markdownLines.push("");
  }
  if (section.files) {
    for (const fileInfo of section.files) {
      markdownLines.push(`### \`${fileInfo.path}\``);
      markdownLines.push("");
      markdownLines.push(`- **Qué hace:** ${fileInfo.purpose}`);
      markdownLines.push(`- **Cómo funciona:** ${fileInfo.howItWorks}`);
      markdownLines.push("");
    }
  }
}

fs.writeFileSync(markdownOutputPath, markdownLines.join("\n"), "utf8");

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 52, bottom: 52, left: 52, right: 52 },
  info: {
    Title: "Guía Astro Tailwind Vue - Orbit Web Studio",
    Author: "Codex",
    Subject: "Documentación del proyecto",
    Keywords: "Astro, Tailwind, Vue, islas interactivas, documentación",
  },
});

doc.pipe(fs.createWriteStream(pdfOutputPath));

const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const bottomLimit = () => doc.page.height - doc.page.margins.bottom;

const ensureSpace = (heightNeeded = 70) => {
  if (doc.y + heightNeeded > bottomLimit()) {
    doc.addPage();
  }
};

const addMainTitle = (title) => {
  ensureSpace(120);
  doc.font("Helvetica-Bold").fontSize(24).fillColor("#0f172a").text(title, {
    width: contentWidth,
    align: "left",
  });
  doc.moveDown(0.5);
};

const addSubText = (text, size = 11, color = "#334155") => {
  ensureSpace(50);
  doc.font("Helvetica").fontSize(size).fillColor(color).text(text, {
    width: contentWidth,
    align: "left",
    lineGap: 2,
  });
  doc.moveDown(0.45);
};

const addSectionTitle = (title) => {
  ensureSpace(70);
  doc.moveDown(0.25);
  doc.font("Helvetica-Bold").fontSize(15).fillColor("#0f172a").text(title, {
    width: contentWidth,
    align: "left",
  });
  doc.moveDown(0.25);
};

const addBullet = (text) => {
  ensureSpace(40);
  doc.font("Helvetica").fontSize(11).fillColor("#1e293b").text(`• ${text}`, {
    width: contentWidth,
    indent: 8,
    lineGap: 2,
  });
  doc.moveDown(0.2);
};

const addFileBlock = (fileInfo) => {
  ensureSpace(95);
  doc.font("Courier-Bold").fontSize(10).fillColor("#0369a1").text(fileInfo.path, {
    width: contentWidth,
  });
  doc.moveDown(0.2);
  addSubText(`Qué hace: ${fileInfo.purpose}`, 10.5, "#334155");
  addSubText(`Cómo funciona: ${fileInfo.howItWorks}`, 10.5, "#334155");
};

addMainTitle("Guía de Arquitectura del Proyecto");
addSubText("Stack: Astro + Tailwind + Vue (Islas Interactivas)", 12, "#0f172a");
addSubText(`Fecha de generación: ${projectDate}`, 10.5, "#475569");
doc.moveDown(0.8);

for (const section of sections) {
  addSectionTitle(section.title);

  if (section.paragraphs) {
    for (const paragraph of section.paragraphs) {
      addSubText(paragraph, 11, "#334155");
    }
  }

  if (section.bullets) {
    for (const bullet of section.bullets) {
      addBullet(bullet);
    }
    doc.moveDown(0.35);
  }

  if (section.files) {
    for (const fileInfo of section.files) {
      addFileBlock(fileInfo);
      doc.moveDown(0.2);
    }
  }
}

doc.moveDown(1);
addSubText("Fin de la guía. Puedes usar el .md generado para ampliarla fácilmente.", 10, "#64748b");

doc.end();

console.log(`PDF generado en: ${pdfOutputPath}`);
console.log(`Markdown generado en: ${markdownOutputPath}`);
