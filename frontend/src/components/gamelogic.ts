import DeviceDetector from 'device-detector-js';

// Types
interface DeviceSupport {
    client?: string;
    os?: string;
}

interface PlayerPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface MotionData {
    player1: "idle" | "jump" | "squat";
}

// Game Engine Class
export class GameEngine {
    private currentFrame: number = 0;
    private readonly animationSpeed: number = 1000;
    private lastFrameTime: number = 0;
    private lastBotAction: "idle" | "jump" | "squat" = "idle";
    private botActionTimestamp: number = 0;
    private botReactionDelay: number = 1000;
    private player1: PlayerPosition = { x: 450, y: 370, width: 150, height: 200 };
    private bot: PlayerPosition = { x: 600, y: 370, width: 150, height: 200 };
    private player1Sprite: HTMLImageElement;
    private player2Sprite: HTMLImageElement;
    private gameLoop: number | null = null;

    static canvas: HTMLCanvasElement;
    static canvasCtx: CanvasRenderingContext2D;

    static {
        this.canvas = document.createElement("canvas");
        this.canvas.className = "output_canvas";
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.canvasCtx = this.canvas.getContext("2d")!;
    }

    constructor(player1ImgSrc: string, player2ImgSrc: string) {
        this.player1Sprite = new Image();
        this.player1Sprite.src = player1ImgSrc;
        this.player2Sprite = new Image();
        this.player2Sprite.src = player2ImgSrc;
    }

    public static testSupport(supportedDevices: DeviceSupport[]): boolean {
        const deviceDetector = new DeviceDetector();
        const detectedDevice = deviceDetector.parse(navigator.userAgent);
        
        return supportedDevices.some(device => {
            if (device.client && !new RegExp(`^${device.client}$`).test(detectedDevice.client?.name || '')) {
                return false;
            }
            if (device.os && !new RegExp(`^${device.os}$`).test(detectedDevice.os?.name || '')) {
                return false;
            }
            return true;
        });
    }

    public start(): void {
        this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }

    public stop(): void {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    private update(timestamp: number): void {
        const motionData = JSON.parse(localStorage.getItem("motionData") || '{"player1":"idle"}') as MotionData;

        if (timestamp - this.lastFrameTime > this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % 2;
            this.lastFrameTime = timestamp;
        }

        if (timestamp - this.botActionTimestamp > this.botReactionDelay) {
            this.lastBotAction = this.getRandomBotAction();
            this.botActionTimestamp = timestamp;
            this.botReactionDelay = Math.random() * 2500 + 500;
        }

        GameEngine.canvasCtx.clearRect(0, 0, GameEngine.canvas.width, GameEngine.canvas.height);
        this.drawPlayer1(motionData.player1);
        this.drawBot(this.lastBotAction);

        if (this.checkWinCondition(motionData.player1, this.lastBotAction)) {
            return;
        }

        this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }

    private drawPlayer1(action: "idle" | "jump" | "squat"): void {
        const sx = this.currentFrame * 70;
        
        switch (action) {
            case "jump":
                this.drawSprite(this.player1Sprite, 245 + 2.5 * sx, 185, 80, 100, 500, 370, 150, 200);
                this.player1.x = 500;
                break;
            case "squat":
                this.drawSprite(this.player1Sprite, 245 + sx, 185, 80, 100, 450, 370, 150, 200);
                this.player1.x = 450;
                break;
            default:
                this.drawSprite(this.player1Sprite, 245, 185, 80, 100, 450, 370, 150, 200);
                this.player1.x = 450;
        }
    }

    private drawBot(action: "idle" | "jump" | "squat"): void {
        const sx = this.currentFrame * 70;
        
        switch (action) {
            case "jump":
                this.drawSprite(this.player2Sprite, 240 - 2.5 * sx, 185, 80, 100, 550, 370, 150, 200);
                this.bot.x = 550;
                break;
            case "squat":
                this.drawSprite(this.player2Sprite, 245 - sx, 185, 80, 100, 600, 370, 150, 200);
                this.bot.x = 600;
                break;
            default:
                this.drawSprite(this.player2Sprite, 235, 185, 80, 100, 600, 370, 150, 200);
                this.bot.x = 600;
        }
    }

    private drawSprite(
        sprite: HTMLImageElement,
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        dx: number,
        dy: number,
        dw: number,
        dh: number
    ): void {
        GameEngine.canvasCtx.drawImage(sprite, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    private getRandomBotAction(): "idle" | "jump" | "squat" {
        const random = Math.random();
        if (random < 0.33) return "jump";
        if (random < 0.66) return "squat";
        return "idle";
    }

    private checkWinCondition(player1Action: string, botAction: string): boolean {
        if (player1Action === "jump" && botAction !== "squat") {
            this.exitGame("Player 1");
            return true;
        }
        if (botAction === "jump" && player1Action !== "squat") {
            this.exitGame("Bot");
            return true;
        }
        return false;
    }

    private exitGame(winner: string): void {
        this.stop();
        localStorage.removeItem("motionData");
        alert(`Game Over! ${winner} wins!\nPress ENTER to play again.`);

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                window.removeEventListener("keydown", handleKeyPress);
                location.reload();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
    }
}