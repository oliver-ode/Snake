enum Direction {
    Up,
    Down,
    Left,
    Right
}

class Game {
    // Drawing variables
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Constants
    private readonly WIDTH = 20;
    private readonly HEIGHT = 20;
    private readonly SCALE: number;
    private readonly fps: number = 4;
    private readonly fpsInterval: number = 1000/this.fps;
    
    // FPS calculation
    private then: number;
    private now: number;

    // General variables
    private snake: number[][];
    private open: number[][];
    private headColour: string = "#1795bf";
    private bodyColour: string = "#3bb1d9";
    private food: number[];
    private direction: Direction = Direction.Right;
    private alive: boolean = false;
    private resetted: boolean = true;
    private eaten: boolean = false;
    private score: number = 0;

    // General constructor for class
    public constructor() {
        this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.SCALE = this.canvas.height / this.HEIGHT;

        // Make snake
        this.snake = [];
        for (let x = 0; x < 4; x++) {
            this.snake.push([Math.floor(this.WIDTH / 2) - x, Math.floor(this.HEIGHT / 2)])
        }

        // Food and score
        this.food = [Math.floor(this.WIDTH / 2) + 4, Math.floor(this.HEIGHT / 2)];
        document.getElementById("score").innerText = `00000`;

        // Open spaces for food
        this.open = [];
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                this.open.push([x, y]);
            }
        }
        // Remove used spaces
        for (let i = 0; i < this.snake.length; i++) {
            this.open.splice(this.snake[i][1] * this.WIDTH + this.snake[i][0], 1);
        }

        // Initial draw
        this.draw();

        // Binding functions (not all need but its easier to do all)
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.handleKey = this.handleKey.bind(this);
        this.updateDirection = this.updateDirection.bind(this);
        this.moveFood = this.moveFood.bind(this);
        this.lose = this.lose.bind(this);
        this.win = this.win.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleStart = this.handleStart.bind(this);

        // Listeners
        window.addEventListener("keydown", this.handleKey, true);
        document.getElementById("reset").addEventListener("click", this.handleReset);
        document.getElementById("start").addEventListener("click", this.handleStart);
        
        // Actual running
        this.then = performance.now();
        this.run()
    }

    // Function for handling losing
    private lose() {
        this.alive = false;
        this.headColour = "#e30b1e";
        this.bodyColour = "#e83a49";
        this.draw();
    }

    // Function for handling winning
    private win() {
        this.alive = false;
        this.headColour = "#10de40";
        this.bodyColour = "#42f56c";
        this.draw();
        alert("You win");
    }

    // Resetting game (button)
    private handleReset() {
        if (!this.alive) {
            this.snake = [];
            for (let x = 0; x < 4; x++) {
                this.snake.push([Math.floor(this.WIDTH / 2) - x, Math.floor(this.HEIGHT / 2)])
            }
            this.direction = Direction.Right;
            this.food = [Math.floor(this.WIDTH / 2) + 4, Math.floor(this.HEIGHT / 2)];
            this.open = [];
            for (let x = 0; x < this.WIDTH; x++) {
                for (let y = 0; y < this.HEIGHT; y++) {
                    this.open.push([x, y]);
                }
            }
            for (let i = 0; i < this.snake.length; i++) {
                this.open.splice(this.snake[i][1] * this.WIDTH + this.snake[i][0], 1);
            }
            this.headColour = "#1795bf";
            this.bodyColour = "#3bb1d9";
            document.getElementById("score").innerText = `00000`;
            this.score = 0;
            this.draw();
            this.resetted = true;
        }
    }

    // Start game (button)
    private handleStart() {
        if (!this.alive && this.resetted) {
            this.alive = true;
            this.resetted = false;
        }
    }

    // Running code + fps calculation
    private run() {
        requestAnimationFrame(this.run);
        this.now = performance.now();
        let elapsed: number = this.now - this.then;

        if (elapsed > this.fpsInterval) {
            this.then = this.now - (elapsed % this.fpsInterval)
            if (this.alive)
                this.update();
            if (this.alive)
                this.draw();
        }
    }

    // General update code
    private update() {
        let direction = this.direction;
        let snake = this.snake;
        let head = snake[0];
        let open = this.open;

        // Move player
        switch (+direction) {
            case Direction.Right: {
                snake.splice(0, 0, [head[0] + 1, head[1]]);
                open.splice(open.indexOf([head[0] + 1, head[1]]), 1);
                break;
            }
            case Direction.Left: {
                snake.splice(0, 0, [head[0] - 1, head[1]]);
                open.splice(open.indexOf([head[0] - 1, head[1]]), 1);
                break;
            }
            case Direction.Up: {
                snake.splice(0, 0, [head[0],  head[1] - 1]);
                open.splice(open.indexOf([head[0],  head[1] - 1]), 1);
                break;
            }
            case Direction.Down: {
                snake.splice(0, 0, [head[0],  head[1] + 1]);
                open.splice(open.indexOf([head[0],  head[1] + 1]), 1);
                break;
            }
        }

        // Remove tail
        if (!this.eaten){
            open.push(snake[-1]);
            snake.splice(-1, 1)
        }
        else {
            this.eaten = false;
        }

        // Check wall collision
        if (head[0] < 0 || head[0] >= this.WIDTH || head[1] < 0 || head[1] >= this.HEIGHT) {
            this.lose();
        }

        // Check snake collision
        let cnt = 0;
        for(var i = 1; i < snake.length; ++i){
            if (snake[0][0] == snake[i][0] && snake[0][1] == snake[i][1])
                cnt++;
        }
        if (cnt != 0) {
            this.lose();
        }

        // Check food collision
        if (snake[0][0] == this.food[0] && snake[0][1] == this.food[1]) {
            this.eaten = true;
            this.moveFood();
            this.score += 10;
            let extraZero = 5 - `${this.score}`.length + 1;
            document.getElementById("score").innerText = `${Array(extraZero).join("0")}${this.score}`;
        }

        // Check for win (congratz if you win)
        if (snake.length == this.WIDTH * this.HEIGHT) {
            this.win();
        }
    }

    // Move food position
    private moveFood() {
        this.food = this.open[Math.floor(Math.random() * this.open.length)];
    }

    // Drawing function
    private draw() {
        const ctx = this.ctx;
        const c = this.canvas;
        const s = this.SCALE;

        // Background
        ctx.fillStyle = "#3b3d3c";
        ctx.fillRect(0, 0, c.width, c.height);

        // Body
        ctx.fillStyle = this.bodyColour;
        for (let i = 1; i < this.snake.length; i++) {
            ctx.fillRect(this.snake[i][0] * s, this.snake[i][1] * s, s, s);
        }
        // Snake head
        ctx.fillStyle = this.headColour;
        ctx.fillRect(this.snake[0][0] * s, this.snake[0][1] * s, s, s);

        // Food
        ctx.fillStyle = "#199e08";
        ctx.fillRect(this.food[0] * s, this.food[1] * s, s, s);

        // Grid
        this.drawGrid();
    }

    // Draw the grid
    private drawGrid() {
        const ctx = this.ctx;
        const c = this.canvas;
        const s = this.SCALE;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";

        ctx.beginPath();
        for (let x = 0; x <= c.width; x += s) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, c.height);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let y = 0; y <= c.height; y += s) {
            ctx.moveTo(0, y);
            ctx.lineTo(c.width, y);
        }
        ctx.stroke();
    }

    // Updates the direction
    private updateDirection(newDir: Direction) {
        if (this.direction + newDir != 1 && this.direction + newDir != 5) // makes sure that you don't do back on yourself (moving right then hit left etc.)
            this.direction = newDir;
    }

    // Key presses
    private handleKey(event) {
        if (event.defaultPrevented) {
            return;
        }
        switch (event.key) {
            case "ArrowDown":
                this.updateDirection(Direction.Down);
                break;
            case "ArrowUp":
                this.updateDirection(Direction.Up);
                break;
            case "ArrowLeft":
                this.updateDirection(Direction.Left);
                break;
            case "ArrowRight":
                this.updateDirection(Direction.Right);
                break;
            default:
        }
        event.preventDefault();
    }
}