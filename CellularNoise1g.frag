#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

#define MAX_POINTS 7


float circle(in vec2 _st, in float _radius) {
  vec2 dist = _st - vec2(0.5);
  return 1. - smoothstep(_radius - (_radius * 0.01),
   _radius + (_radius * 0.01),
   dot(dist, dist) * 4.0);
}


float shapeBorder(vec2 st, float radius, float width) {
    return circle(st, radius) - circle(st, radius - width);
}

float random(in float x) {
    return fract(sin(x) * 1e4);
}

// YUV to RGB matrix
mat3 yuv2rgb = mat3(1.0,  0.0,      1.13983,
                    1.0, -0.39465, -0.58060,
                    1.0,  2.03211,  0.0);

// RGB to YUV matrix
mat3 rgb2yuv = mat3( 0.2126,   0.7152,  0.0722,
                    -0.09991, -0.33609, 0.43600,
                     0.615,   -0.5586, -0.05639);

//---------------------------------------------------------------------

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5) - st;
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter) * 2.0;
    
    vec3 color = vec3(.0);

    st *= radius * 14.;
    st -= .7;

    vec2 circularMotion = vec2(sin(u_time), cos(u_time));

    vec2 point[MAX_POINTS];

    for (int i = 0; i < MAX_POINTS; i++) {
        point[i] = vec2(radius * float(i) - sin(abs(u_time - 3. + float(i))), 
                        radius * float(i) + cos(abs(u_time + 3. + float(i))));
    }

    float m_dist = 1.;  // minimun distance

    // Iterate through the points positions
    for (int i = 0; i < MAX_POINTS; i++) {
        float dist = distance(st, point[i]);

        // Keep the closer distance
        m_dist = min(m_dist, dist);
    }

    color += shapeBorder(vec2(m_dist), m_dist, .7);
    color += step(.7, abs(sin(7. * m_dist)));
    color -= vec3(st, .7);
    color -= rgb2yuv[0];

    gl_FragColor = vec4(color, 1.0);
}

