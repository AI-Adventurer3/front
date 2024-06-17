import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const WebcamComponent = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  useImperativeHandle(ref, () => ({
    getCapturedImages: () => {
      return capturedImages;
    }
  }));

  useEffect(() => {
    const video = videoRef.current;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((error) => {
          console.log("Something went wrong!");
          console.log(error);
          return;
        });
    }

    return () => {
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const startCapturing = () => {
    const id = setInterval(captureImage, 1000);
    setIntervalId(id);
  };

  const stopCapturing = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageUrl = canvas.toDataURL('image/png');

    console.log(`Captured image URL: ${imageUrl}`);

    setCapturedImages(prevImages => {
      if (prevImages.length >= 10) {
        return [...prevImages.slice(1), imageUrl];
      } else {
        return [...prevImages, imageUrl];
      }
    });
  };

  return (
    <div>
      <video
        id="videoElement"
        ref={videoRef}
        autoPlay
        playsInline
        width="900"
        height="600"
        style={{ width: '900px', height: '600px' }}
      />
      <div>
        <button onClick={startCapturing}>Start Capturing</button>
        <button onClick={stopCapturing}>Stop Capturing</button>
      </div>
      <div>
        {capturedImages.map((img, index) => (
          <img key={index} src={img} alt={`captured-${index}`} style={{ width: '300px', margin: '10px' }} />
        ))}
      </div>
    </div>
  );
});

export default WebcamComponent;
