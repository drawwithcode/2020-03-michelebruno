/**
 * @property {p5.Vector} direction
 */
class Entity {
    constructor(
        {
            x = 10,
            y = 10
        } = {}
    ) {
        this.pos = createVector(x, y);

        this.direction = createVector(0, 1);

        this.alive = true;
    }

    run() {
        if (!this.alive)
            return;

        this.move();

        push();

        translate(this.pos.x * size, this.pos.y * size);

        this.draw()

        pop();
    }

    /**
     * Should update in base of direction and
     */
    move() {

        if (!this.alive) return;

        this.beforeRun();

        let d = this.getDirection();

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

        const facingElement = grid[nextPos.x + nextPos.y * cols];

        if (this.canWalkOver(facingElement))
            this.pos.set(nextPos);

    }

    beforeRun() {
    }

    /**
     *
     * @param {FieldElement} el
     * @return {boolean} True if the entity can go on, false otherwise.
     */
    canWalkOver(el) {
        if (!el)
            return false;

        if (el.isWalkable())
            return true;
        else this.onCantGo();
    }

    onCantGo() {
    }

    die() {
        this.alive = false;
    }
}


class Ghost extends Entity {

    draw() {
        this.checkIfMetPlayer();

        if (!this.alive)
            return;

        let w = min(Ghost.image.width, size),
            offset = (size - w) / 2;

        image(Ghost.image, offset, offset + sin(frameCount / 2) * 3, w, w);
    }

    beforeRun() {
        super.beforeRun();
        this.checkIfMetPlayer();
    }

    getDirection() {

        // If necessary, initiates the direction vector object.
        if (!this.direction || !this.direction instanceof p5.Vector)
            this.direction = Entity.directions.random();


        let d = Ghost.directions.random(),
            possiblePos = this.pos.copy();

        possiblePos.add(d)

        // Randomly, tries to change direction if possible.
        if (random() > .5 && grid[possiblePos.x + possiblePos.y * cols].isWalkable())
            return this.direction = d;


        return this.direction;
    }

    checkIfMetPlayer() {

        if (this.pos.x === player.pos.x && this.pos.y === player.pos.y) {
            player.onMeetGhost(this);
        }
    }

    onCantGo() {
        this.direction = Entity.directions.random();
    }

    die() {
        if (!this.alive)
            return;

        super.die();

        SOUNDS.eatghost.play();

        if (!ghosts.filter(g => g.alive).length) {

        }
    }
}