import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import { postStation } from '../apis/api';

const AddStation = () => {
  const [eui, setEui] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [zipCode, setZipCode] = useState('');

  const [showMsg, setShowMsg] = useState(false);

  const onClickRegister = () => {
    if (
      eui === '' ||
      name === '' ||
      latitude === null ||
      longitude === null ||
      zipCode === ''
    ) {
      setShowMsg(true);
    } else {
      setShowMsg(false);
      const form = {
        eui: eui,
        name: name,
        latitude: latitude,
        longitude: longitude,
        zipCode: zipCode,
      };
      postStation(form).then((data) => {
        //data 유효성 판단?
        setEui('');
        setName('');
        setLatitude(null);
        setLongitude(null);
        setZipCode('');
        alert('Have been registered');
      });
    }
  };

  return (
    <Container>
      <Header>
        <Link to='/'>
          <Logo src={logo} alt='logo' />
        </Link>
      </Header>
      <Body>
        <Title>Register Station</Title>
        {showMsg && <Msg>* Please fill in all blanks</Msg>}
        <Input
          placeholder='EUI'
          name='eui'
          type='text'
          onChange={(e) => setEui(e.target.value)}
        />
        <Input
          placeholder='NAME'
          name='name'
          type='text'
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder='LATITUDE'
          name='latitude'
          type='text'
          onChange={(e) => setLatitude(e.target.value)}
        />
        <Input
          placeholder='LONGITUDE'
          name='longitude'
          type='text'
          onChange={(e) => setLongitude(e.target.value)}
        />
        <Input
          placeholder='ZIPCODE'
          name='zipcode'
          type='text'
          onChange={(e) => setZipCode(e.target.value)}
        />
        <BtnContainer>
          <Btn onClick={onClickRegister}>Register</Btn>
        </BtnContainer>
      </Body>
    </Container>
  );
};

export default AddStation;

const Container = styled.div`
  padding: 0;
  margin: 0;
  background: #f1f1f1;
  height: 100vh;
  overflow: hidden;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;

const Header = styled.header`
  width: 100%;
  padding: 6vh 0 4.5vh 0;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3vh 0;
  }
`;

const Logo = styled.img`
  height: 7vh;
  margin-left: 5%;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 5vh;
    margin: 3.2vh 0;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin: 0 auto;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    width: 75%;
  }
`;

const Title = styled.div`
  font-family: 'poppinsB';
  font-size: 25px;
  color: #515151;
  margin: 2vh 0 3.5vh 1vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 16px;
    margin: 2vh 0 2vh 1vh;
  }
`;

const Msg = styled.div`
  font-family: 'poppinsR';
  color: #e62243;
  font-size: 14px;
  text-align: right;
  margin: 0.5vh 2vh 1.7vh 0;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    margin: 0.5vh 1.6vh 1vh 0;
    font-size: 12px;
  }
`;

const Input = styled.input`
  padding: 2.2vh;
  font-family: 'poppinsM';
  font-size: 13px;
  margin: 1vh 0;
  border-radius: 15px;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 11px;
    padding: 1.5vh;
    margin: 0.6vh 0;
    border-radius: 10px;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: right;
`;

const Btn = styled.button`
  font-family: 'poppinsSB';
  font-size: 14px;
  padding: 1.8vh;
  color: #ffffff;
  background-color: #65b065;
  border: transparent;
  margin-top: 2vh;
  border-radius: 15px;
  width: 28%;
  cursor: pointer;
  box-shadow: 1px 3px 6px rgba(142, 142, 142, 0.3);
  &:hover {
    background-color: #5ba35b;
  }
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 12px;
    border-radius: 10px;
    padding: 1.2vh;
    width: 42%;
    margin-top: 1.1vh;
  }
`;
