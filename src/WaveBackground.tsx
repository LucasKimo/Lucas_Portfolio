import { useEffect, useRef } from "react";

interface WaveBackgroundProps {
  src: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  opacity?: number;
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

const MAX_DPR = 0.5;

export default function WaveBackground({
  src,
  amplitude = 0.012,
  frequency = 0.012,
  speed = 0.6,
  opacity = 0.92,
}: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uAmp = gl.getUniformLocation(prog, "u_amplitude");
    const uFreq = gl.getUniformLocation(prog, "u_frequency");
    gl.uniform1f(uAmp, amplitude);
    gl.uniform1f(uFreq, frequency);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    let startTime: number | null = null;
    let loaded = false;

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      loaded = true;
      rafRef.current = requestAnimationFrame(draw);
    };

    function draw(ts: number) {
      if (!gl || !loaded) return;
      if (!startTime) startTime = ts;
      const t = ((ts - startTime) / 1000) * speed;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteTexture(texture);
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