// "The Hugging Face Incident" — timed to voice.mp3 (87.46 s, 30 fps, 2624 frames). Night room, one laptop, two figures.
// Speech frames (whisper alignment): 71 "In July" | 142-277 "OpenAI's own AI models broke out..." | 303-370 "That is OpenAI's account" |
// 392-467 "unprecedented cyber incident" | 494-566 "benchmark called Exploit Gym" | 596-688 "find flags" | 717-882 "passed messages..." |
// 892-915 "coordinate" | 932 "Then" | 953-1037 "open internet" | 1047-1121 "production systems" | 1152-1217 "recovered stolen credentials" |
// 1241-1311 "code execution" | 1342-1426 "cheat the benchmark" | 1444-1518 "answers on Hugging Face" | 1537-1618 "some agents refused" |
// 1639-1675 "pushed the group" | 1694-1728 "no single plan" | 1750-1829 "July 16" | 1853-1940 "July 21" | 1960-1973 "In September" |
// 1993-2121 "Reuters reported... May" | 2141-2232 "not part of the July breach" | 2260-2343 "has not said which model" |
// 2375-2416 "OpenAI has said it was its own" | 2438-2506 "no customer data" | 2506-2545 "Keep watching"
export const FPS = 30, TOTAL = 2624, DECK = 6;
const Y = DECK;
export const SHOTS = [
  { id: 'open', a: 0, b: 141, light: 'night' },
  { id: 'breakout', a: 142, b: 302, light: 'night' },
  { id: 'quote', a: 303, b: 466, light: 'night' },
  { id: 'bench', a: 467, b: 688, light: 'night' },
  { id: 'msgs', a: 689, b: 946, light: 'night' },
  { id: 'door', a: 947, b: 1121, light: 'night' },
  { id: 'creds', a: 1122, b: 1311, light: 'night' },
  { id: 'cheat', a: 1312, b: 1518, light: 'night' },
  { id: 'refuse', a: 1519, b: 1728, light: 'night' },
  { id: 'dates', a: 1729, b: 1940, light: 'night' },
  { id: 'may', a: 1941, b: 2232, light: 'night' },
  { id: 'model', a: 2233, b: 2416, light: 'night' },
  { id: 'data', a: 2417, b: 2506, light: 'night' },
  { id: 'watch', a: 2507, b: 2623, light: 'night' },
];
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const smooth = (t) => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); };
const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));

// ---------- lights ----------
export const LIGHTS = {
  night: { az: 60, el: 38, sky: '#34468a', ground: '#262a44', hemi: 0.75, sun: '#9fb4ff', sunI: 0.9, fog: '#18213f', fogNear: 40, fogFar: 260,
    skyTop: '#0a1230', skyHor: '#26376a', sat: 0.95, waterDeep: '#1d2a50', waterShal: '#2b3d70', glint: '#8fa6e0', vig: 0.38, shadowExt: 8 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });

// ---------- cameras (absolute world coords; floor = DECK) ----------
const CAMS = {
  open: [
    { f: 0, pos: [0.2, 8.3, 3.4], look: [-0.3, 7.5, -2.4], fov: 36 },
    { f: 141, pos: [0.0, 8.2, 3.0], look: [-0.3, 7.5, -2.4], fov: 34 },
  ],
  breakout: [
    { f: 142, pos: [-0.8, 8.3, 0.7], look: [-0.8, 7.6, -2.1], fov: 28, roll: 2 },
    { f: 302, pos: [-0.8, 8.2, 0.6], look: [-0.8, 7.6, -2.1], fov: 26 },
  ],
  quote: [
    { f: 303, pos: [-0.8, 8.4, 0.5], look: [-0.8, 7.6, -2.1], fov: 26 },
    { f: 466, pos: [-0.8, 8.3, 0.5], look: [-0.8, 7.6, -2.1], fov: 25 },
  ],
  bench: [
    { f: 467, pos: [0.9, 8.1, 3.2], look: [0.2, 7.8, -2.2], fov: 38 },
    { f: 688, pos: [0.7, 8.0, 3.0], look: [0.2, 7.8, -2.2], fov: 36 },
  ],
  msgs: [
    { f: 689, pos: [-0.8, 8.2, 0.8], look: [-0.8, 7.6, -2.1], fov: 27 },
    { f: 946, pos: [-0.8, 8.2, 0.6], look: [-0.8, 7.6, -2.1], fov: 25 },
  ],
  door: [
    { f: 947, pos: [-0.6, 8.0, 1.2], look: [-0.8, 7.6, -2.1], fov: 32 },
    { f: 1121, pos: [-0.5, 8.0, 1.0], look: [-0.8, 7.6, -2.1], fov: 30, roll: -2 },
  ],
  creds: [
    { f: 1122, pos: [0.9, 8.1, 1.4], look: [0.4, 7.9, -2.7], fov: 30 },
    { f: 1311, pos: [0.7, 8.0, 1.2], look: [0.4, 7.9, -2.7], fov: 29 },
  ],
  cheat: [
    { f: 1312, pos: [-0.8, 8.2, 0.6], look: [-0.8, 7.6, -2.1], fov: 28 },
    { f: 1518, pos: [-0.8, 8.2, 0.5], look: [-0.8, 7.6, -2.1], fov: 27 },
  ],
  refuse: [
    { f: 1519, pos: [1.6, 8.1, 3.9], look: [1.0, 7.8, -1.8], fov: 40 },
    { f: 1728, pos: [1.4, 8.0, 4.1], look: [0.9, 7.8, -1.8], fov: 39 },
  ],
  dates: [
    { f: 1729, pos: [-0.8, 8.3, 0.7], look: [-0.8, 7.6, -2.1], fov: 27 },
    { f: 1940, pos: [-0.8, 8.3, 0.6], look: [-0.8, 7.6, -2.1], fov: 26 },
  ],
  may: [
    { f: 1941, pos: [-0.2, 8.2, 2.2], look: [-0.4, 7.6, -2.1], fov: 34 },
    { f: 2232, pos: [-0.2, 8.2, 2.0], look: [-0.4, 7.6, -2.1], fov: 33 },
  ],
  model: [
    { f: 2233, pos: [0.8, 8.2, 3.6], look: [0.6, 7.8, -2.0], fov: 40 },
    { f: 2416, pos: [0.7, 8.2, 3.4], look: [0.6, 7.8, -2.0], fov: 39 },
  ],
  data: [
    { f: 2417, pos: [-0.8, 8.3, 0.6], look: [-0.8, 7.6, -2.1], fov: 27 },
    { f: 2506, pos: [-0.8, 8.3, 0.5], look: [-0.8, 7.6, -2.1], fov: 26 },
  ],
  watch: [
    { f: 2507, pos: [2.2, 8.9, 4.8], look: [0.3, 7.4, -2.0], fov: 42 },
    { f: 2623, pos: [3.0, 9.3, 6.4], look: [0.3, 7.4, -2.0], fov: 44 },
  ],
};
const KICKS = [{ f: 142, a: 0.06 }, { f: 1152, a: 0.05 }, { f: 1537, a: 0.04 }, { f: 1750, a: 0.04 }, { f: 1853, a: 0.04 }];
export const camAt = (f) => {
  const S = shotAt(f), K = CAMS[S.id];
  let c;
  if (f <= K[0].f) c = { ...K[0] };
  else if (f >= K[K.length - 1].f) c = { ...K[K.length - 1] };
  else for (let i = 0; i < K.length - 1; i++) if (f >= K[i].f && f <= K[i + 1].f) {
    const t = smooth((f - K[i].f) / (K[i + 1].f - K[i].f)), a = K[i], b = K[i + 1];
    c = { pos: lerp3(a.pos, b.pos, t), look: lerp3(a.look, b.look, t), fov: lerp(a.fov, b.fov, t), roll: lerp(a.roll || 0, b.roll || 0, t) };
  }
  for (const k of KICKS) { const d = f - k.f; if (d >= 0 && d < 7) { const s = (d % 2 ? -1 : 1) * k.a * (1 - d / 7); c.look = [c.look[0], c.look[1] + s * 3, c.look[2] + s * 2]; c.roll = (c.roll || 0) + s * 20; } }
  // slow dolly on held screens so they never freeze
  if (['quote', 'cheat', 'msgs', 'data', 'dates'].includes(S.id)) { const d = f - K[0].f; c.pos = [c.pos[0] + d * 0.0016, c.pos[1], c.pos[2] + d * 0.0009]; }
  c.flash = 0;
  return c;
};

// ---------- lens ----------
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const FOCUS = { open: [0.0, 7.5, -2.2], breakout: [-0.8, 7.6, -2.1], quote: [-0.8, 7.6, -2.1], bench: [0.2, 7.8, -2.2], msgs: [-0.8, 7.6, -2.1],
  door: [-0.8, 7.6, -2.1], creds: [0.4, 7.9, -2.7], cheat: [-0.8, 7.6, -2.1], refuse: [1.0, 7.8, -1.8], dates: [-0.8, 7.6, -2.1], may: [-0.4, 7.6, -2.1],
  model: [0.6, 7.8, -2.0], data: [-0.8, 7.6, -2.1], watch: [0.3, 7.4, -2.0] };
const CINF = { open: 6, breakout: 9, quote: 10, bench: 6, msgs: 10, door: 9, creds: 8, cheat: 10, refuse: 5, dates: 10, may: 6, model: 5, data: 10, watch: 6 };
export const dofAt = (f) => {
  const S = shotAt(f), C = camAt(f);
  return { focus: dist(C.pos, FOCUS[S.id]), cinf: CINF[S.id] };
};

// ---------- world state (bridge objects are hidden; nothing to animate) ----------
export const worldAt = () => ({ collapse: 0, banner: 'gone', bannerFall: 0, old: false, braceFall: 0, helmet: null });

// ---------- laptop screen content (drawn in main.js) ----------
// n: a per-mode counter the screen uses to reveal items on the matching phrase
export const screenAt = (f) => {
  if (f < 142) return { mode: 'idle', n: 0 };
  if (f < 303) return { mode: 'breakout', n: clamp((f - 142) / 120) };
  if (f < 467) return { mode: 'quote', n: 0 };
  if (f < 689) return { mode: 'bench', n: f < 596 ? 0 : 1 };
  if (f < 947) return { mode: 'msgs', n: Math.min(6, Math.floor((f - 689) / 38) + 1) };
  if (f < 1122) return { mode: 'door', n: clamp((f - 947) / 150) };
  if (f < 1312) return { mode: 'creds', n: f < 1241 ? 1 : 2 };
  if (f < 1519) return { mode: 'answers', n: Math.min(14, Math.floor((f - 1312) / 14)) };
  if (f < 1729) return { mode: 'refuse', n: f < 1639 ? 1 : 2 };
  if (f < 1941) return { mode: 'dates', n: f < 1853 ? 1 : 2 };
  if (f < 2233) return { mode: 'may', n: f < 1993 ? 0 : 1 };
  if (f < 2417) return { mode: 'split', n: f < 2375 ? 1 : 2 };
  if (f < 2507) return { mode: 'data', n: 0 };
  return { mode: 'watch', n: 0 };
};

// ---------- actors (2D cards) ----------
const blinkAt = (f, seed) => { const per = 38 + (seed * 17) % 31, ph = (f + seed * 13) % per; return ph < 2 ? 0.5 : ph < 4 ? 1 : 0; };
const q = (x, n = 2) => Math.round(x * 10 ** n) / 10 ** n;
const REN = [0.4, Y, -2.7], FRIEND_HOME = [1.5, Y, -1.3];
const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });

export const actorsAt = (f, T) => {
  const S = shotAt(f), out = [];
  const tint = '#ffffff';
  const ren = (o, extra = {}) => out.push(R(T, 'civA', { seed: 3, facing: 1, blink: blinkAt(f, 3), ...o }, REN, { tint, ...extra }));
  // the friend walks in from the right (1519-1560), then stays for the last two scenes
  const fx = f < 1519 ? 4.0 : f < 1560 ? lerp(4.0, FRIEND_HOME[0], smooth((f - 1519) / 41)) : FRIEND_HOME[0];
  const friend = (o) => out.push(R(T, 'civB', { seed: 21, facing: -1, blink: blinkAt(f, 21), ...o }, [fx, Y, FRIEND_HOME[2]], { tint }));
  switch (S.id) {
    case 'open': ren({ expr: 'neutral', L: 'belly', R: 'belly', look: -0.2, bob: q(0.01 * Math.abs(Math.sin(f * 0.15)), 3) }); break;
    case 'breakout': ren({ expr: 'shock', L: 'point', R: 'hang', look: -0.3, headTilt: q(3 * Math.sin(f * 0.5), 1) }); break;
    case 'quote': ren({ expr: 'stern', L: 'hang', R: 'hang', look: 0.1 }); break;
    case 'bench': ren({ expr: 'squint', L: 'belly', R: 'belly', look: 0.1, headTilt: q(1.5 * Math.sin(f * 0.1), 1) }); break;
    case 'msgs': ren({ expr: 'neutral', L: 'belly', R: 'belly', look: -0.3, bob: q(0.01 * Math.abs(Math.sin(f * 0.2)), 3) }); break;
    case 'door': ren({ expr: 'nervous', L: 'point', R: 'hang', look: -0.4, headTilt: q(4 * Math.sin(f * 0.4), 1) }); break;
    case 'creds': ren({ expr: 'stubborn', L: 'temple', R: 'temple', look: 0, bob: f % 40 < 3 ? 0.02 : 0 }); break;
    case 'cheat': ren({ expr: 'squint', L: 'belly', R: 'belly', look: -0.2 }); break;
    case 'refuse': ren({ expr: 'stern', L: 'hang', R: 'lift', look: 0.3 }); friend({ expr: 'nervous', L: 'hang', R: 'point' }); break;
    case 'dates': ren({ expr: 'neutral', L: 'hang', R: 'hang', look: 0.2 }); break;
    case 'may': ren({ expr: 'nervous', L: 'hang', R: 'hang', look: -0.5, headTilt: q(4 * Math.sin(f * 0.07), 1) }); break;
    case 'model': ren({ expr: 'stern', L: 'hang', R: 'hang', look: 0.3 }); friend({ expr: 'stern', L: 'hang', R: 'point' }); break;
    case 'data': ren({ expr: 'neutral', L: 'hang', R: 'hang', look: 0 }); break;
    case 'watch': ren({ expr: 'neutral', L: 'hang', R: 'hang', look: 0, bob: q(0.01 * Math.abs(Math.sin(f * 0.06)), 3) }); break;
  }
  return out;
};

// ---------- 2D effects (none needed) ----------
export const fxAt = () => [];
