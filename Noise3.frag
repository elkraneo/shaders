#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix( mix( dot( random2(i + vec2(0.0, 0.0) ), f - vec2(0.0, 0.0) ),
                     dot( random2(i + vec2(1.0, 0.0) ), f - vec2(1.0, 0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0, 1.0) ), f - vec2(0.0, 1.0) ),
                     dot( random2(i + vec2(1.0, 1.0) ), f - vec2(1.0, 1.0) ), u.x), u.y);
}

float circle(in vec2 _st, in float _radius) {
    vec2 dist = _st - vec2(0.5);
    return 1. - smoothstep(_radius - (_radius * 0.01),
                           _radius + (_radius * 0.01),
                           dot(dist, dist) * 4.0);
}

float shapeBorder(vec2 st, float radius, float width) {
    return circle(st, radius) - circle(st, radius - width);
}

//---------------------------------------------------------------------

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    float t = 1.0;
    t *= abs(1.0 - sin(u_time * .35)) * 7.;

    st += noise(st * 1.7) * t;

	vec3 color = vec3(1.0) * shapeBorder(st, noise(st), 7.);
    color += vec3(.7, .7, .7) * smoothstep(.7, .2, noise(st));
    
    vec2 toCenter = vec2(0.5) - st;
 	float angle = atan(toCenter.y, toCenter.x);
	float radius = length(toCenter) * 2.0;

	color.r *= radius;
	color.b *= angle;
	color.g /= toCenter.x;

    gl_FragColor = vec4(color, 1.0);
}
