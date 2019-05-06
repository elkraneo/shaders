#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main (void) {
    vec3 st = gl_FragCoord.xxy/u_resolution.yxx;
    vec3 color = vec3(sin(st.xz + u_time * 3.0), 0.0);
    // vec3 color = vec3(st.xy, 0.0);

    gl_FragColor = vec4(color,1.0);
}
