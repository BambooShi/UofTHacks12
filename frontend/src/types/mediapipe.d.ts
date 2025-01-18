declare module "../js/mediapipe.mjs" {
    export function createPoseLandmarker(): void;
    export function predictWebcam(
      video: HTMLVideoElement,
      canvasElement: HTMLCanvasElement | null,
      callback: (poseData: PoseData) => void
    ): void;
    export interface PoseData {
      landmarks: { x: number; y: number; z: number }[];
    }
  }
  