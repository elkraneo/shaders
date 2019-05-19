// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Marble

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitud = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitud * noise(st);
        st *= 2.;
        amplitud *= .5;
    }
    return value;
}

float edge(float v, float center, float edge0, float edge1) {
    return 1.0 - smoothstep(edge0, edge1, abs(v - center));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    float v0 = edge(fbm(st * 18.0), 0.5, 0.0, 0.2);
    float v1 = smoothstep(0.5, 0.51, fbm(st * 14.0));
    float v2 = edge(fbm(st * 14.0), 0.5, 0.0, 0.05);
    float v3 = edge(fbm(st * 14.0), 0.5, 0.0, 0.25);

    vec3 col = vec3(1.0);
    col -= v0 * 0.75;
    col = mix(col, vec3(0.97), v1);
    col = mix(col, vec3(0.51), v2);
    col -= v3 * 0.2;

    gl_FragColor = vec4(col,1.0);
}
