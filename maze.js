let game = {
  width: 600,
  height: 400,
  backgroundColor: "black",
};

class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = [];
  }
  drawGrid = (id) => {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext("2d");
    this.cells.forEach((element) => {
      /* console.log(element.vertices); */
      ctx.moveTo(element.vertices.tl.x, element.vertices.tl.y);
      ctx.lineTo(element.vertices.tr.x, element.vertices.tr.y);
      ctx.moveTo(element.vertices.tr.x, element.vertices.tr.y);
      ctx.lineTo(element.vertices.br.x, element.vertices.br.y);
      ctx.moveTo(element.vertices.br.x, element.vertices.br.y);
      ctx.lineTo(element.vertices.bl.x, element.vertices.bl.y);
      ctx.moveTo(element.vertices.bl.x, element.vertices.bl.y);
      ctx.lineTo(element.vertices.tl.x, element.vertices.tl.y);
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    });
  };
  getRandomCell = () => {
    return Math.floor(Math.random() * ((this.cells.length - 1) - 0 + 1)) + 0;
  }
}

class Cell extends Grid {
  constructor(cols, rows, x, y) {
    super(cols, rows);
    this.width = Math.floor(game.width / this.cols);
    this.height = Math.floor(game.height / this.rows);
    this.x = x;
    this.y = y;
    this.visited = false;
    this.neighbours = {
      top: false, /* neighbour top */
      right: false, /* neighbour left */
      bottom: false, /* neighbour bottom */
      left: false, /* neighbour left */
    };
    this.vertices = {
      tl: {x: undefined, y: undefined}, /* Top Left */
      tr: {x: undefined, y: undefined}, /* Top Right */
      bl: {x: undefined, y: undefined}, /* Bottom Left */
      br: {x: undefined, y: undefined} /* Bottom Right */
    }
  }
  setNeighbours = (index) => {
    if (!(this.y === 0)) {
      this.neighbours.top = index - this.cols;
    }
    if (!(this.x === this.cols - 1)) {
      this.neighbours.right = index + 1;
    }
    if (!(this.y === this.rows - 1)) {
      this.neighbours.bottom = index + this.cols;
    }
    if (!(this.x === 0)) {
      this.neighbours.left = index - 1;
    }
  };
  setVertices = () => {
    this.vertices.tl.x = (this.x * this.width);
    this.vertices.tl.y = (this.y * this.height);
    this.vertices.tr.x = this.vertices.tl.x + this.width;
    this.vertices.tr.y = this.vertices.tl.y;
    this.vertices.bl.x = this.vertices.tl.x;
    this.vertices.bl.y = (this.y * this.height) + this.height;
    this.vertices.br.x = this.vertices.tl.x + this.width;
    this.vertices.br.y = this.vertices.tr.y + this.height;
  }
}

function init(ctx) {
  let grid = new Grid(4, 3);
  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      let cell = new Cell(grid.cols, grid.rows, j, i);
      let index = grid.cells.push(cell) - 1;
      cell.setNeighbours(index);
      cell.setVertices();
    }
  }
  grid.drawGrid("canvas");
  let randomIndex = grid.getRandomCell();
  console.log(randomIndex);
  let activeCell = grid.cells[randomIndex];
  activeCell.visited = true;
  ctx.fillStyle = "green";
  ctx.fillRect(activeCell.vertices.tl.x, activeCell.vertices.tl.y, activeCell.width, activeCell.height);
  /* ctx.stroke(); */
}

window.onload = () => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  canvas.style.width = game.width;
  canvas.style.height = game.height;
  canvas.style.backgroundColor = game.backgroundColor;
  init(ctx);
};
