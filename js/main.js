    /*----- constants -----*/
    const ROW_SIZE = 8;
    const COL_SIZE = 8;
    const GRID_SIZE = ROW_SIZE*COL_SIZE;
    const MINE_COUNT = (GRID_SIZE)/5;
	/*----- state variables -----*/
   let gridObjArray ;
  
   
  /*----- cached elements  -----*/
  const uiGrid = document.getElementById('board');


	/*----- event listeners -----*/
  //  let boardCells = getElementById("board");
  //  boardCells.addEventListener(click,handleClick);


  /*------Class----------*/
  class Cell{
    constructor(row, col, isMined, isRevealed){
      this.row = row;
      this.col = col;
      this.isMined = isMined // boolean to determine if cell is mined or not
      this.content = ''
      this.isRevealed = isRevealed // boolean to determine if cell is revealed or not
    }

    mined(){
      return this.isMined;
    }

    placeMine(){
      this.isMined = true;
      this.content = `<img src='images/bomb.png'/>`;
    }

    mineReveled(){
      return this.isRevealed;
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
        if(gridObjArray[this.row+1] && gridObjArray[this.row-1][this.col-1]) neighbors.push(gridObjArray[this.row-1][this.col-1])
        if(gridObjArray[this.row+1] && gridObjArray[this.row-1][this.col]) neighbors.push(gridObjArray[this.row-1][this.col])
        if(gridObjArray[this.row+1] && gridObjArray[this.row-1][this.col+1]) neighbors.push(gridObjArray[this.row-1][this.col+1])
      }
      neighbors.forEach(function(neighbor){
        if(neighbors.mined()){
          count++;
        }
       return this.adjMineCount = count;
        
      })
      console.log(count)
    }  
      // set mine count into the cell 

      setMinesCount(){
      let cnt = this.adjMineCount();
      if(cnt != 0){
        this.content = cnt;
        this.isEmpty = false;

      } else {
        this.content = "";
        this.isEmpty = true;
      }
    
    }
  }  
    /*----- functions -----*/
    init();
    //Initialize all state, then call render();
    function init(){
      gridObjArray = [];
      for(let i = 0;i < ROW_SIZE;i++){
        gridObjArray[i] = []
        for(let j =0;j < COL_SIZE;j++){
          gridObjArray[i][j] = new Cell(i, j, false, false);
        }
      }
      setMines();
      render();
    }
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
    
    function render(){



    }


   function handleClick(evt){



   }
      
     