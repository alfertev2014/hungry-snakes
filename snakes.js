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

    (function () {
        let snakes = {};
        let field = new Array(fieldWidth);
        let snakesField = new Array(fieldWidth);

        for (let i = 0; i < fieldWidth; ++i) {
            field[i] = new Array(fieldWidth);
            snakesField[i] = new Array(fieldWidth);
            for (let j = 0; j < fieldWidth; ++j) {
                field[i][j] = CellTypes.EMPTY;
                snakesField[i][j] = null;
            }
        }

        class Snake {
            constructor(name, color, headX, headY) {
                this.name = name;
                this.color = color;
                
                this.headX = headX;
                this.headY = headY;
                this.length = 0;
    
                this.direction = Direction.UP;
            }

            turnToFeed(x, y) {
                let tailX = x;
                let tailY = y;
                while (true) {
                    const snakeDirection = field[tailX, tailY];
                    if (snakesField[tailX][tailY] !== this) {
                        throw new Error("Broken tail");
                    }
                    field[tailX][tailY] = CellTypes.FOOD;
                    snakesField[tailX][tailY] = null;
                    switch (snakeDirection) {
                        case CellTypes.SNAKE.UP:
                            --tailY;
                            break;
                        case CellTypes.SNAKE.RIGHT:
                            ++tailX;
                            break;
                        case CellTypes.SNAKE.DOWN:
                            ++tailY;
                            break;
                        case CellTypes.SNAKE.LEFT:
                            --tailX;
                            break;
                        case CellTypes.SNAKE.TAIL:
                            return;
                    }
                }
            }

            setTail(x, y, direction) {
                if (field[x][y] === direction) {
                    if (snakesField[x][y] === this) {
                        field[x][y] = CellTypes.SNAKE.TAIL;
                    }
                    else {
                        throw new Error("Broken snake");
                    }
                }
            }

            die() {
                this.turnToFeed(this.headX, this.headY, this);
                delete snakes[this.name];
            }

            step() {
                if (this.headX === 0 || this.headY === 0 || this.headX === fieldWidth - 1 || this.headY === fieldWidth - 1)
                    return;
                
                switch (this.direction) {
                    
                }
            }
        }

        function createSnake(name, color, headX, headY) {
            const newSnake = new Snake(name, color, headX, headY);
            snakes[name] = newSnake;
            field[headX][headY] = CellTypes.SNAKE.TAIL;
            snakesField[headX][headY] = newSnake;
        }

        function cutTail(x, y) {
            const snake = snakesField[x][y];

            snake.setTail(x - 1, y, CellTypes.SNAKE.LEFT);
            snake.setTail(x + 1, y, CellTypes.SNAKE.RIGHT);
            snake.setTail(x, y - 1, CellTypes.SNAKE.UP);
            snake.setTail(x, y + 1, CellTypes.SNAKE.DOWN);

            snake.turnToFeed(x, y);
        }
    })();
}