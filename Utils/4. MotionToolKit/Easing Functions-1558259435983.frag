// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Easing Functions

#ifdef GL_ES
precision mediump float;
#endif

#define IVORY vec3(1.0, 0.9, 0.8)
#define SUNSET vec3(0.9, 0.3, 0.3)
#define NAVY vec3(0.0, 0.1, 0.2)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct - 0.005, pct, st.y) -
          smoothstep( pct, pct + 0.005, st.y);
}

float easeInQuad(float t) {
    return t * t;
}

float easeOutQuad(float t) {
    return -1.0 * t * (t - 2.0);
}

float easeInOutQuad(float t) {
    if ((t *= 2.0) < 1.0) {
        return 0.5 * t * t;
    } else {
        return -0.5 * ((t - 1.0) * (t - 3.0) - 1.0);
    }
}

float easeInCubic(float t) {
    return t * t * t;
}

float easeOutCubic(float t) {
    return (t = t - 1.0) * t * t + 1.0;
}

float easeInOutCubic(float t) {
    if ((t *= 2.0) < 1.0) {
        return 0.5 * t * t * t;
    } else {
        return 0.5 * ((t -= 2.0) * t * t + 2.0);
    }
}

float easeInExpo(float t) {
    return (t == 0.0) ? 0.0 : pow(2.0, 10.0 * (t - 1.0));
}

float easeOutExpo(float t) {
    return (t == 1.0) ? 1.0 : -pow(2.0, -10.0 * t) + 1.0;
}

float easeInOutExpo(float t) {
    if (t == 0.0 || t == 1.0) {
        return t;
    }
    if ((t *= 2.0) < 1.0) {
        return 0.5 * pow(2.0, 10.0 * (t - 1.0));
    } else {
        return 0.5 * (-pow(2.0, -10.0 * (t - 1.0)) + 2.0);
    }
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse.xy / u_resolution;
    float t = fract(u_time), n0 = st.y * 10.0, n1 = mouse.y * 10.0, v0, v1;

    vec3 color = IVORY;

    // Bar animations
    if (n0 < 1.0) {
      v0 = step(st.x, t);
    } else if (n0 < 2.0) {
      v0 = step(st.x, easeInQuad(t));
    } else if (n0 < 3.0) {
      v0 = step(st.x, easeOutQuad(t));
    } else if (n0 < 4.0) {
      v0 = step(st.x, easeInOutQuad(t));
    } else if (n0 < 5.0) {
      v0 = step(st.x, easeInCubic(t));
    } else if (n0 < 6.0) {
      v0 = step(st.x, easeOutCubic(t));
    } else if (n0 < 7.0) {
      v0 = step(st.x, easeInOutCubic(t));
    } else if (n0 < 8.0) {
      v0 = step(st.x, easeInExpo(t));
    } else if (n0 < 9.0) {
      v0 = step(st.x, easeOutExpo(t));
    } else {
      v0 = step(st.x, easeInOutExpo(t));
    }
    color = mix(color, SUNSET, v0);

    // Mouse over to plot graph
    if (n1 < 1.0) {
      v1 = st.x;
    } else if (n1 < 2.0) {
      v1 = easeInQuad(st.x);
    } else if (n1 < 3.0) {
      v1 = easeOutQuad(st.x);
    } else if (n1 < 4.0) {
      v1 = easeInOutQuad(st.x);
    } else if (n1 < 5.0) {
      v1 = easeInCubic(st.x);
    } else if (n1 < 6.0) {
      v1 = easeOutCubic(st.x);
    } else if (n1 < 7.0) {
      v1 = easeInOutCubic(st.x);
    } else if (n1 < 8.0) {
      v1 = easeInExpo(st.x);
    } else if (n1 < 9.0) {
      v1 = easeOutExpo(st.x);
    } else {
      v1 = easeInOutExpo(st.x);
    }

    float v2 = plot(st, v1);
    color = mix(color, NAVY, v2);

    gl_FragColor = vec4(color, 1.0);
}
