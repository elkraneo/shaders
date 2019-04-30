#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

#define PI 3.14159265358979323846

// 2D Random
float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation
    vec2 u = smoothstep(0., 1., f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
              (c - a) * u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
}

vec2 rotate2D(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), -sin(_angle),
               sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size * 0.5;
    vec2 uv = smoothstep(_size,
                         _size + vec2(0.001),
                         _st);
    uv *= smoothstep(_size,
                     _size + vec2(0.001),
                     vec2(1.0) - _st);
    return uv.x * uv.y;
}


float circle(in vec2 _st, in float _radius) {
    vec2 dist = _st - vec2(0.5);
    return 1. - smoothstep(_radius - (_radius * 0.01),
                           _radius + (_radius * 0.01),
                           dot(dist, dist) * 4.0);
}

//---------------------------------------------------------------------

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    st -= vec2(0.5);


    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st * 21.);


    color += vec3(circle(vec2(pos), .07));

    // Use the noise function
    float n = noise(pos);
    pos = rotate2D(pos, sin(u_time) * PI);
    pos += n;

    color += vec3(box(vec2(pos - 0.5), vec2(0.7)));
    color += vec3(box(vec2(pos - 1.),  vec2(1.7)));
    color += vec3(box(vec2(pos - 1.5), vec2(2.7)));
    color += vec3(box(vec2(pos - 2.),  vec2(3.7)));
    color += vec3(box(vec2(pos - 2.5), vec2(4.7)));
    color += vec3(box(vec2(pos - 3.),  vec2(5.7)));
    color += vec3(box(vec2(pos - 3.5), vec2(6.7)));   
    // color += vec3(box(vec2(pos - 4.),  vec2(7.7)));
    // color += vec3(box(vec2(pos - 4.5), vec2(8.7)));
    // color += vec3(box(vec2(pos - 5.),  vec2(9.7)));
    // color += vec3(box(vec2(pos - 5.5), vec2(10.7)));
    // color += vec3(box(vec2(pos - 6.),  vec2(11.7)));
    // color += vec3(box(vec2(pos - 6.5), vec2(12.7)));
    // color += vec3(box(vec2(pos - 7.),  vec2(13.7)));

    // st *= rotate2D(st, cos(u_time) * PI);
    color *= vec3(st.x, st.y, .7);

    gl_FragColor = vec4(vec3(color), 1.0);
}