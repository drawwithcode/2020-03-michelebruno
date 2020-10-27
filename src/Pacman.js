class Pacman extends Entity {
    /**
     *
     * @type {p5.Image[]}
     */
    static images = []

    /**
     * Sounds to play on Pacman events.
     */
    static sounds = {};

    /**
     * True if Pacman keeps going without typing arrows.
     * @type {boolean}
     */
    keepMoving = false;

    /**
     * Frame until when Pacman is invincible
     *
     * @type {int}
     */
    invincibleTil = 0;

    /**
     * Checks typed key and updates direction;
     *
     * @return {p5.Vector|void}
     */
    getDirection() {
        let d;

        if (this.keepMoving) {
            d = this.direction;
        } else d = createVector(0, 0);

        switch (keyCode) {
            case UP_ARROW:
                d = Entity.directions.up;
                break;
            case DOWN_ARROW:
                d = Entity.directions.down;
                break;
            case LEFT_ARROW:
                d = Entity.directions.left;
                break;
            case RIGHT_ARROW:
                d = Entity.directions.right;
                break;
        }

        return this.direction = d;
    }

    draw() {

        push();

        noStroke();
        if (this.isInvincible() && frameCount % 2) {
            fill('red')
        } else fill(PALETTE.light);

        translate(size / 2, size / 2)

        rotate(this.angle);

        let a = map(cos(frameCount), -1, 1, 0, QUARTER_PI * .8);

        arc(0, 0, size, size, a, -a);

        fill('black');

        if (this.angle === 0) rotate(PI);

        ellipse(0, size / 4, 5);

        pop();

        for (let i = 0; i < ghosts.length; i++) {
            let g = ghosts[i];
            if (g.pos.x === this.pos.x && g.pos.y === this.pos.y) {
                return this.onMeetGhost(g);
            }
        }

    }

    canWalkOver(el) {
        el.onPlayerOver();
        return super.canWalkOver(el);
    }

    onMeetGhost(ghost) {
        if (!ghost.alive)
            return ;

        if (this.isInvincible()) {
            ghost.die();
        } else {
            this.die();
        }
    }


    setInvincible({lastsFor = 0} = {}) {
        this.invincibleTil = frameCount + lastsFor;
    }

    /**
     * Calculates if Pacman is currently invincible.
     *
     * @return {boolean}
     */
    isInvincible() {
        return frameCount < this.invincibleTil;
    }

    /**
     * I'm sorry, you died.
     */
    die() {
        super.die();

        Pacman.sounds.death.play();
    }
}