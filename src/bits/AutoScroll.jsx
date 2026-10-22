import { useEffect } from "react";

// Middle-click autoscroll in the site's style. The browser's own shows an OS cursor no CSS can hide.
// Click to start, move away from the click point to scroll, any click / key / wheel stops it.
// Hold-and-drag works too: letting go after moving stops it, like Chrome.
// TargetCursor draws it: anchored at the click point, one chevron stretched to the mouse (autoscroll:* events).
export default function AutoScroll() {
  useEffect(() => {
    let raf = 0, y0 = 0, y = 0, moved = false, on = false;
    const stop = () => {
      on = false;
      cancelAnimationFrame(raf);
      dispatchEvent(new Event("autoscroll:stop"));
    };
    const tick = () => {
      const d = y - y0;
      // 12px dead zone round the click point, then speed grows with distance
      if (Math.abs(d) > 12) scrollBy({ top: (d - Math.sign(d) * 12) / 8, behavior: "instant" });
      raf = requestAnimationFrame(tick);
    };
    const down = (e) => {
      if (on) return e.preventDefault(), stop();
      // middle-click on a link still opens it in a new tab
      if (e.button !== 1 || e.target.closest("a, input, textarea")) return;
      e.preventDefault();
      on = true;
      moved = false;
      y0 = y = e.clientY;
      dispatchEvent(new Event("autoscroll:start"));
      raf = requestAnimationFrame(tick);
    };
    const move = (e) => {
      y = e.clientY;
      if (on) dispatchEvent(new CustomEvent("autoscroll:move", { detail: y - y0 }));
      if (Math.abs(y - y0) > 12) moved = true;
    };
    const up = (e) => on && e.button === 1 && moved && stop();
    const end = () => on && stop();
    addEventListener("mousedown", down);
    addEventListener("mousemove", move);
    addEventListener("mouseup", up);
    addEventListener("keydown", end);
    addEventListener("wheel", end, { passive: true });
    addEventListener("blur", end);
    return () => {
      if (on) stop();
      removeEventListener("mousedown", down);
      removeEventListener("mousemove", move);
      removeEventListener("mouseup", up);
      removeEventListener("keydown", end);
      removeEventListener("wheel", end);
      removeEventListener("blur", end);
    };
  }, []);

  return null;
}
