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
            return console.warn("Was not a direction");

        this.angle = atan2(d.y, d.x);

        const nextPos = this.pos.copy();

        nextPos.add(d);

        if (nextPos.x < 0) {
            nextPos.x = cols - 1;
        } else if (nextPos.x >= cols) {
            nextPos.x = 0;
        }

        if (nextPos.y < 0) {
            nextPos.y = rows - 1;
        } else if (nextPos.y >= rows) {
            nextPos.y = 0;
        }

        let index = nextPos.x + nextPos.y * cols;

        const facingElement = grid[index];

        if (this.onFacingElement(facingElement)) { // We can go on.
            this.pos.set(nextPos)
        }

    }

    /**
     *
     * @param el
     * @return {boolean} True if the entity can go on, false otherwsise.
     */
    onFacingElement(el) {
        // Exit the function if there is no facing element or it is an obstacle.
        if (!el || !el.isWalkable())
            return false;


        if (el.isEdible() && !el.wasEaten)
            el.setEaten();

        return true;
    }

    run() {
        push();

        translate(this.pos.x * size, this.pos.y * size);

        this.draw()

        pop();
    }

    draw() {
    }

    play() {
    }

}


class Pacman extends Entity {

    /**
     *
     * @type {p5.Image[]}
     */
    static images = []

    static sounds = {};

    draw() {
        let img = Pacman.images[0];
        push();
        fill(PALETTE.light)

        translate(size / 2, size / 2)
        rotate(this.angle);
        let a = map(cos(frameCount), -1, 1, 0, QUARTER_PI * 0.9)
        arc(0, 0, size, size, a, -a);

        // fill('white');
        // ellipse(size / 3 * cos(QUARTER_PI), size / 3 * sin(QUARTER_PI), 10);
        pop();
    }

}
