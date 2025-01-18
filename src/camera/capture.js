import { Camera } from '@mediapipe/camera_utils';

export const startCamera = async (onResultsCallback) => {
    const videoElement = document.createElement('video');
    videoElement.width = 640;
    videoElement.height = 480;

    // Add video element to the page
    document.body.appendChild(videoElement);

    // Start camera
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await onResultsCallback(videoElement);
        },
        width: 640,
        height: 480,
    });

    camera.start();
};
