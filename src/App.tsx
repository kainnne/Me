import {
  ArrowDown,
  ArrowUpRight,
  BookOpenText,
  Code2,
  Mail,
  MonitorDown,
  Moon,
  Music2,
  School,
  Sun,
  Workflow,
  X,
} from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { marked } from "marked";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import aboutEnglishMarkdown from "./content/about.en.md?raw";
import aboutChineseMarkdown from "./content/about.md?raw";
import { projects, type Project, type SiteLanguage } from "./projects";

const EMAIL = "chaos60649@gmail.com";
const KCIS_EMAIL = "kainnne@kcis.com.tw";
const INSTAGRAM = "https://www.instagram.com/kaine_z_/";
const YOUTUBE_MUSIC = "https://music.youtube.com/channel/UCRk-djUeDdJ31-kcfAKKWwQ?si=engK-FXHeyWAduh6";
const KCIS_PORTAL = "https://kcis.kainnne.com";
const WIKINB_GEMINI = "https://wikinb.kainnne.com/gemini/";
const titleLetters = Array.from("Kainnne.");
const disciplines = ["Apps Design", "UI / UX", "AI", "Music", "Machine Learning"];
const heroIntroduction: Record<SiteLanguage, string> = {
  en: "Digital products that save you time, automate repetitive work, and reduce mental load.",
  zh: "一些讓你更省時、自動化、同時節省你思考時間的數位產品",
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

const aboutContent: Record<SiteLanguage, AboutCategoryContent[]> = {
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

function GeminiPortal() {
  return (
    <a className="home-gemini-btn" href={WIKINB_GEMINI} aria-label="Open Kainnne x Gemini guest access">
      <span className="home-gemini-aura" aria-hidden="true" />
      <span className="home-gemini-orbit home-gemini-orbit-a" aria-hidden="true" />
      <span className="home-gemini-orbit home-gemini-orbit-b" aria-hidden="true" />
      <span className="home-gemini-copy">
        <span className="home-gemini-label">Kainnne x Gemini</span>
      </span>
      <span className="home-gemini-particles" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      <span className="home-gemini-light" aria-hidden="true" />
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
      : project.id === "studio"
        ? Music2
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
            <Mail size={18} /><span><strong>Gmail</strong><small>{EMAIL}</small></span><ArrowUpRight size={15} />
          </motion.a>
          <motion.a href={`mailto:${KCIS_EMAIL}`} onClick={onClose} whileHover={{ x: 4 }} whileTap={{ x: 4 }}>
            <Mail size={18} /><span><strong>KCIS Mail</strong><small>{KCIS_EMAIL}</small></span><ArrowUpRight size={15} />
          </motion.a>
          <motion.a href={INSTAGRAM} target="_blank" rel="noreferrer" onClick={onClose} whileHover={{ x: 4 }} whileTap={{ x: 4 }}>
            <InstagramMark /><span><strong>Instagram</strong><small>@kaine_z_</small></span><ArrowUpRight size={15} />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function KcisPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="kcis-popover"
          role="dialog"
          aria-label="KCIS 專區"
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 330, damping: 27 }}
        >
          <div className="kcis-popover-head">
            <span>KCIS</span>
            <button type="button" onClick={onClose} aria-label="關閉 KCIS 專區"><X size={16} /></button>
          </div>
          <motion.a
            href={KCIS_PORTAL}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            whileHover={{ x: 4 }}
            whileTap={{ x: 4 }}
          >
            <span className="kcis-popover-icon"><School size={20} /></span>
            <span><strong>康橋專區</strong><small>kcis.kainnne.com</small></span>
            <ArrowUpRight size={16} />
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

function AboutSection({ language }: { language: SiteLanguage }) {
  const [open, setOpen] = useState(false);
  const categories = aboutContent[language];
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
  const [projectsOpen, setProjectsOpen] = useState(false);
  const projectsControlRef = useRef<HTMLDivElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const contactControlRef = useRef<HTMLDivElement>(null);
  const [kcisOpen, setKcisOpen] = useState(false);
  const kcisControlRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<"dream" | "dusk">(() =>
    window.localStorage.getItem("kainnne-mood") === "dusk" ? "dusk" : "dream",
  );
  const [language, setLanguage] = useState<SiteLanguage>("en");
  const scrollProgress = usePageEffects();

  useEffect(() => {
    document.documentElement.dataset.mood = mood;
    window.localStorage.setItem("kainnne-mood", mood);
  }, [mood]);

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
  }, [language]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProjectsOpen(false);
        setContactOpen(false);
        setKcisOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!projectsOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (projectsControlRef.current && !projectsControlRef.current.contains(event.target as Node)) {
        setProjectsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [projectsOpen]);

  useEffect(() => {
    if (!contactOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (contactControlRef.current && !contactControlRef.current.contains(event.target as Node)) {
        setContactOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [contactOpen]);

  useEffect(() => {
    if (!kcisOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (kcisControlRef.current && !kcisControlRef.current.contains(event.target as Node)) {
        setKcisOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [kcisOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <DreamBackground mood={mood} />
      <a className="skip-link" href="#main">跳至主要內容</a>
      <motion.div className="scroll-progress" style={{ scaleX: scrollProgress }} aria-hidden="true" />
      <div className="page-grain" aria-hidden="true" />

      <header className="site-header">
        <nav className="site-nav" aria-label="主要導覽">
          <div className="projects-control" ref={projectsControlRef}>
            <motion.button
              className="nav-projects"
              type="button"
              onClick={() => setProjectsOpen((value) => !value)}
              aria-expanded={projectsOpen}
              aria-haspopup="dialog"
              whileHover={{ y: -2 }}
              whileTap={{ y: -2 }}
            >
              Products
            </motion.button>
            <ProjectsPopover open={projectsOpen} onClose={() => setProjectsOpen(false)} />
          </div>
          <div className="kcis-control" ref={kcisControlRef}>
            <motion.button
              className="kcis-nav-button"
              type="button"
              onClick={() => setKcisOpen((value) => !value)}
              aria-expanded={kcisOpen}
              aria-haspopup="dialog"
              whileHover={{ y: -2 }}
              whileTap={{ y: -2 }}
            >
              <span className="kcis-nav-label">KCIS</span>
            </motion.button>
            <KcisPopover open={kcisOpen} onClose={() => setKcisOpen(false)} />
          </div>
          <div className="contact-control" ref={contactControlRef}>
            <motion.button
              className="contact-nav-button"
              type="button"
              onClick={() => setContactOpen((value) => !value)}
              aria-expanded={contactOpen}
              aria-haspopup="dialog"
              whileHover={{ y: -2 }}
              whileTap={{ y: -2 }}
            >
              Contact
            </motion.button>
            <ContactPopover open={contactOpen} onClose={() => setContactOpen(false)} />
          </div>
        </nav>

        <motion.button
          className="icon-button"
          type="button"
          onClick={() => setMood(mood === "dream" ? "dusk" : "dream")}
          aria-label={
            language === "en"
              ? `Switch to ${mood === "dream" ? "dark" : "light"} mode`
              : `切換至${mood === "dream" ? "深色" : "淺色"}模式`
          }
          whileHover={{ rotate: 8, scale: 1.06 }}
          whileTap={{ rotate: 8, scale: 1.06 }}
        >
          {mood === "dream" ? <Moon size={17} /> : <Sun size={17} />}
        </motion.button>

        <div className="site-language-switch" role="group" aria-label="Site language">
          <button
            type="button"
            className={language === "en" ? "is-active" : ""}
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={language === "zh" ? "is-active" : ""}
            aria-pressed={language === "zh"}
            onClick={() => setLanguage("zh")}
          >
            中文
          </button>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero section-shell">
          <PerformanceGallery />
          <div className="hero-center">
            <motion.p
              className="hero-kicker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              lang={language === "en" ? "en" : "zh-Hant"}
            >
              {heroIntroduction[language]}
            </motion.p>
            <div className="hero-title-interaction">
              <motion.h1 className="hero-title" aria-label="Kainnne" initial="hidden" animate="visible" whileHover="hover" whileTap="hover">
                {titleLetters.map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    aria-hidden="true"
                    variants={{
                      hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: 0.05 + index * 0.055, type: "spring", stiffness: 190, damping: 20 } },
                      hover: { y: index % 2 === 0 ? -6 : 4, transition: { type: "spring", stiffness: 260, damping: 17 } },
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            <motion.div className="hero-disciplines" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}>
              {disciplines.map((discipline, index) => (
                <motion.span
                  key={discipline}
                  className={`discipline discipline-${index + 1}`}
                  whileHover={{ y: -4, scale: 1.055 }}
                  whileTap={{ y: -4, scale: 1.055 }}
                  transition={{ type: "spring", stiffness: 390, damping: 22 }}
                >
                  {discipline}
                </motion.span>
              ))}
            </motion.div>

            <motion.div className="hero-links" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
              <motion.a href="https://github.com/kainnne" target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ y: -4 }}><Code2 size={17} /><span>GitHub</span><ArrowUpRight size={14} /></motion.a>
              <motion.a href={INSTAGRAM} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ y: -4 }}><InstagramMark /><span>Instagram</span><ArrowUpRight size={14} /></motion.a>
              <motion.a className="music-link" href={YOUTUBE_MUSIC} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ y: -4 }}><Music2 size={17} /><span>YT Music</span><ArrowUpRight size={14} /></motion.a>
            </motion.div>
          </div>

          <AboutSection language={language} />
          <GeminiPortal />

          <motion.nav className="project-dock" aria-label="產品快速連結" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78 }}>
            {projects.map((project) => (
              <motion.a key={project.id} href={`#project-${project.id}`} whileHover={{ y: -4 }} whileTap={{ y: -4 }}>
                <span>{project.number}</span><strong>{project.title}</strong><ArrowDown size={14} />
              </motion.a>
            ))}
          </motion.nav>
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
        <span>Kainnne</span>
        <nav>
          <a href="https://github.com/kainnne" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href={YOUTUBE_MUSIC} target="_blank" rel="noreferrer">YT Music ↗</a>
          <a href="#top">Top ↑</a>
        </nav>
        <div className="footer-meta">
          <a
            className="view-counter"
            href="https://hits.sh/kainnne.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="查看 Kainnne 網站瀏覽數統計"
            title="總瀏覽數"
          >
            <img
              src="https://hits.sh/kainnne.com.svg?view=total&style=flat-square&label=Total%20views&color=ff8fab&labelColor=4a2038"
              alt="Kainnne 總瀏覽數"
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
