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
const animationSpeed = 500; // Milliseconds between frame changes
let lastFrameTime = 0;

let lastBotAction = "idle";
let botActionTimestamp = 0;
let botReactionDelay = 1000;

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
        console.log("jumping");
    } else if (motionData == "squat"){
        // triggerAnimation("dodge");
        // character.classList.add("dodge");
        canvasCtx.drawImage(spriteSheet, 245 + sx, 185, 80, 100, 500, 370, 150, 200);
        console.log("squatting");
    }  else {
        // triggerAnimation("idle");
        canvasCtx.drawImage(spriteSheet, 245, 185, 80, 100, 500, 370, 150, 200);
        console.log("idle");
    }
}

function drawBot(lastBotAction){
    // Draw the current frame
    const sx = currentFrame * 70; // Calculate source x position
        
    if (lastBotAction == "jump"){
        // triggerAnimation("attack");
        // character.classList.add("attack");
        canvasCtx.drawImage(spriteSheet2, 240 - 2.5*sx, 185, 80, 100, 600, 370, 150, 200);
        console.log("jumping");
    } else if (lastBotAction == "squat"){
        // triggerAnimation("dodge");
        // character.classList.add("dodge");
        canvasCtx.drawImage(spriteSheet2, 245 - sx, 185, 80, 100, 600, 370, 150, 200);
        console.log("squatting");
    }  else {
        // triggerAnimation("idle");
        canvasCtx.drawImage(spriteSheet2, 235, 185, 80, 100, 600, 370, 150, 200);
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

// Start the loop
spriteSheet.onload = spriteSheet2.onload = () => {
    requestAnimationFrame(gameLoop);
};