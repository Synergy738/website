import { Children, useEffect, useRef } from "react";
import gsap from "gsap";

// Adapted from React Bits' CardSwap. The front card drops away on a timer and the rest step forward;
// clicking a card behind pulls it to the front, and clicking the front card lets its link through.
const slot = (i, dx, dy, n) => ({ x: i * dx, y: -i * dy, z: -i * dx * 1.5, zIndex: n - i });

export default function CardSwap({
  width = 480,
  height = 300,
  cardDistance = 40,
  verticalDistance = 45,
  delay = 5000,
  skewAmount = 5,
  onFront,
  apiRef,
  children,
}) {
  const cards = Children.toArray(children);
  const n = cards.length;
  const els = useRef([]);
  const order = useRef([...Array(n).keys()]);
  const toFront = useRef(() => {});
  const hold = useRef(false); // pointer over the stack: no auto swap under it

  useEffect(() => {
    // no auto swap on touch screens: each swap changes the page height, and iOS jumps when the pins re-measure
    const still = matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches;
    const at = (i) => slot(i, cardDistance, verticalDistance, n);
    order.current.forEach((idx, i) =>
      gsap.set(els.current[idx], { ...at(i), xPercent: -50, yPercent: -50, skewY: skewAmount, force3D: true })
    );

    let tl, timer;
    const ease = "elastic.out(0.6,0.9)";

    const swap = () => {
      if (hold.current) return;
      const [front, ...rest] = order.current;
      const el = els.current[front];
      order.current = [...rest, front];
      onFront?.(rest[0]);
      tl = gsap.timeline();
      tl.to(el, { y: "+=500", duration: 2, ease });
      tl.addLabel("promote", "-=1.8");
      rest.forEach((idx, i) => {
        tl.set(els.current[idx], { zIndex: at(i).zIndex }, "promote");
        const s = at(i);
        tl.to(els.current[idx], { x: s.x, y: s.y, z: s.z, duration: 2, ease }, `promote+=${i * 0.15}`);
      });
      const back = at(n - 1);
      tl.set(el, { zIndex: back.zIndex }, "promote+=0.1");
      tl.to(el, { x: back.x, y: back.y, z: back.z, duration: 2, ease }, "promote+=0.1");
    };

    const start = () => {
      clearInterval(timer);
      if (!still) timer = setInterval(swap, delay);
    };

    toFront.current = (idx) => {
      tl?.kill();
      const k = order.current.indexOf(idx);
      order.current = [...order.current.slice(k), ...order.current.slice(0, k)];
      onFront?.(idx);
      // z-order flips at once so the picked card rises over the rest on its way forward
      tl = gsap.timeline();
      order.current.forEach((c, i) => {
        const s = at(i);
        tl.set(els.current[c], { zIndex: s.zIndex }, 0);
        tl.to(els.current[c], { x: s.x, y: s.y, z: s.z, duration: still ? 0 : 0.9, ease: "power3.out" }, i * 0.05);
      });
      start();
    };

    // prev/next: pull the next or last card in the stack to the front
    if (apiRef) apiRef.current = (d) => toFront.current(order.current[d > 0 ? 1 : n - 1]);

    start();
    return () => {
      clearInterval(timer);
      tl?.kill();
    };
  }, [n, cardDistance, verticalDistance, delay, skewAmount, onFront, apiRef]);

  return (
    <div
      className="card-swap"
      style={{ width, height }}
      onPointerEnter={() => (hold.current = true)}
      onPointerLeave={() => (hold.current = false)}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          ref={(el) => (els.current[i] = el)}
          className="swap-card"
          style={{ width, height }}
          onClickCapture={(e) => {
            if (order.current[0] === i) return;
            e.preventDefault();
            toFront.current(i);
          }}
        >
          {card}
        </div>
      ))}
    </div>
  );
}
