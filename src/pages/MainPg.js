import React, { useState } from 'react';
import './MainPg.css';
import { Element, animateScroll as scroll } from 'react-scroll';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function MainPg() {
  const [showNavbar] = useState(false);

  const scrollToNextSection = () => {
    scroll.scrollTo(window.innerHeight);
  };

  return (
    <div className="MainPg">
      {showNavbar && <Navbar />}
      <header className="MainPg-header">
        <div className="centered">
          <button onClick={scrollToNextSection}>다음 섹션으로 이동</button>
        </div>
      </header>

      {!showNavbar && <Navbar className='Navbar'/>}
      <Element name="nextSection" className="element">
        <div className="content">
          <h2>ABOUT US</h2>
          <div className="content-container">
            <img src="/main.PNG" alt="" className="content-image" />
            <div className="content-text">
                <p>입구컷은 모든 침입자를 예방합니다..</p>
                <p>얼굴인식과 침입자 알림으로 집 안의 안전을 완벽하게 보호합니다.</p>
                <p>위험인물 등록과 침입자 행동 분석을 통해 입구컷이 집을 안전하게 지킵니다.</p>
                <p>얼굴인식 기술을 활용한 지능형 보안, 입구컷이 가족의 평화를 지킵니다.</p>
            </div>
        </div>
        </div>
        <div className='ourservice'>
            <h2>Our Services</h2>
            <div className="link-row">
                <Link to="/intro" className="link-item">얼굴인식AI</Link>
                <Link to="/dangerpg" className="link-item">침입자 알림</Link>
                <Link to="/register" className="link-item">성범죄자 알림이</Link>
            </div>
            <div className="link-row">
                <Link to="/intro" className="link-item">위험인물 등록</Link>
                <Link to="/dangerpg" className="link-item">위험인물 행동분석</Link>
                <Link to="/register" className="link-item">리포트</Link>
            </div>
        </div>
        <div className='synergy'>
            <h2>기대효과</h2>
            <div>
                <img src="/Shuhua.jpeg" alt="" />
                <p>해만 떨어지면 이거 이제 환하게 비치니까 이게 막 벌떼만치 날아와 막 역싸는게 호롤롤롤롤롤 날아올라 막 그러면 손님들이 이 옷을 털고는 벌레가 묻을까봐 호로롤롤롤롤</p>
            </div>
            <div>
                <p>해만 떨어지면 이거 이제 환하게 비치니까 이게 막 벌떼만치 날아와 막 역싸는게 호롤롤롤롤롤 날아올라 막 그러면 손님들이 이 옷을 털고는 벌레가 묻을까봐 호로롤롤롤롤</p>
                <img src="/Shuhua.jpeg" alt="" />
            </div>
        </div>
        <div className='ourteam'>
            <img src="/Shuhua.jpeg" alt="" />
            <img src="/Shuhua.jpeg" alt="" />
            <img src="/Shuhua.jpeg" alt="" />
            <img src="/Shuhua.jpeg" alt="" />
        </div>
      </Element>
    </div>
  );
}

export default MainPg;
