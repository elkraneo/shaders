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


/* Shape 2D circle */
float sCircle(in vec2 p, in float w) {
    return length(p) * 2.0 - w;
}
float circle(in vec2 p, in float w) {
    float d = sCircle(p, w);
    return fill(d);
}
float circle(in vec2 p, in float w, float t) {
    float d = sCircle(p, w);
    return stroke(d, t);
}

void main() {
    vec3 color = vec3(
        abs(cos(st.x + mx.x)), 
        abs(sin(st.y + mx.y)), 
        abs(sin(u_time))
    );


    vec2 p = st;

    float d = 0.4;
    p.x -= d / 4.0;
    color += circle(p, d, 0.007);
    p.x += d / 2. ;
    color += circle(p, d, 0.007);


    gl_FragColor = vec4(color, 1.0);
}