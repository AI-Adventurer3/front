// eslint-disable-next-line
import React, { useRef, useEffect } from 'react';
import './IntroPage.css';  // CSS 파일을 임포트

function IntroPage() {
  const videoRef = useRef(null);

  const startCapture = async () => {
    console.log("POST 요청을 보냅니다: /start-capture/");
    try {
      const response = await fetch('http://localhost:8000/start-capture/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("성공적인 응답:", data.message); // 성공 메시지 출력

        // 웹캠 스트림 시작
        if (videoRef.current) {
          const getUserMedia = 
            navigator.mediaDevices?.getUserMedia ||
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

          if (getUserMedia) {
            getUserMedia.call(navigator.mediaDevices || navigator, { video: true })
              .then((stream) => {
                videoRef.current.srcObject = stream;
              })
              .catch((error) => {
                console.error('웹캠 스트림을 시작할 수 없습니다:', error);
              });
          } else {
            console.error('이 브라우저는 getUserMedia를 지원하지 않습니다.');
          }
        }
      } else {
        console.error('캡처 시작 실패, 상태 코드:', response.status);
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const stopCapture = async () => {
    console.log("POST 요청을 보냅니다: /stop-capture/");
    try {
      const response = await fetch('http://localhost:8000/stop-capture/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("성공적인 응답:", data.message); // 성공 메시지 출력

        // 웹캠 스트림 중단
        if (videoRef.current && videoRef.current.srcObject) {
          let tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      } else {
        console.error('캡처 중단 실패, 상태 코드:', response.status);
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const processImages = async () => {
    console.log("POST 요청을 보냅니다: /process-images/");
    try {
      const response = await fetch('http://localhost:8000/process-images/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("성공적인 응답:", data.results); // 성공 메시지 출력
      } else {
        console.error('이미지 인식 실패, 상태 코드:', response.status);
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const stopVideoFeed = async () => {
    console.log("POST 요청을 보냅니다: /stop_video_feed/");
    try {
      const response = await fetch('http://localhost:8000/stop_video_feed/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("성공적인 응답:", data.message); // 성공 메시지 출력

        // 웹캠 스트림 중단
        if (videoRef.current && videoRef.current.srcObject) {
          let tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      } else {
        console.error('비디오 피드 중단 실패, 상태 코드:', response.status);
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  useEffect(() => {
    return () => {

      // 컴포넌트 언마운트 시 웹캠 스트림 중지
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        // eslint-disable-next-line
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div>
      <h3>인트로 페이지</h3>
      <div className="live_box">
        <video ref={videoRef} autoPlay />
      </div>
      <button onClick={startCapture}>캡처 시작</button>
      <button onClick={stopCapture}>캡처 중단</button>
      <button onClick={processImages}>이미지 인식</button>
      <button onClick={stopVideoFeed}>비디오 중단</button>
      <p>인물 감지</p>
    </div>
  );
}

export default IntroPage;