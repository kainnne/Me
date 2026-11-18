// 背景：Paper Shaders MeshGradient（Apache-2.0，0.0.72，從 resume-website 的 node_modules 複製到 vendor/）。
// 參數同 kainnne.com 的 DreamBackground。本站固定亮色，只用 dream 色票。WebGL 不可用時保留 CSS 漸層。
import { ShaderMount } from './vendor/paper-shaders-0.0.72/shader-mount.js';
import { meshGradientFragmentShader } from './vendor/paper-shaders-0.0.72/shaders/mesh-gradient.js';
import { getShaderColorFromString } from './vendor/paper-shaders-0.0.72/get-shader-color-from-string.js';
import { ShaderFitOptions } from './vendor/paper-shaders-0.0.72/shader-sizing.js';

const host = document.getElementById('mesh');
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
// 第八版：直接用 kainnne.com 的 dream 色票（粉、薰衣草、淡藍、薄荷），由 styles.css 的 .bg-veil 壓淡。
const dream = ['#fffafc', '#ffd8e7', '#f6c8ff', '#cddcff', '#c9fff0', '#ffb7ce', '#ffffff'];

try {
  const mount = new ShaderMount(host, meshGradientFragmentShader, {
    u_colors: dream.map(getShaderColorFromString),
    u_colorsCount: dream.length,
    u_distortion: 0.82,
    u_swirl: 0.42,
    u_grainMixer: 0.08,
    u_grainOverlay: 0.05,
    u_fit: ShaderFitOptions.contain,
    u_rotation: 0,
    u_scale: 1,
    u_offsetX: 0,
    u_offsetY: 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
  }, undefined, still.matches ? 0 : 0.16, 0, 1);
  still.addEventListener('change', () => mount.setSpeed(still.matches ? 0 : 0.16));
  document.addEventListener('visibilitychange', () => mount.setSpeed(document.hidden || still.matches ? 0 : 0.16));
} catch (err) {
  host.remove();
}
