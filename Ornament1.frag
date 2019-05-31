/* Main function, uniforms & utils */
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

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
#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(1.0, 0.0, 0.0)
#define GREEN           vec3(0.0, 1.0, 0.0)
#define BLUE            vec3(0.0, 0.0, 1.0)
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

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

/* Staggered animation */
struct Animation { float time; float pow; };
Animation animation = Animation(0.0, 0.0);
void totalTime(in float t, in float offset) { animation.time = mod(u_time + offset, t); }
void totalTime(in float t) { totalTime(t, 0.0); }
bool between(in float duration, in float offset) {
    float p = (animation.time - offset) / duration;
    animation.pow = p;
    animation.time -= (duration + offset);
    return (p >= 0.0 && p <= 1.0);
}
bool between(in float duration) { return between(duration, 0.0); }

/* Easing Circular InOut equation */
/* Adapted from Robert Penner easing equations */
float easeCircularInOut(float t) {
    t = t * 2.0; if ((t) < 1.0) return -0.5 * (sqrt(1.0 - t * t) - 1.0);
    return 0.5 * (sqrt(1.0 - (t -= 2.0) * t) + 1.0);
}

/* Easing Elastic Out equation */
/* Adapted from Robert Penner easing equations */
float easeElasticOut(float t) {
    if (t == 0.0) { return 0.0; }
    if (t == 1.0) { return 1.0; }
    float p = 0.3;
    float a = 1.0; 
    float s = p / 4.0;
    return (a * pow(2.0, -10.0 * t) * sin((t - s) * TWO_PI / p) + 1.0);
}

/* Math 2D Transformations */
mat2 rotate2d(in float angle){
    return mat2(cos(angle),-sin(angle), sin(angle), cos(angle));
}

/* Shape 2D poly */
float sPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}
float poly(in vec2 p, in float w, in int sides) {
    float d = sPoly(p, w, sides);
    return fill(d);
}
float poly(in vec2 p, in float w, in int sides, in float t) {
    float d = sPoly(p, w, sides);
    return stroke(d, t);
}

/* Tiling function */
vec2 tile(in vec2 p, vec2 w) { return fract(mod(p + w / 2.0, w)) - (w / 2.0); }
vec2 tile(in vec2 p, float w) { return tile(p, vec2(w)); }

void main() {

    vec2 p = st; float v = 0.0; float v2 = 0.0;
    
    float t = sin(u_time * 0.5);
    vec2 s = vec2(0.1, 0.35);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5) - st;
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter) * 2.0;

    p = tile(toCenter + vec2(0.7, 0.35 + radius * s.y), s);    

    vec3 color = vec3(
        abs(cos(st.x)), 
        abs(sin(st.y)), 
        abs(sin(u_time))
    );

    totalTime(6.0);

    /* Object struct */
    struct Object { float distance; vec3 color; };
    Object object = Object(0.0, vec3(0.0));
    
    if (between(0.7)) {
        v = easeElasticOut(animation.pow);
        object.distance = poly(p * rotate2d(PI_TWO) + vec2(0.0, mix(0.7, 0.0, v)), 0.1, 4, 0.035);
        object.color = vec3(st, v);
    }
    if (between(1.3)) {
        v = easeElasticOut(animation.pow);
        object.distance = poly(p * rotate2d(PI_TWO), 0.1, 4, 0.035);
        object.color = vec3(st, v);
    }
    if (between(0.7)) {
        v = easeElasticOut(animation.pow);
        object.distance = poly(p * rotate2d(PI) + vec2(0.0, mix(0.7, 0.0, v)), 0.15, 5, 0.035);
        object.color = vec3(p, v);
    }
    if (between(1.3)) {
        v = easeElasticOut(animation.pow);
        object.distance = poly(p * rotate2d(PI), 0.15, 5, 0.035);
        object.color = vec3(p, v);
    }
    if (between(0.7)) {
        v = easeElasticOut(animation.pow);
        object.distance = poly(p * rotate2d(PI_TWO) + vec2(0.0, mix(0.7, 0.0, v)), 0.13, 6, 0.035);
        object.color = vec3(st, v);
    }
    if (between(1.3)) {
        v = easeElasticOut(animation.pow);
        object.distance = poly(p * rotate2d(PI_TWO), 0.13, 6, 0.035);
        object.color = vec3(st, v);
    }

    color -= mix(color, object.color, object.distance);

    gl_FragColor = vec4(color, 1.0);
}