// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

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

#define NUM_OCTAVES 14

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(91.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.7), sin(0.7),
                    -sin(0.7), cos(0.7));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.;
    //st += st * abs(sin(u_time*0.1)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st );
    q.y = fbm( st + vec2(.7));

    vec2 r = vec2(0.);
    r.x = fbm( st + .7 * q + vec2(1.4, 7.) + abs(u_time));
    r.y = fbm( st + .7 * q + vec2(7., 3.5) + abs(u_time));

    float f = fbm(st+r);
    
	color = mix(vec3(.7),
                vec3(1),
                clamp((f*f) * 3.5, 0.0, .7));

    color = mix(color,
                vec3(1, 0, 0.35),
                clamp(length(q), 0.0, .7));

    color = mix(color,
                vec3(1, 0, 0),
                clamp(length(r.x), 0.0, .7));
                
    color /= vec3(st, .7) - 1.;

    gl_FragColor = vec4((f*f*f+.7*f*f+.35*f)*color,1.);
}