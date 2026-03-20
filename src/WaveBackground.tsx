import { useEffect, useRef } from "react";

interface WaveBackgroundProps {
  src: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  opacity?: number;
  quality?: number;
  fps?: number;
}

const VERT = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_time;
  uniform float u_amplitude;
  uniform float u_frequency;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;

    float dx =
      sin(uv.y * u_frequency * 800.0 + u_time * 1.1) * u_amplitude +
      sin(uv.y * u_frequency * 420.0 + uv.x * u_frequency * 250.0 + u_time * 0.7) * (u_amplitude * 0.5);

    float dy =
      cos(uv.x * u_frequency * 800.0 + u_time * 0.9) * u_amplitude * 0.7 +
      cos(uv.x * u_frequency * 376.0 + uv.y * u_frequency * 224.0 + u_time * 0.55) * (u_amplitude * 0.4);

    uv.x += dx;
    uv.y += dy;

    uv = clamp(uv, 0.0, 1.0);
    gl_FragColor = texture2D(u_image, uv);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export default function WaveBackground({
  src,
  amplitude = 0.012,
  frequency = 0.012,
  speed = 0.6,
  opacity = 0.92,
  quality = 0.5,
  fps = 30,
}: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const glCtx: WebGLRenderingContext = gl;
    const renderScale = Math.min(Math.max(quality, 0.25), 1);
    const frameDuration = 1000 / Math.max(fps, 1);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, renderScale);
      canvasEl.width = Math.floor(window.innerWidth * dpr);
      canvasEl.height = Math.floor(window.innerHeight * dpr);
      glCtx.viewport(0, 0, canvasEl.width, canvasEl.height);
    }

    resize();
    window.addEventListener("resize", resize);

    const vert = compileShader(glCtx, glCtx.VERTEX_SHADER, VERT);
    const frag = compileShader(glCtx, glCtx.FRAGMENT_SHADER, FRAG);
    const prog = glCtx.createProgram()!;
    glCtx.attachShader(prog, vert);
    glCtx.attachShader(prog, frag);
    glCtx.linkProgram(prog);
    glCtx.useProgram(prog);

    const buf = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buf);
    glCtx.bufferData(
      glCtx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      glCtx.STATIC_DRAW
    );
    const aPos = glCtx.getAttribLocation(prog, "a_position");
    glCtx.enableVertexAttribArray(aPos);
    glCtx.vertexAttribPointer(aPos, 2, glCtx.FLOAT, false, 0, 0);

    const uTime = glCtx.getUniformLocation(prog, "u_time");
    const uAmp = glCtx.getUniformLocation(prog, "u_amplitude");
    const uFreq = glCtx.getUniformLocation(prog, "u_frequency");
    glCtx.uniform1f(uAmp, amplitude);
    glCtx.uniform1f(uFreq, frequency);

    const texture = glCtx.createTexture();
    glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
    glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
    glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
    glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.LINEAR);
    glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.LINEAR);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    let startTime: number | null = null;
    let lastFrameTime = 0;
    let loaded = false;

    img.onload = () => {
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, glCtx.RGBA, glCtx.UNSIGNED_BYTE, img);
      loaded = true;
      rafRef.current = requestAnimationFrame(draw);
    };

    function draw(ts: number) {
      if (!loaded) return;
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      if (!startTime) startTime = ts;
      if (ts - lastFrameTime < frameDuration) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      lastFrameTime = ts;
      const t = ((ts - startTime) / 1000) * speed;
      glCtx.uniform1f(uTime, t);
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      glCtx.deleteBuffer(buf);
      glCtx.deleteShader(vert);
      glCtx.deleteShader(frag);
      glCtx.deleteProgram(prog);
      glCtx.deleteTexture(texture);
    };
  }, [src, amplitude, frequency, speed, quality, fps]);

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
