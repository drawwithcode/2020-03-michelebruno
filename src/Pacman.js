class Pacman extends Entity {
    /**
     * True if Pacman keeps going without typing arrows.
     * @type {boolean}
     */
    keepMoving = true;

    /**
     * Frame until when Pacman is invincible
     *
     * @type {int}
     */
    invincibleTil = 0;

    invicibilityTotalTime = 0;

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


        if (keyIsDown(UP_ARROW)) {
            d = Entity.directions.up;

        }
        if (keyIsDown(DOWN_ARROW)) {
            d = Entity.directions.down;

        }
        if (keyIsDown(LEFT_ARROW)) {
            d = Entity.directions.left;

        }
        if (keyIsDown(RIGHT_ARROW)) {
            d = Entity.directions.right;
        }


        return this.direction = d;
    }

    draw() {

        push();

        noStroke();
        if (this.isInvincible() && frameCount % 2) {
            fill(color("#d80e18"))
        } else fill(PALETTE.light);


        translate(size / 2, size / 2)

        rotate(this.direction.heading());

        let a = map(cos(frameCount * 8), -1, 1, 0, QUARTER_PI * .8);

        arc(0, 0, size, size, a, -a);

        fill('black');

        if (this.direction.heading() === 0) rotate(PI);

        ellipse(0, size / 4, 5);

        pop();
    }

    canWalkOver(el) {
        el.onPlayerOver();
        return super.canWalkOver(el);
    }

    onMeetGhost(ghost) {
        if (!ghost.alive)
            return;

        // noLoop();
        if (this.isInvincible()) {
            ghost.die();
        } else {
            this.die();
        }
    }

    setInvincible({lastsFor = 0} = {}) {


        if (this.isInvincible()) {
            this.invincibleTil += lastsFor;

        } else {
            this.invincibleTil = frameCount + lastsFor;
        }

        // SOUNDS.intermission.play();
    }

    /**
     * Calculates if Pacman is currently invincible.
     *
     * @return {boolean}
     */
    isInvincible() {
        if (frameCount < this.invincibleTil) {
            return true
        } else {
            this.invicibilityTotalTime = 0;
        }
    }

    /**
     * I'm sorry, you died.
     */
    die() {

        if (!this.alive)
            return;

        SOUNDS.death.play();

        super.die();

        life--;


        if (life) {
            setTimeout(() => {
                player = new Pacman();
            }, 2000)
        }
    }
}