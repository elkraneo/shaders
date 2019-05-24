#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

#define TWO_PI 6.28318530718

#define PLOT(f, c, d, p) d = mix(c, d, smoothstep(0.0, (LINE_SIZE / u_resolution.y * DISP_SCALE), abs(f(p) / length(GRAD(f,p)))))



float plot(vec2 _st, float _pct, float _thickness) {
    return step(_pct - _thickness, _st.y) -
           step(_pct + _thickness, _st.y);
}

float plot2(vec2 _st, float _pct, float _thickness) {
    return step(_pct - _thickness, _st.x) - 
           step(_pct + _thickness, _st.x);
}

vec2 tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

float f( float x, int idx ) {
    float t = x + sin(u_time);

    if ( idx == 2 )
        return sin(t*t*t)*sin(t);
    else if ( idx == 1 )
        return step( fract(t), 0.5 ) - 0.5;
    else
    {
        //return fract(t);
        //return 0.1 * tan( t );
        return 0.2*t;
    }
}

float eval(vec2 uv, int idx) {
    //note: evaluate function at pixel-edges
    //      +-------+
    //      |       |
    //      x0  x  x1
    //      |       |
    //      +-------+
    float dx = .5 * dFdx(uv.x);
    float x0 = uv.x - dx;
    float x1 = uv.x + dx;
    float y0 = f(x0, idx);
    float y1 = f(x1, idx);

    //note: determine if center is within the interval, y0 < uv.y < y1
    float mn = min(y0,y1);
    float mx = max(y0,y1);
    float w = dFdy(uv.y);
    float c = step(mn - w, uv.y ) * step(uv.y, mx + w);

    return c;
}

// Returns the square, triangular and quadratic-ladder signals
//
// Branchless is always nicer
//
vec3 funcs(in float x) {
    x *= 0.5;
    
    float h = fract(x)-0.5;
    
    float s = -sign(h);
    float t = 1.0 - 2.0 * abs(h); // also 1.0 + 2.0*h*s
    float p = x + h*t;
    
    return vec3( s, t, p );
}

//---------------------------------------------------------------------

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    st = tile(st, 1.);

    //wave = abs(cos(st.x * 7. + u_time)) * 0.5 + .25;
    //wave = abs(cos(st.x * 14. + u_time) * sin(st.x * 3.)) * 0.7 + .1;
    //wave = smoothstep(-.1, 1., cos(st.x * 14. + u_time)) * 0.5 + .25;
    //wave = smoothstep(0., 1., cos(st.x * 14. + u_time * 3.5)) * 0.5 + .25;
    //wave = step(0., cos(st.y * 14. + u_time * 3.5)) * 0.5 + .25;

    float amplitude = 1.;
    float frequency = 3.5;
    float phase     = u_time;

   float wave  = step(0., amplitude * sin((st.x * frequency - phase) * TWO_PI));
   float wave2 = amplitude * sin((st.x * frequency - phase) * TWO_PI);

    color  = vec3(0., plot(st, wave, 0.035), 0.);
    color += vec3(0., eval(st, 1), 0.);

    st = frequency * (2.0 * st);
    float px = frequency / u_resolution.y;
    
    vec3 f = funcs(st.x);
    color = mix(color, 
                vec3(.0, .7, .0), 
                1. - step(7. * px, 
                           min(abs(st.y - f.x), 
                               length(vec2(fract(st.x + .5) - .5,
                                           min(1. - abs(st.y), 0.)))
                              )
                           )
                );

    gl_FragColor = vec4(color, 1.0);
}