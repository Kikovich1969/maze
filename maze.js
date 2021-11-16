let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let lineWidth = 6; // must be even, otherwise antialiasing will show!

let game = {
  width: 600,
  height: 400,
  backgroundColor: "black",
};

class Maze {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = [];
  }
  drawMaze = () => {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'bevel';
    this.cells.forEach((element) => {
      /* console.log(element.vertices); */
      //ctx.beginPath();
      ctx.moveTo(element.vertices.tl.x, element.vertices.tl.y);
      ctx.lineTo(element.vertices.tr.x, element.vertices.tr.y);
      ctx.stroke();
      //ctx.moveTo(element.vertices.tr.x, element.vertices.tr.y);
      ctx.lineTo(element.vertices.br.x, element.vertices.br.y);
      ctx.stroke();
      //ctx.moveTo(element.vertices.br.x, element.vertices.br.y);
      ctx.lineTo(element.vertices.bl.x, element.vertices.bl.y);
      ctx.stroke();
      //ctx.moveTo(element.vertices.bl.x, element.vertices.bl.y);
      ctx.lineTo(element.vertices.tl.x, element.vertices.tl.y);
      ctx.stroke();
    });
  };
}

class Cell extends Maze {
  constructor(cols, rows, x, y) {
    super(cols, rows);
    this.width = Math.floor(game.width / this.cols);
    this.height = Math.floor(game.height / this.rows);
    this.x = x;
    this.y = y;
    this.visited = false;
    this.neighbours = [];
    this.vertices = {
      tl: { x: undefined, y: undefined } /* Top Left */,
      tr: { x: undefined, y: undefined } /* Top Right */,
      bl: { x: undefined, y: undefined } /* Bottom Left */,
      br: { x: undefined, y: undefined } /* Bottom Right */,
    };
    this.walls = [true, true, true, true];
  }
  setNeighbours = (index) => {
    if (!(this.y === 0)) {
      this.neighbours.push({ index: index - this.cols, direction: "top" });
    }
    if (!(this.x === this.cols - 1)) {
      this.neighbours.push({ index: index + 1, direction: "right" });
    }
    if (!(this.y === this.rows - 1)) {
      this.neighbours.push({ index: index + this.cols, direction: "bottom" });
    }
    if (!(this.x === 0)) {
      this.neighbours.push({ index: index - 1, direction: "left" });
    }
  };
  setVertices = () => {
    this.vertices.tl.x = this.x * this.width;
    this.vertices.tl.y = this.y * this.height;
    this.vertices.tr.x = this.vertices.tl.x + this.width;
    this.vertices.tr.y = this.vertices.tl.y;
    this.vertices.bl.x = this.vertices.tl.x;
    this.vertices.bl.y = this.y * this.height + this.height;
    this.vertices.br.x = this.vertices.tl.x + this.width;
    this.vertices.br.y = this.vertices.tr.y + this.height;
  };
  show = () => {
    console.log('Show Cell');

  }
}

function init() {
  canvas.style.width = game.width;
  canvas.style.height = game.height;
  canvas.style.backgroundColor = game.backgroundColor;

  let maze = new Maze(6, 4);
  for (let i = 0; i < maze.rows; i++) {
    for (let j = 0; j < maze.cols; j++) {
      let cell = new Cell(maze.cols, maze.rows, j, i);
      let index = maze.cells.push(cell) - 1;
      cell.setNeighbours(index);
      cell.setVertices();
      cell.show();
    }
  }
  maze.drawMaze(canvas);
  let randomIndex = generateRandomIntegerInRange(0, maze.cells.length - 1);
  let activeCell = maze.cells[randomIndex];
  console.log("Active cell:");
  console.log(activeCell);
  activeCell.visited = true;

  /* Mark active cell */
  /* ctx.fillStyle = "green";
  ctx.fillRect(
    activeCell.vertices.tl.x,
    activeCell.vertices.tl.y,
    activeCell.width,
    activeCell.height
  ); */

  /* Choose neighbour which was not visitied yet */
  for (let i = 0; i < activeCell.neighbours.length; i++) {
    let newCellIndex = activeCell.neighbours[i].index;
    let direction = activeCell.neighbours[i].direction;
    console.log(newCellIndex);
    if (!maze.cells[newCellIndex].visited) {
      newActiveCell = maze.cells[newCellIndex];
      newActiveCell.visited = true;
      /* Delete Lines */
      if (direction === "top") {
        ctx.beginPath();
        ctx.moveTo(activeCell.vertices.tl.x, activeCell.vertices.tl.y);
        ctx.lineTo(activeCell.vertices.tr.x, activeCell.vertices.tr.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.moveTo(newActiveCell.vertices.bl.x, newActiveCell.vertices.bl.y);
        ctx.lineTo(newActiveCell.vertices.br.x, newActiveCell.vertices.br.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      } else if (direction === "right") {
        ctx.beginPath();
        ctx.moveTo(activeCell.vertices.tr.x, activeCell.vertices.tr.y);
        ctx.lineTo(activeCell.vertices.br.x, activeCell.vertices.br.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.moveTo(newActiveCell.vertices.tl.x, newActiveCell.vertices.tl.y);
        ctx.lineTo(newActiveCell.vertices.bl.x, newActiveCell.vertices.bl.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      } else if (direction === "bottom") {
        ctx.beginPath();
        ctx.moveTo(activeCell.vertices.bl.x, activeCell.vertices.bl.y);
        ctx.lineTo(activeCell.vertices.br.x, activeCell.vertices.br.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.moveTo(newActiveCell.vertices.tl.x, newActiveCell.vertices.tl.y);
        ctx.lineTo(newActiveCell.vertices.tr.x, newActiveCell.vertices.tr.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      } else {
        /* direction left */
        ctx.beginPath();
        ctx.moveTo(activeCell.vertices.bl.x, activeCell.vertices.bl.y);
        ctx.lineTo(activeCell.vertices.tl.x, activeCell.vertices.tl.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = lineWidth + 2;
        ctx.stroke();
        ctx.moveTo(newActiveCell.vertices.tr.x, newActiveCell.vertices.tr.y);
        ctx.lineTo(newActiveCell.vertices.br.x, newActiveCell.vertices.br.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = lineWidth + 2;
        ctx.stroke();
      }

      console.log("New active cell:");
      console.log(newActiveCell);
      activeCell = newActiveCell;
      break;
    } else {
      /* No cell  */
      console.log("Backtracking Start");
    }
  }
  //console.log(maze.cells);
}

window.onload = () => {
  init();
};

function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
