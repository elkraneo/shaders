#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

#define TWO_PI 6.28318530718

vec2 tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

float plot(vec2 st, float pct) {
    return smoothstep(pct - 0.01, pct, st.y) -
           smoothstep(pct, pct + 0.01, st.y);
}

vec2 stairs(vec2 _st, float _thickness) {
    vec2 uv;

    if(_st.x > 0.5) {
        uv.y = step(0., _st.y - _thickness) - step(1. - _st.x, _thickness);
    } else {
        uv.y = step(_st.y + _thickness, 1.) - step(0.5 - _st.x, _thickness);
    }

    return uv;
}

//---------------------------------------------------------------------

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    st = tile(st, 20.);

    color = vec3(stairs(st, 0.1), 0.0);

    gl_FragColor = vec4(color, 1.0);
}