/* Main function, uniforms & utils */
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define HALF_PI 1.5707963267948966
#define PI      3.14159265358979323846
#define TWO_PI  6.28318530718

/* Coordinate and unit utils */
vec2 coord(in vec2 p) {
  p = p / u_resolution.xy;
    // correct aspect ratio
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
      p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    // centering
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
  return p;
}
#define rx 1.0 / min(u_resolution.x, u_resolution.y)
#define uv gl_FragCoord.xy / u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)

/* Signed distance drawing methods */
float fill(in float d) { return 1.0 - smoothstep(0.0, rx * 2.0, d); }
float stroke(in float d, in float t) { return 1.0 - smoothstep(t - rx * 1.5, t + rx * 1.5, abs(d)); }
vec3 draw(in sampler2D t, in vec2 pos, in vec2 w) { vec2 s = w / 1.0; s.x *= -1.0; return texture2D(t, pos / s + 0.5).rgb; }

/* Tiling function */
vec2 tile(in vec2 p, vec2 w) { return fract(mod(p + w / 2.0, w)) - (w / 2.0); }
vec2 tile(in vec2 p, float w) { return tile(p, vec2(w)); }

/* Shape 2D segment */
float sSegment(in vec2 a, in vec2 b) {
    vec2 ba = a - b;
    float d = clamp(dot(a, ba) / dot(ba, ba), 0.0, 1.0);
    return length(a - ba * d) * 2.0;
}
float segment(in vec2 a, in vec2 b, float t) {
    float d = sSegment(a, b);
    return stroke(d, t);
}

/* Shape 2D line */
float sLine(in vec2 a, in vec2 b) {
    vec2 p = b - a;
    float d = abs(dot(normalize(vec2(p.y, -p.x)), a));
    return d * 2.0;
}
float line(in vec2 a, in vec2 b) {
    float d = sLine(a, b);
    return fill(d);
}
float line(in vec2 a, in vec2 b, in float t) {
    float d = sLine(a, b);
    return stroke(d, t);
}
float line(in vec2 p, in float a, in float t) {
    vec2 b = p + vec2(sin(a), cos(a));
    return line(p, b, t);
}

/* Shape 2D grid */
float grid(in vec2 p, in float w) {
    vec2 l = tile(p, w);
    float d = 0.0;
    d += line(l, l + vec2(0.0, 0.1), 0.002);
    d += line(l, l + vec2(0.1, 0.0), 0.002);
    d *= 0.2;
    p = tile(p, vec2(w * 5.0));
    float s = w / 10.0;
    float g = 0.0;
    g += segment(p + vec2(-s, 0.0), p + vec2(s, 0.0), 0.004);
    g += segment(p + vec2(0.0, -s), p + vec2(0.0, s), 0.004);
    return d + g;
}

/* Band Motive Segments */
float bandMotive5Plate2(in vec2 p, in float w) {
    float bm = 0.0;
    float n = 0.1;

    p.x -= 0.15 - n;

    bm += segment(p + vec2(-n, -n), 
                  p + vec2( 0.0,  0.0), 
                  w);

    bm += segment(p + vec2(0.0,  0.0), 
                  p + vec2(  n, -n), 
                  w);

    bm += segment(p + vec2(n,       -n), 
                  p + vec2(n * 2.0, -n), 
                  w);

    bm += segment(p + vec2(n, -n), 
                  p + vec2(n, -n * 2.0), 
                  w);

    bm += segment(p + vec2(n * 2.0, -n), 
                  p + vec2(n * 2.0, -n * 2.0), 
                  w);

    return bm;
}

vec2 tile2(vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

void main() {
    vec3 color = vec3(0.0);
    vec2 p = st;

    color += grid(p, .1);

    p.x += 0.05;
    p = tile(p, vec2(0.3, 0.3));
    color += bandMotive5Plate2(p, 0.005);
    p.y *= -1.;
    color += bandMotive5Plate2(p, 0.005);

    gl_FragColor = vec4(color, 1.0);
}