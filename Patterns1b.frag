#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

vec2 pattern(in vec2 _st, in float _amountX, in float _amountY){
    vec2 l = _st *= vec2( _amountX, _amountY); // Scale up the space by _amount
    return fract(l); // Wrap arround 1.0
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    st = pattern(st, 3., 3.);
    // st *= 3.;      // Scale up the space by 3
    // st = fract(st); // Wrap arround 1.0

    // Now we have 3 spaces that goes from 0-1

    color = vec3(st,0.0);
    //color = vec3(circle(st,0.5));

	gl_FragColor = vec4(color,1.0);
}