import { useEffect, useRef } from "react";

interface WaveBackgroundProps {
  src: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  opacity?: number;
  whiteBoost?: number;
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
  uniform float u_white_boost;
  uniform vec2 u_cursor;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;
    vec2 cursorOffset = uv - u_cursor;
    float cursorDistance = length(cursorOffset);
    float cursorInfluence = smoothstep(0.8, 0.0, cursorDistance);

    float dx =
      sin(uv.y * u_frequency * 2400.0 + u_time * 1.1) * u_amplitude +
      sin(uv.y * u_frequency * 1260.0 + uv.x * u_frequency * 750.0 + u_time * 0.7) * (u_amplitude * 0.5);

    float dy =
      cos(uv.x * u_frequency * 2400.0 + u_time * 0.9) * u_amplitude * 0.7 +
      cos(uv.x * u_frequency * 1128.0 + uv.y * u_frequency * 672.0 + u_time * 0.55) * (u_amplitude * 0.4);

    dx += cursorOffset.x * -0.35 * cursorInfluence;
    dy += cursorOffset.y * -0.35 * cursorInfluence;

    uv.x += dx;
    uv.y += dy;
    uv = clamp(uv, 0.0, 1.0);

    vec4 color = texture2D(u_image, uv);
    float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    float whiteMask = smoothstep(0.62, 0.92, brightness);
    color.rgb = mix(color.rgb, vec3(1.0), whiteMask * u_white_boost);

    gl_FragColor = color;
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

const MAX_DPR = 0.5;

export default function WaveBackground({
  src,
  amplitude = 0.05,
  frequency = 0.004,
  speed = 0.9,
  opacity = 0.92,
  whiteBoost = 5,
}: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const cursorTargetRef = useRef({ x: 0.5, y: 0.5 });
  const cursorCurrentRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const canvasEl = canvas;
    const glContext = gl;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvasEl.width = Math.floor(window.innerWidth * dpr);
      canvasEl.height = Math.floor(window.innerHeight * dpr);
      glContext.viewport(0, 0, canvasEl.width, canvasEl.height);
    }

    function handlePointerMove(event: PointerEvent) {
      cursorTargetRef.current = {
        x: event.clientX / window.innerWidth,
        y: 1 - event.clientY / window.innerHeight,
      };
    }

    function handlePointerLeave() {
      cursorTargetRef.current = { x: 0.5, y: 0.5 };
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    const vert = compileShader(glContext, glContext.VERTEX_SHADER, VERT);
    const frag = compileShader(glContext, glContext.FRAGMENT_SHADER, FRAG);
    const prog = glContext.createProgram()!;
    glContext.attachShader(prog, vert);
    glContext.attachShader(prog, frag);
    glContext.linkProgram(prog);
    glContext.useProgram(prog);

    const buf = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, buf);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      glContext.STATIC_DRAW
    );
    const aPos = glContext.getAttribLocation(prog, "a_position");
    glContext.enableVertexAttribArray(aPos);
    glContext.vertexAttribPointer(aPos, 2, glContext.FLOAT, false, 0, 0);

    const uTime = glContext.getUniformLocation(prog, "u_time");
    const uAmp = glContext.getUniformLocation(prog, "u_amplitude");
    const uFreq = glContext.getUniformLocation(prog, "u_frequency");
    const uWhiteBoost = glContext.getUniformLocation(prog, "u_white_boost");
    const uCursor = glContext.getUniformLocation(prog, "u_cursor");

    glContext.uniform1f(uAmp, amplitude);
    glContext.uniform1f(uFreq, frequency);
    glContext.uniform1f(uWhiteBoost, whiteBoost ?? 5);
    glContext.uniform2f(uCursor, 0.5, 0.5);

    const texture = glContext.createTexture();
    glContext.bindTexture(glContext.TEXTURE_2D, texture);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    let startTime: number | null = null;
    let loaded = false;

    img.onload = () => {
      glContext.bindTexture(glContext.TEXTURE_2D, texture);
      glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, img);
      loaded = true;
      rafRef.current = requestAnimationFrame(draw);
    };

    function draw(ts: number) {
      if (!loaded) return;
      if (!startTime) startTime = ts;

      const t = ((ts - startTime) / 1000) * speed;
      cursorCurrentRef.current.x +=
        (cursorTargetRef.current.x - cursorCurrentRef.current.x) * 0.15;
      cursorCurrentRef.current.y +=
        (cursorTargetRef.current.y - cursorCurrentRef.current.y) * 0.15;

      glContext.uniform1f(uTime, t);
      glContext.uniform2f(
        uCursor,
        cursorCurrentRef.current.x,
        cursorCurrentRef.current.y
      );
      glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      glContext.deleteProgram(prog);
      glContext.deleteTexture(texture);
    };
  }, [src, amplitude, frequency, speed, whiteBoost]);

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