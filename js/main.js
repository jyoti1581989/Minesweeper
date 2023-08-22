    /*----- constants -----*/
    const ROW_SIZE = 8;
    const COL_SIZE = 8;
    const GRID_SIZE = ROW_SIZE*COL_SIZE;
    const MINE_COUNT = (GRID_SIZE)/5;
    const GAME_OVER_TEXT = "Stepped on Mine..Game over! Click reset to start again!";
    const GAME_WON_TEXT = "You Won! Press reset to play again!";
	/*----- state variables -----*/
   let gridObjArray ;
   let openCellCount;
  
   
  /*----- cached elements  -----*/
  const uiGrid = document.getElementById('board');
  const resetButton = document.getElementById("reset-game");

  // convert nodeList into JS Array to be able to use indexOf method on it
  const gridCells = [...document.querySelectorAll("#board > div")];

	/*----- event listeners -----*/
  uiGrid.addEventListener("click",handleClick);
  // reset game with differently placed set of mines
   resetButton.addEventListener("click", function () {
  resetGame();
  });


  /*------Class----------*/
  class Cell{
    constructor(row, col, isMined, isRevealed, isEmpty){
      this.row = row;
      this.col = col;
      this.isMined = isMined // boolean to determine if cell is mined or not
      this.content = ''
      this.isRevealed = isRevealed // boolean to determine if cell is revealed or not
      this.isEmpty = isEmpty; // boolean to determine if cell is empty or not
    }

    mined(){
      return this.isMined;
    }

    placeMine(){
      this.isMined = true;
      this.content = `<img src='images/bomb.png'/>`;
    }

    revealed(){
      return this.isRevealed;
    }

    getContent(){
      return this.content;
    }
    empty() {
      return this.isEmpty;
    }

   //Calculate mine count in neighboring cells
    adjMineCount(){
      let neighbors = [];
      let count = 0;
      if(!this.isMined){
        if(gridObjArray[this.row][this.col+1]) neighbors.push(gridObjArray[this.row][this.col+1])
        if(gridObjArray[this.row+1] && gridObjArray[this.row+1][this.col+1]) neighbors.push(gridObjArray[this.row+1][this.col+1])
        if(gridObjArray[this.row+1] && gridObjArray[this.row+1][this.col]) neighbors.push(gridObjArray[this.row+1][this.col])
        if(gridObjArray[this.row+1] && gridObjArray[this.row+1][this.col-1]) neighbors.push(gridObjArray[this.row+1][this.col-1])
        if(gridObjArray[this.row][this.col-1]) neighbors.push(gridObjArray[this.row][this.col-1])
        if(gridObjArray[this.row-1] && gridObjArray[this.row-1][this.col-1]) neighbors.push(gridObjArray[this.row-1][this.col-1])
        if(gridObjArray[this.row-1] && gridObjArray[this.row-1][this.col]) neighbors.push(gridObjArray[this.row-1][this.col])
        if(gridObjArray[this.row-1] && gridObjArray[this.row-1][this.col+1]) neighbors.push(gridObjArray[this.row-1][this.col+1])
      }
      neighbors.forEach(function(neighbor){
        if(neighbor.mined()){
          count++;
        }
       
        })
      return count;
    }  
      // set mine count into the cell 

      setMineCount() {
        let cnt = this.adjMineCount();
        if (cnt != 0) {
          this.content = cnt;
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
          this.content = "";
        }
      }

      reset(){
        this.Mined = false;
        this.isEmpty = true;
        this.isVisited = false;
        this.isRevealed = false;
        this.content = "";
      }
    
    
  }
    /*----- functions -----*/
    init();
    //Initialize all state, then call render();
    function init(){
      gridObjArray = [];
      openCellCount = 0;
      for(let i = 0;i < ROW_SIZE;i++){
        gridObjArray[i] = []
        for(let j =0;j < COL_SIZE;j++){
          gridObjArray[i][j] = new Cell(i, j, false, false, true);
        }
      }
      setMines();
      setMineCounts();
     
    }
    //Click event to click handle to stepping on mine ,number or empty cell 
    function handleClick(event){
      event.preventDefault();
      let uiCellElement = event.target;
      if (uiCellElement.tagName == "IMG") {
        uiCellElement = event.target.parentElement; // get surrounding div if image tag is present inside.
      }
      const cellIdx = gridCells.indexOf(uiCellElement);
      const cellRow = Math.floor(cellIdx / ROW_SIZE);
      const cellCol = cellIdx % COL_SIZE;
      console.log("hello")
      console.log(openCellCount);
      if (openCellCount < GRID_SIZE - MINE_COUNT) {
        
        console.log(gridObjArray[cellRow][cellCol]);
        if (gridObjArray[cellRow][cellCol].mined()) {
          renderCellContent(cellRow, cellCol);// steped on mine
        } else if (gridObjArray[cellRow][cellCol].empty()) {
          // flood the grid
          floodFill(cellRow, cellCol);
        } else {
          // uiGrid gets the mineCount from grid array
          renderCellContent(cellRow, cellCol);
          openCellCount++;
        }
      }
      if (openCellCount >= GRID_SIZE - MINE_COUNT) {
        // Display you won the game press reset to play again!
        renderMessage(GAME_WON_TEXT);
      }
    };


    // Places mines(20% of grid size) in the grid 

    function setMines(){
      let mineCnt = MINE_COUNT
      let r=0, c=0;
      let randomCell
      while(mineCnt > 0){
        randomCell = Math.floor(Math.random()*GRID_SIZE)
        r = Math.floor(randomCell/ROW_SIZE)
        c = randomCell%COL_SIZE
        if(!gridObjArray[r][c].mined()){
          gridObjArray[r][c].placeMine()
          mineCnt--
        
        }

      }
    } 
    
     //set mine count into each cell
     function setMineCounts(){
      for(let i=0; i<ROW_SIZE; i++){
         for(let j=0; j<COL_SIZE; j++){
          if (!gridObjArray[i][j].mined()) {
            gridObjArray[i][j].setMineCount();
            
          }
        }
      }
    }
    // reset game to its initial state

    function resetGame(){
      enableGrid()
     resetUIGrid();
      for(let i = 0; i<ROW_SIZE; i++){
        for(j = 0; j<COL_SIZE; j++){
          gridObjArray[i][j].reset();
        }
      }
      clearMessage();
      setMines();
      setMineCounts();
      openCellCount = 0;
    }
    function resetUIGrid() {
      gridCells.forEach(function (el) {
        el.innerHTML = null;
        el.innerText = "";
      });
    }
    function clearMessage() {
      document.querySelector("#message").style.display = "none";
    }
    
    function render(){
      // renderMessage();
      
  
  
    }
  
    function renderMessage(message) {
      const el = document.querySelector("#message");
      el.style.display = "block";
      el.style.backgroundColor = "red";
      el.innerText = message;
    }
    function renderCellContent(cellRow, cellCol) {
      let uiCell = gridCells[cellRow * ROW_SIZE + cellCol];
      let cellObj = gridObjArray[cellRow][cellCol];
        if (cellObj.mined()) {
          uiCell.innerHTML = cellObj.getContent();
          // Display Game is over
          renderMessage(GAME_OVER_TEXT);
          disableGrid();
        } else {
          uiCell.innerText = cellObj.getContent();
        
        }
    }
      function disableGrid() {
      uiGrid.style.pointerEvents = "none";
      }
      function enableGrid() {
        uiGrid.style.pointerEvents = "auto";
      }
   



   
      
   
   