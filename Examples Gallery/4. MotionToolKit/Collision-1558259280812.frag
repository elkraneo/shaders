// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Collision

#ifdef GL_ES
precision mediump float;
#endif
#define SUNFLOWER vec3(1.0, 1.0, 0.6)
#define TURQUOISE vec3(0.0, 1.0, 0.7)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float linearstep(float begin, float end, float t) {
    return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float easeInCubic(float t) {
    return t * t * t;
}

float easeOutQuad(float t) {
    return -1.0 * t * (t - 2.0);
}

float smoothedge(float v, float f) {
    return smoothstep(0.0, f / u_resolution.x, v);
}

float rect(vec2 p, vec2 size) {
  vec2 d = abs(p) - size;
  return min(max(d.x, d.y), 0.0) + length(max(d,0.0));
}

float rectPlot(vec2 p, vec2 size) {
  return 1.0 - smoothedge(rect(p, size), 1.0);
}

float collider(vec2 p, vec2 b, vec2 e, float t) {

    float t0 = linearstep(0.0, 0.5, t);
    float p0 = easeInCubic(t0);
    float t1 = linearstep(0.5, 1.0, t);
    float p1 = easeOutQuad(t1);

    return rectPlot(p - mix(b, e, p0 - p1), vec2(0.05));
}

float colliders(vec2 st, float t) {
    float t0 = fract(t);
    float t1 = fract(t + 0.5);
    float v = collider(st, vec2(0.05, 0.5), vec2(0.45, 0.5), t0);
    v = max(v, collider(st, vec2(0.95, 0.5), vec2(0.55, 0.5), t0));
    v = max(v, collider(st, vec2(0.5, 0.05), vec2(0.5, 0.45), t1));
    v = max(v, collider(st, vec2(0.5, 0.95), vec2(0.5, 0.55), t1));
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
	float t = fract(u_time);
    float v = colliders(st, t);
    vec3 color = mix(TURQUOISE, SUNFLOWER, v);
    gl_FragColor = vec4(color, 1.0);
}
