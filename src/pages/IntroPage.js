import React, { useEffect, useState } from 'react';
import './ListPage.css';

function ListPage() {
  const [results, setResults] = useState([]);
  const [dangerousCount, setDangerousCount] = useState(0);
  const [normalCount, setNormalCount] = useState(0);

  useEffect(() => {
    const savedResults = localStorage.getItem('results');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults);
      countResults(parsedResults);
    }
  }, []);

  const countResults = (results) => {
    const dangerous = results.filter(result => result.is_dangerous).length;
    const normal = results.length - dangerous;
    setDangerousCount(dangerous);
    setNormalCount(normal);
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'ko-KR'; // 한국어 설정
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="page-container">
      <header>
        <h1 className="title">입구컷 침입자 목록</h1>
      </header>
      <p className="description">입구컷 침입자 리스트</p>
      <div className="count-container">
        <div className="count-box dangerous">
          <h3>위험 인물</h3>
          <p>{dangerousCount}명</p>
        </div>
        <div className="count-box">
          <h3>일반 침입자</h3>
          <p>{normalCount}명</p>
        </div>
      </div>
      <div className="result-container">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div className={`result-item ${result.is_dangerous ? 'dangerous' : ''}`} key={index}>
              <div className="image-container">
                {result.image_base64 && (
                  <img
                    src={`data:image/jpeg;base64,${result.image_base64}`}
                    alt={`이미지 ${index + 1}`}
                  />
                )}
              </div>
              <div className="info-container">
                <div className="title-and-button">
                  <h2>침입자 {index + 1}:</h2>
                  <button 
                    className="voice-button" 
                    onClick={() => speakText(result.summary)}>🔊</button>
                </div>
                <div>
                  <strong>정보:</strong> {result.summary}
                </div>
                {result.is_dangerous && (
                  <div className="warning">
                    경고: 위험한 내용이 감지되었습니다!
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>등록된 침입자가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ListPage;
