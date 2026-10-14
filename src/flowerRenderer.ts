const createColorKeyer = () => {
  const surface = document.createElement('canvas');
  const gl = surface.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  let contextLost = false;
  const handleContextLost = () => { contextLost = true; };
  surface.addEventListener('webglcontextlost', handleContextLost);
  const dispose = () => {
    surface.removeEventListener('webglcontextlost', handleContextLost);
    shaders.forEach(shader => gl.deleteShader(shader));
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
    gl.deleteTexture(texture);
    surface.width = surface.height = 0;
  };

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Flower shader unavailable');
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Flower shader unavailable');
    return shader;
  };

  try {
    if (!program || !buffer || !texture) throw new Error('Flower renderer unavailable');
    gl.attachShader(program, compile(gl.VERTEX_SHADER, `
      attribute vec2 position;
      varying vec2 uv;
      void main() {
        uv = (position + 1.0) * 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform sampler2D frame;
      varying vec2 uv;
      void main() {
        vec4 color = texture2D(frame, uv);
        float blueCast = color.b - color.r;
        float alpha = 1.0;
        if (blueCast > 5.0 / 255.0 && color.g >= color.r - 2.0 / 255.0) {
          alpha = max(0.0, 1.0 - (blueCast - 5.0 / 255.0) * 28.0);
        }
        gl_FragColor = vec4(color.rgb * alpha, alpha);
      }
    `));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Flower renderer unavailable');

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

    return {
      surface,
      dispose,
      draw(video: HTMLVideoElement, width: number, height: number) {
        if (contextLost || gl.isContextLost() || Math.max(video.videoWidth, video.videoHeight) > maxTextureSize) return false;
        if (surface.width !== width || surface.height !== height) {
          surface.width = width;
          surface.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        return true;
      }
    };
  } catch {
    dispose();
    return null;
  }
};

export const createFlowerRenderer = (canvas: HTMLCanvasElement) => {
  const keyer = createColorKeyer();
  // Keep a persistent display canvas; only the detached color-key surface uses WebGL.
  const context = canvas.getContext('2d', { willReadFrequently: !keyer });
  let mode = keyer ? 'webgl' : 'canvas';

  return {
    get mode() { return mode; },
    draw(video: HTMLVideoElement, requestedWidth: number, requestedHeight: number) {
      if (!context) return false;
      const accelerated = keyer?.draw(video, requestedWidth, requestedHeight) ?? false;
      // Limit pixel work if hardware acceleration is unavailable.
      const width = accelerated ? requestedWidth : Math.min(1280, requestedWidth);
      const height = accelerated ? requestedHeight : Math.round(width * requestedHeight / requestedWidth);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.clearRect(0, 0, width, height);
      context.drawImage(accelerated ? keyer!.surface : video, 0, 0, width, height);
      mode = accelerated ? 'webgl' : 'canvas';

      if (!accelerated) {
        const pixels = context.getImageData(0, 0, width, height);
        for (let i = 0; i < pixels.data.length; i += 4) {
          const red = pixels.data[i];
          const green = pixels.data[i + 1];
          const blueCast = pixels.data[i + 2] - red;
          if (blueCast > 5 && green >= red - 2) pixels.data[i + 3] = Math.max(0, 255 - (blueCast - 5) * 28);
        }
        context.putImageData(pixels, 0, 0);
      }
      return true;
    },
    dispose: () => keyer?.dispose()
  };
};
