class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private readonly WIDTH = 40;
    private readonly HEIGHT = 40;
    
    private board: string[][];
    private scale: number;

    public constructor() {
        this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');

        this.scale = this.canvas.height/this.HEIGHT;

        this.board = [];
        for (let y = 0; y < this.HEIGHT; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.WIDTH; x++){
                this.board[y][x] = "empty";
            }
        }

        this.draw = this.draw.bind(this);
    }

    public draw() {
        const ctx = this.context;
        const c = this.canvas;
        const s = this.scale;
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, c.width, c.height);

        
        ctx.fillStyle = "#3bb1d9";
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++){
                ctx.rect(x*s, y*s, s, s);
                ctx.fill()
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
                ctx.stroke();
            }
        }
    }
}