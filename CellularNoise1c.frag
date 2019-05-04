// Author: @patriciogv
// Title: 4 cells DF

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

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

    vec3 color = vec3(.0);

    vec2 circularMotion = vec2(sin(u_time), cos(u_time));
    // Cell positions
    vec2 point[5];
    point[0] = vec2(0.83 + circularMotion.x, 0.75 - circularMotion.y);
    point[1] = vec2(0.60 + circularMotion.x, 0.07 - circularMotion.y);
    point[2] = vec2(0.28 - circularMotion.x, 0.64 + circularMotion.y);
    point[3] = vec2(0.31 - circularMotion.x, 0.26 + circularMotion.y);
    // point[4] = vec2(0.11,0.37);
    // point[5] = vec2(0.70,0.17);
    // point[6] = u_mouse/u_resolution;
    point[4] = 0.5 + circularMotion / 3.5;


    float m_dist = 1.;  // minimun distance

    // Iterate through the points positions
    for (int i = 0; i < 5; i++) {
        float dist = distance(st, point[i]);

        // Keep the closer distance
        m_dist = min(m_dist, dist);
    }

    // Draw the min distance (distance field)
    // Show isolines
    color += vec3(st, .7);
    color -= step(.7, abs(sin(210. * m_dist))) * .35;
    color *= shapeBorder(st, m_dist, .35);
    color += shapeBorder(st, m_dist + .2, .19);

    gl_FragColor = vec4(color, 1.0);
}

