import React, { useRef, useEffect, useState } from 'react';
import './IntroPage.css';
import WebcamComponent from '../components/WebcamComponent';
import Modal from 'react-modal';
import caution from '../img/caution.gif';

Modal.setAppElement('#root');  // 모달 접근성을 위한 설정

function IntroPage() {
  const webcamRef = useRef(null);
  const [results, setResults] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [modalBackground, setModalBackground] = useState("red");

  const processImages = async () => {
    console.log("POST 요청을 보냅니다: /process-images/");
    const capturedImages = webcamRef.current.getCapturedImages();
    
    if (!capturedImages || capturedImages.length === 0) {
      console.error('캡처된 이미지가 없습니다.');
      return;
    }

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
        console.log("성공적인 응답:", data.similarities);
        setResults(data.similarities);

        // 성범죄자 이미지 파일 목록
        const dangerousImages = [
          'im01.PNG', 'im02.PNG', 'im03.PNG', 'im04.PNG', 'im05.PNG', 
          'im06.PNG', 'im07.PNG', 'im08.PNG', 'im09.PNG', 'im10.PNG', 
          'im11.PNG', 'im12.PNG', 'im13.PNG', 'im14.PNG', 'im15.PNG', 'im16.PNG'
        ];

        // 0.5 이상 값 확인 후 모달 표시
        let isDangerousPersonDetected = false;
        let isCriminalDetected = false;

        data.similarities.forEach(similarity => {
          const match = similarity.match(/유사도.*?: ([0-9.]+)/);
          if (match) {
            const similarityValue = parseFloat(match[1]);
            const isDangerousImage = dangerousImages.some(imgName => similarity.includes(imgName));

            if (similarityValue >= 0.5) {
              if (isDangerousImage) {
                setAlertMessage("성범죄자가 집에 찾아왔습니다!!");
                setModalBackground("yellow");
                isCriminalDetected = true;
              } else {
                setAlertMessage("위험인물이 왔습니다.");
                setModalBackground("red");
                isDangerousPersonDetected = true;
              }
            }
          }
        });

        if (isCriminalDetected || isDangerousPersonDetected) {
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
      if (webcamRef.current && webcamRef.current.srcObject) {
        let tracks = webcamRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        webcamRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div>
      <h3>인트로 페이지</h3>
      <WebcamComponent ref={webcamRef} />
      <button onClick={processImages}>이미지 인식</button>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: modalBackground, padding: '20px 20px' }}>
        <img src={caution} style={{ width: '70px' }} alt="Caution"/>
          <div style={{ lineHeight: '1.1' }}>
          <h2>경고</h2>
          <h3>{alertMessage}</h3>
        </div>
        <button onClick={closeModal} style={{ color: 'red', backgroundColor: 'white', border: 'none', margin: '10px 7px', borderRadius: '5px', cursor: 'pointer' }}>닫기</button>
        </div>
      </Modal>
    </div>
  );
}

export default IntroPage;