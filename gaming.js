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
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const spriteSheet = new Image();
spriteSheet.src = 'player1.png';

const spriteSheet2 = new Image();
spriteSheet2.src = 'player2.png';

setInterval(() => {
    const motionData = JSON.parse(localStorage.getItem('motionData'));
    if (motionData) {
        // drawItem(motionData);
        animateSprite(0, canvasElement, canvasCtx, motionData);
    }
}, 100)


let currentFrame = 0;    // Current frame index

const animationSpeed = 500; // Milliseconds between frame changes
let lastFrameTime = 0;

// Function to animate sprite
function animateSprite(timestamp, canvas, ctx, motionData) {
    if (timestamp - lastFrameTime >= animationSpeed) {
        // Update to the next frame
        currentFrame = (currentFrame + 1) % 2; // Loop through frames
        lastFrameTime = timestamp;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the current frame
    const sx = currentFrame * 70; // Calculate source x position
    
    if (motionData.player1 == "jump"){
        // triggerAnimation("attack");
        // character.classList.add("attack");
        canvasCtx.drawImage(spriteSheet, 245 + 2.5*sx, 185, 80, 100, 600, 370, 150, 200);
        console.log("jumping");
    } else if (motionData.player1 == "squat"){
        // triggerAnimation("dodge");
        // character.classList.add("dodge");
        canvasCtx.drawImage(spriteSheet, 245 + sx, 185, 80, 100, 600, 370, 150, 200);
        console.log("squatting");
    }  else {
        // triggerAnimation("idle");
        canvasCtx.drawImage(spriteSheet, 245, 185, 80, 100, 600, 370, 150, 200);
        console.log("idle");
    }
    
    if (motionData.player2 == "jump"){
        // triggerAnimation("attack");
        // character.classList.add("attack");
        canvasCtx.drawImage(spriteSheet2, 230 - 2.5*sx, 185, 80, 100, 750, 370, 150, 200);
        console.log("jumping");
    } else if (motionData.player2 == "squat"){
        // triggerAnimation("dodge");
        // character.classList.add("dodge");
        canvasCtx.drawImage(spriteSheet2, 235 - sx, 185, 80, 100, 750, 370, 150, 200);
        console.log("squatting");
    }  else {
        // triggerAnimation("idle");
        canvasCtx.drawImage(spriteSheet2, 240, 185, 80, 100, 750, 370, 150, 200);
        console.log("idle");
    }
    

    // Request the next frame
    requestAnimationFrame(animateSprite);
}

// Start the animation when the sprite sheet loads
spriteSheet.onload = () => {
    requestAnimationFrame(animateSprite);
};