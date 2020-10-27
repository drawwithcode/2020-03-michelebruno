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
        if (this.wasEaten)
            return true;

        if (!Pacman.sounds.eatghost.isPlaying())
            Pacman.sounds.eatfruit.play();
        leftToWin--;
        return this.wasEaten = true;
    }

    run() {
        if (this.wasEaten) {
            return;
        }

        push();

        translate(this.pos.x * size, this.pos.y * size);

        this.draw();

        pop();

    }

    draw() {

    };

    onPlayerOver() {

    }


    play() {

    }
}

class Dot extends FieldElement {

    draw() {
        push();
        noStroke();
        fill(PALETTE.light)
        ellipse(size / 2, size / 2, 6);
        pop();
    }

    onPlayerOver() {
        this.setEaten();
    }

}

class Fruit extends Dot {
    static fruits = [
        {
            lastsFor: 10
        },
        {
            lastsFor: 10
        }
    ];

    constructor(a) {
        super(a);

        let f = random(Fruit.fruits)

        this.lastsFor = f.lastsFor;
        this.img = f.img;

    }

    draw() {
        let w = min(this.img.width, size),
            offset = (size - w) / 2;

        image(this.img, offset, offset + sin(frameCount / 2) * 3, w, w);

    }

    setEaten() {
        if (!this.wasEaten) player.setInvincible({lastsFor: this.lastsFor})

        super.setEaten();
    }
}


/**
 * @property {String} shape
 */
class Wall extends FieldElement {
    shape;

    isWalkable() {
        return false;
    }

    isEdible() {
        return false;
    }

    draw() {

        push();
        noFill();
        this.drawLine({
            color: '#2424ff',
            strk: 7
        });
        this.drawLine({
            color: '#246dff',
            strk: 5
        });
        // this.drawLine({
        //     color: '#249fff',
        //     strk: 3
        // });

        pop();
    }

    drawLine({color, strk}) {

        push();


        stroke(color);
        strokeWeight(strk);

        if (this.guessShape()) {
            this.drawSegment(this.shape);
        } else {
            noStroke();
            fill(color);
            ellipse(size / 2, size / 2, 5);
        }


        pop();
    }

    guessShape() {
        if (this.shape)
            return this.shape;

        this.shape = "";

        let myX = this.pos.x;
        let myY = this.pos.y;

        if (myX > 0) {
            let n = grid[myX - 1 + myY * cols]
            if (n instanceof Wall)
                this.shape += "c"
        }

        if (myX < cols - 1) {
            let n = grid[myX + 1 + myY * cols]
            if (n instanceof Wall)
                this.shape += "a"
        }

        if (myY > 0) {
            let n = grid[myX + (myY - 1) * cols]
            if (n instanceof Wall)
                this.shape += "d"
        }

        if (myY < rows - 1) {
            let n = grid[myX + (myY + 1) * cols]
            if (n instanceof Wall)
                this.shape += "b"
        }

        if (!this.shape)
            this.shape = "abcd";

        this.shape = this.shape.split("");

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        return this.shape = this.shape.filter(onlyUnique);


    }

    /**
     *
     * @param {String|Array} type
     */
    drawSegment(type) {
        if (Array.isArray(type)) {
            type.forEach(c => this.drawSegment(c));
        }

        if (typeof type === "string") {

            if (type.length > 1) {
                return this.drawSegment(type.split(""))
            }

            switch (type) {
                case 'a':
                    line(size / 2, size / 2, size, size / 2);
                    break;
                case 'b':
                    line(size / 2, size, size / 2, size / 2);
                    break;
                case 'c':
                    line(size / 2, size / 2, 0, size / 2);
                    break;
                case 'd':
                    line(size / 2, size / 2, size / 2, 0);
                    break;
            }
        }
    }
}