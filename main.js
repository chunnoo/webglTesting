var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

function Draw() {

  var vertices = [
    -0.75, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
    0.75, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,
    -0.75, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
    -0.75, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
    0.75, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,
    0.75, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0
  ];
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var texture = gl.createTexture();
  HandleLoadedTexture(textureImage, texture);

  var vertexShaderSource = document.getElementById("vsh").contentDocument.firstChild.lastChild.textContent;
  //console.log(vertexShaderSource);
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  console.log(gl.getShaderInfoLog(vertexShader));

  var fragmentShaderSource = document.getElementById("fsh").contentDocument.firstChild.lastChild.textContent;
  //console.log(fragmentShaderSource);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  console.log(gl.getShaderInfoLog(fragmentShader));

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  var vCoord = gl.getAttribLocation(shaderProgram, "vCoord");
  gl.vertexAttribPointer(vCoord, 2, gl.FLOAT, false, 4*8, 0);
  gl.enableVertexAttribArray(vCoord);

  var vColor = gl.getAttribLocation(shaderProgram, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 4*8, 4*2);
  gl.enableVertexAttribArray(vColor);

  var vTexCoord = gl.getAttribLocation(shaderProgram, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 4*8, 4*6);
  gl.enableVertexAttribArray(vTexCoord);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  var textureUniform = gl.getUniformLocation(shaderProgram, "fSampler");
  gl.uniform1i(textureUniform, 0);

  gl.clearColor(0.125, 0.125, 0.125, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function HandleLoadedTexture(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

var loadedItems = 0; //Texture, Vertex Shader and Fragment Shader

document.getElementById("vsh").onload = function() {loadedItems++; if (loadedItems == 3) {Draw()}};
document.getElementById("fsh").onload = function() {loadedItems++; if (loadedItems == 3) {Draw()}};

var textureImage = new Image();
textureImage.onload = function() {loadedItems++; if (loadedItems == 3) {Draw()}};
textureImage.src = "tree.png";
