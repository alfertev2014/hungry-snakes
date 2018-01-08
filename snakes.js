window.onload = function () {
    const fibCount = 13;

    const fibArray = new Array(fibCount);

    let fib1 = 1;
    let fib2 = 1;
    for (let i = 0; i < fibCount; ++i) {
        fibArray[i] = fib2;
        const f = fib2;
        fib2 = fib2 + fib1;
        fib1 = f;
    }

    const fieldWidth = fib1;

    const CellTypes = {
        EMPTY = 0,
        FOOD = 1,
        BRICK = 2,
        SNAKE = {
            UP = 3,
            RIGHT = 4,
            DOWN = 5,
            LEFT = 6,
            TAIL = 7
        }
    };

    const Direction = {
        UP = 0,
        RIGHT = 1,
        DOWN = 2,
        LEFT = 3
    };

    const snakesCount = 10;
    const foodCount = fieldWidth * fieldWidth / 4;

    let game = new Game(fieldWidth);

    game.initGame(foodCount, snakesCount);

    class Game {
        constructor(fieldWidth) {
            this.fieldWidth = fieldWidth;
            this.snakes = {};
            this.field = new Array(fieldWidth);
            this.snakesField = new Array(fieldWidth);

            for (let i = 0; i < this.fieldWidth; ++i) {
                this.field[i] = new Array(this.fieldWidth);
                this.snakesField[i] = new Array(this.fieldWidth);
                for (let j = 0; j < this.fieldWidth; ++j) {
                    this.field[i][j] = CellTypes.EMPTY;
                    this.snakesField[i][j] = null;
                }
            }
        }

        fieldAt(x, y) {
            return this.field[x][y];
        }

        setFieldAt(x, y, cell) {
            this.field[x][y] = cell;
        }

        snakeAt(x, y) {
            return this.snakesField[x][y];
        }

        setSnakeAt(x, y, snake) {
            this.snakesField[x][y] = snake;
        }

        createSnake(name, color, headX, headY) {
            const newSnake = new Snake(name, color, headX, headY);
            this.snakes[name] = newSnake;
            this.setFieldAt(headX, headY, CellTypes.SNAKE.TAIL);
            this.setSnakeAt(headX, headY, newSnake);
            return newSnake;
        }

        randomFieldCoord() {
            return Math.round(Math.random() * (this.fieldWidth - 1));
        }

        initGame(foodCount, snakesCount) {
            for (let i; i < foodCount; ++i) {
                this.field[this.randomFieldCoord()][this.randomFieldCoord()] = CellTypes.FOOD;
            }
            for (let i; i < snakesCount; ++i) {
                this.createSnake(i.toString(), Math.random() * 100, this.randomFieldCoord(), this.randomFieldCoord());
            }
        }

        step() {
            let deadSnakes = [];
            for (let snake in this.snakes) {
                if (snake.isAlive) {
                    snake.step();
                }
                else {
                    deadSnakes.push(snake);
                }
            }
            for (let snake in deadSnakes) {
                delete this.snakes[snake.name];
            }
        }
    }

    class Snake {
        constructor(name, color, headX, headY) {
            this.name = name;
            this.color = color;
            
            this.headX = headX;
            this.headY = headY;

            this.tailX = headX;
            this.tailY = headY;
            
            this.length = 1;

            this.isAlive = true;

            this.direction = Direction.UP;
        }

        turnToFeed(x, y) {
            if (game.snakeAt(restX, restY) !== this) {
                return;
            }
            
            let tailSet = snake._stepTail(x, y);

            if (!tailSet) {
                this.isAlive = false;
            }

            let restX = x;
            let restY = y;
            while (true) {
                const snakeDirection = game.fieldAt(restX, restY);
                if (game.snakeAt(restX, restY) !== this) {
                    throw new Error("Broken snake tail");
                }
                game.setFieldAt(restX, restY, CellTypes.FOOD);
                game.setSnakeAt(restX, restY, null);
                this.length--;
                switch (snakeDirection) {
                    case CellTypes.SNAKE.UP:
                        --restY;
                        break;
                    case CellTypes.SNAKE.RIGHT:
                        ++restX;
                        break;
                    case CellTypes.SNAKE.DOWN:
                        ++restY;
                        break;
                    case CellTypes.SNAKE.LEFT:
                        --restX;
                        break;
                    case CellTypes.SNAKE.TAIL:
                        return;
                    default:
                        throw new Error("Broken tail");
                }
            }
        }

        _setTail(x, y, direction) {
            if (game.fieldAt(x, y) === direction) {
                if (game.snakeAt(x, y) === this) {
                    game.setFieldAt(x, y, CellTypes.SNAKE.TAIL);
                    this.tailX = x;
                    this.tailY = y;
                    return true;
                }
                else {
                    throw new Error("Broken snake");
                }
            }
            return false;
        }

        _stepTail(tailX, tailY) {
            game.setFieldAt(tailX, tailY, CellTypes.EMPTY);
            game.setSnakeAt(tailX, tailY, null);

            let tailSet = false;
            if (this._setTail(tailX - 1, tailY, CellTypes.SNAKE.RIGHT)) {
                tailSet = true;
            }
            if (this._setTail(tailX + 1, tailY, CellTypes.SNAKE.LEFT)) {
                if (tailSet) throw new Error("Broken tail step");
                tailSet = true;
            }
            if (this._setTail(tailX, tailY - 1, CellTypes.SNAKE.DOWN)) {
                if (tailSet) throw new Error("Broken tail step");
                tailSet = true;
            }
            if (this._setTail(tailX, tailY + 1, CellTypes.SNAKE.UP)) {
                if (tailSet) throw new Error("Broken tail step");
            }
            return tailSet;
        }

        stepTail() {
            if (this._stepTail(this.tailX, this.tailY)) {
                this.length--;
            }
        }

        die() {
            this.turnToFeed(this.headX, this.headY);
            this.isAlive = false;
        }

        step() {
            let newCell = CellTypes.EMPTY;
            let doStep = false;

            let newX = this.headX;
            let newY = this.headY;

            switch (this.direction) {
                case Direction.UP:
                    if (newY > 0) {
                        newY--;
                        newCell = CellTypes.SNAKE.DOWN;
                        doStep = true;
                    }
                    break;
                case Direction.LEFT:
                    if (newX > 0) {
                        newX--;
                        newCell = CellTypes.SNAKE.RIGHT;
                        doStep = true;
                    }
                    break;
                case Direction.RIGHT:
                    if (newX < fieldWidth - 1) {
                        newX++;
                        newCell = CellTypes.SNAKE.LEFT;
                        doStep = true;
                    }
                    break;
                case Direction.DOWN:
                    if (newY < fieldWidth - 1) {
                        newY++;
                        newCell = CellTypes.SNAKE.UP;
                        doStep = true;
                    }
                    break;
                default:
                    throw new Error("Direction");
            }
            if (doStep) {
                let oldCell = game.fieldAt(newX, newY);
                if (oldCell === CellTypes.BRICK) {
                    return;
                }
                
                const snake = game.snakeAt(newX, newY);
                if (snake !== null) {
                    snake.turnToFeed(newX, newY);
                }
                
                game.setSnakeAt(newX, newY, this);
                
                this.headX = newX;
                this.headY = newY;
                
                if (oldCell === CellTypes.EMPTY) {
                    this.stepTail();
                }
            }
        }

        setDirection(direction) {
            switch (this.direction) {
                case Direction.UP:
                    if (direction === Direction.DOWN) {
                        return false;
                    }
                    break;
                case Direction.RIGHT:
                    if (direction === Direction.LEFT) {
                        return false;
                    }
                    break;
                case Direction.DOWN:
                    if (direction === Direction.UP) {
                        return false;
                    }
                    break;
                case Direction.LEFT:
                    if (direction === Direction.RIGHT) {
                        return false;
                    }
                    break;
                default:
                    throw new Error("Invalid direction");
            }
            this.direction = direction;
            return true;
        }
    }

    class UserInput {
        constructor() {
            this.snake = game.createSnake("User", 1234, fieldWidth / 2, fieldWidth / 2);
        }

        onSetDirection(direction) {
            this.snake.setDirection(direction);
        }
    }

    class GameRenderer {
        render() {

        }
    }

    class GameController {
        constructor() {
            this.timer = null;
        }

        start() {
            this.stop();
            this.timer = setInterval(() => game.step(), 1000);
        }

        stop() {
            if (this.timer !== null) {
                clearInterval(this.timer);
            }
        }
    }
};