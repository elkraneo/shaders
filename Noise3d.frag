#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//---------------------------------------------------------------------

#define seed 43758.5453123

vec2 random2(vec2 st) {
  st = vec2(dot(st, vec2(127.1, 311.7)),
            dot(st, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(st) * seed);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix( mix( dot( random2(i + vec2(0.0, 0.0) ), f - vec2(0.0, 0.0) ),
                   dot( random2(i + vec2(1.0, 0.0) ), f - vec2(1.0, 0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0, 1.0) ), f - vec2(0.0, 1.0) ),
                   dot( random2(i + vec2(1.0, 1.0) ), f - vec2(1.0, 1.0) ), u.x), u.y);
}

float circle(in vec2 _st, in float _radius) {
  vec2 dist = _st - vec2(0.5);
  return 1. - smoothstep(_radius - (_radius * 0.01),
   _radius + (_radius * 0.01),
   dot(dist, dist) * 4.0);
}

vec2 rotate2D(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), -sin(_angle),
               sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 noiseTranslate(in vec2 _st) {
  vec2 translate = vec2(noise(_st));
  _st += translate * 7.;
  return _st + rotate2D(_st, sin(u_time));
}

//---------------------------------------------------------------------

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  st *= 4.0; 
  st -= 2.; 

  vec3 color = vec3(0.0, .7, .7);
  

  st += noiseTranslate(st);

  for(int i = 0; i <= 10; i++) { 
    color += circle(st + vec2(float(i)), 1.);
  }


  gl_FragColor = vec4(color, 1.0);
}
