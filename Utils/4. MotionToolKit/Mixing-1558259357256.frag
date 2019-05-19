// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Mixing

#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define NAVY vec3(0.0, 0.1, 0.2)
#define SUNFLOWER vec3(1.0, 1.0, 0.6)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float smoothedge(float v, float f) {
    return smoothstep(0.0, f / u_resolution.x, v);
}

float circle(vec2 p, float radius) {
  return length(p) - radius;
}

float circlePlot(vec2 p, float radius) {
  return 1.0 - smoothedge(circle(p, radius), 2.0);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float index = 0.0, v;
    index += step(0.5, st.x);
    index += step(0.5, st.y) * 2.0;
    st = fract(st * 2.0);

    float c0 = circlePlot(st - vec2(0.35, 0.5), 0.2);
    float c1 = circlePlot(st - vec2(0.65, 0.5), 0.2);

    if (index == 0.0) {
        v = max(c0, c1);
    } else if (index == 1.0) {
        v = min(c0, c1);
    } else if (index == 2.0) {
        v = max(0.0, c0 - c1);
    } else {
        v = abs(c0 - c1);
    }

    vec3 color = mix(SUNFLOWER, NAVY, v);
    gl_FragColor = vec4(color, 1.0);
}
