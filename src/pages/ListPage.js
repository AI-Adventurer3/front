import React, { useEffect, useState } from 'react';
import './ListPage.css';

function ListPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedResults = localStorage.getItem('results');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'ko-KR'; // 한국어 설정
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="page-container">
      <header>
        <h1 className="title">리스트 페이지</h1>
      </header>
      <p className="description">입구컷 침입자 리스트</p>
      <div className="result-container">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div className="result-item" key={index}>
              <div className="image-container">
                {result.image_base64 && (
                  <img
                    src={`data:image/jpeg;base64,${result.image_base64}`}
                    alt={`이미지 ${index + 1}`}
                    style={{ maxWidth: '180px' }}
                  />
                )}
              </div>
              <div className="info-container">
                <h2>이미지 {index + 1} 결과:</h2>
                <div>얼굴 상태: {result.face_status}</div>
                <div>표정: {result.expressions ? result.expressions.join(', ') : '없음'}</div>
                <div>캡션: {result.caption}</div>
                <div>나이: {result.age}</div>
                <div>
                  <strong>요약:</strong> {result.summary}
                </div>
                {result.is_dangerous && (
                  <div style={{ color: 'red' }}>
                    경고: 위험한 내용이 감지되었습니다!
                  </div>
                )}
                <button 
                  className="voice-button" 
                  onClick={() => speakText(result.summary)}>🔊</button>
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
