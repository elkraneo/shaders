// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Timing functions 1

#ifdef GL_ES
precision mediump float;
#endif
#define IVORY vec3(1.0, 0.9, 0.8)
#define NAVY vec3(0.0, 0.1, 0.2)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float stepUpDown(float begin, float end, float t) {
  return step(begin, t) - step(end, t);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse.xy / u_resolution;
	float t = fract(u_time), n = st.y * 4.0, v;

    if (n < 1.0) {
      v = step(0.5, t);
    } else if (n < 2.0) {
      v = 1.0 - step(0.5, t);;
    } else if (n < 3.0) {
      v = stepUpDown(0.25, 0.5, t);
    } else {
      v = stepUpDown(0.5, 0.75, t);
    }
    vec3 color = mix(NAVY, IVORY, v);

    gl_FragColor = vec4(color, 1.0);
}
