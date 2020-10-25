/*
 * ==================================================
 *  ***      *      ******  *     *      *      *   *
 *  *  *    * *     *       **   **     * *     **  *
 *  ***    *   *    *       * * * *    *   *    * * *
 *  *     * * * *   *       *  *  *   * * * *   *  **
 *  *    *       *  ******  *     *  *       *  *   *
 * ==================================================
 */

const PALETTE = {}, SOUNDS = {};

let cols,
    rows,
    size = 30,
    player,
    grid = [],
    enemies,
    gridData,
    leftToWin = 0;

function preload() {
    // @todo load pacman images
    gridData = loadJSON('./assets/walls.json', () => {
        gridData = Object.values(gridData)
    });

    //Pacman.images.push(loadImage('https://www.classicgaming.cc/classics/pac-man/images/icons/pac-man-32x32.png'))

    Pacman.sounds.beginning = loadSound('./assets/sounds/pacman_beginning.wav');
    Pacman.sounds.chomp = loadSound('./assets/sounds/pacman_chomp.wav');
    Pacman.sounds.death = loadSound('./assets/sounds/pacman_death.wav');
    Pacman.sounds.eatfruit = loadSound('./assets/sounds/pacman_eatfruit.wav');
    Pacman.sounds.eatghost = loadSound('./assets/sounds/pacman_eatghost.wav');
    Pacman.sounds.extrapac = loadSound('./assets/sounds/pacman_extrapac.wav');
    Pacman.sounds.intermission = loadSound('./assets/sounds/pacman_intermission.wav');

}

function setGrid() {
    grid = new Array(rows * cols);
    for (let y = 0; y < gridData.length; y++) {
        let r = gridData[y];

        for (let x = 0; x < r.length; x++) {
            let w = r[x]
            if (w === 1) {
                grid[y * cols + x] = new Wall({x, y})
            } else if (w === 0) {
                grid[y * cols + x] = new Point({x, y})
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

    frameRate(10);

    pixelDensity(1);

    rows = gridData.length;
    cols = gridData[0].length;

    PALETTE.dark = color('#04052a');
    PALETTE.light = color('#ffe71d');

    setGrid();

    player = new Pacman();
}


function draw() {

    background(PALETTE.dark);

    push();

    translate(width / 2, height / 6);


    push();
    translate(-size * cols / 2, 0);
    grid.forEach(c => c.run());
    player.run();
    pop();

    // Draw instructions.
    push();

    translate(size * cols / 2 + size * 3, height / 2 - height / 6)

    fill(PALETTE.light);
    textSize(20)
    text("Press R to reset.", 0, 0)

    pop();

    pop();
}


function keyPressed() {

    if (key === "r") {
        setGrid();
    } else if (player && player.move) player.move();
}


