export abstract class Canvas {
    // Standard size is 10x20 so its just scaled
    public static width: number = 100;
    public static height: number = 200;
    public static context: CanvasRenderingContext2D;

    public static init(c: HTMLCanvasElement) {
        c.height = Canvas.height;
        c.width = Canvas.width;
        Canvas.context = c.getContext("2d");
    }
}