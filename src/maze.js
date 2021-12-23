import { generateRandomIntegerInRange, pickRandom } from "./../tools/helper.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let maze = undefined;

let game = {
  config: {
    width: undefined,
    height: undefined,
    backgroundColor: "#dedede",
    //scene: [bootGame, playGame]
  },
};

class Maze {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = undefined;
    this.cells = [];
    this.currentCell = undefined;
    this.nextCell = undefined;
    this.cellCount = undefined;
    this.directionToNextCell = undefined;
    this.stack = [];
    this.strokeStyle = "#7f7f7f";
    this.fillStyle = "#424242";
    this.lineWidth = 6;
    this.lineCap = "square"; //'butt', 'round', 'square'
    this.setCellSize();
    this.createCells();
    this.setCurrentCell(generateRandomIntegerInRange(0, this.cells.length - 1));
    this.setNextCell();
    while (this.nextCell) {
      this.deleteWallsBetweenCells(this.directionToNextCell);
      this.currentCell = this.nextCell;
      this.setNextCell();
    }
    this.closeQuads();
    //this.deleteRandomCells(generateRandomIntegerInRange(0, this.cellCount - 1));
    this.deleteRandomCells(generateRandomIntegerInRange(0, this.cellCount - 10));
    this.strokeMaze();
  }

  setCellSize = () => {
    let size = Math.floor(game.config.width / this.cols);
    this.rows = Math.floor(game.config.height / size);
    this.cellSize = size;
  };

  createCells = () => {
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = {
          x: j,
          y: i,
          width: this.cellSize,
          height: this.cellSize,
          visited: false,
          neighbours: [],
          vertices: {
            tl: { x: undefined, y: undefined } /* Top Left */,
            tr: { x: undefined, y: undefined } /* Top Right */,
            bl: { x: undefined, y: undefined } /* Bottom Left */,
            br: { x: undefined, y: undefined } /* Bottom Right */,
          },
          walls: { top: true, right: true, bottom: true, left: true },
        };

        /* Set neigghbours */
        if (!(cell.y === 0)) {
          cell.neighbours.push({
            index: index - this.cols,
            direction: "top",
          });
        }
        if (!(cell.x === this.cols - 1)) {
          cell.neighbours.push({
            index: index + 1,
            direction: "right",
          });
        }
        if (!(cell.y === this.rows - 1)) {
          cell.neighbours.push({
            index: index + this.cols,
            direction: "bottom",
          });
        }
        if (!(cell.x === 0)) {
          cell.neighbours.push({
            index: index - 1,
            direction: "left",
          });
        }
        this.cells.push(cell);

        /* Set cell verices */
        cell.vertices.tl.x = cell.x * cell.width;
        cell.vertices.tl.y = cell.y * cell.height;
        cell.vertices.tr.x = cell.vertices.tl.x + cell.width;
        cell.vertices.tr.y = cell.vertices.tl.y;
        cell.vertices.bl.x = cell.vertices.tl.x;
        cell.vertices.bl.y = cell.y * cell.height + cell.height;
        cell.vertices.br.x = cell.vertices.tl.x + cell.width;
        cell.vertices.br.y = cell.vertices.tr.y + cell.height;

        index++;
        console.log(cell);
      }
    }
    this.cellCount = this.cells.length;
  };

  /**
   * @param {number} index Index of cell in array, which is the current cell
   */
  setCurrentCell = (index) => {
    this.currentCell = this.cells[index];
    this.currentCell.visited = true;
    this.stack.push(index);
  };

  setNextCell = () => {
    /* New version */
    this.currentCell.neighbours = _.shuffle(this.currentCell.neighbours);
    let foundNextCell = false;
    for (let i = 0; i <= this.currentCell.neighbours.length - 1; i++) {
      let neighbourIndex = this.currentCell.neighbours[i].index;
      this.directionToNextCell = this.currentCell.neighbours[i].direction;
      if (this.cells[neighbourIndex].visited === false) {
        this.cells[neighbourIndex].visited = true;
        this.nextCell = this.cells[neighbourIndex];
        this.stack.push(neighbourIndex);
        foundNextCell = true;
        break;
      }
    }

    if (foundNextCell === false) {
      if (this.stack.length > 1) {
        this.stack.pop();
        this.currentCell = this.cells[this.stack[this.stack.length - 1]];
        this.setNextCell();
      } else {
        this.nextCell = false;
      }
    }
  };

  /**
   * @param {string} direction In which direction the walls should be deleted; top | right | bottom | left
   */
  deleteWallsBetweenCells = (direction) => {
    switch (direction) {
      case "top":
        this.currentCell.walls.top = false;
        this.nextCell.walls.bottom = false;
        break;
      case "right":
        this.currentCell.walls.right = false;
        this.nextCell.walls.left = false;
        break;
      case "bottom":
        this.currentCell.walls.bottom = false;
        this.nextCell.walls.top = false;
        break;
      case "left":
        this.currentCell.walls.left = false;
        this.nextCell.walls.right = false;
        break;
    }
  };

  /* Method for closing cells, which have three walls left */
  /* These cells are then filled with a fillColor */
  closeQuads = () => {
    this.cells.forEach((cell) => {
      console.log(
        _.countBy(cell.walls, (wall) => {
          //return wall.direction ? true : false;
          //return wall.direction;
        })
      );
      let closedWalls = 0;
      for (let direction in cell.walls) {
        if (cell.walls[direction]) {
          closedWalls++;
        }
      }
      if (closedWalls === 3) {
        //console.log("Wall can be closed");
        cell.walls.top = true;
        cell.walls.right = true;
        cell.walls.bottom = true;
        cell.walls.left = true;
      }
    });
  };

  /**
   * @param {number} count How many cells should be deleted
   */
  deleteRandomCells = (count) => {
    //let cellsToDelete = pickRandom(this.cells, count);
    //console.log(cellsToDelete);
    pickRandom(this.cells, count).forEach((cell) => {
      let cellIndex = this.getCellIndex(cell.x, cell.y);

      /* Is it a border cell? */
      if (!(cell.y === 0)) {
        cell.walls.top = false;
        /* Is ther any neighbour? */
        if (this.getCellIndexOfNeighbour(cellIndex, "top")) {
          this.cells[this.getCellIndexOfNeighbour(cellIndex, "top")].walls.bottom = false;
        }
      }

      if (!(cell.x >= this.cols - 1)) {
        cell.walls.right = false;
        /* Is ther any neighbour? */
        if (this.getCellIndexOfNeighbour(cellIndex, "right")) {
          this.cells[this.getCellIndexOfNeighbour(cellIndex, "right")].walls.left = false;
        }
      }

      if (!(cell.y >= this.rows - 1)) {
        cell.walls.bottom = false;
        /* Is ther any neighbour? */
        if (this.getCellIndexOfNeighbour(cellIndex, "bottom")) {
          this.cells[this.getCellIndexOfNeighbour(cellIndex, "bottom")].walls.top = false;
        }
      }

      if (!(cell.x <= 0)) {
        cell.walls.left = false;
        /* Is ther any neighbour? */
        if (this.getCellIndexOfNeighbour(cellIndex, "left")) {
          this.cells[this.getCellIndexOfNeighbour(cellIndex, "left")].walls.right = false;
        }
      }
    });
  };

  /**
   * @param {number} x x coord of cell
   * @param {number} y y coord of cell
   */
  getCellIndex = (x, y) => {
    return _.findIndex(this.cells, { x, y });
  };

  /**
   * @param {number} index Index of cell in array
   * @param {string} direction Direction to neighbour cell
   */
  getCellIndexOfNeighbour = (index, direction) => {
    switch (direction) {
      case "top":
        return !(this.cells[index].y === 0) ? index - this.cols : false;
      case "right":
        return !(this.cells[index].x === this.cols - 1) ? index + 1 : false;
      case "bottom":
        return !(this.cells[index].y === this.rows - 1) ? index + this.cols : false;
      case "left":
        return !(this.cells[index].x === 0) ? index - 1 : false;
      default:
        return false;
    }
  };

  strokeMaze = () => {
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = this.lineCap;
    this.cells.forEach((cell) => {
      let wallTop = false;
      let wallRight = false;
      let wallBottom = false;
      let wallLeft = false;

      if (cell.walls.top) {
        wallTop = true;
        ctx.moveTo(cell.vertices.tl.x, cell.vertices.tl.y);
        ctx.lineTo(cell.vertices.tr.x, cell.vertices.tr.y);
      }
      if (cell.walls.right) {
        wallRight = true;
        ctx.moveTo(cell.vertices.tr.x, cell.vertices.tr.y);
        ctx.lineTo(cell.vertices.br.x, cell.vertices.br.y);
      }
      if (cell.walls.bottom) {
        wallBottom = true;
        ctx.moveTo(cell.vertices.br.x, cell.vertices.br.y);
        ctx.lineTo(cell.vertices.bl.x, cell.vertices.bl.y);
      }
      if (cell.walls.left) {
        wallLeft = true;
        ctx.moveTo(cell.vertices.bl.x, cell.vertices.bl.y);
        ctx.lineTo(cell.vertices.tl.x, cell.vertices.tl.y);
      }
      ctx.stroke();
      if (wallTop && wallRight && wallBottom && wallLeft) {
        ctx.rect(cell.vertices.tl.x, cell.vertices.tl.y, cell.width, cell.height);
        ctx.fill();
      }
    });
  };

  redrawMaze = () => {
    /* Clear canvas */
    ctx.clearRect(0, 0, game.config.width, game.config.height);
    this.strokeMaze();
  };
}

function setGameSize() {
  //game.config.width = window.innerWidth;
  //game.config.height = window.innerHeight;
  game.config.width = 800;
  game.config.height = 600;
}

function init() {
  window.focus();
  setGameSize();
  canvas.setAttribute("width", game.config.width);
  canvas.setAttribute("height", game.config.height);
  canvas.style.width = game.config.width;
  canvas.style.height = game.config.height;
  canvas.style.backgroundColor = game.config.backgroundColor;
  maze = new Maze(10);
}

window.onload = () => {
  init();
};
