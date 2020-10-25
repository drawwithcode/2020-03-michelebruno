/*
 * ==================================================
 *  ***      *      ******  *     *      *      *   *
 *  *  *    * *     *       **   **     * *     **  *
 *  ***    *   *    *       * * * *    *   *    * * *
 *  *     * * * *   *       *  *  *   * * * *   *  **
 *  *    *       *  ******  *     *  *       *  *   *
 * ==================================================
 */

const PALETTE = {};

let cols = 21,
    rows = 23,
    size = 40,
    player,
    grid = [],
    enemies;


function preload() {
    // @todo load pacman images


}

function setup() {
    createCanvas(windowWidth, windowHeight);

    frameRate(15);

    pixelDensity(1);

    PALETTE.dark = color('#04052a');
    PALETTE.light = color('#ffe71d');

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            random() > .4 ? grid.push(new Point({x, y})): grid.push(new Wall({x, y}))
        }
    }

    player = new Pacman();
}


function draw() {

    background(PALETTE.dark)
    grid.forEach(c => c.run());

    player.run();

}


function keyPressed() {
    player.move();
}

class Entity {
    constructor(
        {
            x = 10,
            y = 10
        } = {}
    ) {
        this.pos = createVector(x, y);
        this.angle = 0;

        this.color = color('red');
    }

    /**
     * Checks typed key and updates direction;
     *
     * @return {p5.Vector|void}
     */
    getDirection() {
        let d;
        switch (keyCode) {
            case UP_ARROW:
                d = createVector(0, -1);
                break;
            case DOWN_ARROW:
                d = createVector(0, 1);
                break;
            case LEFT_ARROW:
                d = createVector(-1, 0);
                break;
            case RIGHT_ARROW:
                d = createVector(1, 0);
                break;
        }
        return d;
    }


    /**
     * Should update in base of direction and
     */
    move() {

        let d = this.getDirection();

        if (!d)
            return console.log("Was not a direction");

        this.angle = radians(d.y / d.x);

        const nextPos = this.pos.copy();

        nextPos.add(d);

        if (nextPos.x < 0) {
            nextPos.x = cols - 1
        } else if ( nextPos.x >= cols ) {
            nextPos.x = 0;
        }

        if (nextPos.y < 0) {
            nextPos.y = rows - 1
        } else if ( nextPos.y >= rows ) {
            nextPos.y = 0;
        }

        const facingElement = grid[nextPos.x + nextPos.y * cols];

        console.log(facingElement)

        // Exit the function if there is no facing element or it is an obstacle.
        if (!facingElement || !facingElement.canBeWalkedOn())
            return;


        if (facingElement.canBeEaten())
            facingElement.setEaten();

        this.pos.set(nextPos)


    }

    run() {
        push();

        translate(this.pos.x * size, this.pos.y * size);

        this.draw()

        pop();
    }

    draw() {}
}


class Pacman extends Entity {

    draw() {
        push();
        fill(this.color);
        ellipse(size / 2, size / 2, size );
        pop();
    }
}

class FieldElement {

    constructor({x, y} = {}) {
        this.pos = createVector(x, y);
        this.wasEaten = false;
        this.edible = true;
    }

    canBeWalkedOn() {
        return true;
    }

    canBeEaten() {
        return this.edible && !this.wasEaten;
    }

    setEaten() {
        return this.wasEaten = true;
    }

    run() {
        if (this.wasEaten)
            return;

        push();

        translate(this.pos.x * size, this.pos.y * size);

        this.draw();

        pop();

    }

    draw() {

    };
}

class Point extends FieldElement {

    draw() {
        push();
        fill(PALETTE.light)
        ellipse(size / 2, size / 2, size / 2);
        pop();
    }

}

class Wall extends FieldElement {
    canBeWalkedOn() {
        return false;
    }

    draw() {
        push();
        fill('red');
        rect(size/4, size/6, size/2, size/3);
        pop();
    }
}