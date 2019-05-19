// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Tween Animations

#ifdef GL_ES
precision mediump float;
#endif
#define WHITE vec3(1.0, 1.0, 1.0)
#define SWEETPEA vec3(1.0, 0.7, 0.75)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float linearstep(float begin, float end, float t) {
    return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float easeInOutCubic(float t) {
    if ((t *= 2.0) < 1.0) {
        return 0.5 * t * t * t;
    } else {
        return 0.5 * ((t -= 2.0) * t * t + 2.0);
    }
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

float smoothedge(float v, float f) {
    return smoothstep(0.0, f / u_resolution.x, v);
}

float circle(vec2 p, float radius) {
  return length(p) - radius;
}

float dotPlot(vec2 p) {
  return 1.0 - smoothedge(circle(p, 0.05), 1.0);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float t = fract(u_time / 2.0), v;

    float t0 = linearstep(0.2, 0.6, t);
    float p0 = easeInOutCubic(t0);
    v = dotPlot(st - vec2(mix(0.2, 0.8, p0), 0.2));

    float t1 = linearstep(0.2, 0.6, t);
    float p1 = easeInOutExpo(t1);
    v = max(v, dotPlot(st - vec2(mix(0.2, 0.8, p1), 0.6)));

    float t2 = linearstep(0.1, 0.5, t);
    float p2 = easeInOutCubic(t2);
    float t3 = linearstep(0.6, 1.0, t);
    float p3 = easeInOutCubic(t3);
    v = max(v, dotPlot(st - vec2(mix(0.2, 0.8, p2 - p3), 0.4)));

    float t4 = linearstep(0.1, 0.5, t);
    float p4 = easeInOutExpo(t4);
    float t5 = linearstep(0.6, 1.0, t);
    float p5 = easeInOutExpo(t5);
    v = max(v, dotPlot(st - vec2(mix(0.2, 0.8, p4 - p5), 0.8)));

    vec3 color = mix(SWEETPEA, WHITE, v);
    gl_FragColor = vec4(color, 1.0);
}
