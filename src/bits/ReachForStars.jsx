import { useEffect, useRef, useState } from "react";
import { me } from "../data";

// ponytail: same-origin serverless function (api/contact.js); point this elsewhere if the host differs
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact";

// Contact: the template clip plays when scrolled into view, the camera looks up into the sky,
// "Let's reach for the stars" lands centred, then rises to make room for the form.
export default function ReachForStars() {
  // reduced motion skips the scene and lands on the form
  const [phase, setPhase] = useState(() => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "form" : "idle")); // idle → play → up → title → form
  const stage = useRef(null);
  const video = useRef(null);

  useEffect(() => {
    if (phase === "form") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const v = video.current;
        // React never writes the muted attribute, so autoplay can be refused; start it by hand
        v.muted = true;
        v.play().then(() => setPhase("play"), () => setPhase("form"));
      },
      // fires once the section's top is in the upper quarter of the screen, so the clip is seen from its start
      { rootMargin: "0px 0px -75% 0px" }
    );
    // buffer the clip only when the section is ~2 screens away, so it doesn't fight the first load
    const near = new IntersectionObserver(([e]) => e.isIntersecting && (video.current.preload = "auto", near.disconnect()), { rootMargin: "200% 0px" });
    io.observe(stage.current);
    near.observe(stage.current);
    return () => (io.disconnect(), near.disconnect());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // timers, not animationend: a backgrounded tab freezes animations, and the form must still arrive
  useEffect(() => {
    const next = { up: ["title", 3000], title: ["form", 1600] }[phase];
    if (!next) return;
    const id = setTimeout(() => setPhase(next[0]), next[1]);
    return () => clearTimeout(id);
  }, [phase]);

  // start looking up while the clip still moves, so it never freezes on a frame
  const lookUp = () => setPhase((p) => (p === "play" ? "up" : p));

  return (
    <div ref={stage} className={"stars-stage " + phase}>
      {/* a box around the camera: the clip is the front wall, the sky its open ceiling */}
      <div className="stars-view" aria-hidden="true">
        <div className="stars-world">
          <div className="stars-wall" />
          <div className="stars-ceiling" />
          <video
            ref={video}
            src="/intro.mp4"
            muted
            playsInline
            preload="metadata"
            onTimeUpdate={(e) => e.currentTarget.currentTime > 3.1 && lookUp()}
            onEnded={lookUp}
            onError={() => setPhase("form")}
          />
        </div>
      </div>

      <div className="stars-copy">
        <h2 className="chrome-text">Let&rsquo;s reach for the stars</h2>
        <div className="stars-reveal" inert={phase !== "form"}>
          <div>
            <ContactForm />
            <ul className="socials">
              {me.links.map((l) => (
                <li key={l.label}>
                  <a className="cursor-target" href={l.href} target="_blank" rel="noreferrer" aria-label={l.label} title={l.label}>
                    <span style={{ "--icon": `url(${l.icon})` }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="wrap">
        <span>{me.name}</span>
        <span>MMXXVI</span>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle → sending → sent | error

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") return <p className="form-note">Message sent. I&rsquo;ll be in touch soon.</p>;

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        <span>Name</span>
        <input className="cursor-target" name="name" required maxLength={100} autoComplete="name" />
      </label>
      <label>
        <span>Email</span>
        <input className="cursor-target" name="email" type="email" required maxLength={200} autoComplete="email" />
      </label>
      <label className="wide">
        <span>Message</span>
        <textarea className="cursor-target" name="message" required maxLength={5000} rows={4} />
      </label>
      {/* honeypot: people never see it, bots fill it in */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button className="btn cursor-target" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send"}
      </button>
      {status === "error" && (
        <p className="form-note" role="alert">
          That didn&rsquo;t go through. Email me directly at <a href={"mailto:" + me.email}>{me.email}</a>.
        </p>
      )}
    </form>
  );
}
