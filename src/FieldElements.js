class FieldElement {

    constructor({x, y} = {}) {
        this.pos = createVector(x, y);
        this.wasEaten = false;
    }

    isWalkable() {
        return true;
    }

    isEdible() {
        return true;
    }

    setEaten() {
        Pacman.sounds.eatfruit.play()
        leftToWin--;
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


    play() {

    }
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
    isWalkable() {
        return false;
    }

    isEdible() {
        return false;
    }

    draw() {
        push();
        fill('red');
        rect(size / 4, size / 6, size / 2, size / 3);
        pop();
    }
}