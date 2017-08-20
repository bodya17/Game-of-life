var cellWidth
var cellHeight
var cellCount = 40
var cells = []
// var colorPicker = document.querySelector('input[type=color]')
var bombs = []
var i
var j
var playButton
var autoButton
var rateSlider
var auto = false

class Cell {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.alive = false
  }

  toggle() {
    this.alive ? this.dead() : this.live()
  }

  live() {
    this.alive = true
    textSize(32)
   
    fill(200, 100, 150, 255)
    rect(this.x * cellWidth, this.y * cellHeight, cellWidth, cellHeight)
    // fill(255)
    // text(`${this.x} ${this.y}`, this.x * cellWidth + cellWidth / 4, this.y * cellHeight + cellHeight / 2)
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
  createCanvas(800, 800)
  drawBoard()
  playButton = createButton('play')
  autoButton = createButton('auto')
  playButton.mousePressed(play)
  autoButton.mousePressed(() => auto = !auto)
  rateSlider = createSlider(0, 60, 5, 1)
}

function getAliveNeighborsCount(i, j, previousState) {
  var aboveLeft
  var aboveCenter
  var aboveRight
  var left
  var right
  var bottomLeft 
  var bottomCenter
  var bottomRight

  if (i > 0 && j > 0)
    aboveLeft = (i - 1) * cellCount + (j - 1)
  
  if (i > 0)
    aboveCenter = (i - 1) * cellCount + j
  
  if (i > 0 && j < cellCount - 1)
    aboveRight = (i - 1) * cellCount + (j + 1)

  if (j > 0)
    left = i * cellCount + (j - 1)
  
  if (j < cellCount - 1)
    right = i * cellCount + (j + 1)

  if (i < cellCount - 1 && j > 0)
    bottomLeft = (i + 1) * cellCount + (j - 1)
  
  if (i < cellCount - 1)
    bottomCenter = (i + 1) * cellCount + j
  
  if (i < cellCount - 1 && j < cellCount - 1)
    bottomRight = (i + 1) * cellCount + (j + 1)

  var neighbors = [
    aboveLeft, aboveCenter,  aboveRight,
    left,                         right,
    bottomLeft, bottomCenter, bottomRight
  ].filter(n => n !== undefined)

  // console.log(`neighbors: (${i} - ${j})`, neighbors)
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
      // console.log(`(${i}, ${j}) = ${neighborsCount}`)

      if (neighborsCount > 3 || neighborsCount < 2) {
        cells[i * cellCount + j].dead()
      } else if (neighborsCount === 3) {
        cells[i * cellCount + j].live()
      }
    } 
  }
}

function draw() {
  // console.log(rateSlider.value())
  frameRate(+rateSlider.value())
  if (auto)
    play()
  // play()
}

function mousePressed(e) {
  var xClicked = e.clientX
  var yClicked = e.clientY
  if (xClicked < width && yClicked < height) {
    i = floor(xClicked / cellWidth) 
    j = floor(yClicked / cellHeight)
    cells[i * cellCount + j].toggle()
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