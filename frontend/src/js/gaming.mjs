import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";
import player1Img from "../assets/player1.png";
import player2Img from "../assets/player2.png";

// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os
testSupport([{ client: "Chrome" }]);

export function testSupport(supportedDevices) {
    const deviceDetector = new DeviceDetector();
    const detectedDevice = deviceDetector.parse(navigator.userAgent);
    let isSupported = false;
    for (const device of supportedDevices) {
        if (device.client !== undefined) {
            const re = new RegExp(`^${device.client}$`);
            if (!re.test(detectedDevice.client.name)) {
                continue;
            }
        }
        if (device.os !== undefined) {
            const re = new RegExp(`^${device.os}$`);
            if (!re.test(detectedDevice.os.name)) {
                continue;
            }
        }
        isSupported = true;
        break;
    }
}

const mpPose = window;
const options = {
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
    },
};

// Our input frames will come from here.
export const canvas = document.createElement("canvas");
canvas.className = "output_canvas";
canvas.width = 1280; // Set canvas dimensions
canvas.height = 720;
// const canvas = document.getElementsByClassName('output_canvas')[0];
export const canvasCtx = canvas.getContext("2d");

const spriteSheet = new Image();
spriteSheet.src = player1Img;

console.log(spriteSheet);

const spriteSheet2 = new Image();
spriteSheet2.src = player2Img;

let currentFrame = 0; // Current frame index
const animationSpeed = 1000; // Milliseconds between frame changes
let lastFrameTime = 0;

let lastBotAction = "idle";
let botActionTimestamp = 0;
let botReactionDelay = 1000;

let player1 = { x: 450, y: 370, width: 150, height: 200 };
let bot = { x: 600, y: 370, width: 150, height: 200 };

export function startGame() {
    const spriteSheet = new Image();
    spriteSheet.src = player1Img;
    console.log(spriteSheet.src);

    const spriteSheet2 = new Image();
    spriteSheet2.src = player2Img;

    // Start the loop
    // spriteSheet.onload = spriteSheet2.onload = () => {
    console.log("Game actuallly started");
    requestAnimationFrame(gameLoop);
    // };
}

export function gameLoop(timestamp) {
    // Update Player 1 motion data
    console.log("Game loop running");
    const motionData = JSON.parse(localStorage.getItem("motionData")) || {
        player1: "idle",
    };

    if (timestamp - lastFrameTime > animationSpeed) {
        currentFrame = (currentFrame + 1) % 2; // Update the current frame index
        lastFrameTime = timestamp; // Update the last frame time
    }

    // Update Bot action with delay
    if (timestamp - botActionTimestamp > botReactionDelay) {
        lastBotAction = getRandomBotAction();
        botActionTimestamp = timestamp;
        botReactionDelay = Math.random() * 2500 + 500; // Re-randomize reaction delay
    }

    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Clearing board...");

    // Draw Player 1 and Bot
    drawPlayer1(motionData.player1);
    drawBot(lastBotAction);
    console.log("motionData.player1: " + motionData.player1);
    console.log("lastBotAction: " + lastBotAction);
    console.log("Drawing players...");

    if (motionData.player1 == "jump" && lastBotAction != "squat") {
        console.log("Player 1 wins!");
        exitgame("Player 1");
    } else if (lastBotAction == "jump" && motionData.player1 != "squat") {
        console.log("Bot wins!");
        exitgame("Bot");
    }

    // Continue the loop
    requestAnimationFrame(gameLoop);
}

export function exitgame(winner) {
    console.log("Exiting game...");
    localStorage.removeItem("motionData");
    alert("Game Over! " + winner + " wins!\n Press ENTER to play again.");

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            window.removeEventListener("keydown", handleKeyPress);
            location.reload();
        }
    };

    window.addEventListener("keydown", handleKeyPress);
}

export function drawPlayer1(motionData) {
    const sx = currentFrame * 70; // Calculate source x position
    spriteSheet.onload = () => {
        if (motionData == "jump") {
            canvasCtx.drawImage(
                spriteSheet,
                245 + 2.5 * sx,
                185,
                80,
                100,
                500,
                370,
                150,
                200
            );
            player1.x = 500;
            console.log("jumping");
        } else if (motionData == "squat") {
            canvasCtx.drawImage(
                spriteSheet,
                245 + sx,
                185,
                80,
                100,
                450,
                370,
                150,
                200
            );
            player1.x = 450;
            console.log("squatting");
        } else {
            canvasCtx.drawImage(
                spriteSheet,
                245,
                185,
                80,
                100,
                450,
                370,
                150,
                200
            );
            player1.x = 450;
            console.log("idle");
        }
    };
}

export function drawBot(lastBotAction) {
    const sx = currentFrame * 70; // Calculate source x position
    spriteSheet2.onload = () => {
        if (lastBotAction == "jump") {
            canvasCtx.drawImage(
                spriteSheet2,
                240 - 2.5 * sx,
                185,
                80,
                100,
                550,
                370,
                150,
                200
            );
            bot.x = 550;
            console.log("jumping");
        } else if (lastBotAction == "squat") {
            canvasCtx.drawImage(
                spriteSheet2,
                245 - sx,
                185,
                80,
                100,
                600,
                370,
                150,
                200
            );
            bot.x = 600;
            console.log("squatting");
        } else {
            canvasCtx.drawImage(
                spriteSheet2,
                235,
                185,
                80,
                100,
                600,
                370,
                150,
                200
            );
            bot.x = 600;
            console.log("idle");
        }
    };
}

export function getRandomBotAction() {
    const random = Math.random();
    if (random < 0.33) {
        return "jump";
    } else if (random < 0.66) {
        return "squat";
    } else {
        return "idle";
    }
}

export function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}
