import { useEffect, useMemo, useRef, useState } from "react";
import { me, skills, experience, projects, certs, orgs } from "./data";
import DitherVeil from "./bits/DitherVeil";
import ScrollExpand from "./bits/ScrollExpand";
import ScrollFloat from "./bits/ScrollFloat";
import OrbitImages from "./bits/OrbitImages";
import ReachForStars from "./bits/ReachForStars";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TargetCursor from "./bits/TargetCursor";
import AutoScroll from "./bits/AutoScroll";
import CircularGallery from "./bits/CircularGallery";
import LightRays from "./bits/LightRays";

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
    // the phone URL bar showing/hiding must not re-lay out pins mid-scroll
    ScrollTrigger.config({ ignoreMobileResize: true });
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

// About is an expand animation: its link scrolls to where the expand ends, so the whole thing plays on the way
const ABOUT_SCROLL = 0.7;
function toAboutEnd(e) {
  if (!e.currentTarget.hash.endsWith("about")) return;
  e.preventDefault();
  const top = document.getElementById("about").getBoundingClientRect().top + scrollY;
  // hand-rolled: native smooth scroll has no duration setting; this takes 0.5s, eased in-out
  document.documentElement.dataset.jump = 1; // ScrollExpand skips its easing, so the content lands with the scroll
  const from = scrollY, to = top + innerHeight * ABOUT_SCROLL, t0 = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - t0) / 500);
    scrollTo({ top: from + (to - from) * (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2), behavior: "instant" });
    if (t < 1) requestAnimationFrame(step);
    else delete document.documentElement.dataset.jump;
  };
  requestAnimationFrame(step);
}

// Cursor-tracked chrome sheen on a card, via CSS vars.
// touch screens: off, a tap shouldn't tilt the card and it saves low-end phones the work
const touch = matchMedia("(hover: none)").matches;
function sheen(e) {
  if (touch) return;
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

// phones: a top bar that hides on scroll down, and a burger that slides in the menu
function MobileBar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      setHidden(scrollY > last && scrollY > 60);
      last = scrollY;
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("keydown", onKey);
    return () => (removeEventListener("scroll", onScroll), removeEventListener("keydown", onKey));
  }, []);
  const close = () => setOpen(false);

  return (
    <>
      <header className={"mbar" + (hidden && !open ? " up" : "")}>
        <a href="#home" className="mbar-name" onClick={close} aria-label="Blũ Dennis, back to top"><img src="/logo.svg" alt="" width="38" height="38" /></a>
        <button className={"burger" + (open ? " x" : "")} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </header>
      <div className={"mmenu-veil" + (open ? " open" : "")} onClick={close} aria-hidden="true" />
      <aside className={"mmenu" + (open ? " open" : "")} inert={!open}>
        <nav aria-label="Sections">
          {SECTIONS.map(([id, numeral]) => (
            <a key={id} href={"#" + id} onClick={(e) => (close(), toAboutEnd(e))}>
              <span className="numeral">{numeral}</span> {id}
            </a>
          ))}
        </nav>
        <a className="btn btn-ghost" href="/Blu_Dennis_CV.pdf" download onClick={close}>Download CV</a>
      </aside>
    </>
  );
}

// phones get static sections: no pinned scroll effects
const PHONE = matchMedia("(max-width: 899px)").matches;

// back-to-top fill: share of the page scrolled
addEventListener("scroll", () => document.documentElement.style.setProperty("--page", scrollY / (document.documentElement.scrollHeight - innerHeight || 1)), { passive: true });

export default function App() {
  useScrollTriggerRefresh();
  const navRef = useActiveSection();
  const finePointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine) and (hover: hover) and (min-width: 900px)").matches;
  const [heroIn, setHeroIn] = useState(false);
  // Safari has no view timelines: drive the experience rail's fill from ScrollTrigger instead
  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return;
    const el = document.querySelector(".timeline");
    const st = ScrollTrigger.create({ trigger: el, start: "top center", end: "bottom center", onUpdate: ({ progress }) => el.style.setProperty("--fill", progress) });
    return () => st.kill();
  }, []);

  return (
    <>
      {finePointer && <TargetCursor spinDuration={2.4} hideDefaultCursor parallaxOn cursorColor="#e9edf2" />}
      {finePointer && <AutoScroll />}
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <a href="#home" className="to-top cursor-target" aria-label="Back to top">
        {/* chevron outline; the inner stroke fills from the left tip, over the apex, to the right tip as the page scrolls */}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path className="tt-edge" d="M5 16 L12 8 L19 16" pathLength="1" />
          <path className="tt-hole" d="M5 16 L12 8 L19 16" pathLength="1" />
          <path className="tt-fill" d="M5 16 L12 8 L19 16" pathLength="1" />
        </svg>
      </a>
      <nav className="rail" ref={navRef} aria-label="Sections">
        {SECTIONS.map(([id, numeral]) => (
          <a key={id} href={"#" + id} className="cursor-target" onClick={toAboutEnd}>
            <span className="numeral">{numeral}</span>
            <span className="rail-label">{id}</span>
          </a>
        ))}
      </nav>
      <MobileBar />

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
              interactive={finePointer}
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
          {PHONE ? (
            <div className="about-plain">
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
            </div>
          ) : (
          <ScrollExpand
            src="/about-bg.webp"
            alt=""
            title="Who I am"
            scrollHint="Scroll"
            mediaZoom={1.2}
            startRadius={2}
            overlayScrim={0.9}
            startDim={0.6}
            scrollDistance={ABOUT_SCROLL}
            holdDistance={0.2}
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
          )}
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
                {PHONE ? (
                  <h3 className="scroll-float"><span className="scroll-float-text">{job.role}</span></h3>
                ) : (
                  <ScrollFloat scrollStart="top bottom-=8%" scrollEnd="top center" stagger={0.015}>
                    {job.role}
                  </ScrollFloat>
                )}
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
          <Projects />
        </section>

        <section id="certifications" className="wrap">
          <Heading numeral="VI" title="Certifications" />
          <p className="note cert-note" data-reveal>
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

// Pinned: the line fills with colour (the bulb turns into a rocket at the end), the gallery slides up
// over it, then each further screen of scroll steps one project; click one to open its details.
function Projects() {
  const root = useRef(null);
  const api = useRef(null);
  const items = useMemo(
    () =>
      // websites with a screenshot first; terminal (CS50) ones and placeholders after
      projects.toSorted((a, b) => web(b) - web(a)).map((p) => ({
        image: SHOTS[`/public/projects/${slugOf(p)}.webp`] || placeholder(p),
        text: p.title,
        description: p.blurb,
        extra: (
          <div className="pj-info">
            <p className="kind">{p.kind}</p>
            <h3 className="chrome-text">{p.title}</h3>
            <ul className="stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
            <a className="btn cursor-target" href={p.href} target="_blank" rel="noreferrer">View project</a>
          </div>
        ),
      })),
    []
  );
  useEffect(() => {
    const el = root.current;
    const n = projects.length;
    if (PHONE) return el.style.setProperty("--s", 1), el.style.setProperty("--e", 1), undefined;
    const STEP = 150; // px per project: one mouse-wheel notch in Chrome on Windows (ponytail: varies by device/zoom)
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: () => `+=${innerHeight * 0.7 + n * STEP}`,
      pin: true,
      onUpdate: (self) => {
        // intro: rays fade in, cards slide up; then one wheel notch per project
        const px = self.scroll() - self.start, intro = innerHeight * 0.7;
        const u = px < intro ? px / intro : 1 + (px - intro) / STEP;
        el.style.setProperty("--s", Math.min(u, 1));
        // glides with the scroll; a card opens only when clicked, and scrolling closes it
        api.current?.close();
        if (u >= 1) api.current?.seek(Math.min(u - 1, n - 1));
      },
    });
    // entering: the heading rides in at the section top and sticks once it reaches the centre
    const enter = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "top top", onUpdate: ({ progress }) => el.style.setProperty("--e", progress) });
    return () => (st.kill(), enter.kill());
  }, []);
  return (
    <div className="pj" ref={root}>
      {/* phones: rays drawn once and frozen */}
      <LightRays className="pj-rays" raysSpeed={PHONE ? 0 : 1} raysColor="#bfe3ff" followMouse={false} cursorShadow={false} clickPulse={false} />
      <Heading numeral="V" title="Projects" />
      <div className="pj-stage">
        <CircularGallery items={items} apiRef={api} wheel={false} side bend={2} itemSize={0.7} borderRadius={0} shadow={0} textColor="#e9edf2" font="bold 26px Cinzel" />
      </div>
    </div>
  );
}

// a screenshot at public/projects/<slug>.webp is picked up automatically; until then a drawn title card
const SHOTS = import.meta.glob("/public/projects/*.webp", { query: "?url", import: "default", eager: true });
const web = (p) => !/CS50/.test(p.kind) && !!SHOTS[`/public/projects/${slugOf(p)}.webp`];
const slugOf = (p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
function placeholder(p) {
  const c = document.createElement("canvas");
  c.width = 800;
  c.height = 1000;
  const g = c.getContext("2d");
  const bg = g.createLinearGradient(0, 0, 800, 1000);
  bg.addColorStop(0, "#14161d");
  bg.addColorStop(1, "#05050a");
  g.fillStyle = bg;
  g.fillRect(0, 0, 800, 1000);
  g.textAlign = "center";
  g.fillStyle = "#70747d";
  g.font = "28px Cinzel";
  g.fillText(p.kind.toUpperCase(), 400, 440);
  g.fillStyle = "#e9edf2";
  g.font = "bold 56px Cinzel";
  p.title.split(" ").reduce((lines, w) => {
    const l = lines.at(-1);
    if (l && (l + " " + w).length < 16) lines[lines.length - 1] = l + " " + w;
    else lines.push(w);
    return lines;
  }, []).forEach((l, i) => g.fillText(l, 400, 530 + i * 70));
  return c.toDataURL();
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
  // the section pins and scrolling steps through the deck; arrows, keys and clicks scroll to the card
  const wrap = useRef(null);
  const st = useRef(null);
  useEffect(() => {
    // phones: no pinning, the deck is just swiped
    if (matchMedia("(max-width: 899px)").matches) return;
    // the whole section pins: centred if it fits, top-aligned if its content still does;
    // on phones it doesn't, so just the deck pins centred
    const sec = wrap.current.closest("section");
    const contentH = wrap.current.getBoundingClientRect().bottom - sec.getBoundingClientRect().top;
    const fits = sec.offsetHeight <= innerHeight;
    st.current = ScrollTrigger.create({
      trigger: fits || contentH <= innerHeight ? sec : wrap.current,
      start: fits || contentH > innerHeight ? "center center" : "top top",
      end: `+=${n * 140}`,
      pin: true,
      onUpdate: (t) => setI(Math.round(t.progress * (n - 1))),
    });
    return () => st.current.kill();
  }, [n]);
  const seek = (k) => {
    const t = st.current;
    k = Math.max(0, Math.min(n - 1, k));
    if (!t) return setI(k);
    window.scrollTo({ top: t.start + (k / (n - 1)) * (t.end - t.start), behavior: "smooth" });
  };
  const go = (d) => seek(i + d);
  return (
    <div className="deck-wrap" ref={wrap}>
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
              onClick={() => x0.current === null && (o ? seek(k) : open())}
            >
              <CertCard cert={c} />
            </div>
          );
        })}
      </div>
      <div className="deck-nav">
        <button className="cursor-target" onClick={() => go(-1)} aria-label="Previous certification">&larr;</button>
        <span>{String(i + 1).padStart(2, "0")} / {n}</span>
        <button className="cursor-target" onClick={() => go(1)} aria-label="Next certification">&rarr;</button>
      </div>
      {/* native dialog: Esc, focus trap and backdrop for free; click outside closes */}
      <dialog ref={dlg} className="cert-modal" onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        <p className="eyebrow">{c.org} · {c.date}{c.mark && ` · ${c.mark}`}</p>
        {c.img && <img className="cert-preview" src={c.img} alt={`${c.name} certificate`} loading="lazy" />}
        <h3>{c.name}</h3>
        <p>{c.about || "Details coming soon."}</p>
        <dl className="cert-creds">
          <div><dt>Issuer</dt><dd>{c.org}</dd></div>
          <div><dt>Issued</dt><dd>{c.date}</dd></div>
          {c.mark && <div><dt>Grade</dt><dd>{c.mark}</dd></div>}
          {credId(c.url) && <div><dt>Credential ID</dt><dd>{credId(c.url)}</dd></div>}
          {c.url && <div><dt>Verify at</dt><dd>{new URL(c.url).hostname.replace(/^www\./, "")}</dd></div>}
        </dl>
        <div className="cert-modal-actions">
          {c.url && <a className="btn cursor-target" href={c.url} target="_blank" rel="noreferrer">Verify in new tab &#8599;</a>}
          <button className="btn cursor-target" onClick={() => dlg.current.close()}>Close</button>
        </div>
      </dialog>
    </div>
  );
}

// the longest id-looking segment of the certificate link; LinkedIn's media ids aren't credentials
const credId = (url) =>
  url && !url.includes("linkedin.com") && new URL(url).pathname.split("/").filter((p) => p.length >= 10 && /\d/.test(p)).sort((a, b) => b.length - a.length)[0];

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
          <li key={s.group} className={"cursor-target" + (i === open ? " open" : "")} data-reveal>
            <button
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
