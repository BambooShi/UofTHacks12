import { useState, useEffect, useRef } from "react";
import { createPoseLandmarker, predictWebcam } from "../js/mediapipe.mjs";

// to move the hearts part later....?
export default function Webcam() {
    // Ref to store pose landmarks
    const poseLandmarks = useRef(null);
    const webcamVideo = useRef<HTMLVideoElement | null>(null);
    const canvas = useRef(null);

    const [isWebcamOn, setIsWebcamOn] = useState(false);
    const [videoStream, setVideoStream] = useState(null);

    // heart count for player 1 + 2
    let defaultHeart = 3;
    const [p1heart, setP1heart] = useState(defaultHeart);
    const [p2heart, setP2heart] = useState(defaultHeart);

    // Tracker of player 1's squats + jumps
    const [p1squats, setP1squats] = useState(0);
    const [p1jumps, setP1jumps] = useState(0);

    // Tracker of player 2's squats + jumps
    const [p2squats, setP2squats] = useState(0);
    const [p2jumps, setP2jumps] = useState(0);

    useEffect(() => {
        createPoseLandmarker();
        // Assuming `mjsFile` exposes a method that will update the state
        window.addEventListener("p1hChange", (event: any) => {
            setP1heart(event.detail);  
        });

        window.addEventListener("p2hChange", (event: any) => {
            setP2heart(event.detail);  
        });
        window.addEventListener("p1sChange", (event: any) => {
            setP1squats(event.detail); 
        });
        window.addEventListener("p1jChange", (event: any) => {
            setP1jumps(event.detail);  
        });
        window.addEventListener("p2sChange", (event: any) => {
            setP2squats(event.detail); 
        });
        window.addEventListener("p2jChange", (event: any) => {
            setP2jumps(event.detail); 
        });

        return () => {
            // Cleanup event listener on component unmount
            window.removeEventListener("p1hChange", () => {});
            window.removeEventListener("p2hChange", () => {});
            window.removeEventListener("p1sChange", () => {});
            window.removeEventListener("p1jChange", () => {});
            window.removeEventListener("p2sChange", () => {});
            window.removeEventListener("p2jChange", () => {});            
        };
    }, []);

    function toggleCam() {
        if (isWebcamOn) {
            disableCam();
        } else {
            enableCam();
        }
    }

    async function enableCam() {
        const constraints = {
            video: true,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        webcamVideo.current.srcObject = stream;
        setVideoStream(stream);
        setIsWebcamOn(true);
    }

    async function disableCam() {
        if (videoStream) {
            videoStream.getTracks().forEach((track) => {
                track.stop();
            });
            setVideoStream(null);
        }
        setIsWebcamOn(false);
    }

    async function readPose() {
        predictWebcam(webcamVideo.current, canvas.current, poseCallback);
    }

    async function poseCallback(poseData) {
        poseLandmarks.current = poseData.landmarks;
    }

    return (
        <div className="m-0">
            <div>
                <video
                    ref={webcamVideo}
                    autoPlay
                    width="480px"
                    height="640px"
                    onLoadedData={readPose}
                    className={
                        isWebcamOn
                            ? "rounded-tr-lg border-4 border-[#46262d]"
                            : ""
                    }
                />
                <canvas
                    ref={canvas}
                    className="output_canvas absolute top-0 left-[-240px] w-[240px] h-[320px]"
                    id="output_canvas"
                    width="480"
                    height="640"
                ></canvas>
            </div>

            <button className="rounded-none  w-60 text-xl" onClick={toggleCam}>
                {isWebcamOn ? "Disable Webcam" : "Enable Webcam"}
            </button>
            <p>
                Position camera such that your feet and mid-chest is visible in
                the camera.
            </p>
            <p>Stats!</p>
            <ul>
                <li>
                    Player 1: {p1heart} hearts, {p1squats} squats, {p1jumps}
                </li>
                <li>
                    Player 2: {p2heart} hearts, {p2squats} squats, {p2jumps}
                </li>
            </ul>
        </div>
    );
}
