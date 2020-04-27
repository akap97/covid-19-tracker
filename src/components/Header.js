import React from 'react';
import covid from '../assets/images/covi19.png';
import { FaGithub } from 'react-icons/fa';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container type="content">
        <img className="covidicon" src={covid} alt="header-logo"></img>
        <p>GO Corona GO</p>
        <div className="git">
          <a href="https://github.com/akap97/covid-19-tracker">
            <FaGithub size="35px" />
          </a>
        </div>
      </Container>
    </header>
  );
};

export default Header;