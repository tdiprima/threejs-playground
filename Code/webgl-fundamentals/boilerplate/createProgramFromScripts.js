/**
 * Creates a program from 2 script tags.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string[]} shaderScriptIds Array of ids of the script
 *        tags for the shaders. The first is assumed to be the
 *        vertex shader, the second the fragment shader.
 * @return {!WebGLProgram} A program
 */
function createProgramFromScripts(gl, shaderScriptIds) {
  let vertexShader = createShaderFromScript(gl, shaderScriptIds[0], gl.VERTEX_SHADER);
  let fragmentShader = createShaderFromScript(gl, shaderScriptIds[1], gl.FRAGMENT_SHADER);
  return createProgram(gl, vertexShader, fragmentShader);
}

// let program = createProgramFromScripts(gl, [idOfVertexShaderScript, idOfFragmentShaderScript]);
