// Author @kynd - 2016
// Title: Distance field metaball
// http://www.kynd.info

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float smoothen(float d1, float d2) {
    float k = 1.5;
    return -log(exp(-k * d1) + exp(-k * d2)) / k;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 p0 = vec2(cos(u_time) * 0.3 + 0.5, 0.5);
    vec2 p1 = vec2(-cos(u_time) * 0.3 + 0.5, 0.5);
    float d = smoothen(distance(st, p0) * 5.0, distance(st, p1) * 5.0);
	float ae = 5.0 / u_resolution.y;
    vec3 color = vec3(smoothstep(0.8, 0.8+ae, d));
    gl_FragColor = vec4(color, 1.0);
}