#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    float pct = 0.0;

    pct = distance(st, vec2(0.5));

    vec3 color;

    if(pct > 0.5) {
        color = vec3(0.0);
    } else {
        color = vec3(1.0);
    }

	gl_FragColor = vec4(color, 1.0);
}