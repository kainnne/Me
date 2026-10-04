import {
  ArrowDown,
  ArrowUpRight,
  BookOpenText,
  Code2,
  Grid2X2,
  Mail,
  MonitorDown,
  Music2,
  Workflow,
  X,
} from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { marked } from "marked";
import { useEffect, useLayoutEffect, useReducer, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import aboutEnglishMarkdown from "./content/about.en.md?raw";
import aboutChineseMarkdown from "./content/about.md?raw";
import { projects, type Project, type SiteLanguage } from "./projects";
import { navigationThemeReducer } from "./navigationTheme";
import { assistantUrl, initialLanguage } from "./assistantNavigation";

const EMAIL = "ryanzhu@kainnne.com";
const GMAIL = "kaine60649@gmail.com";
const INSTAGRAM = "https://www.instagram.com/kaine_z_/";
const YOUTUBE_MUSIC = "https://music.youtube.com/channel/UCRk-djUeDdJ31-kcfAKKWwQ?si=engK-FXHeyWAduh6";
const titleLetters = Array.from("Kaine.");
const disciplines = ["Knowledge", "AI", "Nuance", "Narrative", "Novelty", "Experience"];
const brandTagline: Record<SiteLanguage, string> = {
  zh: "最前沿的 AI 技術，最細膩的人文藝術團隊。",
  en: "A team with cutting-edge AI expertise and a deep appreciation for art and culture.",
};
const personalIntroduction: Record<SiteLanguage, string> = {
  en: "Kaine's personal website.",
  zh: "kaine 的個人網頁。",
};
const performancePhotos = [
  { src: "/photos/performance-01.jpg", shape: "wide", position: "62% 50%" },
  { src: "/photos/performance-02.jpg", shape: "square", position: "50% 42%" },
  { src: "/photos/performance-03.jpg", shape: "wide", position: "62% 70%" },
  { src: "/photos/performance-04.jpg", shape: "tall", position: "50% 44%" },
  { src: "/photos/performance-05.jpg", shape: "tall", position: "50% 46%" },
  { src: "/photos/performance-06.jpg", shape: "square", position: "52% 42%" },
  { src: "/photos/performance-07.jpg", shape: "tall", position: "50% 40%" },
  { src: "/photos/performance-08.jpg", shape: "square", position: "50% 42%" },
  { src: "/photos/performance-09.jpg", shape: "tall", position: "50% 36%" },
  { src: "/photos/performance-10.jpg", shape: "wide", position: "66% 48%" },
  { src: "/photos/performance-11.jpg", shape: "tall", position: "50% 44%" },
  { src: "/photos/performance-12.jpg", shape: "wide", position: "42% 50%" },
  { src: "/photos/performance-13.jpg", shape: "wide", position: "45% 50%" },
  { src: "/photos/performance-14.jpg", shape: "tall", position: "50% 42%" },
  { src: "/photos/performance-15.jpg", shape: "wide", position: "54% 48%" },
  { src: "/photos/performance-16.jpg", shape: "square", position: "55% 42%" },
];
type AboutQuestionContent = {
  question: string;
  html: string;
};

type AboutCategoryContent = {
  title: string;
  questions: AboutQuestionContent[];
};

const aboutTitle = "Q&A";
function parseAboutMarkdown(markdown: string, fallbackTitle: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .split(/(?=^#\s+)/m)
    .map((block) => {
      const lines = block.trim().split("\n");
      const hasCategoryHeading = lines[0]?.startsWith("# ");
      const title = hasCategoryHeading ? lines[0].replace(/^#\s+/, "").trim() : fallbackTitle;
      const content = (hasCategoryHeading ? lines.slice(1) : lines)
        .join("\n")
        .replace(/\n---\s*$/, "")
        .trim();
      const questions = content
        .split(/^##\s+/m)
        .slice(1)
        .map((section) => {
          const [question, ...answer] = section.trim().split("\n");
          const html = (marked.parse(answer.join("\n").trim(), { async: false }) as string)
            .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noreferrer"');
          return { question: question.trim(), html };
        })
        .filter(({ question }) => question.length > 0);

      return { title, questions };
    })
    .filter(({ questions }) => questions.length > 0);
}

const personalAboutContent: Record<SiteLanguage, AboutCategoryContent[]> = {
  en: parseAboutMarkdown(aboutEnglishMarkdown, "About Me"),
  zh: parseAboutMarkdown(aboutChineseMarkdown, "關於我"),
};


function InstagramMark() {
  return <span className="instagram-mark" aria-hidden="true" />;
}

function PhotoLoop({ photos, copy }: { photos: typeof performancePhotos; copy: string }) {
  return (
    <div className="photo-loop">
      {photos.map((photo, index) => (
        <div className={`photo-frame photo-${photo.shape}`} key={`${copy}-${photo.src}`}>
          <img
            src={photo.src}
            alt=""
            loading={index < 4 && copy === "a" ? "eager" : "lazy"}
            decoding="async"
            style={{ objectPosition: photo.position }}
          />
        </div>
      ))}
    </div>
  );
}

function PerformanceGallery() {
  const reversePhotos = [...performancePhotos.slice(8), ...performancePhotos.slice(0, 8)];

  return (
    <div className="performance-gallery" aria-hidden="true">
      <div className="photo-rail rail-left">
        <div className="photo-rail-track">
          <PhotoLoop photos={performancePhotos} copy="a" />
          <PhotoLoop photos={performancePhotos} copy="b" />
        </div>
      </div>
      <div className="photo-rail rail-right">
        <div className="photo-rail-track">
          <PhotoLoop photos={reversePhotos} copy="c" />
          <PhotoLoop photos={reversePhotos} copy="d" />
        </div>
      </div>
    </div>
  );
}

function GeminiPortal({ language }: { language: SiteLanguage }) {
  return (
    <a id="gemini" className="gemini-entry" href={assistantUrl(language)}>
      <span className="gemini-entry-wordmark">Get Started</span>
    </a>
  );
}

function DreamBackground({ mood }: { mood: "dream" | "dusk" }) {
  const reduceMotion = useReducedMotion();
  const colors = mood === "dream"
    ? ["#fffafc", "#ffd8e7", "#f6c8ff", "#cddcff", "#c9fff0", "#ffb7ce", "#ffffff"]
    : ["#160b19", "#3c1733", "#56284c", "#273450", "#21463f", "#742d58"];

  return (
    <div className="dream-background" aria-hidden="true">
      <MeshGradient
        colors={colors}
        distortion={0.82}
        swirl={0.42}
        grainMixer={0.08}
        grainOverlay={0.05}
        speed={reduceMotion ? 0 : 0.16}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="dream-background-wash" />
      <div className="dream-background-pointer" />
    </div>
  );
}

function usePageEffects() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.3 });

  useEffect(() => {
    const root = document.documentElement;
    const handlePointer = (event: PointerEvent) => {
      root.style.setProperty("--mouse-x", `${event.clientX}px`);
      root.style.setProperty("--mouse-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  return smoothProgress;
}

function ProjectCard({ project, index, language }: { project: Project; index: number; language: SiteLanguage }) {
  const Icon = project.id === "lumareader"
    ? MonitorDown
    : project.id === "wikinb"
      ? BookOpenText
      : project.id === "stories"
        ? BookOpenText
        : project.id === "ai-tools"
          ? Grid2X2
          : Workflow;
  const features = project.features.map((feature) => feature[language]);

  const handleMove = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      className={`project-card tone-${project.color}`}
      onPointerMove={handleMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={{ y: -8, scale: 1.012 }}
      whileTap={{ y: -8, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 240, damping: 24, delay: index * 0.04 }}
    >
      <div className="project-spotlight" aria-hidden="true" />

      <div className="project-card-head">
        <span className="project-number">{project.number}</span>
        <motion.span className="project-icon" whileHover={{ rotate: -8, scale: 1.08 }}>
          <Icon size={22} strokeWidth={1.7} />
        </motion.span>
      </div>

      <div className="project-copy">
        <p className="project-eyebrow">{project.eyebrow}</p>
        <h2>{project.title}</h2>
        <p className="project-description" lang={language === "en" ? "en" : "zh-Hant"}>
          {project.description[language]}
        </p>
      </div>

      <ul
        className="feature-list"
        aria-label={`${project.title} ${language === "en" ? "features" : "功能"}`}
        lang={language === "en" ? "en" : "zh-Hant"}
      >
        {features.map((feature, featureIndex) => (
          <motion.li key={feature} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
            <span>{String(featureIndex + 1).padStart(2, "0")}</span>{feature}
          </motion.li>
        ))}
      </ul>

      <div className="project-card-actions">
        {project.href && (
          <motion.a href={project.href} target="_blank" rel="noreferrer" whileHover={{ y: -3 }} whileTap={{ y: -3 }}>
            <span>Open</span><ArrowUpRight size={16} />
          </motion.a>
        )}
        {project.source && (
          <motion.a className="project-source-link" href={project.source} target="_blank" rel="noreferrer" whileHover={{ y: -3 }} whileTap={{ y: -3 }}>
            <Code2 size={16} /><span>GitHub</span>
          </motion.a>
        )}
      </div>
    </motion.article>
  );
}

function ContactPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="contact-popover"
          role="dialog"
          aria-label="Contact"
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 330, damping: 27 }}
        >
          <div className="contact-popover-head">
            <span>Contact</span>
            <button type="button" onClick={onClose} aria-label="關閉聯絡方式"><X size={16} /></button>
          </div>
          <motion.a href={`mailto:${EMAIL}`} onClick={onClose} whileHover={{ x: 4 }} whileTap={{ x: 4 }}>
            <Mail size={18} /><span><strong>EMAIL</strong><small>{EMAIL}</small></span><ArrowUpRight size={15} />
          </motion.a>
          <motion.a href={`mailto:${GMAIL}`} onClick={onClose} whileHover={{ x: 4 }} whileTap={{ x: 4 }}>
            <Mail size={18} /><span><strong>Gmail</strong><small>{GMAIL}</small></span><ArrowUpRight size={15} />
          </motion.a>
          <motion.a href={INSTAGRAM} target="_blank" rel="noreferrer" onClick={onClose} whileHover={{ x: 4 }} whileTap={{ x: 4 }}>
            <InstagramMark /><span><strong>Instagram</strong><small>@kaine_z_</small></span><ArrowUpRight size={15} />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectsPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="projects-popover"
          role="dialog"
          aria-label="Products"
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 330, damping: 27 }}
        >
          <div className="projects-popover-head">
            <span>Products</span>
            <button type="button" onClick={onClose} aria-label="關閉產品選單"><X size={16} /></button>
          </div>
          <nav aria-label="選擇產品">
            {projects.map((project) => (
              <motion.a
                href={`#project-${project.id}`}
                key={project.id}
                onClick={onClose}
                whileHover={{ x: 4 }}
                whileTap={{ x: 4 }}
              >
                <span>{project.number}</span>
                <strong>{project.title}</strong>
                <ArrowDown size={15} />
              </motion.a>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AboutQuestion({
  question,
  html,
  categoryIndex,
  index,
}: AboutQuestionContent & { categoryIndex: number; index: number }) {
  const [open, setOpen] = useState(false);
  const answerId = `about-answer-${categoryIndex}-${index}`;

  return (
    <article className={`about-question${open ? " is-open" : ""}`}>
      <motion.button
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen((value) => !value)}
        whileHover={{ x: 4 }}
        whileTap={{ x: 4 }}
      >
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong>{question}</strong>
        <ArrowDown size={18} />
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={answerId}
            className="about-answer-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about-answer" dangerouslySetInnerHTML={{ __html: html }} />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function AboutCategory({
  title,
  questions,
  index,
}: AboutCategoryContent & { index: number }) {
  const [open, setOpen] = useState(false);
  const categoryId = `about-category-${index}`;

  return (
    <article className={`about-category${open ? " is-open" : ""}`}>
      <motion.button
        className="about-category-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={categoryId}
        onClick={() => setOpen((value) => !value)}
        whileHover={{ x: 4 }}
        whileTap={{ x: 4 }}
      >
        <span className="about-category-index">{String(index + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
        <span className="about-category-count">{questions.length}</span>
        <ArrowDown size={19} />
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={categoryId}
            className="about-category-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about-questions">
              {questions.map((question, questionIndex) => (
                <AboutQuestion
                  key={question.question}
                  {...question}
                  categoryIndex={index}
                  index={questionIndex}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function AboutSection({
  language,
  content,
  defaultOpen = false,
}: {
  language: SiteLanguage;
  content: Record<SiteLanguage, AboutCategoryContent[]>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const categories = content[language];
  const questionCount = categories.reduce((total, category) => total + category.questions.length, 0);

  return (
    <section id="about" className="about section-shell" aria-labelledby="about-title">
      <div className={`about-panel${open ? " is-open" : ""}`}>
        <motion.button
          className="about-master-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="about-categories"
          onClick={() => setOpen((value) => !value)}
          whileHover={{ y: -3 }}
          whileTap={{ y: -3 }}
        >
          <h2 id="about-title">{aboutTitle}</h2>
          <span>{questionCount}</span>
          <ArrowDown size={24} />
        </motion.button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="about-categories"
              className="about-master-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="about-categories" lang={language === "en" ? "en" : "zh-Hant"}>
                {categories.map((category, index) => (
                  <AboutCategory key={category.title} {...category} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function App() {
  const isPersonalArchive = /^\/me(?:\/|$)/.test(window.location.pathname);
  const [{ menu, mood }, dispatchNavigation] = useReducer(navigationThemeReducer, {
    menu: null,
    mood: window.localStorage.getItem("kainnne-mood") === "dusk"
      || (!window.localStorage.getItem("kainnne-mood") && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dusk" : "dream",
  });
  const projectsOpen = menu === "products";
  const contactOpen = menu === "contact";
  const navigationRef = useRef<HTMLElement>(null);
  const closeMenu = () => dispatchNavigation({ type: "close-menu" });
  const [language, setLanguage] = useState<SiteLanguage>(() => {
    let saved = null;
    try { saved = window.localStorage.getItem("kainnne-language"); } catch { /* ignore */ }
    return initialLanguage(window.location.search, saved);
  });
  const scrollProgress = usePageEffects();

  useLayoutEffect(() => {
    document.documentElement.dataset.mood = mood;
    window.localStorage.setItem("kainnne-mood", mood);
  }, [mood]);

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
    try { window.localStorage.setItem("kainnne-language", language); } catch { /* ignore */ }
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", language === "en" ? "en" : "zh-TW");
      window.history.replaceState(window.history.state, "", url);
    }
  }, [language]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatchNavigation({ type: "close-menu" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (event: PointerEvent) => {
      // Both menu triggers share this boundary, so switching menus never closes first.
      if (navigationRef.current && !navigationRef.current.contains(event.target as Node)) {
        dispatchNavigation({ type: "close-menu" });
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menu]);

  return (
    <MotionConfig reducedMotion="user">
      <DreamBackground mood={mood} />
      <a className="skip-link" href="#main">跳至主要內容</a>
      <motion.div className="scroll-progress" style={{ scaleX: scrollProgress }} aria-hidden="true" />
      <div className="page-grain" aria-hidden="true" />

      <header className="site-header">
        {isPersonalArchive ? (
          <nav className="site-nav site-nav-personal" aria-label="主站導覽">
            <motion.a
              className="home-nav-link"
              href="/"
              whileHover={{ y: -2 }}
              whileTap={{ y: -2 }}
            >
              <span>kainnne.com</span>
              <ArrowUpRight size={15} />
            </motion.a>
          </nav>
        ) : (
          <nav className="site-nav" aria-label="主要導覽" ref={navigationRef}>
            <div className="projects-control">
              <motion.button
                className="nav-projects"
                type="button"
                onClick={() => dispatchNavigation({ type: "toggle-menu", menu: "products" })}
                aria-expanded={projectsOpen}
                aria-haspopup="dialog"
                whileHover={{ y: -2 }}
                whileTap={{ y: -2 }}
              >
                Products
              </motion.button>
              <ProjectsPopover open={projectsOpen} onClose={closeMenu} />
            </div>
            <div className="contact-control">
              <motion.button
                className="contact-nav-button"
                type="button"
                onClick={() => dispatchNavigation({ type: "toggle-menu", menu: "contact" })}
                aria-expanded={contactOpen}
                aria-haspopup="dialog"
                whileHover={{ y: -2 }}
                whileTap={{ y: -2 }}
              >
                Contact
              </motion.button>
              <ContactPopover open={contactOpen} onClose={closeMenu} />
            </div>
          </nav>
        )}

        <button
          type="button"
          className="site-language-switch"
          aria-label={language === "zh" ? "切換至英文" : "Switch to Chinese"}
          lang={language === "zh" ? "en" : "zh-Hant"}
          onClick={() => setLanguage((current) => current === "zh" ? "en" : "zh")}
        >
          {language === "zh" ? "EN" : "中文"}
        </button>
      </header>

      <main id="main">
        <section id="top" className="hero section-shell">
          {isPersonalArchive && <PerformanceGallery />}
          <div className="hero-center">
            {isPersonalArchive && <motion.p
              className="hero-kicker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              lang={language === "en" ? "en" : "zh-Hant"}
            >
              {personalIntroduction[language]}
            </motion.p>}
            <div className="hero-title-interaction">
              <motion.h1 className="hero-title" aria-label="Kain³e" initial="hidden" animate="visible" whileHover="hover" whileTap="hover">
                <button
                  className="brand-theme-trigger"
                  type="button"
                  aria-label={language === "en" ? "Kain³e — switch site colors" : "Kain³e：切換網站色彩"}
                  onClick={() => dispatchNavigation({ type: "toggle-mood" })}
                >
                {titleLetters.map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className={letter === "n" ? "brand-cubed-n" : undefined}
                    aria-hidden="true"
                    variants={{
                      hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: 0.05 + index * 0.055, type: "spring", stiffness: 190, damping: 20 } },
                      hover: { y: index % 2 === 0 ? -6 : 4, transition: { type: "spring", stiffness: 260, damping: 17 } },
                    }}
                  >
                    {letter}
                    {letter === "n" && <sup className="brand-exponent">3</sup>}
                  </motion.span>
                ))}
                </button>
              </motion.h1>
            </div>

            <motion.p
              className="hero-tagline"
              lang={language === "en" ? "en" : "zh-Hant"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
            >
              {brandTagline[language]}
            </motion.p>

            <motion.div className="hero-disciplines" aria-label="Knowledge, AI, Nuance, Narrative, Novelty, Experience" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}>
              {disciplines.map((discipline, index) => (
                <motion.span
                  key={discipline}
                  className={`discipline discipline-${index + 1}`}
                  whileHover={{ y: -4, scale: 1.055 }}
                  whileTap={{ y: -4, scale: 1.055 }}
                  transition={{ type: "spring", stiffness: 390, damping: 22 }}
                >
                  <span className="discipline-initial">{discipline === "AI" ? discipline : discipline[0]}</span>
                  {discipline !== "AI" && <span className="discipline-rest">{discipline.slice(1)}</span>}
                </motion.span>
              ))}
            </motion.div>

            {!isPersonalArchive && <GeminiPortal language={language} />}

            <motion.div className="hero-links" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
              <motion.a href="https://github.com/kainnne" target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ y: -4 }}><Code2 size={17} /><span>GitHub</span><ArrowUpRight size={14} /></motion.a>
              <motion.a href={INSTAGRAM} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ y: -4 }}><InstagramMark /><span>Instagram</span><ArrowUpRight size={14} /></motion.a>
              <motion.a className="music-link" href={YOUTUBE_MUSIC} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ y: -4 }}><Music2 size={17} /><span>YT Music</span><ArrowUpRight size={14} /></motion.a>
            </motion.div>
          </div>

          {isPersonalArchive ? (
            <>
              <AboutSection language={language} content={personalAboutContent} defaultOpen />
              <GeminiPortal language={language} />
            </>
          ) : null}

        </section>

        <section id="projects" className="projects section-shell" aria-label="Products">
          <div className="project-grid">
            {projects.map((project, index) => (
              <div id={`project-${project.id}`} className="project-anchor" key={project.id}>
                <ProjectCard project={project} index={index} language={language} />
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="site-footer section-shell">
        <span>Kain³e</span>
        <nav>
          <a href="https://github.com/kainnne" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href={YOUTUBE_MUSIC} target="_blank" rel="noreferrer">YT Music ↗</a>
          <a href="#top">Top ↑</a>
        </nav>
        <div className="footer-meta">
          {!isPersonalArchive && (
            <a className="creator-link" href="/me/" aria-label="About the producer">
              Producer ↗
            </a>
          )}
          <a
            className="view-counter"
            href="https://hits.sh/kainnne.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="查看 Kain³e 網站瀏覽數統計"
            title="總瀏覽數"
          >
            <img
              src="https://hits.sh/kainnne.com.svg?view=total&style=flat-square&label=Total%20views&color=ff8fab&labelColor=4a2038"
              alt="Kain³e 總瀏覽數"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </MotionConfig>
  );
}

export default App;
