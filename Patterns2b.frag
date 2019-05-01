#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265358979323846

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
   
    // Use a matrix to rotate the space 45 degrees
    st = rotate2D(st,cos(u_time * PI*0.25));

    // Divide the space in 2
    st = tile(st,2.);

    // Rotate
    st = rotate2D(st,sin(u_time * PI*0.25));

    // Divide the space once more
    st = tile(st,1.);

    // Rotate
    st = rotate2D(st,cos(u_time * PI*0.25));

    // Draw
    color = vec3(st,.7);

    gl_FragColor = vec4(color,1.0);
}

