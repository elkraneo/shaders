#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

#define MAX_POINTS 49


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

//---------------------------------------------------------------------

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    st *= 7.0;
    st -= 3.;

    vec3 color = vec3(.0);
    vec2 circularMotion = vec2(sin(u_time), cos(u_time));
    int pointsAmount = MAX_POINTS;
    vec2 point[MAX_POINTS];

    for (int i = 0; i < pointsAmount; i++) {
        point[i] = vec2(random(14. * float(i) * 14.) + sin(abs(u_time + 3. + float(i))), 
                        random(21. * float(i) * 14.) + cos(abs(u_time + 3. + float(i))));
    }

    // point[4] = (u_mouse/u_resolution);

    float m_dist = 1.;  // minimun distance


    point[MAX_POINTS-1] = vec2(cos(u_time)) * 2.;


    // Iterate through the points positions
    for (int i = 0; i < pointsAmount; i++) {
        float dist = distance(st, point[i]);

        // Keep the closer distance
        m_dist = min(m_dist, dist);
    }

    color *= shapeBorder(vec2(m_dist), m_dist + .2, .19);
    color -= shapeBorder(vec2(m_dist), m_dist + .1, .19);
    color -= step(.7, abs(sin(3. * m_dist))) * .35;
    color *= vec3(st, .7);


    gl_FragColor = vec4(color, 1.0);
}

