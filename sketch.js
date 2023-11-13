let source;
let tiles = [];
let cols = 4;
let rows = 4;
let w, h;
let board = [];
let coolfont;

let marinara;

class Tile {
  constructor(i, img) {
    this.index = i;
    this.img = img;
  }
}

function preload() {
  jsonData = loadJSON('json.json');

  coolfont = ('Langar');
}

function setup() {
  textFont(coolfont);
  createCanvas(400, 400);
  source = createGraphics(400, 400);
  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      let index = i + j * cols;
      board.push(index);
      let tile = new Tile(index, img);
      tiles[index] = tile;
    }
  }

  let generateButton = createButton('New');
  generateButton.mousePressed(generateRandomLanguage);

  jsonParagraph = createP();
  generateRandomLanguage();
  tiles.pop();
  board.pop();
  board.push(-1);
  startViz();
  simpleShuffle(board);
}

let jsonData;
let jsonParagraph;

function generateRandomLanguage() {
  background(0);

  let randomLanguage = getRandomLanguage();
  let htmlContent = `<h2>Hint</h2><br> <b>${randomLanguage}</b><br>`;

  let randomGreeting = random(jsonData[randomLanguage].greetings);
  let greetingParts = randomGreeting.split('(');
  let cleanGreeting = greetingParts[0].trim();
  let delayedHtmlContent = `<i></i> ${cleanGreeting}<br>`;
  // Display the clean greeting after 10 seconds
  setTimeout(function () {
    
    jsonParagraph.html(delayedHtmlContent, false);
  }, 19000);

  htmlContent += "<i></i><br>";
  for (let country of jsonData[randomLanguage].countries) {
    htmlContent += ` ${country.name}<br>`;
  }

  jsonParagraph.html(htmlContent, false);
  console.log("Random Language:", randomLanguage);
  console.log("Random Greeting:", cleanGreeting);
  console.log("Countries:", jsonData[randomLanguage].countries);

  marinara = cleanGreeting;
}

function getRandomLanguage() {
  let languages = Object.keys(jsonData);
  let randomIndex = floor(random(languages.length));
  return languages[randomIndex];
}

function updateTiles() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let index = i + j * cols;
      if (tiles[index])
        tiles[index].img.copy(source, x, y, w, h, 0, 0, w, h);
    }
  }
}

function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function randomMove(arr) {
  let r1 = floor(random(cols));
  let r2 = floor(random(rows));
  move(r1, r2, arr);
}

function simpleShuffle(arr) {
  for (let i = 0; i < 1000; i++) {
    randomMove(arr);
  }
}

function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  move(i, j, board);
}

function draw() {
  background(0);
  drawViz();
  updateTiles();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = i + j * cols;
      let x = i * w;
      let y = j * h;
      let tileIndex = board[index];
      if (tileIndex > -1) {
        let img = tiles[tileIndex].img;
        
        // Draw rounded rectangle with a border radius of 10
        fill(255);
        stroke(255);
        strokeWeight(1);
        rectMode(CENTER);
        rect(x + w/2, y + h/2, w, h, 10);
        
        // Display the image with rounded corners
        image(img, x, y, w, h);
      }
    }
  }
}

function move(i, j, arr) {
  let blank = findBlank();
  let blankCol = blank % cols;
  let blankRow = floor(blank / rows);

  if (isNeighbor(i, j, blankCol, blankRow)) {
    swap(blank, i + j * cols, arr);
  }
}

function isNeighbor(i, j, x, y) {
  if (i !== x && j !== y) {
    return false;
  }

  if (abs(i - x) == 1 || abs(j - y) == 1) {
    return true;
  }
  return false;
}

function findBlank() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == -1) return i;
  }
}

function startViz() {
  source.textSize(40);
  source.textAlign(CENTER, CENTER);
  source.text(marinara, width / 2, height / 2);
}

function drawViz() {
  source.textFont(coolfont, 40);
  source.background(10);
  source.fill(255);
  source.noStroke();
  source.text(marinara, width / 2, height / 2);
}