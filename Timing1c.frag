#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//--------------------------------------------—-

#define PI 3.14159265358979323846
#define TWO_PI 6.28318530718

#define IVORY vec3(1.0, 0.9, 0.8)
#define SUNSET vec3(0.9, 0.3, 0.3)
#define NAVY vec3(0.0, 0.1, 0.2)

vec2 rotate2D(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), -sin(_angle),
               sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
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
    vec3 color = vec3(.09);
   
    // UV values goes from -1 to 1
    // So we need to remap st (0.0 to 1.0)
    st -= 0.5; // becomes -0.5 to 0.5
    st *= 14.0; // becomes -1.0 to 1.0

    st += .25;
    st += rotate2D(st, easeInOutExpo(abs(sin(u_time))) * TWO_PI);
    
    
    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5) - st;
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter) * 2.0;

    float t = abs(sin(u_time)), n0 = radius, v0;
    
    // Bar animations
    if (n0 < 1.0) {
      v0 = smoothstep(.01, .35, t);
    } else if (n0 < 2.0) {
      v0 = smoothstep(.01, .35, easeInQuad(t));
    } else if (n0 < 3.0) {
      v0 = smoothstep(.01, .35, easeOutQuad(t));
    } else if (n0 < 4.0) {
      v0 = smoothstep(.01, .35, easeInOutQuad(t));
    } else if (n0 < 5.0) {
      v0 = smoothstep(.01, .35, easeInCubic(t));
    } else if (n0 < 6.0) {
      v0 = smoothstep(.01, .35, easeOutCubic(t));
    } else if (n0 < 7.0) {
      v0 = smoothstep(.01, .35, easeInOutCubic(t));
    } else if (n0 < 8.0) {
      v0 = smoothstep(.01, .35, easeInExpo(t));
    } else if (n0 < 9.0) {
      v0 = smoothstep(.01, .35, easeOutExpo(t));
    } else if (n0 < 10.0) {
      v0 = smoothstep(.01, .35, easeOutExpo(t));
    } else {
      v0 = smoothstep(.0, radius, easeInOutExpo(t));
    }
    
    color += mix(color, vec3(st, abs(cos(t))), v0);

    gl_FragColor = vec4(color, 1.0);
}
