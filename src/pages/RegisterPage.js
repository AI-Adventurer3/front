import React, { useRef, useState, useEffect } from 'react';
import './RegisterPage.css';
import criminal1 from '../criminal/criminal1.PNG';
import criminal2 from '../criminal/criminal2.PNG';
import criminal3 from '../criminal/criminal3.PNG';
import criminal4 from '../criminal/criminal4.PNG';
import criminal5 from '../criminal/criminal5.PNG';
import criminal6 from '../criminal/criminal6.PNG';
import criminal7 from '../criminal/criminal7.PNG';
import criminal8 from '../criminal/criminal8.PNG';
import criminal9 from '../criminal/criminal9.PNG';
import criminal10 from '../criminal/criminal10.PNG';
import criminal11 from '../criminal/criminal11.PNG';
import criminal12 from '../criminal/criminal12.PNG';
import criminal13 from '../criminal/criminal13.PNG';
import criminal14 from '../criminal/criminal14.PNG';
import criminal15 from '../criminal/criminal15.PNG';
import criminal16 from '../criminal/criminal16.PNG';

const imageList = [
  criminal1,
  criminal2,
  criminal3,
  criminal4,
  criminal5,
  criminal6,
  criminal7,
  criminal8,
  criminal9,
  criminal10,
  criminal11,
  criminal12,
  criminal13,
  criminal14,
  criminal15,
  criminal16,
  criminal1,
  criminal2,
  criminal3,
  criminal4,
  criminal5,
  criminal6,
  criminal7,
  criminal8,
  criminal9,
  criminal10,
  criminal11,
  criminal12,
  criminal13,
  criminal14,
  criminal15,
  criminal16
];

const sliderData = [
  { url: criminal1, name: "1", crime: "Theft" },
  { url: criminal2, name: "2h", crime: "Fraud" },
  { url: criminal3, name: "3", crime: "Assault" },
  { url: criminal4, name: "4", crime: "Robbery" },
  { url: criminal5, name: "5", crime: "Theft" },
  { url: criminal6, name: "6", crime: "Theft" },
  { url: criminal7, name: "7", crime: "Theft" },
  { url: criminal8, name: "8", crime: "Theft" },
  { url: criminal9, name: "9", crime: "Theft" },
  { url: criminal10, name: "10", crime: "Theft" },
  { url: criminal11, name: "11", crime: "Theft" },
  { url: criminal12, name: "12", crime: "Theft" },
  { url: criminal13, name: "13", crime: "Theft" },
  { url: criminal14, name: "14", crime: "Theft" },
  { url: criminal15, name: "15", crime: "Theft" },
  { url: criminal16, name: "16", crime: "Theft" },
];

function RegisterPage({ dangerousPersons, setDangerousPersons }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editMode, setEditMode] = useState({}); // 이름 수정 모드 상태 관리
  const fileInputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (imageList.length * 2));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRegister = (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const newPerson = {
      id: new Date().getTime(),
      name: '이름',
      url: URL.createObjectURL(files[0]),
    };

    const updatedDangerousPersons = [...dangerousPersons, newPerson];
    setDangerousPersons(updatedDangerousPersons);
    localStorage.setItem('dangerousPersons', JSON.stringify(updatedDangerousPersons));

    // 파일 선택 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateName = (id, newName) => {
    const updatedDangerousPersons = dangerousPersons.map((person) =>
      person.id === id ? { ...person, name: newName } : person
    );
    setDangerousPersons(updatedDangerousPersons);
    localStorage.setItem('dangerousPersons', JSON.stringify(updatedDangerousPersons));
  };

  const deletePerson = (id) => {
    const updatedDangerousPersons = dangerousPersons.filter((person) => person.id !== id);
    setDangerousPersons(updatedDangerousPersons);
    localStorage.setItem('dangerousPersons', JSON.stringify(updatedDangerousPersons));
  };

  const handleClearAll = () => {
    setDangerousPersons([]);
    localStorage.removeItem('dangerousPersons');
  };

  const toggleEditMode = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };
// eslint-disable-next-line
  const handleNameChange = (id, newName) => {
    updateName(id, newName);
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="register-page">
      <h2>위험인물 등록 페이지</h2>
      <input
        type="file"
        onChange={handleRegister}
        accept="image/*"
        ref={fileInputRef}
      />
      <h3>등록된 위험인물</h3>
      <button onClick={handleClearAll}>
        모든 위험인물 초기화
      </button>
      <div className="person-list">
        {dangerousPersons.map((person) => (
          <div key={person.id} className="person-item">
            <button className='person-delete' onClick={() => deletePerson(person.id)}>x</button>
            <img src={person.url} alt={person.name} />
            {editMode[person.id] ? (
              <input
                type="text"
                value={person.name}
                onChange={(e) => updateName(person.id, e.target.value)}
                onBlur={() => toggleEditMode(person.id)}
                placeholder="이름 수정"
                autoFocus
              />
            ) : (
              <div className="name-container">
                <span>{person.name}</span>
                <button className="edit-button" onClick={() => toggleEditMode(person.id)}>
                  ✏️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="image-slider">
        <div
          className="image-list"
          style={{
            width: `${sliderData.length * 150 * 12}px`,
            transform: `translateX(-${currentIndex * 110}px)`,
            transition: "transform 2s ease",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {sliderData.map((item, index) => (
            <div key={index} className="image-container">
              <img
                src={item.url}
                alt={`이미지 ${index + 1}`}
                className="image-item"
              />
              <div className="image-info">
                <p className="image-name">이름: {item.name}</p>
                <p className="image-crime">범죄: {item.crime}</p>
              </div>
            </div>
          ))}
          {sliderData.map((item, index) => (
            <div key={index} className="image-container">
              <img
                src={item.url}
                alt={`이미지 ${index + 1}`}
                className="image-item"
              />
              <div className="image-info">
                <p className="image-name">이름: {item.name}</p>
                <p className="image-crime">범죄: {item.crime}</p>
              </div>
            </div>
          ))}
          {sliderData.map((item, index) => (
            <div key={index} className="image-container">
              <img
                src={item.url}
                alt={`이미지 ${index + 1}`}
                className="image-item"
              />
              <div className="image-info">
                <p className="image-name">이름: {item.name}</p>
                <p className="image-crime">범죄: {item.crime}</p>
              </div>
            </div>
          ))}
          {sliderData.map((item, index) => (
            <div key={index} className="image-container">
              <img
                src={item.url}
                alt={`이미지 ${index + 1}`}
                className="image-item"
              />
              <div className="image-info">
                <p className="image-name">이름: {item.name}</p>
                <p className="image-crime">범죄: {item.crime}</p>
              </div>
            </div>
          ))}
          {sliderData.map((item, index) => (
            <div key={index} className="image-container">
              <img
                src={item.url}
                alt={`이미지 ${index + 1}`}
                className="image-item"
              />
              <div className="image-info">
                <p className="image-name">이름: {item.name}</p>
                <p className="image-crime">범죄: {item.crime}</p>
              </div>
            </div>
          ))}
          {sliderData.map((item, index) => (
            <div key={index} className="image-container">
              <img
                src={item.url}
                alt={`이미지 ${index + 1}`}
                className="image-item"
              />
              <div className="image-info">
                <p className="image-name">이름: {item.name}</p>
                <p className="image-crime">범죄: {item.crime}</p>
              </div>
            </div>
          ))}
          {sliderData.map((item, index) => (
            <div key={index} className="image-container">
              <img
                src={item.url}
                alt={`이미지 ${index + 1}`}
                className="image-item"
              />
              <div className="image-info">
                <p className="image-name">이름: {item.name}</p>
                <p className="image-crime">범죄: {item.crime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
