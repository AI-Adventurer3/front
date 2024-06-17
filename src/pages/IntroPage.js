import React, { useRef, useEffect, useState } from 'react';
import './IntroPage.css';  // CSS 파일을 임포트
import WebcamComponent from '../components/WebcamComponent';
import Modal from 'react-modal';
import caution from '../img/caution.gif';

Modal.setAppElement('#root');  // 모달 접근성을 위한 설정

function IntroPage() {
  const webcamRef = useRef(null);
  const [results, setResults] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // const startCapture = async () => {
  //   console.log("POST 요청을 보냅니다: /start-capture/");
  //   try {
  //     const response = await fetch('http://localhost:8000/start-capture/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       console.error('캡처 시작 실패, 상태 코드:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('에러 발생:', error);
  //   }
  // };

  // const stopCapture = async () => {
  //   console.log("POST 요청을 보냅니다: /stop-capture/");
  //   try {
  //     const response = await fetch('http://localhost:8000/stop-capture/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("성공적인 응답:", data.message); // 성공 메시지 출력

  //       // 웹캠 스트림 중단
  //       if (webcamRef.current && webcamRef.current.srcObject) {
  //         let tracks = webcamRef.current.srcObject.getTracks();
  //         tracks.forEach(track => track.stop());
  //         webcamRef.current.srcObject = null;
  //       }
  //     } else {
  //       console.error('캡처 중단 실패, 상태 코드:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('에러 발생:', error);
  //   }
  // };

  const processImages = async () => {
    console.log("POST 요청을 보냅니다: /process-images/");
    const capturedImages = webcamRef.current.getCapturedImages();
    try {
      const response = await fetch('http://localhost:8000/process-images/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: capturedImages })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("성공적인 응답:", data.similarities); // 성공 메시지 출력
        setResults(data.similarities);

        // 0.5 이상 값 확인 후 모달 표시
        const isDangerousPersonDetected = data.similarities.some(similarity => {
          const similarityValue = parseFloat(similarity.match(/유사도.*?: ([0-9.]+)/)[1]);
          return similarityValue >= 0.5;
        });

        if (isDangerousPersonDetected) {
          setModalIsOpen(true);
        }
      } else {
        console.error('이미지 인식 실패, 상태 코드:', response.status);
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 웹캠 스트림 중지
      // if (webcamRef.current && webcamRef.current.srcObject) {
      //   let tracks = webcamRef.current.srcObject.getTracks();
      //   tracks.forEach(track => track.stop());
      //   webcamRef.current.srcObject = null;
      // }
    };
  }, []);

  return (
    <div>
      <h3>인트로 페이지</h3>
      <WebcamComponent ref={webcamRef} />
      {/* <button onClick={startCapture}>캡처 시작</button>
      <button onClick={stopCapture}>캡처 중단</button> */}
      <button onClick={processImages}>이미지 인식</button>
      {/* <div>
        {results.map((result, index) => (
          <p key={index}>{result}</p>
        ))}
      </div> */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Dangerous Person Alert"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            padding: '0px',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'red',  padding: '20px 20px' }}>
          {/* <span><img src="../img/caution.gif" alt="Caution" /></span> */}
          <img src={caution} style={{ width: '70px' }}/>
          <div style={{ lineHeight: '1.1' }} >
            <h2>경고</h2>
            <h3>위험인물이 집에 찾아왔습니다!!</h3>
          </div>
          <button onClick={closeModal} style={{ color: 'red', backgroundColor: 'white', border: 'none', margin: '10px 7px', borderRadius: '5px', cursor: 'pointer' }}>닫기</button>
        </div>
      </Modal>
    </div>
  );
}

export default IntroPage;
