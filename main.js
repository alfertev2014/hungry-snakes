
class Field {

    constructor(width, height, initialValue) {
        this.width = width;
        this.height = height;
        this.cells = new Int32Array(width * height);
        const size = this.cells.length;
        for (let i = 0; i < size; ++i) {
            this.cells[i] = initialValue;
        }
    }

    locationToIndex(x, y) {
        return x + this.width * y;
    }

    getCell(x, y) {
        return this.cells[this.locationToIndex(x, y)];
    }

    setCell(x, y, value) {
        this.cells[this.locationToIndex(x, y)] = value;
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomColor() {
    return random(0, 256 ** 3 - 1);
}


const cellNone = -1;
const cellFood = -2;


const directionLeft = 0;
const directionRight = 1;
const directionUp = 2;
const directionDown = 3;

const foodColor = 256 ** 3 - 1;

function snakeIdOf(cell) {
    return cell >= 0 ? Math.floor(cell / 4) : -1;
}

function snakeDirectionOf(cell) {
    return cell >= 0 ? cell % 4 : -1;
}

function snakeCell(snakeId, direction) {
    return snakeId * 4 + direction;
}

class Game {

    constructor(width, height, snakeCount, foodCount) {
        this.field = new Field(width, height, cellNone);
        this.snakes = [];
        this.startUp(snakeCount, foodCount);
    }

    get width() {
        return this.field.width;
    }

    get height() {
        return this.field.height;
    }

    getCell(x, y) {
        return this.field.getCell(x, y);
    }

    getSnakeId(x, y) {
        return snakeIdOf(this.getCell(x, y));
    }

    getSnakeDirection(x, y) {
        return snakeDirectionOf(this.getCell(x, y));
    }

    setCellSnake(x, y, snakeId, direction) {
        this.field.setCell(x, y, snakeCell(snakeId, direction));
    }

    setCellFood(x, y, value = true) {
        this.field.setCell(x, y, value ? cellFood : cellNone);
    }

    isSnake(x, y) {
        return this.getCell(x, y) >= 0;
    }
    
    startUp(snakeCount, foodCount) {
        const direction = random(0, 4) % 4;
        let x = Math.floor(this.width / 2);
        let y = Math.floor(this.height / 2);
        const snake = new Snake(this.snakes.length, direction, randomColor(), x, y);
        this.setCellSnake(x, y, snake.id, direction);
        this.snakes.push(snake);

        for (let i = 0; i < snakeCount; ++i) {
            this.spawnSnake();
        }

        for (let i = 0; i < foodCount; ++i) {
            this.spawnFood();
        }
    }

    spawnSnake() {
        const direction = random(0, 4) % 4;
        let x = random(0, this.width);
        let y = random(0, this.height);
        while (this.isSnake(x, y)) {
            x = random(0, this.width);
            y = random(0, this.height);
        }
        const snake = new Snake(this.snakes.length, direction, randomColor(), x, y);
        this.snakes.push(snake);
    }

    spawnFood() {
        let x = random(0, this.width);
        let y = random(0, this.height);
        while (this.isSnake(x, y)) {
            x = random(0, this.width);
            y = random(0, this.height);
        }
        this.setCellFood(x, y, true);
    }
    
    tick() {
        const snakeCount = this.snakes.length;
        for (let i = 0; i < snakeCount; ++i) {
            const snake = this.snakes[i];
            if (snake) {
                snake.step();
            }
        }
    }

    colorOf(cell) {
        if (cell === cellFood) {
            return foodColor;
        } else if (cell === cellNone) {
            return -1;
        }
        const snakeId = snakeIdOf(cell);
        if (snakeId >= 0 && this.snakes[snakeId]) {
            return this.snakes[snakeId].color;
        } else {
            return -1;
        }
    }

    draw() {
        graphics.clear();
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                const cell = this.getCell(x, y);
                const color = this.colorOf(cell);
                if (color >= 0) {
                    graphics.drawCell(x, y, color, snakeDirectionOf(cell));
                }
            }
        }
    }

    setDirection(direction) {
        const snake = this.snakes[0];
        if (snake) {
            snake.setDirection(direction);
        }
    }
}

class Snake {

    constructor(id, direction, color, x, y) {
        this.id = id;
        this.direction = direction;
        this.color = color;
        this.headX = x;
        this.headY = y;
        this.length = 1;

        this.tailX = this.headX;
        this.tailY = this.headY;
    }

    setDirection(direction) {
        if ((direction === directionLeft && this.direction === directionRight) ||
            (direction === directionRight && this.direction === directionLeft) ||
            (direction === directionUp && this.direction === directionDown) ||
            (direction === directionDown && this.direction === directionUp)) {
            return;
        }
        this.direction = direction;
    }

    step() {
        game.setCellSnake(this.headX, this.headY, this.id, this.direction);
        
        let stuck = false;
        switch (this.direction) {
            case directionLeft:
                if (this.headX === 0) {
                    stuck = true;
                } else {
                    --this.headX;
                }
                break;
            case directionRight:
                if (this.headX === game.width - 1) {
                    stuck = true;
                } else {
                    ++this.headX;
                }
                break;
            case directionUp:
                if (this.headY === 0) {
                    stuck = true;
                } else {
                    --this.headY;
                }
                break;
            case directionDown:
                if (this.headY === game.height - 1) {
                    stuck = true;
                } else {
                    ++this.headY;
                }
                break;
        }

        if (stuck) {
            --this.length;
        } else {
            const cell = game.getCell(this.headX, this.headY);

            if (cell >= 0) {
                const snake = game.snakes[snakeIdOf(cell)];
                if (snake) {
                    snake.cut(this.headX, this.headY, this.direction);
                }
            }
            
            game.setCellSnake(this.headX, this.headY, this.id, this.direction);
            
            if (cell !== cellNone) {
                ++this.length;
                return;
            }
        }

        const direction = game.getSnakeDirection(this.tailX, this.tailY);
        game.setCellFood(this.tailX, this.tailY, false);
        switch (direction) {
            case directionLeft:
                --this.tailX;
                break;
            case directionRight:
                ++this.tailX;
                break;
            case directionUp:
                --this.tailY;
                break;
            case directionDown:
                ++this.tailY;
                break;
            default:
                console.log("Error tail");
        }
        if (this.length <= 0) {
            this.die();
        }
    }

    cut(x, y, cutDirection) {
        const cell = game.getCell(x, y);
        if (cell < 0 || snakeIdOf(cell) !== this.id) {
            return;
        }

        const direction = snakeDirectionOf(cell);
        switch (direction) {
            case directionLeft:
                this.tailX = x - 1;
                this.tailY = y;
                break;
            case directionRight:
                this.tailX = x + 1;
                this.tailY = y;
                break;
            case directionUp:
                this.tailX = x;
                this.tailY = y - 1;
                break;
            case directionDown:
                this.tailX = x;
                this.tailY = y + 1;
                break;
        }

        let cutX = x;
        let cutY = y;
        let cutLength = 0;
        let cutStop = false;

        game.setCellFood(cutX, cutY, true);
        ++cutLength;
        if (cutX > 0 && cutDirection !== directionRight &&
            game.getSnakeId(cutX - 1, cutY) === this.id && game.getSnakeDirection(cutX - 1, cutY) === directionRight) {
            --cutX;
        } else if (cutX < game.width && cutDirection !== directionLeft &&
            game.getSnakeId(cutX + 1, cutY) === this.id && game.getSnakeDirection(cutX + 1, cutY) === directionLeft) {
            ++cutX;
        } else if (cutY > 0 && cutDirection !== directionDown &&
            game.getSnakeId(cutX, cutY - 1) === this.id &&  game.getSnakeDirection(cutX, cutY - 1) === directionDown) {
            --cutY;
        } else if (cutY < game.height && cutDirection !== directionUp &&
            game.getSnakeId(cutX, cutY + 1) === this.id && game.getSnakeDirection(cutX, cutY + 1) === directionUp) {
            ++cutY;
        } else {
            cutStop = true;
        }

        while (! cutStop) {
            game.setCellFood(cutX, cutY, true);
            ++cutLength;
            if (cutX > 0 && game.getSnakeId(cutX - 1, cutY) === this.id && game.getSnakeDirection(cutX - 1, cutY) === directionRight) {
                --cutX;
            } else if (cutX < game.width && game.getSnakeId(cutX + 1, cutY) === this.id && game.getSnakeDirection(cutX + 1, cutY) === directionLeft) {
                ++cutX;
            } else if (cutY > 0 && game.getSnakeId(cutX, cutY - 1) === this.id &&  game.getSnakeDirection(cutX, cutY - 1) === directionDown) {
                --cutY;
            } else if (cutY < game.height && game.getSnakeId(cutX, cutY + 1) === this.id && game.getSnakeDirection(cutX, cutY + 1) === directionUp) {
                ++cutY;
            } else {
                cutStop = true;
            }
        }

        this.length -= cutLength;

        if (this.length <= 0) {
            this.die();
        }
    }

    die() {
        game.snakes[this.id] = null;
    }
}

const game = new Game(200, 100, 80, 200 * 100 / 8);

function colorToCss(color) {
    return `rgb(${color % 256}, ${(color / 256) % 256}, ${(color / 256 / 256) % 256})`;
}

class Graphics {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    clear() {
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawCell(x, y, color, direction) {
        const w = this.width / game.width;
        const h = this.height / game.height;
        const screenX = x * w;
        const screenY = y * h;

        this.ctx.fillStyle = colorToCss(color);

        switch (direction) {
            case directionLeft:
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY + h / 2);
                this.ctx.lineTo(screenX + w, screenY);
                this.ctx.lineTo(screenX + w, screenY + h);
                this.ctx.fill();
                break;
            case directionRight:
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY);
                this.ctx.lineTo(screenX + w, screenY + h / 2);
                this.ctx.lineTo(screenX, screenY + h);
                this.ctx.fill();
                break;
            case directionUp:
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY + h);
                this.ctx.lineTo(screenX + w / 2, screenY);
                this.ctx.lineTo(screenX + w, screenY + h);
                this.ctx.fill();
                break;
            case directionDown:
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY);
                this.ctx.lineTo(screenX + w, screenY);
                this.ctx.lineTo(screenX + w / 2, screenY + h);
                this.ctx.fill();
                break;
            default:
                this.ctx.fillRect(screenX, screenY, w, h);
                break;
        }
    }
}

const graphics = new Graphics();

function onKeyDown(e) {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    switch(e.key) {
        case 'Down':
        case 'ArrowDown':
            game.setDirection(directionDown);
            break;
        case 'Up':
        case 'ArrowUp':
            game.setDirection(directionUp);
            break;
        case 'Left':
        case 'ArrowLeft':
            game.setDirection(directionLeft);
            break;
        case 'Right':
        case 'ArrowRight':
            game.setDirection(directionRight);
            break;
    }
}

window.addEventListener('keydown', onKeyDown);

let playGame = true;

function globalStep() {

    if (! playGame) {
        return 0;
    }

    game.tick();
    game.draw();

    setTimeout(globalStep, 100);
}

globalStep();