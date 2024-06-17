import React, { useRef, useState, useEffect } from 'react';
import './RegisterPage.css';
import criminal1 from '../criminal/criminal1.PNG';
import criminal2 from '../criminal/criminal2.PNG';
import criminal4 from '../criminal/criminal4.PNG';
import criminal5 from '../criminal/criminal5.PNG';
import criminal6 from '../criminal/criminal6.PNG';
import criminal7 from '../criminal/criminal7.PNG';
import criminal8 from '../criminal/criminal8.PNG';
import criminal9 from '../criminal/criminal9.PNG';
import criminal10 from '../criminal/criminal10.PNG';
import criminal11 from '../criminal/criminal11.PNG';
import criminal13 from '../criminal/criminal13.PNG';
import criminal14 from '../criminal/criminal14.PNG';
import criminal15 from '../criminal/criminal15.PNG';
import criminal16 from '../criminal/criminal16.PNG';

export const imageList = [
  criminal1,
  criminal2,
  criminal4,
  criminal5,
  criminal6,
  criminal7,
  criminal8,
  criminal9,
  criminal10,
  criminal11,
  criminal13,
  criminal14,
  criminal15,
  criminal16
];

export const sliderData = [
  { url: criminal1, name: "강동호", crime: "범죄자" },
  { url: criminal2, name: "강성운", crime: "범죄자" },
  { url: criminal4, name: "김명호", crime: "범죄자" },
  { url: criminal5, name: "김승현", crime: "범죄자" },
  { url: criminal6, name: "도현정", crime: "범죄자" },
  { url: criminal7, name: "박원천", crime: "범죄자" },
  { url: criminal8, name: "박창용", crime: "범죄자" },
  { url: criminal9, name: "박혜룡", crime: "범죄자" },
  { url: criminal10, name: "신창균", crime: "범죄자" },
  { url: criminal11, name: "윤재경", crime: "범죄자" },
  { url: criminal13, name: "이강준", crime: "범죄자" },
  { url: criminal14, name: "장윤", crime: "범죄자" },
  { url: criminal15, name: "정지민", crime: "범죄자" },
  { url: criminal16, name: "정진식", crime: "범죄자" },
];

function RegisterPage({ dangerousPersons, setDangerousPersons }) {
  const [editMode, setEditMode] = useState({});
  const fileInputRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (imageList.length * 2));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRegister = (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;
      const newPerson = {
        id: new Date().getTime(),
        name: nameInput.trim() || file.name,
        url: base64,
      };

      const updatedDangerousPersons = [...dangerousPersons, newPerson];
      setDangerousPersons(updatedDangerousPersons);
      localStorage.setItem('dangerousPersons', JSON.stringify(updatedDangerousPersons));

      // 파일 선택 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setNameInput('');
    };
    reader.readAsDataURL(file);
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
            width: `${sliderData.length * 150}px`, // 이미지 개수에 따라 가로 길이 조절
            transform: `translateX(-${currentIndex * 150}px)`, // 슬라이드 이동 효과
            transition: "transform 2s ease", // 2초간 부드럽게 이동
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
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;