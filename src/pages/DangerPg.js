import React, { useState, useRef, useEffect } from 'react';
import { imageList } from './RegisterPage'; // 이미지 리스트 가져오기

function DangerPg({ results, setResults }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewURLs, setPreviewURLs] = useState([]);
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
      const updatedResults = [...(results || []), ...uploadResults];
      setResults(updatedResults);
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

  const compareWithRegisterPageImages = async (base64Image) => {
    if (!base64Image) {
      console.error('base64Image is undefined');
      return [];
    }

    const base64Header = "data:image/jpeg;base64,";
    const formattedBase64Image = base64Image.startsWith(base64Header) ? base64Image : `${base64Header}${base64Image}`;

    const similarityPromises = imageList.map(async (image) => {
      // image는 URL 형태이므로 이를 Blob으로 변환
      const imageBlob = await fetch(image).then(res => res.blob());

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
        return { image, similarityScore: data.similarity_score };
      } catch (error) {
        console.error('이미지 비교 에러:', error);
        return { image, similarityScore: 0 };
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
  };

  return (
    <div>
      <h1>오늘의 침입자를 알려줘</h1>
      <input type="file" onChange={handleFileChange} ref={fileInputRef} multiple />
      <div className="image-previews">
        {previewURLs.map((url, index) => (
          <img key={index} src={url} alt={`미리 보기 ${index + 1}`} style={{ maxWidth: '150px' }} />
        ))}
      </div>
      <button onClick={handleUpload} disabled={!selectedFiles.length || loading}>
        {loading ? '분석 중...' : '업로드'}
      </button>
      <button onClick={handleClearResults}>초기화</button>
      {results && results.map((result, index) => (
        <div key={index} className="result">
          <h2>이미지 {index + 1} 결과:</h2>
          <div key="image">
            <img src={`data:image/jpeg;base64,${result.image_base64}`} alt={`이미지 ${index + 1}`} style={{ maxWidth: '150px' }} />
            <div>얼굴 상태: {result.face_status}</div>
            <div>표정: {result.expressions ? result.expressions.join(', ') : '없음'}</div>
            <div>캡션: {result.caption}</div>
            <div>나이: {result.age}</div>
            <div>
              <strong>요약:</strong> {result.summary}
            </div>
            <div>
              <strong>유사도 점수:</strong>
              {result.similarityScores && result.similarityScores.map((similarity, i) => (
                <div key={i}>
                  <span>이미지 {i + 1}: {similarity.similarityScore}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DangerPg;
