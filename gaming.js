import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";
// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os
testSupport([
    { client: 'Chrome' },
]);
function testSupport(supportedDevices) {
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
    }
};
// Our input frames will come from here.
const canvas = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvas.getContext('2d');

const spriteSheet = new Image();
spriteSheet.src = 'player1.png';

const spriteSheet2 = new Image();
spriteSheet2.src = 'player2.png';

// setInterval(() => {
//     const motionData = JSON.parse(localStorage.getItem('motionData'));
//     if (motionData) {
//         // drawItem(motionData);
//         gameLoop(timestamp, motionData);
//     }
// }, 100)


let currentFrame = 0;    // Current frame index
const animationSpeed = 1000; // Milliseconds between frame changes
let lastFrameTime = 0;

let lastBotAction = "idle";
let botActionTimestamp = 0;
let botReactionDelay = 1000;

let player1 = { x: 450, y: 370, width: 150, height: 200 };
let bot = { x: 600, y: 370, width: 150, height: 200 };

function gameLoop(timestamp) {
    // Update Player 1 motion data
    const motionData = JSON.parse(localStorage.getItem('motionData')) || { player1: "idle" };
    // const playerAction = motionData.player1;

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

    // Draw Player 1 and Bot
    drawPlayer1(motionData.player1);
    drawBot(lastBotAction);

    if (motionData.player1 == "jump" && isColliding(bot, player1) && lastBotAction != "squat") {
        console.log("Player 1 wins!");
    } else if (lastBotAction == "jump" && isColliding(bot, player1) && motionData.player1 != "squat") {
        console.log("Bot wins!");
    }
    // Continue the loop
    requestAnimationFrame(gameLoop);
}

function drawPlayer1(motionData){
    // Draw the current frame
    const sx = currentFrame * 70; // Calculate source x position
        
    if (motionData == "jump"){
        // triggerAnimation("attack");
        // character.classList.add("attack");
        canvasCtx.drawImage(spriteSheet, 245 + 2.5*sx, 185, 80, 100, 500, 370, 150, 200);
        player1.x = 500;
        console.log("jumping");
    } else if (motionData == "squat"){
        // triggerAnimation("dodge");
        // character.classList.add("dodge");
        canvasCtx.drawImage(spriteSheet, 245 + sx, 185, 80, 100, 450, 370, 150, 200);
        player1.x = 450;
        console.log("squatting");
    }  else {
        // triggerAnimation("idle");
        canvasCtx.drawImage(spriteSheet, 245, 185, 80, 100, 450, 370, 150, 200);
        player1.x = 450;
        console.log("idle");
    }
}

function drawBot(lastBotAction){
    // Draw the current frame
    const sx = currentFrame * 70; // Calculate source x position
        
    if (lastBotAction == "jump"){
        // triggerAnimation("attack");
        // character.classList.add("attack");
        canvasCtx.drawImage(spriteSheet2, 240 - 2.5*sx, 185, 80, 100, 550, 370, 150, 200);
        bot.x = 550;
        console.log("jumping");
    } else if (lastBotAction == "squat"){
        // triggerAnimation("dodge");
        // character.classList.add("dodge");
        canvasCtx.drawImage(spriteSheet2, 245 - sx, 185, 80, 100, 600, 370, 150, 200);
        bot.x = 600;
        console.log("squatting");
    }  else {
        // triggerAnimation("idle");
        canvasCtx.drawImage(spriteSheet2, 235, 185, 80, 100, 600, 370, 150, 200);
        bot.x = 600;
        console.log("idle");
    }
}

function getRandomBotAction(){
    const random = Math.random();
    if (random < 0.33) {
        return "jump";
    } else if (random < 0.66) {
        return "squat";
    } else {
        return "idle";
    }
}

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Start the loop
spriteSheet.onload = spriteSheet2.onload = () => {
    requestAnimationFrame(gameLoop);
};