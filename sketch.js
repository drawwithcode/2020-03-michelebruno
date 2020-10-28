"use strict";
/*
 * ==================================================
 *  ***      *      ******  *     *      *      *   *
 *  *  *    * *     *       **   **     * *     **  *
 *  ***    *   *    *       * * * *    *   *    * * *
 *  *     * * * *   *       *  *  *   * * * *   *  **
 *  *    *       *  ******  *     *  *       *  *   *
 * ==================================================
 */

let cols,
    rows,
    size = 30,
    player,
    started = false,
    /**
     * The list of the elements: walls, dots, fruits.
     *
     * @type {FieldElement[]}
     */
    grid,
    /**
     * The shape of the field, fetched from the JSON.
     */
    gridData,
    ghosts,
    leftToWin = 0,
    /**
     * @type {Score}
     */
    score,
    logo,
    gameHeight,
    fSize = 25,
    life = 3;

const PALETTE = {}, SOUNDS = {};

function preload() {
    // @todo load pacman images
    gridData = loadJSON('./assets/walls.json', () => {
        gridData = Object.values(gridData)
    });

    logo = loadImage('./assets/img/logo.png');

    Ghost.image = loadImage('./assets/img/ghost-chase-32x32.png');
    Fruit.fruits[0].img = loadImage('./assets/img/fruit_cherry.png');
    Fruit.fruits[1].img = loadImage('./assets/img/fruit_apple.png');

    SOUNDS.beginning = loadSound('./assets/sounds/pacman_beginning.wav');
    SOUNDS.chomp = loadSound('./assets/sounds/pacman_chomp.wav');
    SOUNDS.death = loadSound('./assets/sounds/pacman_death.wav');
    SOUNDS.eatfruit = loadSound('./assets/sounds/pacman_eatfruit.wav');
    SOUNDS.eatghost = loadSound('./assets/sounds/pacman_eatghost.wav');
    SOUNDS.extrapac = loadSound('./assets/sounds/pacman_extrapac.wav');
    SOUNDS.intermission = loadSound('./assets/sounds/pacman_intermission.wav');

    SOUNDS.eatfruit.setVolume(.8)
    SOUNDS.eatghost.setVolume(.8)
    SOUNDS.extrapac.setVolume(.8)

}

function setSizes() {
    gameHeight = height * 5 / 6;
    size = min(size, gameHeight / rows);
}

/**
 * Function to start or restart game.
 */
function startGame() {
    setGrid()

    life = 3;

    if (!isWin()) score.reset();

    player = new Pacman();

    ghosts = [];

    let g = floor(random(3, 5))

    for (let i = 0; i < g; i++) {
        let x = floor(random(1, cols - 1)),
            y = floor(random(1, rows - 1));

        if (grid[x + cols * y] instanceof Wall) {
            i--;
            continue;
        }

        let ghost = new Ghost({
            x, y
        });


        // console.log(ghost.pos.sub(player.pos).mag())
        if (ghost.pos.copy().sub(player.pos).mag() < 10) {
            i--;
            continue;
        }

        ghosts.push(ghost)
    }

    started && SOUNDS.beginning.play();

}

/**
 * This functions fills the grid.
 */
function setGrid() {
    grid = new Array(rows * cols);

    let maxFruits = 6, fruits = 0;
    for (let y = 0; y < gridData.length; y++) {
        let r = gridData[y];

        for (let x = 0; x < r.length; x++) {
            let w = r[x]
            if (w === 1) {
                grid[y * cols + x] = new Wall({x, y})
            } else if (w === 0) {
                if (random() < .02 && fruits < maxFruits) {
                    grid[y * cols + x] = new Fruit({x, y});
                    fruits++;
                } else grid[y * cols + x] = new Dot({x, y});
            } else {
                grid[y * cols + x] = new FieldElement();
            }
        }
    }

    leftToWin = grid.filter(g => {
        return g.isEdible() && !g.wasEaten;
    }).length
}


function setup() {

    createCanvas(windowWidth, windowHeight);

    frameRate(12);

    // Set here the default font.
    textFont("Joystix");

    // Create the four directions to move Ghosts and Pacman
    Entity.directions = {
        up: createVector(0, -1),
        down: createVector(0, 1),
        left: createVector(-1, 0),
        right: createVector(1, 0),
        random: function () {
            return random([this.up, this.down, this.left, this.right])
        }
    }

    rows = gridData.length;
    cols = gridData[0].length;

    setSizes();

    // Filling the palette
    PALETTE.dark = color('#04052a');
    PALETTE.light = color('#ffe71d');

    score = new Score();

    startGame();

}

function drawWin() {
    push();

    let fSize = 90;
    textSize(fSize)
    textAlign(CENTER)
    fill('green')

    let s = 'You won!'
    text(s, width / 2 - s.length, height / 2);

    pop();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    setSizes();
}

function draw() {
    // The game ends if there is no dots/fruits or there are no more ghosts.
    if (!leftToWin || !ghosts.filter(g => g.alive).length) {
        return drawWin();
    }

    background('black');

    push();

    translate(width / 2, height / 5);

    // Draw logo
    let logoData = {
        w: logo.width,
        h: logo.height,
        ratio: logo.w / logo.h
    }

    image(logo, -logoData.w / 2, 10 - height / 5);

    push();

    translate(-size * cols / 2, 0);
    fill('white');
    textSize(fSize);

    if (!life) fill('red');

    text(life ? life + "UP" : "GAME OVER", size, 15);
    text(score.current, size, 15 + fSize);

    textAlign(RIGHT);

    text("HIGH SCORE ", cols * size, 15);

    textAlign(CENTER);

    text(score.highest, (cols - 3) * size, 15 + fSize);

    translate(0, fSize * 1.5);
    grid.forEach(c => c.run());
    ghosts.forEach(c => c.run());
    player.run();
    pop();

    /*
     ===============
     Draw instructions.
     ===============
     */
    push();

    translate(-cols * size / 2, rows * size + size * 1.5);

    fill(PALETTE.light);

    textSize(fSize);

    textAlign(LEFT);

    if (!started) {
        fill([0, 1, 2, 3, 4, 5].indexOf(frameCount % 8) !== -1 ? 'yellow' : 'black');
        text("Press C to insert coin.", size, 15);
    } else if (isWin()) {
        fill('green');
        text("Press C to continue.", size, 15);
    } else text("Press R to reset.", size, 15);

    pop();

    pop();
}

function isWin() {

    if (leftToWin === 0)
        return true;

    if (ghosts && ghosts.filter(g => g.alive).length === 0)
        return true;
    else return false;
}

function keyPressed() {
    if (key === "r") {
        startGame();
    }

    if (key === "c" && !started) {
        started = true;
        started && SOUNDS.beginning.play();
    } else if (key === "c" && isWin()) {
        startGame();
    }
}

class Score {
    constructor() {
        this.current = 0;
        this.highest = 0;
    }

    add(inc = 1) {
        this.current += inc;
        if (this.current > this.highest)
            this.highest = this.current;
    }

    reset() {
        this.current = 0;
    }
}

