import React from 'react';
import logo from './logo.svg';
import './App.css';
import { getLocalMediaStream } from './utils/broadcast';


const WIDTH = 720;
const HEIGHT = 640;
function App() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = React.useRef<HTMLCanvasElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const animationFrameId = React.useRef(-1);
  const animationFrameId2 = React.useRef(-1);

  const [width, setWidth] = React.useState(WIDTH);
  const [height, setHeight] = React.useState(HEIGHT);
  let pos = {
    drawable: false,
    X: -1,
    Y: -1,
  };
  const [r, setR] = React.useState(0);
  const [g, setG] = React.useState(0);
  const [b, setB] = React.useState(0);
  const video2Canvas = (canvas: HTMLCanvasElement, video: HTMLVideoElement, flag?: boolean) => {
    const context = canvas.getContext('2d');


    if (!context) return;
    if (!context) return null;
    const draw = (): void => {
      const { width: CANVAS_W, height: CANVAS_H } = canvas;
      const { videoWidth: VIDEO_W, videoHeight: VIDEO_H } = video;
      // const {
      //   x: CROPPED_X,
      //   y: CROPPED_Y,
      //   width: CROPPED_W,
      //   height: CROPPED_H,
      // } = cropBroadcastVideo(VIDEO_W, VIDEO_H, CANVAS_H, CANVAS_W);



      const ctx = context as CanvasRenderingContext2D;
      // ctx.rotate(Math.PI * 0.5);
      // ctx.scale(-1, 1);


      // ctx.setTransform(1, 0, 0, 1, 0, 0);

      if (flag) {
        const [CROPPED_X, CROPPED_Y, CROPPED_W, CROPPED_H] = [0, 0, 640, 1280];
              ctx.drawImage(
        video,
        CROPPED_X,
        CROPPED_Y,
        // CROPPED_W,
        // CROPPED_H,
        // CANVAS_W,
        // CANVAS_H,
        // CANVAS_W,
        // CANVAS_H,
      );
      ctx!.fillStyle = "rgba(255,0,0,0.5)"
        ctx?.fillRect(0, 0, 1280, 640);
        ctx.strokeStyle = "#FECA00";
        ctx.lineWidth = 4;

        ctx.strokeRect(pos.X, pos.Y, width, height);
    // // ctx!.fillStyle = `rgba(${r},${g},${b},0.5)`
    // //   ctx?.fillRect(400, 100, 360, 480);
      ctx.drawImage(
        video,
        pos.X, pos.Y, width,height,
        pos.X, pos.Y, width,height,
      )
      } else {
        const [CROPPED_X, CROPPED_Y, CROPPED_W, CROPPED_H] = [width, height, 640, 1280];

        ctx.drawImage(
          video,
          pos.X, pos.Y, width,height,
          0, 0, width,height,
        );

      }

      animationFrameId.current = requestAnimationFrame(draw);

    }
        
    draw();

  }


  function handleCanvas(videoEl: HTMLVideoElement): void {
    const canvas = canvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(animationFrameId.current);
    // const { videoEl } = BroadcastManager.getInstance(streamId).getElements;
    // if (!videoEl) return;
    video2Canvas(canvas, videoEl, true);
    const canvas2 = canvasRef2.current;
    if (!canvas2) return;
    cancelAnimationFrame(animationFrameId2.current);
    video2Canvas(canvas2, videoEl);

  }
  const handleStream = async () => {
    const stream = await getLocalMediaStream({ audioinput: 0, videoinput: 0}, true);
    console.log(stream);
    const videoEl = document.createElement('video');
    videoRef.current = videoEl;
    videoEl.srcObject = stream;
      // HOST는 자신의 오디오를 들을 필요가 없다.
      videoEl.volume = 0;
      videoEl.muted = true;
      videoEl.oncanplay = () => {
        // //
        if (videoEl.paused) {
          videoEl.muted = true;
          videoEl.play();
        }
      };
      videoEl.onplay = () => {
        //
        // setIsVideoLoading(false);
        // handleCanvas();
        handleCanvas(videoEl);
      };
    // document.body.append(videoEl);
  }
  React.useEffect(() => {

    handleStream();
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if(!video) return;
    handleCanvas(video);
  }, [r, g, b, width, height]);
  
   function getPosition(e: any) {
    return { X: e.offsetX, Y: e.offsetY };
  }

  function initDraw(e: any) {
    console.log('init');
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video) return;
    const ctx = canvas?.getContext('2d');
    ctx!.beginPath();
    pos = { ...pos, drawable: true, ...getPosition(e.nativeEvent) };
    ctx!.moveTo(pos.X, pos.Y);
  }

  const drawing = (e: any) => {
    const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
          const video = videoRef.current;
    if(!video) return;
    if (pos.drawable) {
      pos = { ...pos, ...getPosition(e.nativeEvent) };
      console.log(pos);

    }
      
  };
  function finishDraw() {
    const canvas = canvasRef.current;

    const ctx = canvas?.getContext('2d');
    // setWidth(pos.X);
    // setHeight(0);
    pos = {...pos, drawable: false, };
  }
  return (
    <div className="App">
            <input type="number" onChange={(e) => setWidth(Number(e.target.value))}  value={width} />
      <input type="number" onChange={(e) => setHeight(Number(e.target.value))} value={height} />
      <input type="number" onChange={(e) => setR(Number(e.target.value))} min={0} max={255} value={r} />
      <input type="number" onChange={(e) => setG(Number(e.target.value))} min={0} max={255}  value={g} />
        <input type="number" onChange={(e)=>setB(Number(e.target.value))} min={0} max={255}  value={b} />


      <canvas className="canvas" onMouseDown={(e) => initDraw(e)}
            onMouseUp={() => finishDraw()}
            onMouseMove={(e) => drawing(e)} ref={canvasRef} width={1280} height={640} />
      <canvas className="canvas" ref={canvasRef2} width={width} height={height} />

    </div>
  );
}

export default App;
