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

/* Color palette */
#define BLACK   vec3(0.0, 0.0, 0.0)
#define WHITE   vec3(1.0, 1.0, 1.0)
#define RED     vec3(1.0, 0.0, 0.0)
#define GREEN   vec3(0.0, 1.0, 0.0)
#define BLUE    vec3(0.0, 0.0, 1.0)
#define YELLOW  vec3(1.0, 1.0, 0.0)
#define CYAN    vec3(0.0, 1.0, 1.0)
#define MAGENTA vec3(1.0, 0.0, 1.0)
#define ORANGE  vec3(1.0, 0.5, 0.0)
#define PURPLE  vec3(1.0, 0.0, 0.5)
#define LIME    vec3(0.5, 1.0, 0.0)
#define ACQUA   vec3(0.0, 1.0, 0.5)
#define VIOLET  vec3(0.5, 0.0, 1.0)
#define AZUR    vec3(0.0, 0.5, 1.0)

/* Signed distance drawing methods */
float fill(in float d) { return 1.0 - smoothstep(0.0, rx * 2.0, d); }
float stroke(in float d, in float t) { return 1.0 - smoothstep(t - rx * 1.5, t + rx * 1.5, abs(d)); }
vec3 draw(in sampler2D t, in vec2 pos, in vec2 w) { vec2 s = w / 1.0; s.x *= -1.0; return texture2D(t, pos / s + 0.5).rgb; }
/* Field Adapted from https://www.shadertoy.com/view/XsyGRW */
vec3 field(float d) {
    vec3 c1 = mix(WHITE, YELLOW, 0.4);
    vec3 c2 = mix(WHITE, AZUR, 0.7);
    vec3 c3 = mix(WHITE, ORANGE, 0.9);
    vec3 c4 = BLACK;
    float d0 = abs(stroke(mod(d + 0.1, 0.2) - 0.1, 0.004));
    float d1 = abs(stroke(mod(d + 0.025, 0.05) - 0.025, 0.004));
    float d2 = abs(stroke(d, 0.004));
    float f = clamp(d * 0.85, 0.0, 1.0);
    vec3 gradient = mix(c1, c2, f);
    gradient = mix(gradient, c4, 1.0 - clamp(1.25 - d * 0.25, 0.0, 1.0));
    gradient = mix(gradient, c3, fill(d));
    gradient = mix(gradient, c4, max(d2 * 0.85, max(d0 * 0.25, d1 * 0.06125)) * clamp(1.25 - d, 0.0, 1.0));
    return gradient;
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
float bandMotive1Segments(in vec2 p, in float w) {
    float s = 0.0;
    s += segment(p + vec2(0.0,  0.0), p + vec2(0.1,  0.0), w);
    s += segment(p + vec2(0.1,  0.0), p + vec2(0.1, -0.1), w);
    s += segment(p + vec2(0.1, -0.1), p + vec2(0.2, -0.1), w);
    s += segment(p + vec2(0.2, -0.1), p + vec2(0.2,  0.0), w);
    return s;
}

float bandMotive2Segments(in vec2 p, in float w) {
    float s = 0.0;
    s += segment(p + vec2(0.0,  0.0), p + vec2(0.1, -0.1), w);
    s += segment(p + vec2(0.1, -0.1), p + vec2(0.2,  0.0), w);
    return s;
}

float bandMotive4Segments(in vec2 p, in float w) {
    float s = 0.0;
    s += segment(p + vec2(0.0,  0.0), p + vec2(0.2, -0.1), w);
    p.x -= 0.2;
    s += segment(p + vec2(0.2, -0.1), p + vec2(0.4,  0.0), w);
    return s;
}

/* Borders */
float borders(in vec2 p, in float w) {
    float m = 0.0;

    m += segment(p + vec2(0.0, 0.01), p + vec2(1.0, 0.01), w);
    m += segment(p + vec2(0.0, -0.1 - 0.01), p + vec2(1.0, -0.1 - 0.01), w);

    return m;
}

/* Band Motives */
float bandMotive1(in vec2 p, in float w) {
    p.x -= 0.5;
    float m = 0.0;

    for (int i = 0; i < 5; i++) {
        m += bandMotive1Segments(vec2(p.x + float(i) * 0.2, p.y), w);
    }

    m += borders(p, w);

    return m;
}

float bandMotive2(in vec2 p, in float w) {
    p.x -= 0.5;
    float m = 0.0;

    for (int i = 0; i < 6; i++) {
        m += bandMotive2Segments(vec2(p.x + float(i) * 0.2, p.y), w);
    }

    m += borders(p, w);

    return m;
}

float bandMotive3(in vec2 p, in float w) {
    float m = 0.0;

    m += bandMotive2(p, w);
   
    p.y -= 0.1;
    p.y *= -1.0;

    m += bandMotive2(p, w);

    return m;
}

float bandMotive4(in vec2 p, in float w) {
    p.x -= 0.5;
    float m = 0.0;

    for (int i = 0; i < 6; i++) {
        m += bandMotive4Segments(vec2(p.x + float(i) * 0.2, p.y), w);
    }

    m += borders(p, w);

    return m;
}

void main() {
    vec2 p = st;

    vec3 color = vec3(0.0);
    color += grid(p, .1);

    float width = 0.0035;

    // 1
    p.y -= 0.5;
    color += bandMotive1(p, width);

    // 2
    p.y += 0.2;
    color += bandMotive2(p, width);

    // 3
    p.y += 0.2;
    color += bandMotive3(p, width);

    // 3b
    p.y += 0.2;
    color += bandMotive3(p, width);
    p.x -= 0.05;
    color += bandMotive3(p, width);
    p.x += 0.05;

    // 4
    p.y += 0.2;
    color += bandMotive4(p, width);

    // 4b
    p.y += 0.2;
    color += bandMotive4(p, width);
    p.x -= 0.1;
    color += bandMotive4(p, width);


    gl_FragColor = vec4(color, 1.0);
}