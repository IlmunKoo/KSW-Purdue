import React from 'react';
import styled from 'styled-components';
import Slider from './Slider';
import cancel from '../assets/cancel.png';
import { rangeMinMax } from '../assets/data/rangeMinMax';

const Setting = ({ open, isOpen, title, range, setRange, rangeVal }) => {
  const onCancelClick = () => {
    isOpen(!open);
    if (
      rangeVal[0] === rangeMinMax[title].min &&
      rangeVal[1] === rangeMinMax[title].min
    ) {
      setRange({
        lower: rangeMinMax[title].min,
        upper: rangeMinMax[title].min,
      });
    } else {
      setRange({ lower: rangeVal[0], upper: rangeVal[1] });
    }
  };

  const onOkClick = () => {
    isOpen(!open);
    const rangeList = JSON.stringify([range.lower, range.upper]);
    window.localStorage.setItem(title, rangeList);
  };

  return (
    <Container>
      <ModalContainer>
        <Header>
          <Title>Setting</Title>
          <XButton type='button' onClick={onCancelClick}>
            <XButtonImage src={cancel} alt='cancel button' />
          </XButton>
        </Header>
        <SliderContainer>
          <Slider
            range={range}
            setRange={setRange}
            rangeVal={rangeVal}
            title={title}
          />
        </SliderContainer>
        <ButtonContainer>
          <CancelButton onClick={onCancelClick}>CANCEL</CancelButton>
          <OkButton onClick={onOkClick}>OK</OkButton>
        </ButtonContainer>
      </ModalContainer>
    </Container>
  );
};

export default Setting;

const Container = styled.div`
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
`;

const ModalContainer = styled.div`
  width: 85%;
  height: fit-content;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 1px 3px 6px rgba(142, 142, 142, 0.16);
  position: absolute;
  top: 0;
  left: 50;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    width: 70%;
    border-radius: 8px;
  }
`;

const Header = styled.div`
  width: 100%;
  padding: 4.5% 0;
  background-color: #65b065;
  color: white;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    border-radius: 8px 8px 0 0;
  }
`;

const Title = styled.div`
  font-family: 'poppinsSB';
  font-size: 14px;
  margin-left: 5%;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 13px;
  }
`;

const XButton = styled.button`
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  width: 7%;
  height: 1.5vh;
  margin-right: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 1.2vh;
  }
`;

const XButtonImage = styled.img`
  height: 1.5vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 1.2vh;
  }
`;

const SliderContainer = styled.div`
  margin: 0 10%;
  padding: 22% 0 4% 0;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    margin: 0.5vh 10%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 4% 6%;
  margin-top: 2vh;
`;

const CancelButton = styled.button`
  background: transparent;
  outline: none;
  border: none;
  font-family: 'poppinsM';
  font-size: 12px;
  margin: 0 2vh;
  color: #b4b4b4;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 12px;
    margin: 0 1.2vh;
  }
`;

const OkButton = styled.button`
  background: transparent;
  outline: none;
  border: none;
  font-family: 'poppinsSB';
  font-size: 12px;
  color: #65b065;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 12px;
  }
`;
