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


class Wall extends FieldElement {
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
        this.drawLine({
            color: '#000049',
            strk: 3
        });

        pop();
    }

    drawLine({shape = 1, color, strk}) {

        const x = [
            0,
            size / 2,
            size
        ];
        const y = [
            0,
            size / 2,
            size
        ];
        push();

        stroke(color);
        strokeWeight(strk);
        strokeCap(ROUND);
        line(x[0], y[1], x[1], y[1]);

        pop();
    }

    drawWall() {

        const x = [
            0,
            size / 2,
            size
        ];
        const y = [
            0,
            size / 2,
            size
        ];
        stroke('red');
        strokeWeight(lineWidth);
        strokeCap(ROUND);
        switch (column) {
            case "═":
                if (colArray[columnIndex - 1].charCodeAt(0) === 32) {
                    line(x[1], y[1], x[2], y[1]);
                } else {
                    if (colArray[columnIndex + 1].charCodeAt(0) === 32) {
                        line(x[0], y[1], x[1], y[1]);
                    } else {
                        line(x[0], y[1], x[2], y[1]);
                    }
                }
                break;
            case "║":
                if (rowArray[rowIndex - 1][columnIndex].charCodeAt(0) === 32) {
                    line(x[1], y[1], x[1], y[2]);
                } else {
                    if (rowArray[rowIndex + 1][columnIndex].charCodeAt(0) === 32) {
                        line(x[1], y[0], x[1], y[1]);
                    } else {
                        line(x[1], y[0], x[1], y[2]);
                    }
                }
                break;
            case "╔":
                line(x[1], y[1], x[2], y[1]);
                line(x[1], y[1], x[1], y[2]);
                break;
            case "╗":
                line(x[1], y[1], x[0], y[1]);
                line(x[1], y[1], x[1], y[2]);
                break;
            case "╚":
                line(x[1], y[1], x[2], y[1]);
                line(x[1], y[1], x[1], y[0]);
                break;
            case "╝":
                line(x[1], y[1], x[0], y[1]);
                line(x[1], y[1], x[1], y[0]);
                break;
            case "╦":
                line(x[0], y[1], x[2], y[1]);
                line(x[1], y[1], x[1], y[2]);
                break;
            case "╩":
                line(x[0], y[1], x[2], y[1]);
                line(x[1], y[1], x[1], y[0]);
                break;
            case "╠":
                line(x[1], y[0], x[1], y[2]);
                line(x[1], y[1], x[2], y[1]);
                break;
            case "╣":
                line(x[1], y[0], x[1], y[2]);
                line(x[1], y[1], x[0], y[1]);
                break;
        }

    }
}