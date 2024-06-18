import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
      <li>
          <Link to="/">👀입구컷</Link>
        </li>
        <li>
          <Link to="/intro">🔴Live</Link>
        </li>
        <li>
          <Link to="/register">💢사전등록</Link>
        </li>
        <li>
          <Link to="/dangerpg">💥오늘의 침입자</Link>
        </li>
        <li>
          <Link to="/list">✅리스트</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
