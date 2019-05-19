// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: 4 Beat

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
    float t = fract(u_time / 2.0), v;
    if (st.x < 0.5) {
        if (st.y < 0.5) {
            v = stepUpDown(0.0, 0.125, t);
        } else {
            v = stepUpDown(0.25, 0.375, t);
        }
    } else {
        if (st.y > 0.5) {
            v = stepUpDown(0.5, 0.625, t);
        } else {
            v = stepUpDown(0.75, 0.875, t);
        }
    }

    vec3 color = mix(NAVY, IVORY, v);
    gl_FragColor = vec4(color, 1.0);
}
