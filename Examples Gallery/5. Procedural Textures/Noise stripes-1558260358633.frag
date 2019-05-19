// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Noise stripes

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

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    float v;
    if (st.y < 0.25) {
        v = st.x; // x-coord
    } else if (st.y < 0.5) {
        v = sin(st.x * 14.0); // use sin() to create stripe
    } else if (st.y < 0.75) {
        v = sin(st.x * 14.0 + fbm(st.xx * vec2(100.0, 12.0)) * 8.0); // add noise to the angle in the sin() function to add randomness
    } else {
        v = smoothstep(-1.0, 1.0, sin(st.x * 14.0 + fbm(st.xx * vec2(100.0, 12.0)) * 8.0)); // adjust the value with smoothstep() function
    }
    gl_FragColor = vec4(vec3(v), 1.0);
}
