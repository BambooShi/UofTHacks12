import { useState, useEffect, useRef } from "react";
import { createPoseLandmarker, predictWebcam } from "../js/mediapipe.mjs";

export default function Webcam() {
    // Ref to store pose landmarks
    const poseLandmarks = useRef(null);
    const webcamVideo = useRef<HTMLVideoElement | null>(null);
    const canvas = useRef(null);
    
    const [isWebcamOn, setIsWebcamOn] = useState(false);
    const [videoStream, setVideoStream] = useState(null);

    useEffect(() => {
        createPoseLandmarker();
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
        //changePose(poseData)
    }

    return (
        <div className="m-0">
            <div>
                <video
                    ref={webcamVideo}
                    autoPlay
                    width="240px"
                    height="320px"
                    className={
                        isWebcamOn
                            ? "rounded-tr-lg border-4 border-[#46262d]"
                            : ""
                    }
                />
                <canvas
                    ref={canvas}
                    className="output_canvas absolute top-0 left-0 w-[240px] h-[320px]"
                    id="output_canvas"
                    width="240"
                    height="320"
                ></canvas>
            </div>

            <button className="rounded-none  w-60 text-xl" onClick={toggleCam}>
                {isWebcamOn ? "Disable Webcam" : "Enable Webcam"}
            </button>
        </div>
    );

    // save the previous onLoadedData={readSign} ^ above.. for like messages like.. jump higher.. or squat more.. if the person isn't doing it enough..
}
