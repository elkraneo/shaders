#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

// RGB to YUV matrix
mat3 rgb2yuv = mat3(0.2126,   0.7152,  0.0722,
                   -0.09991, -0.33609, 0.43600,
                    0.615,   -0.5586, -0.05639);

//---------------------------------------------------------------------

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(.0);

    // Scale
    st *= 4.;
    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(2.) - st;
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter) * 2.;


    // Tile the space
    vec2 i_st = floor(toCenter);
    vec2 f_st = fract(toCenter);

    float m_dist = 1.;  // minimun distance
    vec2 m_point;        // minimum point

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5 * sin(u_time + 6.2831 * point + radius);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff * radius);

            if( dist < m_dist / radius ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }


    color.rg = vec2(m_dist, .35);
    
    color += vec3(m_point, vec2(.7));

    color -= abs(sin(m_dist));

    // Draw cell center
    color += 1. - smoothstep(0., 0.1, m_dist);

    // Draw grid
    color += step(.99, f_st.x) + step(.99, f_st.y);
    
    color.b = .7;

    gl_FragColor = vec4(color, 1.0);
}
