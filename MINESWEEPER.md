# **MINESWEEPER** 

# Wireframe
<img src ="https://i.imgur.com/10cRpLL.png">


# Pseudocode
- Take fixed size(8*8) grid to begin with
- Initialize 2D grid array to store string values:-
   - Use a random function to populate a grid array with fixed(10) Mines.
        - seed random func with size of the grid(64) and assign output to cellCount (it will be in range 0-63)
        - row will be cellCount/64 
        - eg: cellCount = 5(meaning is 5th element in 2d array and will be in first row, and 5/64 gives 0) and col will be 5%64 which is 5, so col will at index 4 and hence cell is (0,4)
        - col will be cellCount%64 -1
        -  assign ‘*’ to represent bomb in the cell
   - Loop grid to populate mine count in cells:-
            - If the cell does not have mine go through 8 adjacent cells and count mine to fill the cell. Define directions array as [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0]]
    - Lets say current cell is i,j then to find 8 adjacent cells we can add values in above array to i,j 
            - If the cell has mine then ignore.


#### Click events
- use indices of tiles (figure out a way to find clicked value in the grid array.)   
- If value is number(except zero) then reveal the cell  
- If the value is zero, apply a flood algorithm to reveal all connected blank cells in the UI grid.
- if the value is * reveal all cells in the UI grid and mark the background of the cell clicked as red. And Display Game Over!
- If all tiles are open (keep count of tiles which were revealed), if that count reaches grid size and we haven’t stepped on mine meaning game is won and we display the same

#### Flood
* Recursively check adjacent(8) cells if they are empty, if not return, else keep opening the tile in UI and keep reveal count(used in step 5 of click events).