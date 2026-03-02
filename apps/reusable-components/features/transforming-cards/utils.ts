export const generateCode = (width: number, height: number): string => {
  const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const header = [
    '// compiled preview • scanner demo',
    '/* generated for visual effect – not executed */',
    'const SCAN_WIDTH = 8;',
    'const FADE_ZONE = 35;',
    'const MAX_PARTICLES = 2500;',
    'const TRANSITION = 0.05;',
  ];

  const helpers = [
    'function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }',
    'function lerp(a, b, t) { return a + (b - a) * t; }',
    'const now = () => performance.now();',
    'function rng(min, max) { return Math.random() * (max - min) + min; }',
  ];

  const library: string[] = [];
  header.forEach(l => library.push(l));
  helpers.forEach(l => library.push(l));

  for (let i = 0; i < 40; i++) {
    const n1 = randInt(1, 9);
    const n2 = randInt(10, 99);
    library.push(`const v${i} = (${n1} + ${n2}) * 0.${randInt(1, 9)};`);
  }

  let flow = library.join(' ').replace(/\s+/g, ' ').trim();
  const totalChars = width * height;

  while (flow.length < totalChars + width) {
    const extra = library[randInt(0, library.length - 1)]
      .replace(/\s+/g, ' ')
      .trim();
    flow += ' ' + extra;
  }

  let out = '';
  let offset = 0;
  for (let row = 0; row < height; row++) {
    let line = flow.slice(offset, offset + width);
    if (line.length < width) line = line + ' '.repeat(width - line.length);
    out += line + (row < height - 1 ? '\n' : '');
    offset += width;
  }

  return out;
};

// Create ASCII update interval (should only be called on client side)
export const createAsciiUpdateInterval = () => {
  return setInterval(() => {
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.ascii-content').forEach(content => {
        if (Math.random() < 0.15) {
          content.textContent = generateCode(66, 19);
        }
      });
    }
  }, 200);
};
