// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Polyrhythm

#ifdef GL_ES
precision mediump float;
#endif
#define IVORY vec3(1.0, 0.9, 0.8)
#define SUNSET vec3(0.9, 0.3, 0.3)
#define NAVY vec3(0.0, 0.1, 0.2)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float stepUpDown(float begin, float end, float t) {
  return step(begin, t) - step(end, t);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float t0 = fract(u_time), t1 = fract(u_time * 2.0), v0, v1;

    if (st.y > 0.5) {
        if (st.x < 1.0 / 3.0) {
            v0 = stepUpDown(0.0, 1.0 / 3.0, t0);
        } else if (st.x < 2.0 / 3.0) {
            v0 = stepUpDown(1.0 / 3.0, 2.0 / 3.0, t0);
        } else {
            v0 = stepUpDown(2.0 / 3.0, 1.0, t0);
        }
    } else {
        if (st.x < 0.5) {
            v1 = stepUpDown(0.0, 0.5, t1);
        } else {
            v1 = stepUpDown(0.5, 1.0, t1);
        }
    }

    vec3 color = mix(NAVY, SUNSET, v0);
    color = mix(color, IVORY, v1);
    gl_FragColor = vec4(color, 1.0);
}
