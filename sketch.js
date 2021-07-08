var trex, trex_running, trex_choque, trex_fin;
var piso, invisiblepiso, pisoImage;
var nube;
var o1, o2, o3, o4, o5, o6;
var puntaje_trex,
  puntajeFinal = 0;
var estado = "inicio";
var nuevoJuego;
var sonidoSalto;
var reiniciar, reinicio, fin;
var base=0, alto=0;
var baseC=0, alturaC=0, salto=0;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_fin = loadImage("trexFin.png");
  pisoImage = loadImage("ground2.png");
  nube = loadImage("cloud.png");
  nuevoJuego = loadImage("gameOver.png");
  reinicio = loadImage("restart.png");

  o1 = loadImage("obstacle1.png");

  o2 = loadImage("obstacle2.png");

  o3 = loadImage("obstacle3.png");

  o4 = loadImage("obstacle4.png");

  o5 = loadImage("obstacle5.png");

  o6 = loadImage("obstacle6.png");

  sonidoSalto = loadSound("die.mp3");
}

function setup() {
  baseC=windowWidth*0.6;
  alturaC=windowHeight*0.6;
  base=baseC-50;
  alto=alturaC-50
  createCanvas(baseC, alturaC);
  puntaje_trex = 0;
  

  //crea un suelo invisible
  invisiblepiso = createSprite(40, height-50, 100, 10);
  invisiblepiso.visible = true;

  //crea el sprite del suelo
  piso = createSprite(width/2, height-50);
  piso.addImage("piso", pisoImage);
  piso.velocityX = -4;
  piso.x = piso.width / 2;

  //crea el sprite del Trex
  trex = createSprite(50, height-50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 40);
  trex.debug = true;
  

  trex_choque = createSprite(50, height-5);
  trex_choque.addAnimation("chocando", trex_fin);
  trex_choque.scale = 0.5;
  trex_choque.visible = false;

  fin = createSprite(width/2, height/2);
  fin.addImage("final", nuevoJuego);
  fin.scale = 0.25;
  fin.visible = false;

  reiniciar = createSprite(width / 2, height/2+30);
  reiniciar.addImage("GOver", reinicio);
  reiniciar.scale = 0.4;
  reiniciar.visible = false;

  //crea GRUPOS de nubes y GRUPOS de obstaculos
  grupoNubes = new Group();
  grupoObstaculos = new Group();
}

function draw() {
  //establece el color del fondo
  background("pink");

  if (estado == "inicio") {
    cielo();
    obstaculos();
    puntaje();
    //salta cuando se presiona la barra espaciadora y está en el piso&& trex.y >= piso.y-25
    if (touches.length>0 || keyDown("space") ) { 
      trex.velocityY = -10;
      touches=[];
   // sonidoSalto.play();
    }
    //agrega gravedad
    trex.velocityY = trex.velocityY + 0.5;

    if (piso.x < 0) piso.x = piso.width / 2;

    if (grupoObstaculos.isTouching(trex)) {
      estado = "final";
    }
  }
  if (estado == "final") {
    grupoObstaculos.setVelocityXEach(0);
    grupoNubes.setVelocityXEach(0);
    piso.velocityX = 0;
    trex.velocityY = 0;
    puntajeFinal = puntaje_trex;
    trex.visible = false;
    trex_choque.x = trex.x;
    trex_choque.y = trex.y;
    trex_choque.visible = true;

    grupoObstaculos.setLifetimeEach(-1);
    grupoNubes.setLifetimeEach(-1);
    Elfinal();
    if (touches.length>0 || mousePressedOver(reiniciar)) {
      touches=[];
      reset();
    }
  }

  //evita que el Trex caiga
  trex.collide(invisiblepiso);
  drawSprites();

  console.log(trex.y);
}

function cielo() {
  // Cada_-cuadros se crea una nube y se destruye
  if (frameCount % 60 === 0) {
    var nubes = createSprite(width, random(20, height/2));
    nubes.addImage("volando", nube);
    nubes.scale = 0.5;
    nubes.velocityX = -3;
    nubes.lifetime = 250;
    nubes.depth = trex.depth;
    trex.depth = trex.depth + 1;
    grupoNubes.add(nubes);
  }
}

function obstaculos() {
  var tipo_obstaculo, obstaculo;
  tipo_obstaculo = Math.round(random(1, 6));
  if (frameCount % 60 == 0) {
    obstaculo = createSprite(width,height-70);
    obstaculo.scale = 0.5;
    obstaculo.velocityX = -(4 + puntaje_trex / 100);
    piso.velocityX = obstaculo.velocityX;
    obstaculo.depth = trex.depth;

    switch (tipo_obstaculo) {
      case 1:
        obstaculo.addImage(o1);
        break;
      case 2:
        obstaculo.addImage(o2);
        break;
      case 3:
        obstaculo.addImage(o3);
        break;
      case 4:
        obstaculo.addImage(o4);
        break;
      case 5:
        obstaculo.addImage(o5);
        break;
      case 6:
        obstaculo.addImage(o6);
        break;
    }
    obstaculo.lifetime = 200;
    grupoObstaculos.add(obstaculo);
  }
}

function puntaje() {
  //puntaje_trex = Math.round(frameCount / 5);
  puntaje_trex = puntaje_trex + Math.round(getFrameRate() / 60);
  puntajeFinal = puntaje_trex;
  fill("black");
  text("Puntuación: " + puntaje_trex, 25, 15);
}

function Elfinal() {
  fin.visible = true;
  reiniciar.visible = true;
  fill("black");
  text("Puntuación: " + puntajeFinal, 25, 15);
}

function reset() {
  estado = "inicio";
  puntaje_trex = 0;
  grupoObstaculos.destroyEach();
  grupoNubes.destroyEach();
  fin.visible = false;
  reiniciar.visible = false;
  trex_choque.visible = false;
  trex.visible = true;
  piso.velocityX=-4;
}
