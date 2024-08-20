// src/app/utils/FullScreen.ts

// 타입 선언
interface FullScreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface FullScreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
}

export const enterFullscreen = (): void => {
  const elem = document.documentElement as FullScreenElement;
  try {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  } catch (error) {
    console.error("전체 화면 모드를 시작할 수 없습니다:", error);
  }
};

export const exitFullscreen = (): void => {
  const doc = document as FullScreenDocument;
  try {
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      /* Safari */
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      /* IE11 */
      doc.msExitFullscreen();
    }
  } catch (error) {
    console.error("전체 화면 모드를 종료할 수 없습니다:", error);
  }
};

export const isFullscreen = (): boolean => {
  const doc = document as FullScreenDocument;
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);
};

export const toggleFullscreen = (): void => {
  if (isFullscreen()) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
};
