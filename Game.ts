class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private readonly WIDTH = 40;
    private readonly HEIGHT = 40;
    
    // private board: string[][];

    public constructor() {
        this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');

        // for (let y = 0; y < this.HEIGHT; y++) {
        //     this.board[y] = [];
        //     for (let x = 0; x < this.WIDTH; x++){
        //         this.board[y][x] = "empty";
        //     }
        // }

        this.draw = this.draw.bind(this);
    }

    public draw() {
        const ctx = this.context;
        const c = this.canvas;
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, c.width, c.height);
        
        ctx.fillStyle = "#3bb1d9";
        ctx.fillRect(10, 10, 10, 10);
    }
}