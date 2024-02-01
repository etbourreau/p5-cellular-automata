APP = {
  rule: null,
  color: null,
  colorInvert: false,
  layerAlpha: 200,

  cellSize: 4,
  frameRate: 60,

  endProcess: false,

  offset: 0,
  curr: 0,
  cells: null,
  lastCells: null,
};
RULES = [
  13, 18, 22, 26, 28, 30, 45, 54, 57, 60, 62, 69, 70, 73, 75, 77, 78, 79, 82,
  86, 89, 90, 92, 94, 99, 101, 102, 105, 109, 110, 118, 124, 126, 129, 131, 133,
  135, 137, 141, 145, 146, 147, 149, 150, 153, 154, 156, 157, 158, 161, 165,
  167, 169, 181, 182, 188, 190, 193, 195, 197, 198, 199, 210, 214, 218, 225,
  230, 246,
];
DUO_COLORS = null;

setup = () => {
  initColors();
  createCanvas(0, 0);
  background(0);
  frameRate(APP.frameRate);
  reset(true);
};

initColors = () => {
  DUO_COLORS = [
    {
      a: color("#0b0b0b"),
      b: color("#ffed02"),
    },
    {
      a: color("#004fda"),
      b: color("#ed0302"),
    },
    {
      a: color("#6d129d"),
      b: color("#ff9787"),
    },
    {
      a: color("#222"),
      b: color("#DDD"),
    },
    {
      a: color("#5b5b5b"),
      b: color("#00e696"),
    },
    {
      a: color("#f49881"),
      b: color("#01bfbf"),
    },
    {
      a: color("#0b0b0b"),
      b: color("#ff9c00"),
    },
    {
      a: color("#008bde"),
      b: color("#ff9c00"),
    },
  ];
};

windowResized = () => {
  reset(true);
};

reset = (resize = false) => {
  const previousRule = APP.rule;
  do {
    APP.rule = floor(random(RULES.length));
  } while (APP.rule === previousRule);

  const previousColor = APP.color;
  do {
    APP.color = floor(random(DUO_COLORS.length));
  } while (APP.color === previousColor);
  APP.colorInvert = random() > 0.5;

  APP.curr = 0;

  if (resize) {
    resizeCanvas(windowWidth, windowHeight - 4);
  }

  initCells();
  APP.offset = (windowWidth - APP.cells.length * APP.cellSize) / 2;
  drawCells();
};

initCells = () => {
  const len = floor(width / APP.cellSize);
  APP.cells = new Array(len).fill(0);
  APP.cells[floor(APP.cells.length / 2)] = 1;

  APP.lastCells = new Array(len).fill(0);
};

draw = () => {
  if (APP.cells?.length) {
    const reached = reachedBottom();

    if (!reached) {
      updateCells();
      drawCells();
      if (APP.curr < 20) {
        drawRuleNumber();
      }
    } else {
      reset();
    }
  }
};

drawRuleNumber = () => {
  const bg = DUO_COLORS[APP.color][APP.colorInvert ? "b" : "a"];
  const cell = DUO_COLORS[APP.color][APP.colorInvert ? "a" : "b"];

  fill(bg);
  noStroke();
  rectMode(CORNER);
  rect(20, 20, 100, 50);
  fill(cell);
  textAlign(CENTER, CENTER);
  textSize(40);
  text(RULES[APP.rule], 70, 48);
};

updateCells = () => {
  const newCells = [];
  const rule = APP.rule;
  const ruleBin = RULES[rule].toString(2).padStart(8, "0");
  APP.cells.forEach((b, i, ar) => {
    const a = ar[(i - 1 + ar.length) % ar.length];
    const c = ar[(i + 1 + ar.length) % ar.length];
    if (!a && !b && !c) newCells.push(parseInt(ruleBin[7]));
    if (!a && !b && c) newCells.push(parseInt(ruleBin[6]));
    if (!a && b && !c) newCells.push(parseInt(ruleBin[5]));
    if (!a && b && c) newCells.push(parseInt(ruleBin[4]));
    if (a && !b && !c) newCells.push(parseInt(ruleBin[3]));
    if (a && !b && c) newCells.push(parseInt(ruleBin[2]));
    if (a && b && !c) newCells.push(parseInt(ruleBin[1]));
    if (a && b && c) newCells.push(parseInt(ruleBin[0]));
  });
  APP.cells = newCells;
  APP.curr++;
};

drawCells = () => {
  const bg = DUO_COLORS[APP.color][APP.colorInvert ? "b" : "a"];
  const cell = DUO_COLORS[APP.color][APP.colorInvert ? "a" : "b"];
  bg.setAlpha(APP.layerAlpha);
  cell.setAlpha(APP.layerAlpha);
  const cs = APP.cellSize;
  noStroke();
  rectMode(CORNER);
  APP.cells.forEach((x, i) => {
      fill(x ? cell : bg);
      const origin = createVector(APP.offset + cs * i, APP.curr * cs);
      rect(origin.x, origin.y, cs, cs);
  });
};

reachedBottom = () => {
  const nextPos = APP.curr * APP.cellSize + APP.cellSize * 2;
  return nextPos >= height;
};
