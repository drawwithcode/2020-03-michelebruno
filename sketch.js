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

    SOUNDS.beginning.play();

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

function drawWin() {
    push();

    textSize(40)

    fill('red')

    text('You won!', width / 2, height / 2);

    pop();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    setSizes();
}

function draw() {
    // The game ends if there is no dots/fruits or there are no more ghosts.
    if (!leftToWin || !ghosts.filter(g => g.alive).length) {
        console.log("Victory")
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