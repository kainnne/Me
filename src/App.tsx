import {
  ArrowDown,
  ArrowUpRight,
  AtSign,
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
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { projects, type Project } from "./projects";

const EMAIL = "chaos60649@gmail.com";
const INSTAGRAM = "https://www.instagram.com/kaine_z_/";
const YOUTUBE_MUSIC = "https://music.youtube.com/channel/UCRk-djUeDdJ31-kcfAKKWwQ?si=engK-FXHeyWAduh6";
const KCIS_PORTAL = "https://kcis.kainnne.com";
const titleLetters = Array.from("Kainnne.");
const disciplines = ["Software", "Websites", "AI", "Music", "Machine Learning"];

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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = project.id === "lumareader" ? MonitorDown : project.id === "wikinb" ? BookOpenText : Workflow;
  const features = project.detail.replace(/。$/, "").split("、");
  const destination = project.href ?? project.source ?? "#top";

  const handleMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.a
      href={destination}
      target="_blank"
      rel="noreferrer"
      className={`project-card tone-${project.color}`}
      onPointerMove={handleMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={{ y: -8, scale: 1.012 }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: "spring", stiffness: 240, damping: 24, delay: index * 0.04 }}
      aria-label={`開啟 ${project.title}`}
    >
      <div className="project-spotlight" aria-hidden="true" />

      <div className="project-card-head">
        <span className="project-number">{project.number}</span>
        <motion.span className="project-icon" whileHover={{ rotate: -8, scale: 1.08 }}>
          <Icon size={22} strokeWidth={1.7} />
        </motion.span>
        <span className={`project-status status-${project.status}`}><i />{project.status === "live" ? "LIVE" : "SOURCE"}</span>
      </div>

      <div className="project-copy">
        <p className="project-eyebrow">{project.eyebrow}</p>
        <h2>{project.title}</h2>
        <p className="project-description">{project.description}</p>
      </div>

      <ul className="feature-list" aria-label={`${project.title} 功能`}>
        {features.map((feature, featureIndex) => (
          <motion.li key={feature} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
            <span>{String(featureIndex + 1).padStart(2, "0")}</span>{feature}
          </motion.li>
        ))}
      </ul>

      <span className="project-card-link">
        {project.status === "live" ? "Open" : "GitHub"}<ArrowUpRight size={16} />
      </span>
    </motion.a>
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
          <motion.a href={`mailto:${EMAIL}`} onClick={onClose} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
            <Mail size={18} /><span><strong>Gmail</strong><small>{EMAIL}</small></span><ArrowUpRight size={15} />
          </motion.a>
          <motion.a href={INSTAGRAM} target="_blank" rel="noreferrer" onClick={onClose} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
            <AtSign size={18} /><span><strong>Instagram</strong><small>@kaine_z_</small></span><ArrowUpRight size={15} />
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
            whileTap={{ scale: 0.97 }}
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

function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const contactControlRef = useRef<HTMLDivElement>(null);
  const [kcisOpen, setKcisOpen] = useState(false);
  const kcisControlRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<"dream" | "dusk">(() =>
    window.localStorage.getItem("kainnne-mood") === "dusk" ? "dusk" : "dream",
  );
  const scrollProgress = usePageEffects();

  useEffect(() => {
    document.documentElement.dataset.mood = mood;
    window.localStorage.setItem("kainnne-mood", mood);
  }, [mood]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContactOpen(false);
        setKcisOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
          <motion.a href="#projects" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>Projects</motion.a>
          <div className="kcis-control" ref={kcisControlRef}>
            <motion.button
              type="button"
              onClick={() => setKcisOpen((value) => !value)}
              aria-expanded={kcisOpen}
              aria-haspopup="dialog"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              KCIS
            </motion.button>
            <KcisPopover open={kcisOpen} onClose={() => setKcisOpen(false)} />
          </div>
          <div className="contact-control" ref={contactControlRef}>
            <motion.button
              type="button"
              onClick={() => setContactOpen((value) => !value)}
              aria-expanded={contactOpen}
              aria-haspopup="dialog"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
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
          aria-label={`切換至${mood === "dream" ? "深色" : "淺色"}模式`}
          whileHover={{ rotate: 8, scale: 1.06 }}
          whileTap={{ scale: 0.9 }}
        >
          {mood === "dream" ? <Moon size={17} /> : <Sun size={17} />}
        </motion.button>
      </header>

      <main id="main">
        <section id="top" className="hero section-shell">
          <div className="hero-center">
            <motion.p className="hero-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>KAINE ZHU / TAIWAN</motion.p>
            <motion.h1 className="hero-title" aria-label="Kainnne" initial="hidden" animate="visible" whileHover="hover">
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

            <motion.div className="hero-disciplines" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}>
              {disciplines.map((discipline, index) => (
                <motion.span
                  key={discipline}
                  className={`discipline discipline-${index + 1}`}
                  whileHover={{ y: -4, scale: 1.055 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 390, damping: 22 }}
                >
                  {discipline}
                </motion.span>
              ))}
            </motion.div>

            <motion.div className="hero-links" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
              <motion.a href="#projects" whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}><ArrowDown size={17} /><span>Projects</span></motion.a>
              <motion.a href="https://github.com/kainnne" target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}><Code2 size={17} /><span>GitHub</span><ArrowUpRight size={14} /></motion.a>
              <motion.a href={INSTAGRAM} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}><AtSign size={17} /><span>Instagram</span><ArrowUpRight size={14} /></motion.a>
              <motion.a href={YOUTUBE_MUSIC} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}><Music2 size={17} /><span>YT Music</span><ArrowUpRight size={14} /></motion.a>
            </motion.div>
          </div>

          <motion.nav className="project-dock" aria-label="專案快速連結" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78 }}>
            {projects.map((project) => (
              <motion.a key={project.id} href={`#project-${project.id}`} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
                <span>{project.number}</span><strong>{project.title}</strong><ArrowDown size={14} />
              </motion.a>
            ))}
          </motion.nav>
        </section>

        <section id="projects" className="projects section-shell" aria-label="Projects">
          <div className="project-grid">
            {projects.map((project, index) => (
              <div id={`project-${project.id}`} className="project-anchor" key={project.id}>
                <ProjectCard project={project} index={index} />
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
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </MotionConfig>
  );
}

export default App;
