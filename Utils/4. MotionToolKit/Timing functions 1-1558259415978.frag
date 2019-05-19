// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Timing functions 1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
#define IVORY vec3(1.0, 0.9, 0.8)
#define TURQUOISE vec3(0.0, 1.0, 0.7)
#define NAVY vec3(0.0, 0.1, 0.2)

float linearstep(float begin, float end, float t) {
    return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float linearstepUpDown(float upBegin, float upEnd, float downBegin, float downEnd, float t) {
    return linearstep(upBegin, upEnd, t) - linearstep(downBegin, downEnd, t);
}

float plot(vec2 st, float pct){
  return  smoothstep( pct - 0.005, pct, st.y) -
          smoothstep( pct, pct + 0.005, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse.xy / u_resolution;
	float t = fract(u_time), n0 = st.y * 4.0, n1 = mouse.y * 4.0, v0, v1;

	vec3 color = IVORY;

    // Bar animations
    if (n0 < 1.0) {
      v0 = linearstep(0.25, 0.75, t);
    } else if (n0 < 2.0) {
      v0 = 1.0 - linearstep(0.25, 0.75, t);
    } else if (n0 < 3.0) {
      v0 = linearstepUpDown(0.1, 0.3, 0.5, 0.7, t);
    } else {
      v0 = linearstepUpDown(0.3, 0.5, 0.7, 0.9, t);
    }
    color = mix(color, NAVY, v0);

    // Mouse over to plot graph
    if (n1 < 1.0) {
      v1 = linearstep(0.25, 0.75, st.x);
    } else if (n1 < 2.0) {
      v1 = 1.0 - linearstep(0.25, 0.75, st.x);
    } else if (n1 < 3.0) {
      v1 = linearstepUpDown(0.2, 0.4, 0.6, 0.8, st.x);
    } else {
      v1 = linearstepUpDown(0.4, 0.6, 0.8, 1.0, st.x);
    }

    float v2 = plot(st, v1);
    color = mix(color, TURQUOISE, v2);

    gl_FragColor = vec4(color, 1.0);
}
