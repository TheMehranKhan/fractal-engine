# Fractal Engine

A TypeScript library for rendering Mandelbrot and Julia sets with complex mathematical algorithms.

## Installation

```bash
npm install fractal-engine
```

## Usage

```typescript
import { renderFractal, mandelbrot, julia } from 'fractal-engine';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 600;

// Render Mandelbrot set
renderFractal(canvas, 'mandelbrot');

// Render Julia set with custom constant
renderFractal(canvas, 'julia', { colorScheme: 'fire' }, { x: -0.7, y: 0.27015 });
```

## Mathematical Background

### Mandelbrot Set

The Mandelbrot set is defined by the iterative formula:

$$z_{n+1} = z_n^2 + c$$

where:
- $z_0 = 0$
- $c$ is a complex number representing a point in the complex plane
- The set contains all points $c$ for which the sequence does not diverge to infinity

The escape condition is:

$$|z_n| = \sqrt{z_n \cdot \overline{z_n}} = \sqrt{z_r^2 + z_i^2} > 2$$

### Julia Set

The Julia set uses the same formula but with a fixed constant $c$:

$$z_{n+1} = z_n^2 + c$$

where $c$ determines the shape of the fractal. Common values:
- $c = -0.7 + 0.27015i$ (dendrite)
- $c = -0.8 + 0.156i$ (dragon)
- $c = 0.285 + 0.01i$ (swirl)

## API

### `mandelbrot(c, config?)`
Calculate Mandelbrot iteration value for a point.

### `julia(z, c, config?)`
Calculate Julia set iteration value.

### `burningShip(c, config?)`
Calculate Burning Ship fractal iteration value.

### `renderFractal(canvas, type, config?, juliaC?)`
Render fractal directly to an HTML canvas.

### Configuration

```typescript
{
  maxIterations: 256,    // Maximum iterations before escape
  escapeRadius: 4,      // Radius at which point is considered escaped
  colorScheme: 'rainbow' | 'fire' | 'grayscale' | 'ocean' | 'sunset',
  offsetX: -0.5,        // Center X coordinate
  offsetY: 0,           // Center Y coordinate
  zoom: 1               // Zoom level
}
```

### Julia Set Presets

```typescript
import { JULIA_PRESETS } from 'fractal-engine';
// [{ name: 'Dendrite', c: {x: -0.7, y: 0.27015}, ... }, ...]
```

## License

MIT
