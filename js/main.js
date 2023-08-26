/*-----imports----- */
import Cell from "./cell.js"

/*----- constants -----*/
const ROW_SIZE = 8
const COL_SIZE = 8
const GRID_SIZE = ROW_SIZE * COL_SIZE
const MINE_COUNT = Math.floor(GRID_SIZE / 5)
const GAME_OVER_TEXT = "Stepped on Mine..  GAME OVER!   Click reset to start again!"
const GAME_WON_TEXT = "You WON!  Press reset to play again!"
const BOMB_AUDIO = "https://cdn.freesound.org/previews/155/155235_2793595-lq.mp3"
const WINNING_AUDIO = "https://cdn.freesound.org/previews/354/354038_6549161-lq.mp3"

/*----- state variables -----*/
let gridObjArray
let gameWon // boolean represent winning or losing
let cellDirections // directions to circle around the cell in eight directions of the grid array

/*----- cached elements  -----*/
const uiGrid = document.getElementById('board')
const resetButton = document.getElementById("reset-game")
const musicCheckbox = document.getElementById("music")
const audioControl = document.getElementById("audio")
// convert nodeList into JS Array to be able to use indexOf method on it
const gridCells = [...document.querySelectorAll("#board > div")]

/*----- event listeners -----*/
uiGrid.addEventListener("click", handleClick)
resetButton.addEventListener("click", function () {
  // reset game with differently placed set of mines
  resetGame()
})
uiGrid.addEventListener("contextmenu", handleRightClick) // Right click with flag
musicCheckbox.addEventListener("change", handleBGMusic)

/*----- functions -----*/
init()

//Initialize all state
function init() {
  gridObjArray = []
  Cell.openCellCount = 0
  cellDirections = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]
  Cell.gridObjArray = gridObjArray
  for (let i = 0; i < ROW_SIZE; i++) {
    gridObjArray[i] = []
    for (let j = 0; j < COL_SIZE; j++) {
      gridObjArray[i][j] = new Cell(i, j, false, true, false, false)
    }
  }
  setMines()
  setMineCounts()
}

/* handles background music settings based on checkbox checked */
function handleBGMusic(event) {
  audioControl.volume = 0.2
  audioControl.loop = true
  if (event.target.checked) {
    audioControl.play()
  } else {
    audioControl.pause()
  }
}

//Click event to click handle to stepping on mine ,number or empty cell 
function handleClick(event) {
  event.preventDefault()
  let uiCellElement = event.target
  if (uiCellElement.tagName == "IMG") {
    uiCellElement = event.target.parentElement // get surrounding div if image tag is present inside.
  }
  if (uiCellElement.tagName == "DIV") {
    const cellIdx = gridCells.indexOf(uiCellElement)
    const cellRow = Math.floor(cellIdx / ROW_SIZE)
    const cellCol = cellIdx % COL_SIZE
    if (Cell.openCellCount < GRID_SIZE - MINE_COUNT) {
      if (gridObjArray[cellRow][cellCol].empty()) {
        // flood the grid
        floodFill(cellRow, cellCol)
      } else {
        // ui grid cell is mined or have mineCount, reveal it.
        gridObjArray[cellRow][cellCol].setRevealed()
      }
      render()
    }
    if (Cell.openCellCount >= GRID_SIZE - MINE_COUNT) {
      gameWon = true
      // Display you won the game press reset to play again!
      renderMessage(GAME_WON_TEXT)
      playAudio(WINNING_AUDIO)
      toggleResetButtonVisibility()
    }
  }
}

// using flood feature
/** Recursively seeks adjacent empty cells and reveals them. 
 * Once function finds non-empty cell it reveals it and then returns
 * */
function floodFill(row, col) {
  let currCell = gridObjArray[row][col]
  // set grid cell to be revealed if its not already
  if (!currCell.revealed()) {
    currCell.setRevealed()
  }
  let adjRow, adjCol, neighborCell
  if (currCell.empty() && !currCell.flagged()) {
    cellDirections.forEach(function (direction) {
      adjRow = row + direction[0]
      adjCol = col + direction[1]
      // Check if neighbor is not outside the grid
      if (adjRow >= 0 && adjRow < ROW_SIZE && adjCol >= 0 && adjCol < COL_SIZE) {
        neighborCell = gridObjArray[adjRow][adjCol]
        // if neighbor is not already visited
        if (!neighborCell.visited()) {
          neighborCell.setVisited()
          floodFill(adjRow, adjCol)
        }
      }
    })
  }
}

/** handles right click for flagging cells */
function handleRightClick(event) {
  // preventDefault prevents event propagation to parent elements
  event.preventDefault()
  if (event.button == 2) {
    let uiCellElement = event.target
    if (uiCellElement.tagName == "IMG") {
      uiCellElement = event.target.parentElement // get surrounding div if image tag is present inside.
    }
    const cellIdx = gridCells.indexOf(uiCellElement)
    const cellRow = Math.floor(cellIdx / ROW_SIZE)
    const cellCol = cellIdx % COL_SIZE
    const cellObj = gridObjArray[cellRow][cellCol]
    cellObj.setFlag(!cellObj.flagged())
    renderFlag(cellRow, cellCol)
  }
}

// Places mines(20% of grid size) in the grid 
/** randomly finds a cell from the grid to place mine, calculates row and column based on random number returned */
function setMines() {
  let mineCnt = MINE_COUNT
  let r = 0, c = 0
  let randomCell
  while (mineCnt > 0) {
    randomCell = Math.floor(Math.random() * GRID_SIZE)
    r = Math.floor(randomCell / ROW_SIZE)
    c = randomCell % COL_SIZE
    if (!gridObjArray[r][c].mined()) {
      gridObjArray[r][c].placeMine()
      mineCnt--
    }
  }
}

//set mine count into each cell
function setMineCounts() {
  for (let i = 0; i < ROW_SIZE; i++) {
    for (let j = 0; j < COL_SIZE; j++) {
      if (!gridObjArray[i][j].mined()) {
        gridObjArray[i][j].setMineCount()
      }
    }
  }
}

// reset game to its initial state
function resetGame() {
  enableGrid()
  resetUIGrid()
  for (let i = 0; i < ROW_SIZE; i++) {
    for (let j = 0; j < COL_SIZE; j++) {
      gridObjArray[i][j].reset()
    }
  }
  clearMessage()
  setMines()
  setMineCounts()
  Cell.openCellCount = 0
  toggleResetButtonVisibility()
}

/** render function to show cell content either a mine or mine Count*/
function renderCellContent(cellRow, cellCol) {
  let uiCell = gridCells[cellRow * ROW_SIZE + cellCol]
  let cellObj = gridObjArray[cellRow][cellCol]
  if (!cellObj.flagged()) {
    if (cellObj.mined()) {
      // play bomb audio
      playAudio(BOMB_AUDIO)
      uiCell.innerHTML = cellObj.getContent()
      gameWon = false
      // Display Game is over
      renderMessage(GAME_OVER_TEXT)
      disableGrid()
      toggleResetButtonVisibility()
    } else {
      uiCell.innerText = cellObj.getContent()
      if (cellObj.empty()) {
        uiCell.style.backgroundColor = "lightgrey"
      }
    }
    uiCell.style.pointerEvents = "none"
  }
}

// render function
function render() {
  gridObjArray.forEach((objRow) => {
    objRow.forEach((obj) => {
      if (obj.revealed()) {
        renderCellContent(obj.row, obj.col)
      }
    })
  })
}

//Display message 
function renderMessage(message) {
  const el = document.querySelector("#message")
  el.style.display = "block"
  el.style.backgroundColor = gameWon ? "green" : "red"
  el.innerText = message
}

function renderFlag(cellRow, cellCol) {
  let uiCell = gridCells[cellRow * ROW_SIZE + cellCol]
  let cellObj = gridObjArray[cellRow][cellCol]
  uiCell.innerHTML = cellObj.flagged() ? cellObj.getContent() : null

}

/** Resets Grid in DOM to its initial state */
function resetUIGrid() {
  gridCells.forEach(function (el) {
    el.innerHTML = null
    el.innerText = ""
    el.style.backgroundColor = "white"
    el.style.pointerEvents = "auto"
  })
}

/** clears winning or losing message from previous play */
function clearMessage() {
  document.querySelector("#message").style.display = "none"
}

/** disables DOM grid for any pointer events like hover or click */
function disableGrid() {
  uiGrid.style.pointerEvents = "none"
  gridCells.forEach((cell) => cell.style.pointerEvents = "none")
}

/** Enables DOM grid for pointer events */
function enableGrid() {
  uiGrid.style.pointerEvents = "auto"
}

/** toggles visibility of reset button */
function toggleResetButtonVisibility() {
  const resetButton = document.querySelector('.reset-button')
  const visibility = resetButton.style.visibility
  resetButton.style.visibility = visibility == 'visible' ? 'hidden' : 'visible'
}

/** plays audio on user interaction with UI */
function playAudio(url, loop = false) {
  const audio = new Audio(url)
  audio.volume = 0.2
  audio.loop = loop
  audio.play()
}






