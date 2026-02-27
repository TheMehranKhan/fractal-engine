/**
 * Fractal Engine - Mandelbrot & Julia Set Renderer
 * Interactive fractal explorer with zoom and multiple Julia set variations
 */

export interface FractalConfig {
  maxIterations: number;
  escapeRadius: number;
  colorScheme: 'fire' | 'rainbow' | 'grayscale' | 'ocean' | 'sunset';
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface JuliaPreset {
  name: string;
  c: Point;
  description: string;
}

export const JULIA_PRESETS: JuliaPreset[] = [
  { name: 'Dendrite', c: { x: -0.7, y: 0.27015 }, description: 'Fern-like structure' },
  { name: 'Dragon', c: { x: -0.8, y: 0.156 }, description: 'Dragon curve' },
  { name: 'Swirl', c: { x: 0.285, y: 0.01 }, description: 'Swirling pattern' },
  { name: 'Spiral', c: { x: -0.4, y: 0.6 }, description: 'Spiral arms' },
  { name: 'Nebula', c: { x: -0.835, y: -0.2321 }, description: 'Cosmicnebula' },
  { name: 'Burning Ship', c: { x: -0.4, y: 0.4 }, description: 'Ship silhouette' },
  { name: 'Blob', c: { x: 0, y: 0 }, description: 'Circle' },
  { name: 'Cardioid', c: { x: 0.285, y: 0.535 }, description: 'Heart shape' },
];

const DEFAULT_CONFIG: FractalConfig = {
  maxIterations: 256,
  escapeRadius: 4,
  colorScheme: 'rainbow',
  offsetX: -0.5,
  offsetY: 0,
  zoom: 1,
};

export function mandelbrot(c: Point, config: Partial<FractalConfig> = {}): number {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let zr = 0, zi = 0;
  let iter = 0;
  
  while (zr * zr + zi * zi < cfg.escapeRadius && iter < cfg.maxIterations) {
    const temp = zr * zr - zi * zi + c.x;
    zi = 2 * zr * zi + c.y;
    zr = temp;
    iter++;
  }
  
  if (iter === cfg.maxIterations) return 1;
  
  const smooth = iter - Math.log2(Math.log2(zr * zr + zi * zi)) + 4;
  return smooth / cfg.maxIterations;
}

export function julia(z: Point, c: Point, config: Partial<FractalConfig> = {}): number {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let zr = z.x, zi = z.y;
  let iter = 0;
  
  while (zr * zr + zi * zi < cfg.escapeRadius && iter < cfg.maxIterations) {
    const temp = zr * zr - zi * zi + c.x;
    zi = 2 * zr * zi + c.y;
    zr = temp;
    iter++;
  }
  
  if (iter === cfg.maxIterations) return 1;
  
  const smooth = iter - Math.log2(Math.log2(zr * zr + zi * zi)) + 4;
  return smooth / cfg.maxIterations;
}

export function burningShip(c: Point, config: Partial<FractalConfig> = {}): number {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let zr = 0, zi = 0;
  let iter = 0;
  
  while (zr * zr + zi * zi < cfg.escapeRadius && iter < cfg.maxIterations) {
    const temp = zr * zr - zi * zi + c.x;
    zi = Math.abs(2 * zr * zi) + c.y;
    zr = Math.abs(temp);
    iter++;
  }
  
  if (iter === cfg.maxIterations) return 1;
  return iter / cfg.maxIterations;
}

export function getColor(t: number, scheme: FractalConfig['colorScheme']): [number, number, number] {
  if (t >= 1) return [0, 0, 0];
  
  switch (scheme) {
    case 'fire':
      return [Math.floor(255 * t), Math.floor(255 * t * t), 0];
    case 'rainbow':
      const hue = t * 360;
      return hslToRgb(hue / 360, 1, 0.5);
    case 'grayscale':
      const gray = Math.floor(255 * t);
      return [gray, gray, gray];
    case 'ocean':
      return [
        Math.floor(0 + 50 * t),
        Math.floor(50 * t + 100 * t * t),
        Math.floor(100 + 155 * t)
      ];
    case 'sunset':
      return [
        Math.floor(255 * Math.pow(t, 0.7)),
        Math.floor(100 * t),
        Math.floor(50 + 205 * (1 - t))
      ];
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

export function renderFractal(
  canvas: HTMLCanvasElement,
  type: 'mandelbrot' | 'julia' | 'burningShip',
  config: Partial<FractalConfig> = {},
  juliaC?: Point
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const scale = 3 / cfg.zoom;
  const xMin = cfg.offsetX - scale / 2;
  const xMax = cfg.offsetX + scale / 2;
  const yMin = cfg.offsetY - (scale * height / width) / 2;
  const yMax = cfg.offsetY + (scale * height / width) / 2;
  
  const xScale = (xMax - xMin) / width;
  const yScale = (yMax - yMin) / height;
  
  const JuliaC = juliaC || { x: -0.7, y: 0.27015 };
  
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x = xMin + px * xScale;
      const y = yMin + py * yScale;
      
      let t: number;
      switch (type) {
        case 'mandelbrot':
          t = mandelbrot({ x, y }, cfg);
          break;
        case 'burningShip':
          t = burningShip({ x, y }, cfg);
          break;
        default:
          t = julia({ x, y }, JuliaC, cfg);
      }
      
      const [r, g, b] = getColor(t, cfg.colorScheme);
      const idx = (py * width + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}
