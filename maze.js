import { generateRandomIntegerInRange } from "./helper.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let game = {
  width: 600,
  height: 400,
  backgroundColor: "white",
};

class Maze {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = [];
    this.activeCell = undefined;
    this.nextCell = undefined;
    this.stack = [];
    this.strokeStyle = "#7f7f7f";
    this.fillStyle = "#7f7f7f";
    this.lineWidth = 1; // must be even, otherwise antialiasing will show!
    this.createCells();
    this.setStartingCell(this.getRandomCellIndex());
    this.setRandomNeighbour();
    this.drawMaze();
  }

  createCells = () => {
    let index = 0;
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
      }
    }
  };

  getRandomCellIndex = () => {
    let randomIndex = generateRandomIntegerInRange(0, this.cells.length - 1);
    return randomIndex;
  };

  setStartingCell = (index) => {
    this.activeCell = this.cells[index];
    this.activeCell.visited = true;
    this.stack.push(index);
  };

  setRandomNeighbour = () => {
    let neighboursCount = this.activeCell.neighbours.length;
    if (neighboursCount > 0) {
      let randomIndex = generateRandomIntegerInRange(
        0,
        this.activeCell.neighbours.length - 1
      );
      let randomNeighbour = this.activeCell.neighbours[randomIndex];
      if (!this.cells[randomNeighbour.index].visited) {
        /* Chosen neighbour was not visited yet */
        let direction = randomNeighbour.direction;
        this.nextCell = this.cells[randomNeighbour.index];
        this.nextCell.visited = true;
        this.breakWallsBetweenActiveAndRandomNeighbour(
          direction,
          randomNeighbour.index
        );
      } else {
        /* Chosen neighbour already visited */
        /* Splice already visited neighbour */
        this.activeCell.neighbours.splice(randomIndex, 1);
        this.setRandomNeighbour();
      }
    } else if (this.stack.length > 1) {
      this.stack.pop();
      this.activeCell = this.cells[this.stack[this.stack.length - 1]];
      this.setRandomNeighbour();

    } else {
      /* No neighbours anymore */
      this.nextCell = false;
    }
  };

  breakWallsBetweenActiveAndRandomNeighbour = (direction, index) => {
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
    this.activeCell = this.nextCell;
    this.stack.push(index);
    this.setRandomNeighbour();
  };

  drawMaze = () => {
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.lineWidth = this.lineWidth;
    this.cells.forEach((cell) => {
      let wallTop,
        wallRight,
        wallBottom,
        wallLeft = false;
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
        ctx.rect(
          cell.vertices.tl.x,
          cell.vertices.tl.y,
          cell.width,
          cell.height
        );
        ctx.fillStyle = "#7f7f7f";
        ctx.fill();
      }
    });
  };
}

function init() {
  canvas.style.width = game.width;
  canvas.style.height = game.height;
  canvas.style.backgroundColor = game.backgroundColor;
  let maze = new Maze(10, 6);
}

window.onload = () => {
  init();
};
