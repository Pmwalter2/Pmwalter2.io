var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var vts = `#version 300 es
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec2 a_texcoord;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
`;//vertex TEXTURE shader

var vTs2 = `#version 300 es
uniform mat4 u_worldViewProjection;

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec4 v_position;
out vec2 v_texCoord;

void main() {
  v_texCoord = a_texcoord;
  gl_Position = u_worldViewProjection * a_position;
}
`;//another textures vertex shader

var vs1luz = `#version 300 es

in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform vec3 u_lightWorldPosition0;
uniform vec3 u_viewWorldPosition;



uniform mat4 u_world;
uniform mat4 u_matrix;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec3 v_surfaceToLight0;
out vec3 v_surfaceToView0;
out vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
  
  v_normal = mat3(u_worldInverseTranspose) * (a_normal);
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;
  v_surfaceToLight0 = u_lightWorldPosition0 - surfaceWorldPosition;
  v_surfaceToView0 = u_viewWorldPosition - surfaceWorldPosition;

  v_texcoord = a_texcoord;
}
`;

var vsLuzTutorial = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

// varyings to pass values to the fragment shader
out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;
out vec2 v_texcoord;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_worldViewProjection * a_position;

  // orient the normals and pass to the fragment shader
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  // compute the world position of the surfoace
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  // compute the vector of the surface to the light
  // and pass it to the fragment shader
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  // compute the vector of the surface to the view/camera
  // and pass it to the fragment shader
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

  v_texcoord = a_texcoord;

}
`;

var vs3luz = `#version 300 es

in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform vec3 u_lightWorldPosition0;
uniform vec3 u_viewWorldPosition;
uniform vec3 u_lightWorldPosition1;
uniform vec3 u_lightWorldPosition2;


uniform mat4 u_world;
uniform mat4 u_matrix;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec3 v_surfaceToLight0;
out vec3 v_surfaceToView0;
out vec3 v_surfaceToLight1;
out vec3 v_surfaceToView1;
out vec3 v_surfaceToLight2;
out vec3 v_surfaceToView2;
out vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
  
  v_normal = mat3(u_worldInverseTranspose) * (a_normal);
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;
  v_surfaceToLight0 = u_lightWorldPosition0 - surfaceWorldPosition;
  v_surfaceToView0 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight1 = u_lightWorldPosition1 - surfaceWorldPosition;
  v_surfaceToView1 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight2 = u_lightWorldPosition2 - surfaceWorldPosition;
  v_surfaceToView2 = u_viewWorldPosition - surfaceWorldPosition;
  v_texcoord = a_texcoord;
}
`;


//=================================================================================================


var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult;
}
`;

var fts= `#version 300 es

precision highp float;

// Passed in from the vertex shader.
in vec2 v_texcoord;

// The texture.
uniform sampler2D u_texture;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = texture(u_texture, v_texcoord);
}
`;//fragment TEXTURE shader

var fTs2= `#version 300 es
precision mediump float;

in vec4 v_position;
in vec2 v_texCoord;

uniform vec4 u_diffuseMult;
uniform sampler2D u_diffuse;

void main() {
  vec4 diffuseColor = texture2D(u_diffuse, v_texCoord) * u_diffuseMult;
  if (diffuseColor.a < 0.1) {
    discard;
  }
  gl_FragColor = diffuseColor;
}
`;//fragment TEXTURE shader

var fs1luz = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec3 v_normal;
in vec3 v_surfaceToLight0;
in vec3 v_surfaceToView0;
in vec2 v_texcoord;

uniform vec4 u_color;
uniform float u_shininess;

uniform vec3 u_lightColor0;
uniform vec3 u_specularColor0;


uniform sampler2D u_texture;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection0 = normalize(v_surfaceToLight0);
  vec3 surfaceToViewDirection0 = normalize(v_surfaceToView0);

  vec3 halfVector0 = normalize(surfaceToLightDirection0 + surfaceToViewDirection0);
  float light0 = max(dot(v_normal, surfaceToLightDirection0),0.0);


  float specular0 = 0.0;

  outColor = texture(u_texture, v_texcoord);
  vec3 color0;

  vec3 spec0;


  specular0 = pow(dot(normal, halfVector0), u_shininess);


  if(light0>0.0){
  color0 = light0 * u_lightColor0;
  spec0 = specular0 * u_specularColor0;  
  }


  outColor.rgb *= (color0);
  outColor.rgb += spec0 ;
}
`;

var fsLuzTutorial =`#version 300 es

precision highp float;

// Passed in and varied from the vertex shader.
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // because v_normal is a varying it's interpolated
  // so it will not be a uint vector. Normalizing it
  // will make it a unit vector again
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  // compute the light by taking the dot product
  // of the normal to the light's reverse direction
  float light = dot(normal, surfaceToLightDirection);
  float specular = 0.0;
  if (light > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }

  outColor = texture(u_texture, v_texcoord);

  // Lets multiply just the color portion (not the alpha)
  // by the light
  outColor.rgb *= light * u_lightColor;

  // Just add in the specular
  outColor.rgb += specular * u_specularColor;
}`;

var fs3luz = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec3 v_normal;
in vec3 v_surfaceToLight0;
in vec3 v_surfaceToView0;
in vec3 v_surfaceToLight1;
in vec3 v_surfaceToView1;
in vec3 v_surfaceToLight2;
in vec3 v_surfaceToView2;
in vec2 v_texcoord;

uniform vec4 u_color;
uniform float u_shininess;

uniform vec3 u_lightColor0;
uniform vec3 u_specularColor0;

uniform vec3 u_lightColor1;
uniform vec3 u_specularColor1;

uniform vec3 u_lightColor2;
uniform vec3 u_specularColor2;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection0 = normalize(v_surfaceToLight0);
  vec3 surfaceToViewDirection0 = normalize(v_surfaceToView0);

  vec3 surfaceToLightDirection1 = normalize(v_surfaceToLight1);
  vec3 surfaceToViewDirection1 = normalize(v_surfaceToView1);

  vec3 surfaceToLightDirection2 = normalize(v_surfaceToLight2);
  vec3 surfaceToViewDirection2 = normalize(v_surfaceToView2);

  vec3 halfVector0 = normalize(surfaceToLightDirection0 + surfaceToViewDirection0);
  float light0 = max(dot(v_normal, surfaceToLightDirection0),0.0);

  vec3 halfVector1 = normalize(surfaceToLightDirection1 + surfaceToViewDirection1);
  float light1 = max(dot(v_normal, surfaceToLightDirection1),0.0);

  vec3 halfVector2 = normalize(surfaceToLightDirection2 + surfaceToViewDirection2);
  float light2 = max(dot(v_normal, surfaceToLightDirection2),0.0);

  float specular0 = 0.0;
  float specular1 = 0.0;
  float specular2 = 0.0;

  outColor = texture(u_texture, v_texcoord);
  vec3 color0;
  vec3 color1;
  vec3 color2;
  vec3 spec0;
  vec3 spec1;
  vec3 spec2;

  specular0 = pow(dot(normal, halfVector0), u_shininess);
  specular1 = pow(dot(normal, halfVector1), u_shininess);
  specular2 = pow(dot(normal, halfVector2), u_shininess);

  if(light0>0.0){
  color0 = light0 * u_lightColor0;
  spec0 = specular0 * u_specularColor0;  
  }

  if(light1>0.0){
  color1 = light1 * u_lightColor1;
  spec1 = specular1 * u_specularColor1;
  }

  if(light2>0.0){
  color2 = light2 * u_lightColor2;
  spec2 = specular2 * u_specularColor2;
  }
  outColor.rgb *= (color0+color1+color2);
  outColor.rgb += spec0 + spec1 + spec2 ;
}
`;



function makeGlContext(){
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  return gl;
}

function makeProgram(gl){
  twgl.setAttributePrefix("a_");
  //var programInfo = twgl.createProgramInfo(gl, [vs1luz, fs1luz]);
  var programInfo = twgl.createProgramInfo(gl, [vts, fts]);
  //var programInfo = twgl.createProgramInfo(gl, [vs3luz, fs3luz]);

return programInfo;
}
