/**
 * Fractal Engine - Mandelbrot & Julia Set Renderer
 * Complex math for fractal generation
 */

export interface FractalConfig {
  maxIterations: number;
  escapeRadius: number;
  colorScheme: 'fire' | 'rainbow' | 'grayscale';
}

export interface Point {
  x: number;
  y: number;
}

const DEFAULT_CONFIG: FractalConfig = {
  maxIterations: 256,
  escapeRadius: 4,
  colorScheme: 'rainbow',
};

/**
 * Mandelbrot set iteration: z(n+1) = z(n)² + c
 * Where z starts at 0 and c is the point in the complex plane
 */
export function mandelbrot(c: Point, config = DEFAULT_CONFIG): number {
  let zr = 0, zi = 0;
  let iter = 0;
  
  while (zr * zr + zi * zi < config.escapeRadius && iter < config.maxIterations) {
    const temp = zr * zr - zi * zi + c.x;
    zi = 2 * zr * zi + c.y;
    zr = temp;
    iter++;
  }
  
  return iter / config.maxIterations;
}

/**
 * Julia set iteration: z(n+1) = z(n)² + c
 * Where c is a constant complex number and z starts at the point
 */
export function julia(z: Point, c: Point, config = DEFAULT_CONFIG): number {
  let zr = z.x, zi = z.y;
  let iter = 0;
  
  while (zr * zr + zi * zi < config.escapeRadius && iter < config.maxIterations) {
    const temp = zr * zr - zi * zi + c.x;
    zi = 2 * zr * zi + c.y;
    zr = temp;
    iter++;
  }
  
  return iter / config.maxIterations;
}

/**
 * Generate color based on iteration count
 */
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
  }
}

/**
 * Convert HSL to RGB
 */
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

/**
 * Render fractal to canvas
 */
export function renderFractal(
  canvas: HTMLCanvasElement,
  type: 'mandelbrot' | 'julia',
  config = DEFAULT_CONFIG,
  juliaC?: Point
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const xMin = -2, xMax = 1, yMin = -1.5, yMax = 1.5;
  const xScale = (xMax - xMin) / width;
  const yScale = (yMax - yMin) / height;
  
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x = xMin + px * xScale;
      const y = yMin + py * yScale;
      
      const t = type === 'mandelbrot' 
        ? mandelbrot({ x, y }, config)
        : julia({ x, y }, juliaC || { x: -0.7, y: 0.27015 }, config);
      
      const [r, g, b] = getColor(t, config.colorScheme);
      const idx = (py * width + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}
