import React, { useState } from 'react';
import styled from 'styled-components';
import cancel from '../assets/cancel.png';
import Slider from './Slider';

function Setting({ open, getState, dataType, range, setRange, rangeVal }) {
  const onClick = () => {
    getState(!open);
  };
  const onOkClick = () => {
    getState(!open);
    const rangeList = [range.lower, range.upper];
    const rangeListStr = JSON.stringify(rangeList);
    window.localStorage.setItem(dataType.name, rangeListStr);
  };

  return (
    <>
      {open && (
        <Container>
          <ModalContainer>
            <Header>
              <Title>Setting</Title>
              <XButton type='button' onClick={onClick}>
                <XButtonImage src={cancel} alt='cancel button'></XButtonImage>
              </XButton>
            </Header>
            <Content>Range</Content>
            <SliderContainer>
              <Slider range={range} setRange={setRange} rangeVal={rangeVal} />
            </SliderContainer>
            <ButtonContainer>
              <CancelButton onClick={onClick}>CANCEL</CancelButton>
              <OkButton onClick={onOkClick}>OK</OkButton>
            </ButtonContainer>
          </ModalContainer>
        </Container>
      )}
    </>
  );
}

export default Setting;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 28%;
  height: fit-content;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 1px 3px 6px rgba(142, 142, 142, 0.16);
  position: relative;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    width: 55%;
    border-radius: 8px;
  }
`;

const Header = styled.div`
  width: 100%;
  padding: 5% 0;
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
  font-size: 17px;
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
  height: 1.8vh;
  margin-right: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 1.3vh;
  }
`;

const XButtonImage = styled.img`
  height: 1.8vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 1.3vh;
  }
`;

const Content = styled.div`
  font-family: 'poppinsM';
  font-size: 13px;
  color: #717171;
  padding: 3vh;
  margin-bottom: 5%;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 10px;
    padding: 2.5vh;
    margin-bottom: 10%;
  }
`;

const SliderContainer = styled.div`
  margin: 0 10%;
  padding: 4% 0;
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
  font-size: 14px;
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
  font-size: 14px;
  color: #65b065;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 12px;
  }
`;
