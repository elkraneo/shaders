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

//---------------------------------------------------------------------

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  st *= 5.0; 
  st -= 2.0; 

  vec3 color = vec3(0.0);

  vec2 translate = vec2(sin(u_time) , cos(u_time));
  translate.x += noise(st);
  translate.y += noise(st);

  st += translate * 1.;

  color += circle(st, 2.);
  
  gl_FragColor = vec4(color, 1.0);
}
