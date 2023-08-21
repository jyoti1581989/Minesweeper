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



  /*------Class----------*/
  class Cell{
    constructor(row, col, isMined){
      this.row = row
      this.col = col
      this.isMined = isMined // boolean to determine if cell is mined or not
      this.content = ''
    }

    mined(){
      return this.isMined
    }

    placeMine(){
      this.isMined = true
      this.content = `<img src='images/bomb.png'/>`
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
          gridObjArray[i][j] = new Cell(i, j, false);
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


      
     