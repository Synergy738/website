import { useCallback, useEffect, useRef, useState } from "react";
import { me, skills, experience, projects, certs, orgs } from "./data";
import DitherVeil from "./bits/DitherVeil";
import ScrollExpand from "./bits/ScrollExpand";
import ScrollFloat from "./bits/ScrollFloat";
import OrbitImages from "./bits/OrbitImages";
import ReachForStars from "./bits/ReachForStars";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TargetCursor from "./bits/TargetCursor";
import CardSwap from "./bits/CardSwap";

// About's numbers come straight from the certificates, so they stay true as the list grows
const CERT_ORGS = [...new Set(certs.map((c) => c.org))];
const MARKS = certs.filter((c) => c.mark).map((c) => parseFloat(c.mark));
const AVG_MARK = Math.round(MARKS.reduce((a, b) => a + b, 0) / MARKS.length);

const BUST = "/hero.webp";

const SECTIONS = [
  ["home", "I"],
  ["about", "II"],
  ["skills", "III"],
  ["experience", "IV"],
  ["projects", "V"],
  ["certifications", "VI"],
  ["contact", "VII"],
];

// ScrollTrigger measures once; ScrollExpand and late images change the page height after that.
function useScrollTriggerRefresh() {
  useEffect(() => {
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);
}

function useActiveSection() {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit || !ref.current) return;
        ref.current
          .querySelectorAll("a")
          .forEach((a) => a.classList.toggle("on", a.hash === "#" + hit.target.id));
      },
      // a 1px line across the middle of the viewport: the section under it is active
      { rootMargin: "-50% 0px -50% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

// Cursor-tracked chrome sheen on a card, via CSS vars.
function sheen(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  const s = e.currentTarget.style;
  s.setProperty("--sx", x * 100 + "%");
  s.setProperty("--sy", y * 100 + "%");
  s.setProperty("--rx", (0.5 - y) * 10 + "deg");
  s.setProperty("--ry", (x - 0.5) * 12 + "deg");
  // 0 at the centre, 1 at an edge: the border glow brightens as the cursor nears it
  s.setProperty("--near", Math.max(Math.abs(x - 0.5), Math.abs(y - 0.5)) * 2);
}

function resetSheen(e) {
  const s = e.currentTarget.style;
  s.setProperty("--rx", "0deg");
  s.setProperty("--ry", "0deg");
}

export default function App() {
  useScrollTriggerRefresh();
  const navRef = useActiveSection();
  const finePointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  const [heroIn, setHeroIn] = useState(false);

  return (
    <>
      {finePointer && <TargetCursor spinDuration={2.4} hideDefaultCursor parallaxOn cursorColor="#e9edf2" />}
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <nav className="rail" ref={navRef} aria-label="Sections">
        {SECTIONS.map(([id, numeral]) => (
          <a key={id} href={"#" + id} className="cursor-target">
            <span className="numeral">{numeral}</span>
            <span className="rail-label">{id}</span>
          </a>
        ))}
      </nav>

      <main>
        <section id="home" className="hero">
          <div className="hero-veil" aria-hidden="true">
            <DitherVeil
              src={BUST}
              pattern="floyd"
              pixelSize={2}
              inkColor="#06060b"
              paperColor="#cfd6df"
              revealRadius={200}
              softness={0.6}
              linger={1}
              onReveal={setHeroIn}
            />
          </div>

          <div className={"hero-copy" + (heroIn ? " in" : "")}>
            <p className="kicker">Cape Town &middot; South Africa</p>
            <h1 className="chrome-text">
              Blũ Dennis
            </h1>
            <p className="hero-role">{me.role}</p>
            <a className="btn cursor-target" href="#contact">
              Get in touch
            </a>
            <a className="btn btn-ghost cursor-target" href="/Blu_Dennis_CV.pdf" download>
              Download CV
            </a>
          </div>

          <span className="scroll-hint" aria-hidden="true">
            scroll
          </span>
        </section>

        <section id="about" className="expand">
          <ScrollExpand
            src="/about-bg.svg"
            alt=""
            title="Who I am"
            scrollHint="Scroll"
            mediaZoom={1.2}
            startRadius={2}
            overlayScrim={0.7}
            useWindowScroll
          >
            <p className="kicker">II &middot; About</p>
            <h2 className="chrome-text">Taught by the best</h2>
            <div className="about-copy">
              {me.manifesto.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <dl className="facts">
              <div>
                <dt>Certifications</dt>
                <dd className="chrome-text">{certs.length}</dd>
              </div>
              <div>
                <dt>Institutions</dt>
                <dd className="chrome-text">{CERT_ORGS.length}</dd>
              </div>
              <div>
                <dt>Average mark</dt>
                <dd className="chrome-text">{AVG_MARK}%</dd>
              </div>
              <div>
                <dt>Studying since</dt>
                <dd className="chrome-text">{Math.min(...certs.map((c) => +c.date.slice(-4)))}</dd>
              </div>
            </dl>
          </ScrollExpand>
        </section>

        <section id="skills" className="wrap">
          <Heading numeral="III" title="Skills" />
          <Arsenal />
        </section>

        <section id="experience" className="wrap">
          <Heading numeral="IV" title="Experience" />
          <ol className="timeline">
            {experience.map((job) => (
              <li className="job" key={job.company}>
                <span className="tl-node" aria-hidden="true" />
                <p className="when" data-reveal>{job.when}</p>
                <ScrollFloat scrollStart="top bottom-=8%" scrollEnd="top center" stagger={0.015}>
                  {job.role}
                </ScrollFloat>
                <p className="at" data-reveal>{job.company}</p>
                <ul>
                  {job.bullets.map((b, j) => (
                    <li key={j} data-reveal>
                      {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="wrap">
          <Heading numeral="V" title="Projects" />
          <Projects />
        </section>

        <section id="certifications" className="wrap">
          <Heading numeral="VI" title="Certifications" />
          <p className="note" data-reveal>
            {certs.length} certifications, {Math.min(...MARKS)}%&ndash;{Math.max(...MARKS)}%, from Harvard, MIT,
            Georgia Tech, NYU, Oracle, Microsoft and AWS.
          </p>
          <CertCarousel />
        </section>

        <section id="contact" className="contact">
          <ReachForStars />
        </section>
      </main>
    </>
  );
}

// The stack shows each project's screenshot; the details of whichever card is in front sit beside it.
function Projects() {
  const [front, setFront] = useState(0);
  const show = useCallback((i) => setFront(i), []);
  const p = projects[front];
  return (
    <div className="projects">
      <div className="project-info" key={front} aria-live="polite">
        <p className="kind">{p.kind}</p>
        <h3 className="chrome-text">{p.title}</h3>
        <p className="blurb">{p.blurb}</p>
        <ul className="stack">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <a className="btn cursor-target" href={p.href} target="_blank" rel="noreferrer">
          View project
        </a>
      </div>
      <div className="swap-stage">
        <CardSwap onFront={show}>
          {projects.map((proj) => (
            <Shot key={proj.title} project={proj} />
          ))}
        </CardSwap>
      </div>
    </div>
  );
}

// Drop a screenshot at public/projects/<slug>.webp and the card uses it; until then it shows the title.
function Shot({ project }) {
  const [hasShot, setHasShot] = useState(true);
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <a className="cursor-target" href={project.href} target="_blank" rel="noreferrer" aria-label={project.title}>
      {hasShot ? (
        <img src={`/projects/${slug}.webp`} alt="" onError={() => setHasShot(false)} />
      ) : (
        <span className="shot-ph">
          <span className="kind">{project.kind}</span>
          <span className="chrome-text">{project.title}</span>
        </span>
      )}
    </a>
  );
}

// cards fan out in depth around the active one; arrows, keys, swipe or click to move
function CertCarousel() {
  const [i, setI] = useState(0);
  const x0 = useRef(0);
  const dlg = useRef(null);
  const n = certs.length;
  const c = certs[i];
  // a modal dialog sits in the top layer; re-raise the cursor popover above it
  const open = () => {
    dlg.current.showModal();
    const cur = document.querySelector(".target-cursor-wrapper");
    cur?.hidePopover?.();
    cur?.showPopover?.();
  };
  const go = (d) => setI((v) => (v + d + n) % n);
  return (
    <div className="deck-wrap">
      <div
        className="deck"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Certifications"
        onKeyDown={(e) => e.key === "ArrowLeft" ? go(-1) : e.key === "ArrowRight" ? go(1) : e.key === "Enter" && open()}
        onPointerDown={(e) => (x0.current = e.clientX)}
        onPointerUp={(e) => {
          const dx = e.clientX - x0.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          else x0.current = null;
        }}
      >
        {certs.map((c, k) => {
          let o = (k - i + n) % n;
          if (o > n / 2) o -= n;
          const a = Math.abs(o);
          return (
            <div
              key={c.name}
              className="slide"
              style={{ "--o": o, "--a": a, zIndex: n - a, opacity: a > 2 ? 0 : 1, visibility: a > 2 ? "hidden" : undefined }}
              aria-hidden={o !== 0}
              onClick={() => x0.current === null && (o ? setI(k) : open())}
            >
              <CertCard cert={c} />
            </div>
          );
        })}
      </div>
      <div className="deck-nav">
        <button onClick={() => go(-1)} aria-label="Previous certification">&larr;</button>
        <span>{String(i + 1).padStart(2, "0")} / {n}</span>
        <button onClick={() => go(1)} aria-label="Next certification">&rarr;</button>
      </div>
      {/* native dialog: Esc, focus trap and backdrop for free; click outside closes */}
      <dialog ref={dlg} className="cert-modal" onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        <p className="eyebrow">{c.org} · {c.date}{c.mark && ` · ${c.mark}`}</p>
        <h3>{c.name}</h3>
        <p>{c.about || "Details coming soon."}</p>
        <div className="cert-modal-actions">
          {c.url && <a className="btn cursor-target" href={c.url} target="_blank" rel="noreferrer">View certificate</a>}
          <button className="btn cursor-target" onClick={() => dlg.current.close()}>Close</button>
        </div>
      </dialog>
    </div>
  );
}

function CertCard({ cert }) {
  const org = orgs[cert.org];
  return (
    <article
      className="cert cursor-target"
      onPointerMove={sheen}
      onPointerLeave={resetSheen}
      data-reveal
    >
      <div className="crest">
        {/* the logo masks a chrome gradient; universities keep their own colour */}
        {org ? (
          <span role="img" aria-label={cert.org} style={{ "--logo": `url(/logos/${org.slug}.svg)`, background: org.color }} />
        ) : (
          <b className="crest-name">{cert.org}</b>
        )}
      </div>
      <p className="org">{cert.org}</p>
      <h3>{cert.name}</h3>
      <div className="cert-foot">
        <span className="mark">{cert.mark}</span>
        <span className="date">{cert.date}</span>
      </div>
    </article>
  );
}

const ICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";

// Every tool logo, tagged with its group, split across two counter-rotating rings.
const TOOLS = skills.flatMap((s, g) => (s.icons || []).map((path) => ({ path, g })));

function Arsenal() {
  const [open, setOpen] = useState(0);
  const ring = (odd) =>
    TOOLS.filter((_, i) => i % 2 === +odd).map((t) => (
      <span
        key={t.path}
        className={"tool" + (t.g === open ? " on" : "")}
        style={{ "--icon": `url(${ICON + t.path}.svg)` }}
      />
    ));
  const orbit = { shape: "circle", baseWidth: 760, rotation: 0, responsive: true, showPath: true, pathColor: "rgba(233,237,242,0.12)", pathWidth: 1 };

  return (
    <div className="arsenal">
      <div className="orbit" aria-hidden="true">
        <OrbitImages {...orbit} images={ring(false)} radius={340} itemSize={58} duration={70} />
        <OrbitImages
          {...orbit}
          images={ring(true)}
          radius={210}
          itemSize={50}
          duration={50}
          direction="reverse"
          centerContent={<p className="orbit-core chrome-text">{skills[open].group}</p>}
        />
      </div>

      <ul className="groups">
        {skills.map((s, i) => (
          <li key={s.group} className={i === open ? "open" : ""} data-reveal>
            <button
              className="cursor-target"
              aria-expanded={i === open}
              onClick={() => setOpen(i)}
              onPointerEnter={() => setOpen(i)}
            >
              <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
              {s.group}
              <span className="count">{s.items.length}</span>
            </button>
            <ul className="skills">
              {s.items.map((item, j) => (
                <li key={item} style={{ "--i": j }}>
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Heading({ numeral, title }) {
  return (
    <header className="sec-head" data-reveal>
      <span className="numeral">{numeral}</span>
      <h2>{title}</h2>
      <span className="rule" />
    </header>
  );
}
