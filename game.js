let grid;
let cols;
let fils;
let ancho;
let alto;
var canvas;
let bias = 0.1;
let bool_comenzar = true;
let resolution = 5;

function Make2DArray(cols, fils) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
			arr[i] = new Array(fils);
	}
	return arr;
}

function create_array(bias){

	grid = Make2DArray(cols, fils);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < fils; j++) {
			if (i == 0 || i == cols - 1 || j == 0 || j == fils - 1){
				grid[i][j] = 0;
			} else {
				val = Math.random();
				if (val <= bias){
					grid[i][j] = 1;
				} else {
					grid[i][j] = 0;
				}
				
			}
		}
	}
}

function setup() {

	let ancho = windowWidth;
	let alto = windowHeight;

	canvas = createCanvas(ancho, alto);
	canvas.parent('container');
	canvas.position(0, 0);
	canvas.style('z-index', '-1');

	cols = round(ancho / resolution);
	fils = round(alto / resolution);
	frameRate(30);
 
	create_array(bias);
}

function draw() {
	background(0);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < fils; j++) {
			let x = i * resolution;
			let y = j * resolution;
			if (grid[i][j]==1) {
				fill(255);
				stroke(0);
				rect(x, y, resolution, resolution);
			}
		}
	}
	let next = Make2DArray(cols, fils);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < fils; j++) {

			let state = grid[i][j];
			if (i == 0 || i == cols - 1 || j == 0 || j == fils - 1){
				next[i][j] = state;
			} else {
				let neighbors = countNeighbors(grid, i, j);

		 
				if (state == 0 && neighbors == 3){
					next[i][j] = 1;
				} else if (state == 1 && (neighbors < 2 || neighbors > 3)){
					next[i][j] = 0;
				} else {
					next[i][j] = state;
				}
			}
		}
	}
	if (bool_comenzar == true){
		simular(next);
	}

	
}

function countNeighbors(grid, x, y){
	let sum = 0;
	for (let i = - 1; i < 2; i++){
		for (let j = - 1; j < 2; j++){
			sum += grid[x + i][y + j];
		}
	}
	sum -= grid[x][y];
	return sum;
}

function simular(nuevo){
	grid = nuevo;
}

function sliderUpdate(valor){
	valor = document.getElementById("slider").value;
	if (valor == 3){
		resolution = 15;
	} else if (valor == 4){
		resolution = 7;
	} else if (valor == 5){
		resolution = 6;
	} else if (valor == 6){
		resolution = 5;
	} else if (valor == 7){
		resolution = 4;
	} else if (valor == 8){
		resolution = 3;
	} 

	bool_comenzar = true;
	document.getElementById("btn_pause").innerText = "Detener";
	create_array(bias);
	setup();
	
}

function comenzar(){
	bool_comenzar = ! bool_comenzar;
	if (bool_comenzar){
		document.getElementById("btn_pause").innerText = "Detener"
	} else {
		document.getElementById("btn_pause").innerText = "Comenzar"
	}
}

function reiniciar(){
	create_array(bias);
	setup();
	bool_comenzar = true;
	document.getElementById("btn_pause").innerText = "Detener";
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}