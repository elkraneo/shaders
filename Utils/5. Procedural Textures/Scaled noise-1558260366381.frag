// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Scaled noise

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

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    float v;
    if (st.y < 0.25) {
        v = noise(st * vec2(10.0, 1.0)) - noise(st * vec2(20, 2.0));
    } else if (st.y < 0.5) {
        v = noise(st * vec2(45.0, 2.0)) - noise(st * vec2(60, 16.0));
    } else if (st.y < 0.75) {
        v = noise(st * vec2(90.0, 3.0)) - noise(st * vec2(120, 32.0));
    } else {
        v = noise(st * vec2(200.0, 14.0)) - noise(st * vec2(1000.0, 64.0));
    }

    gl_FragColor = vec4(vec3(v), 1.0);
}
