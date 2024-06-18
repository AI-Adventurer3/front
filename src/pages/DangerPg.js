// DangerPg.js
import React, { useState, useRef, useEffect } from 'react';
import { imageList, sliderData } from './RegisterPage'; // 이미지 리스트 가져오기
import './DangerPg.css';

function DangerPg({ results, setResults, dangerousPersons }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [error] = useState('');
  const [currentResult, setCurrentResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!results) {
      setResults([]);
    }
  }, [results, setResults]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files).filter(file => !selectedFiles.some(existingFile => existingFile.name === file.name));
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewURLs(prevPreviews => [...prevPreviews, ...previews]);
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

        // 이미지와 비교하여 similarity_score 추가
        const similarityScores = await compareWithRegisterPageImages(data.image_base64);
        return { ...data, similarityScores };
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

  const compareWithRegisterPageImages = async (base64Image) => {
    if (!base64Image) {
      console.error('base64Image is undefined');
      return [];
    }

    const base64Header = "data:image/jpeg;base64,";
    const formattedBase64Image = base64Image.startsWith(base64Header) ? base64Image : `${base64Header}${base64Image}`;

    const allImages = [...imageList, ...dangerousPersons];

    const similarityPromises = allImages.map(async (imageData) => {
      let imageBlob;
      let imageName;

      if (typeof imageData === 'string'){
        if(imageData.startsWith('data:image/')){
          imageBlob = base64ToBlob(imageData);
        } else {
          const response = await fetch(imageData);
          imageBlob = await response.blob();
        }
        imageName = sliderData.find(item => item.url === imageData)?.name || '';
      } else {
        imageBlob = base64ToBlob(imageData.url);
        imageName = imageData.name || '';
      }

      const formData = new FormData();
      formData.append('file1', base64ToBlob(formattedBase64Image));
      formData.append('file2', imageBlob);

      try {
        const response = await fetch('http://localhost:8000/compare-faces/', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          }
        });
        const data = await response.json();
        return { imageName, similarityScore: data.similarity_score };
      } catch (error) {
        console.error('이미지 비교 에러:', error);
        return { imageName, similarityScore: 0 };
      }
    });

    return Promise.all(similarityPromises);
  };

  const base64ToBlob = (base64) => {
    if (!base64) {
      console.error('base64 string is undefined');
      return null;
    }
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
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
    <div>
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
            <div>
              {currentResult.similarityScores && currentResult.similarityScores
                .filter(similarity => similarity.similarityScore >= 0.3)
                .map((similarity, i) => (
                  <div className="warning" key={i}>
                    <span>경고: 위험인물 {similarity.imageName} 발견!</span>
                  </div>
                ))}
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