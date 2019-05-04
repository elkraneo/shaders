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

float shapeBorder(vec2 st, float radius, float width) {
  return circle(st, radius) - circle(st, radius - width);
}

  // RGB to YUV matrix
mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722,
                    -0.09991, -0.33609, 0.43600,
                    0.615, -0.5586, -0.05639);

// YUV to RGB matrix
mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
                    1.0, -0.39465, -0.58060,
                    1.0, 2.03211, 0.0);

//---------------------------------------------------------------------

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  st *= 4.0; 
  st -= 2.0; 

  vec3 color = vec3(0.0);

  vec2 translate = vec2(noise(st) * sin(u_time), noise(st) * cos(u_time));
  st += translate * .35;
  
  color += shapeBorder(st, 2., 1.);

  color.r *= smoothstep(0.1, abs(translate.y), color.r);
  color.g *= abs(translate.x);
  color.b /= abs(translate.y);

  color.g += shapeBorder(st, 3., .5);
  color.b += shapeBorder(st, 4., .5);

  
  gl_FragColor = vec4(color, 1.0);
}
