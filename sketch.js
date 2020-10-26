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
    logo,
    gameHeight;

const PALETTE = {}, SOUNDS = {};

function preload() {
    // @todo load pacman images
    gridData = loadJSON('./assets/walls.json', () => {
        gridData = Object.values(gridData)
    });

    logo = loadImage('./assets/img/logo.png');

    Ghost.image = loadImage('./assets/img/ghost-chase-32x32.png');
    Fruit.fruits[0].img = loadImage('./assets/img/fruit_cherry.gif');
    Fruit.fruits[1].img = loadImage('./assets/img/fruit_apple.gif');

    Pacman.sounds.beginning = loadSound('./assets/sounds/pacman_beginning.wav');
    Pacman.sounds.chomp = loadSound('./assets/sounds/pacman_chomp.wav');
    Pacman.sounds.death = loadSound('./assets/sounds/pacman_death.wav');
    Pacman.sounds.eatfruit = loadSound('./assets/sounds/pacman_eatfruit.wav');
    Pacman.sounds.eatghost = loadSound('./assets/sounds/pacman_eatghost.wav');
    Pacman.sounds.extrapac = loadSound('./assets/sounds/pacman_extrapac.wav');
    Pacman.sounds.intermission = loadSound('./assets/sounds/pacman_intermission.wav');

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
    player = new Pacman();


    ghosts = [];

    ghosts.push(new Ghost({
        x: 1, y: 2
    }))

}

/**
 * This functions fills the grid.
 */
function setGrid() {
    grid = new Array(rows * cols);

    for (let y = 0; y < gridData.length; y++) {
        let r = gridData[y];

        for (let x = 0; x < r.length; x++) {
            let w = r[x]
            if (w === 1) {
                grid[y * cols + x] = new Wall({x, y})
            } else if (w === 0) {
                grid[y * cols + x] = random() > .1 ? new Point({x, y}) : new Fruit({x, y});
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

    frameRate(6);

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

    startGame();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    setSizes();
}

function draw() {

    background(PALETTE.dark);

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

    translate(size * cols / 2 + size * 3, height / 2 - height / 6)

    fill(PALETTE.light);

    textSize(20);

    text("Press R to reset.", 0, 0);
    text(leftToWin + ' to win.', 0, 25);

    pop();

    pop();
}


function keyPressed() {
    if (key === "r") {
        startGame();
    }
}