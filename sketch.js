var cellWidth
var cellHeight
var cellCount = 8
var cells = []
var colorPicker = document.querySelector('input[type=color]')
var bombs = []
var i
var j
var playButton

class Cell {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.alive = false
  }
  live() {
    this.alive = true
    textSize(32)
   
    fill(200, 100, 150, 255)
    rect(this.x * cellWidth, this.y * cellHeight, cellWidth, cellHeight)
    fill(255)
    text(`${this.x} ${this.y}`, this.x * cellWidth + cellWidth / 4, this.y * cellHeight + cellHeight / 2)
  }

  dead() {
    this.alive = false
    fill(200)
    rect(this.x * cellWidth, this.y * cellHeight, cellWidth, cellHeight)

  }
}

function drawBoard() {
  cellWidth = width / cellCount
  cellHeight = height / cellCount
  background(100)

  for (var i = 0; i < cellCount; i++) {
    for (var j = 0; j < cellCount; j++) {
      var cell = new Cell(i, j)
      cells.push(cell)
      cell.dead()
    }
  }
}

function setup() {
  createCanvas(600, 600)
  drawBoard()
  playButton = createButton('play')
  playButton.mousePressed(play)
}

function getAliveNeighborsCount(i, j, previousState) {
  var aboveLeft = (i - 1) * cellCount + (j - 1)
  var aboveCenter = (i - 1) * cellCount + j
  var aboveRight = (i - 1) * cellCount + (j + 1)

  var left = i * cellCount + (j - 1)
  var right = i * cellCount + (j + 1)

  var bottomLeft = (i + 1) * cellCount + (j - 1)
  var bottomCenter = (i + 1) * cellCount + j
  var bottomRight = (i + 1) * cellCount + (j + 1)

  var neighbors = [
    aboveLeft, aboveCenter,  aboveRight,
    left,                 ,  right,
    bottomLeft, bottomCenter, bottomRight
  ]
  var neighborsCount = neighbors.reduce(function checkNeighbor(aliveTotal, neighbor) {
    if (previousState[neighbor] && previousState[neighbor].alive)
      return aliveTotal + 1
    else 
      return aliveTotal
  }, 0)

  return neighborsCount
}

function play() {
  var previousState = cells.map(cell => Object.assign({}, cell))
  for (var j = 0; j < cellCount; j++) {
    for (var i = 0; i < cellCount; i++) {
      var neighborsCount = getAliveNeighborsCount(i, j, previousState)
      console.log(`(${i}, ${j}) = ${neighborsCount}`)

      if (neighborsCount > 3 || neighborsCount < 2) {
        cells[i * cellCount + j].dead()
      } else if (neighborsCount === 3) {
        cells[i * cellCount + j].live()
      }
    } 
  }
}

function draw() {

}

function mousePressed(e) {
  var xClicked = e.clientX
  var yClicked = e.clientY
  if (xClicked < width && yClicked < height) {
    i = floor(xClicked / cellWidth) 
    j = floor(yClicked / cellHeight)
    cells[i * cellCount + j].live()
  }
  
  // colorPicker.click()
}


// colorPicker.addEventListener('change', function(e) {
//   var [r, g, b] = colorPicker.value.slice(1).match(/../g).map(c => parseInt('0x' + c))
//     cells[i * cellCount + j].hide(r, g, b)
// })

// function windowResized() {
  // console.log('resizing')
  // createCanvas(windowWidth, windowHeight)
  // drawBoard()
  // background(51)
// }