import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Search from '../components/Search';
import Graph from '../components/Graph';
import Map from '../components/map';

import logo from '../assets/logo.png';
import select from '../assets/select.png';
import selectOff from '../assets/selectoff.png';

import { getSensorList } from '../apis/api';

import { data } from '../components/graphdata';

function Home() {
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    // API를 각 위치에서 호출하는 경우
    // const getStationList = async () => {
    //   try {
    //     const res = await http.get(`/todos/1`);
    //     setTest(res.data.title);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };
    // API들을 모듈화해서 호출하는 경우
    getSensorList().then((data) => {
      console.log(data);
    });
  }, []);

  const sliderSetting = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
  };

  return (
    <Body>
      <Header>
        <Logo src={logo} alt='logo'></Logo>
        <Search />
      </Header>
      <GraphsSection>
        <TitleContainer>
          <Title>Graphs</Title>
          <SelectButton type='button' onClick={() => setToggle(!toggle)}>
            <SelectButtonImage
              src={toggle ? select : selectOff}
              alt='select button'
            />
          </SelectButton>
        </TitleContainer>
        {toggle ? (
          <>
            <GraphContainer>
              <Graph
                toggle={toggle}
                dataType={data.temperature}
                title='Temperature'
              />
              <Graph
                toggle={toggle}
                dataType={data.humidity}
                title='Humidity'
              />
            </GraphContainer>
            <GraphContainer>
              <Graph
                toggle={toggle}
                dataType={data.sunlight}
                title='Sunlight'
              />
              <Graph
                toggle={toggle}
                dataType={data.windspeed}
                title='Windspeed'
              />
            </GraphContainer>
          </>
        ) : (
          <SliderContainer>
            <StyledSlider {...sliderSetting}>
              <Graph
                toggle={toggle}
                dataType={data.temperature}
                title='Temperature'
              />
              <Graph
                toggle={toggle}
                dataType={data.humidity}
                title='Humidity'
              />
              <Graph
                toggle={toggle}
                dataType={data.sunlight}
                title='Sunlight'
              />
              <Graph
                toggle={toggle}
                dataType={data.windspeed}
                title='Windspeed'
              />
            </StyledSlider>
          </SliderContainer>
        )}
      </GraphsSection>
      <LocationSection>
        <Title>Location</Title>
        <Map />
      </LocationSection>
      <Footer>© 2022. IIEEE in Purdue Univ. All rights reserved.</Footer>
    </Body>
  );
}

export default Home;

const Body = styled.body`
  padding: 0;
  margin: 0;
  background: #f1f1f1;
  height: 100%;
  overflow: hidden;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5vh 0;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    width: 90%;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 3vh 0;
  }
`;

const Logo = styled.img`
  height: 7vh;
  margin-left: 5%;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 4vh;
    margin: 3vh 0;
  }
`;

const GraphsSection = styled.section`
  float: left;
  width: 45%;
  margin-left: 5%;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    width: 90%;
    margin: 0;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-family: 'poppinsB';
  font-size: 25px;
  color: #515151;
  margin: 2vh 0 3.5vh 2vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 16px;
    margin: 1.5vh;
  }
`;

const SelectButton = styled.button`
  width: 7%;
  height: 4vh;
  margin-right: 2vh;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SelectButtonImage = styled.img`
  height: 4vh;
  border-radius: 50%;
  box-shadow: 1px 3px 6px rgba(142, 142, 142, 0.3);
`;

const GraphContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  margin-top: 1.4vh;
  height: 45%;
  overflow: hidden;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    flex-direction: column;
    justify-content: center;
    margin-top: 0;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSlider = styled(Slider)`
  width: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LocationSection = styled.section`
  float: left;
  width: 45%;
  padding-bottom: 3%;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    width: 90%;
    margin-top: 5vh;
  }
`;

const Footer = styled.footer`
  clear: both;
  width: 100%;
  padding: 4vh 0 4vh 0;
  background: #f4f4f4;
  font-family: 'poppinsL';
  font-size: 10px;
  text-align: center;
  color: #5e5e5e;
  @media screen and (max-width: 767px) and (orientation: portrait) {
  }
`;
