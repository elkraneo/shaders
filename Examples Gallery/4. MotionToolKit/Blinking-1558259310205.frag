// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Blinking

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
#define WHITE vec3(1.0, 1.0, 1.0)
#define SWEETPEA vec3(1.0, 0.7, 0.75)

float linearstep(float begin, float end, float t) {
    return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float linearstepUpDown(float upBegin, float upEnd, float downBegin, float downEnd, float t) {
    return linearstep(upBegin, upEnd, t) - linearstep(downBegin, downEnd, t);
}

float smoothedge(float v, float f) {
    return smoothstep(0.0, f / u_resolution.x, v);
}

float circle(vec2 p, float radius) {
  return length(p) - radius;
}

float dotPlot(vec2 p) {
  return 1.0 - smoothedge(circle(p, 0.05), 1.0);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    float v0 = linearstepUpDown(0.2, 0.4, 0.6, 0.8, fract(u_time));
    float v = dotPlot(st - vec2(0.2, 0.66)) * v0;
    float v1 = linearstepUpDown(0.2, 0.4, 0.6, 0.8, fract(u_time / 2.0));
    v = max(v, dotPlot(st - vec2(0.4, 0.66)) * v1);
    float v2 = linearstepUpDown(0.2, 0.4, 0.6, 0.8, fract(u_time / 3.0));
    v = max(v, dotPlot(st - vec2(0.6, 0.66)) * v2);
    float v3 = linearstepUpDown(0.2, 0.4, 0.6, 0.8, fract(u_time / 4.0));
    v = max(v, dotPlot(st - vec2(0.8, 0.66)) * v3);

    float v4 = linearstepUpDown(0.0, 0.1, 0.5, 0.6, fract(u_time / 4.0));
    v = max(v, dotPlot(st - vec2(0.2, 0.33)) * v4);
    float v5 = linearstepUpDown(0.1, 0.2, 0.6, 0.7, fract(u_time / 4.0));
    v = max(v, dotPlot(st - vec2(0.4, 0.33)) * v5);
    float v6 = linearstepUpDown(0.2, 0.3, 0.7, 0.8, fract(u_time / 4.0));
    v = max(v, dotPlot(st - vec2(0.6, 0.33)) * v6);
    float v7 = linearstepUpDown(0.3, 0.4, 0.8, 0.9, fract(u_time / 4.0));
    v = max(v, dotPlot(st - vec2(0.8, 0.33)) * v7);

    vec3 color = mix(SWEETPEA, WHITE, v);
    gl_FragColor = vec4(color, 1.0);
}
