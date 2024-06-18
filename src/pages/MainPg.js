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

      {!showNavbar && <Navbar className='Navbar' />}
      <Element name="nextSection" className="element">
        <div className="content">
          <h2>ABOUT US</h2>
          <div className="content-container">
            <img src="/sos.png" alt="Company Overview" className="content-image" />
            <div className="content-text">
              <p>입구컷은 모든 침입자를 예방합니다.</p>
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
            <img src="/child.png" alt="" />
            <p>본 시스템을 어린이 보호구역에 도입하여 실시간으로 잠재적 위험인물을 사전에 식별하고 경고함으로써 어린이들의 안전을 체계적으로 보호할 수 있습니다. 이를 통해 사고와 범죄를 예방하고 안전을 확보합니다</p>
          </div>
          <div>
            <p>보안 회사에 최첨단 CCTV 시스템을 제공하여 정밀하고 실시간으로 잠재적 위협을 감지하고 대응할 수 있도록 지원합니다. 얼굴 인식, 감정 분석, 성별 및 나이대 추정, 행동 분석 기능을 통해 보안 수준을 극대화합니다.</p>
            <img src="/cctv.png" alt="" />
          </div>
          <div>
            <img src="/device.png" alt="" />
            <p>가정 내 디바이스에 본 기술을 통합하여 방문자 분석 및 경고 기능을 제공합니다. 얼굴 유사도 분석, 감정 및 행동 분석을 통해 가정의 보안 수준을 한층 강화하고, 사용자에게 더욱 안전한 환경을 제공합니다.</p>
            
          </div>
        </div>
      </Element>
    </div>
  );
}

export default MainPg;
