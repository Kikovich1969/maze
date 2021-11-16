let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let lineWidth = 8; // must be even, otherwise antialiasing will show!

let game = {
  width: 600,
  height: 400,
  backgroundColor: "white",
};

class Maze {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cell = {};
    this.cells = [];
    this.activeCell = undefined;
    this.nextCell = undefined;
    this.createGrid();
    this.setCellNeighbours();
    this.setCellVertices();
    this.setActiveCell(this.getRandomCell());
    this.setNextCell(this.activeCell);
    this.drawMaze();
  }

  createGrid = () => {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = {
          x: j,
          y: i,
          width: Math.floor(game.width / this.cols),
          height: Math.floor(game.height / this.rows),
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
        this.cells.push(cell);
      }
    }
  };

  setCellNeighbours = () => {
    this.cells.forEach((cell, index) => {
      if (!(cell.y === 0)) {
        cell.neighbours.push({ index: index - this.cols, direction: "top" });
      }
      if (!(cell.x === this.cols - 1)) {
        cell.neighbours.push({ index: index + 1, direction: "right" });
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
    });
  };

  setCellVertices = () => {
    this.cells.forEach((cell) => {
      cell.vertices.tl.x = cell.x * cell.width;
      cell.vertices.tl.y = cell.y * cell.height;
      cell.vertices.tr.x = cell.vertices.tl.x + cell.width;
      cell.vertices.tr.y = cell.vertices.tl.y;
      cell.vertices.bl.x = cell.vertices.tl.x;
      cell.vertices.bl.y = cell.y * cell.height + cell.height;
      cell.vertices.br.x = cell.vertices.tl.x + cell.width;
      cell.vertices.br.y = cell.vertices.tr.y + cell.height;
    });
  };

  getRandomCell = () => {
    let randomIndex = generateRandomIntegerInRange(0, this.cells.length - 1);
    return randomIndex;
  };

  setActiveCell = (index) => {
    this.activeCell = this.cells[index];
    this.activeCell.visited = true;
  };

  setNextCell = (activeCell) => {
    console.log(activeCell.neighbours);
    this.nextCell = undefined;
    for (let i = 0; i < activeCell.neighbours.length; i++) {
      if (this.cells[activeCell.neighbours[i].index].visited === false) {
        let direction = activeCell.neighbours[i].direction;
        this.nextCell = this.cells[activeCell.neighbours[i].index];
        this.nextCell.visited = true;
        switch (direction) {
          case "top":
            this.activeCell.walls.top = false;
            this.nextCell.walls.bottom = false;
            break;
          case "right":
            this.activeCell.walls.right = false;
            this.nextCell.walls.left = false;
            break;
          case "bottom":
            this.activeCell.walls.bottom = false;
            this.nextCell.walls.top = false;
            break;
          case "left":
            this.activeCell.walls.left = false;
            this.nextCell.walls.right = false;
            break;
        }
        break;
      }
    }
    if (this.nextCell === undefined) {
      console.log("Backtracking start");
    }
    console.log(this.nextCell);
    console.log(this.activeCell);
  };

  drawMaze = () => {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = lineWidth;
    this.cells.forEach((cell) => {
      /* console.log(element.vertices); */
      if (cell.walls.top) {
        ctx.moveTo(cell.vertices.tl.x, cell.vertices.tl.y);
        ctx.lineTo(cell.vertices.tr.x, cell.vertices.tr.y);
      }
      if (cell.walls.right) {
        ctx.moveTo(cell.vertices.tr.x, cell.vertices.tr.y);
        ctx.lineTo(cell.vertices.br.x, cell.vertices.br.y);
      }
      if (cell.walls.bottom) {
        ctx.moveTo(cell.vertices.br.x, cell.vertices.br.y);
        ctx.lineTo(cell.vertices.bl.x, cell.vertices.bl.y);
      }
      if (cell.walls.left) {
        ctx.moveTo(cell.vertices.bl.x, cell.vertices.bl.y);
        ctx.lineTo(cell.vertices.tl.x, cell.vertices.tl.y);
      }
      ctx.stroke();
    });
  };
}

function init() {
  canvas.style.width = game.width;
  canvas.style.height = game.height;
  canvas.style.backgroundColor = game.backgroundColor;

  let maze = new Maze(5, 4);
  console.log(maze.cells);
}

window.onload = () => {
  init();
};

function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
