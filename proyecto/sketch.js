/*
  Representación gráfica del algoritmo genético, se toman los genes de cada individuo y se modifican
  los siguientes atributos de cada objeto:
  A - TAMAÑO
  B - COLOR EXTERIOR
  C - VIBRACIÓN
  D - COLOR INTERIOR
*/

// Arreglo donde se guardarán las bacterias actuales
let bacterias = []; 
var bacteriasUltGen = [];


// Indica en qué ciclo se encuentra la representación gráfica
var iteracionGraficaActual = 0;

// Variables para controlar los frames por segundo y la cantidad de segundos que se desea que dure una generación en pantalla
var segundosPorGeneracion = 3;
var framesPorSegundo = 60;
var framesTotales = segundosPorGeneracion * framesPorSegundo;
var frameActual = 0;
//var valueInput;

function myInputEvent() {
  valueInput = this.value();
}

function iniciarProceso(){
  if(valueInput){
    limiteIteraciones = (+valueInput + 1);
    console.log(limiteIteraciones);
    algoritmoGenetico(cromosomaA1, cromosomaA2, cromosomaA3, cromosomaA4, cromosomaA5, cromosomaA6, 1);
  } else {
    limiteIteraciones = 0;
    algoritmoGenetico(cromosomaA1, cromosomaA2, cromosomaA3, cromosomaA4, cromosomaA5, cromosomaA6, 1);
  }

  loop();
}

function setup() {

  // Creación del canvas
  //createCanvas(1870, 950);
  createCanvas(screen.width - 45, screen.height - 115);

  let inp = createInput('');
  inp.position(screen.width - (screen.width / 2), 340);
  inp.size(100);
  inp.input(myInputEvent);


  button = createButton('Start');
  button.position(screen.width - (screen.width / 2), 370);
  button.mousePressed(iniciarProceso);


  // Creación de objetos dentro del arreglo de bacterias, se toman los valores del arreglo valoresIteraciones donde se guardaron todos los
  // genes A, B, C y D de cada individuo
  for (let i = 0; i < 6; i++) {
    bacterias.push(new Bacteria(valoresIteraciones[i][iteracionGraficaActual * 4], valoresIteraciones[i][iteracionGraficaActual * 4 + 1], 
                                valoresIteraciones[i][iteracionGraficaActual * 4 + 2], valoresIteraciones[i][iteracionGraficaActual * 4 + 3]));
  } 

  // Aumenta la variable del ciclo actual
  iteracionGraficaActual++;

  // Se configuran los frames por segundo a los que correrá la animación
  frameRate(framesPorSegundo);
  noLoop();
}

function draw() {
  // Texto que explica a grandes rasgos en lo que impacta cada gen en la animación
  background(50, 89, 100);
  fill(255, 255, 255);
  textSize(25);
  text('Representación Gráfica', screen.width - (screen.width / 2), 80);
  textSize(20);
  text('El gen A controla el tamaño de la bacteria', screen.width - (screen.width / 2), 130);
  text('El gen B controla el color de la circunferencia exterior', screen.width - (screen.width / 2), 160);
  text('El gen C controla la intensidad de la vibración', screen.width - (screen.width / 2), 190);
  text('El gen D controla el color del círculo interior', screen.width - (screen.width / 2), 220);
  text('-----------------------------------------------', screen.width - (screen.width / 2), 250);
  text('Ingrese el número de iteraciones', screen.width - (screen.width / 2), 280);
  text('(Si se deja en blanco el ciclo se hará hasta satisfacer la ecuación)', screen.width - (screen.width / 2), 310);
  
  //Indica el numero de generaciones
  text('Generación ' + (iteracionGraficaActual - 1), screen.width - (screen.width / 2), 430);


  // Si no se han terminado los frames totales de la animación entonces sigue todo normal
  if (frameActual++ < framesTotales) {
    for (let i = 0; i < bacterias.length; i++) {
      bacterias[i].vibrar();
      bacterias[i].dibujar();
    }

    if(iteracionGraficaActual == limiteIteraciones && frameActual >= framesTotales){
      noLoop();
    }
    // Si ya se terminaron los frames de los 3 segundos, entonces se pasa a la siguiente generación
  } else {
    // Se vacía el arreglo de bacterias y se introducen nuevos objetos que contendrán los genes actualizados para la generación actual que se
    // está representando
    bacterias = [];
    for (let i = 0; i < 6; i++) {
      bacterias.push(new Bacteria(valoresIteraciones[i][iteracionGraficaActual * 4], valoresIteraciones[i][iteracionGraficaActual * 4 + 1], 
                                  valoresIteraciones[i][iteracionGraficaActual * 4 + 2], valoresIteraciones[i][iteracionGraficaActual * 4 + 3]));
    } 

    // Se reinician los frames
    frameActual = 0;

    
    // Aumenta la variable del ciclo
    iteracionGraficaActual++;
  }
}

// Clase bacteria
class Bacteria {
  constructor(valorA, valorB, valorC, valorD) {

    // Se reciben los 4 genes y se asignan a los atributos correspondientes
    this.A = valorA;
    this.B = valorB;
    this.C = valorC;
    this.D = valorD;

    // Se crea una posición aleatoria para el inicio del dibujo de la bacteria
    this.x = random(width - 1000) + 50;
    this.y = random(height - 300) + 50;

    // Se le da un tamaño dependiendo del gen A
    this.diametro = 20 + this.A * 4;

    // Se le asigna un color a la circunferencia exterior
    this.colorPrincipal = asignarColor(this.B);

    // Se defina la velocidad de vibración con el gen C
    switch (this.C) {
      case 1: case 2: case 3: case 4: case 5: case 6: case 7: this.velocidad = 1;
        break;
      case 8: case 9: case 10: case 11: case 12: case 13: case 14: this.velocidad = 2;
        break;
      case 15: case 16: case 17: case 18: case 19: case 20: this.velocidad = 3;
        break;
      default: this.velocidad = 1;
    }

    // Se le asigna un color al círculo interior
    this.colorSecundario = asignarColor(this.D);
  }

  // Se modifica aleatoriamente la posición de la bacteria para dar la impresión de vibración 
  // dependiendo de la velocidad que se asignó por el gen C
  vibrar() {
    this.x += random(-this.velocidad, this.velocidad);
    this.y += random(-this.velocidad, this.velocidad);
  }

  // Se dibuja tanto el circulo interior como la circunferencia exterior tomando en cuenta
  // el diámetro dado por el gen A y los colores de los genes B y D
  dibujar() {
    fill(this.colorPrincipal);
    ellipse(this.x, this.y, this.diametro, this.diametro);
    fill(this.colorSecundario);
    ellipse(this.x, this.y, this.diametro / 2, this.diametro / 2);
  }
}

// Función de asignación de color para los genes B y D
function asignarColor(X) {
  switch (X) {
    case 1: return color(0, 255, 0);
      break;
    case 2: return color (42, 210, 84);
      break;
    case 3: return color(84, 168, 168);
      break;
    case 4: return color(126, 126, 255);
      break;
    case 5: return color(168, 84, 210);
      break;
    case 6: return color(210, 42, 126);
      break;
    case 7: return color(255, 0, 42);
      break;
    case 8: return color(0, 0, 255);
      break;
    case 9: return color(84, 42, 210);
      break;
    case 10: return color(168, 84, 168);
      break;
    case 11: return color(255, 126, 126);
      break;
    case 12: return color(210, 168, 84);
      break;
    case 13: return color(126, 210, 42);
      break;
    case 14: return color(42, 255, 0);
      break;
    case 15: return color(255, 0, 0);
      break;
    case 16: return color(255, 102, 51);
      break;
    case 17: return color(204, 204, 102);
      break;
    case 18: return color(153, 255, 153);
      break;
    case 19: return color(102, 153, 204);
      break;
    case 20: return color(0, 51, 255);
      break;
    default: return color(0, 255, 0);
  }
}