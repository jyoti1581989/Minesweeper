export default class Cell {
    constructor(row, col, isMined, isEmpty, isVisited, isRevealed, isFlagged) {
        this.row = row
        this.col = col
        this.isMined = isMined // boolean to determine if cell is mined or not
        this.content = ''
        this.isRevealed = isRevealed // boolean to determine if cell is revealed or not
        this.isVisited = isVisited // boolean to determine if cell was visited by flood function
        this.isEmpty = isEmpty // boolean to determine if cell is empty or not
        this.nonFlagContent = ""
        this.isFlagged = isFlagged
    }

    // static fields
    static gridObjArray
    static openCellCount
    // returns if this cell was mined or not

    mined() {
        return this.isMined
    }

    placeMine() {
        this.isMined = true
        this.isEmpty = false
        this.content = `<img src='images/bomb.png'/>`
        this.nonFlagContent = `<img src='images/bomb.png'/>`
    }

    getContent() {
        return this.content
    }

    setEmpty() {
        this.isEmpty = true
    }

    empty() {
        return this.isEmpty
    }

    setVisited() {
        this.isVisited = true
    }

    visited() {
        return this.isVisited
    }

    setRevealed() {
        if (!this.isRevealed) {
            this.isRevealed = true
            // renderCellContent(this.row, this.col)
            if (!this.isMined) {
                Cell.openCellCount++
            }
        }
    }

    revealed() {
        return this.isRevealed
    }

    flagged() {
        return this.isFlagged
    }
    setFlag(flag) {
        this.isFlagged = flag
        this.isRevealed = false
        if (flag) {
            this.content = `<img src='images/mineFlag.png'/>`
        } else {
            this.content = this.nonFlagContent
        }
    }

    //Calculate mine count in neighboring cells
    adjMineCount() {
        let neighbors = []
        let count = 0
        if (!this.isMined && Cell.gridObjArray) {
            if (Cell.gridObjArray[this.row][this.col + 1]) neighbors.push(Cell.gridObjArray[this.row][this.col + 1])
            if (Cell.gridObjArray[this.row + 1] && Cell.gridObjArray[this.row + 1][this.col + 1]) neighbors.push(Cell.gridObjArray[this.row + 1][this.col + 1])
            if (Cell.gridObjArray[this.row + 1] && Cell.gridObjArray[this.row + 1][this.col]) neighbors.push(Cell.gridObjArray[this.row + 1][this.col])
            if (Cell.gridObjArray[this.row + 1] && Cell.gridObjArray[this.row + 1][this.col - 1]) neighbors.push(Cell.gridObjArray[this.row + 1][this.col - 1])
            if (Cell.gridObjArray[this.row][this.col - 1]) neighbors.push(Cell.gridObjArray[this.row][this.col - 1])
            if (Cell.gridObjArray[this.row - 1] && Cell.gridObjArray[this.row - 1][this.col - 1]) neighbors.push(Cell.gridObjArray[this.row - 1][this.col - 1])
            if (Cell.gridObjArray[this.row - 1] && Cell.gridObjArray[this.row - 1][this.col]) neighbors.push(Cell.gridObjArray[this.row - 1][this.col])
            if (Cell.gridObjArray[this.row - 1] && Cell.gridObjArray[this.row - 1][this.col + 1]) neighbors.push(Cell.gridObjArray[this.row - 1][this.col + 1])
        }
        neighbors.forEach(function (neighbor) {
            if (neighbor.mined()) {
                count++
            }
        })
        return count.toString()
    }

    // set mine count into the cell 
    setMineCount() {
        let cnt = this.adjMineCount()
        if (cnt != "0") {
            this.content = cnt
            this.nonFlagContent = cnt
            this.isEmpty = false

        } else {
            this.isEmpty = true
            this.content = ""
            this.nonFlagContent = ""
        }
    }

    reset() {
        this.isMined = false
        this.isEmpty = true
        this.isVisited = false
        this.isRevealed = false
        this.content = ""
        this.nonFlagContent = ""
        this.isFlagged = false
    }
}