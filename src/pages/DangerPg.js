import React, { useState, useRef, useEffect } from 'react';
import './DangerPg.css';

function DangerPg({ results, setResults, dangerousPersons }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [error, setError] = useState('');
  const [currentResult, setCurrentResult] = useState(null);
  const fileInputRef = useRef(null);

  // 
  useEffect(() => {
    if (!results) {
      setResults([]);
    }
  }, [results, setResults]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files).filter(file => 
      !selectedFiles.some(existingFile => existingFile.name === file.name) && 
      file.size <= 5 * 1024 * 1024 && // 파일 크기 제한 5MB
      (file.type === 'image/jpeg' || file.type === 'image/png') // 파일 형식 검사
    );
    
    if (newFiles.length < files.length) {
      setError('5MB 이하의 JPEG 또는 PNG 파일만 업로드 가능합니다.');
    } else {
      setError('');
    }

    setSelectedFiles(newFiles);
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewURLs(previews);
  };

  const handleUpload = async () => {
    setLoading(true);
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch('http://localhost:8000/classify-image/', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          }
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('이미지 업로드 에러:', error);
        return { error: error.message };
      }
    });

    try {
      const uploadResults = await Promise.all(uploadPromises);
      const latestResult = uploadResults[uploadResults.length - 1];
      setCurrentResult(latestResult);
      const updatedResults = [...(results || []), latestResult];
      setResults(updatedResults);
      checkForDangerousPersons([latestResult]);
      saveResults(updatedResults);
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
    } finally {
      setLoading(false);
      setPreviewURLs([]);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const checkForDangerousPersons = (results) => {
    const foundDangerousPersons = results.filter((result) =>
      dangerousPersons.some(
        (person) => result.summary && result.summary.includes(person.name)
      )
    );
    if (foundDangerousPersons.length > 0) {
      alert('경고: 위험 인물이 감지되었습니다!');
    }
  };

  const saveResults = (results) => {
    localStorage.setItem('results', JSON.stringify(results));
  };

  const handleClearResults = () => {
    localStorage.removeItem('results');
    setResults([]);
    setCurrentResult(null);
  };

  return (
    <div className="container">
      <h1>오늘의 침입자를 알려줘</h1>
      {error && <div className="error-message">{error}</div>}
      <input type="file" onChange={handleFileChange} ref={fileInputRef} multiple />
      <div className="image-previews">
        {previewURLs.map((url, index) => (
          <img key={index} src={url} alt={`미리 보기 ${index + 1}`} />
        ))}
      </div>
      <div className="button-container">
        <button onClick={handleUpload} disabled={!selectedFiles.length || loading}>
          {loading ? '분석 중...' : '업로드'}
        </button>
        <button onClick={handleClearResults}>초기화</button>
      </div>
      {currentResult && (
        <div className={`result ${currentResult.is_dangerous ? 'dangerous' : ''}`}>
          <img src={`data:image/jpeg;base64,${currentResult.image_base64}`} alt="분석 결과 이미지" />
          <div className="result-content">
            <h2>이미지 분석 결과:</h2>
            <div>
              <strong>정보:</strong> {currentResult.summary}
            </div>
            {currentResult.is_dangerous && (
              <div className="warning">
                경고: 위험한 내용이 감지되었습니다!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DangerPg;
