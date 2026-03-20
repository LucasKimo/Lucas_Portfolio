import { useEffect, useRef } from "react";

interface WaveBackgroundProps {
  src: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  opacity?: number;
}

export default function WaveBackground({
  src,
  amplitude = 18,
  frequency = 0.012,
  speed = 0.6,
  opacity = 0.92,
}: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    imgRef.current = img;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");

    img.onload = () => {
      startRef.current = null;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };

    function draw(timestamp: number) {
      if (!canvas || !ctx || !offCtx) return;
      if (!startRef.current) startRef.current = timestamp;
      const t = ((timestamp - startRef.current) / 1000) * speed;

      const W = canvas.width;
      const H = canvas.height;

      if (offscreen.width !== W || offscreen.height !== H) {
        offscreen.width = W;
        offscreen.height = H;
      }

      const img = imgRef.current;
      if (!img) return;

      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const iw = img.naturalWidth * scale;
      const ih = img.naturalHeight * scale;
      const ix = (W - iw) / 2;
      const iy = (H - ih) / 2;
      offCtx.drawImage(img, ix, iy, iw, ih);

      const srcData = offCtx.getImageData(0, 0, W, H);
      const dstData = ctx.createImageData(W, H);

      const srcPixels = srcData.data;
      const dstPixels = dstData.data;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const dx =
            Math.sin(y * frequency + t * 1.1) * amplitude +
            Math.sin(y * frequency * 0.53 + x * frequency * 0.31 + t * 0.7) *
              (amplitude * 0.5);

          const dy =
            Math.cos(x * frequency + t * 0.9) * amplitude * 0.7 +
            Math.cos(x * frequency * 0.47 + y * frequency * 0.28 + t * 0.55) *
              (amplitude * 0.4);

          const sx = Math.min(Math.max(x + dx, 0), W - 1);
          const sy = Math.min(Math.max(y + dy, 0), H - 1);

          const x0 = Math.floor(sx);
          const y0 = Math.floor(sy);
          const x1 = Math.min(x0 + 1, W - 1);
          const y1 = Math.min(y0 + 1, H - 1);
          const tx = sx - x0;
          const ty = sy - y0;

          const i00 = (y0 * W + x0) * 4;
          const i10 = (y0 * W + x1) * 4;
          const i01 = (y1 * W + x0) * 4;
          const i11 = (y1 * W + x1) * 4;
          const di = (y * W + x) * 4;

          for (let c = 0; c < 3; c++) {
            dstPixels[di + c] = Math.round(
              srcPixels[i00 + c] * (1 - tx) * (1 - ty) +
                srcPixels[i10 + c] * tx * (1 - ty) +
                srcPixels[i01 + c] * (1 - tx) * ty +
                srcPixels[i11 + c] * tx * ty
            );
          }
          dstPixels[di + 3] = 255;
        }
      }

      ctx.putImageData(dstData, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [src, amplitude, frequency, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}