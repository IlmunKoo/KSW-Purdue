import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Marker, Popup } from 'react-map-gl';
import moment from 'moment';
import Pin from './Pin';
import './map.css';

import temperatureImg from '../assets/temperature.png';
import humidityImg from '../assets/humidity.png';
import anemometerImg from '../assets/anemometer.png';
import pressureImg from '../assets/pressure.png';

import { getStationSensorOne, getStation } from '../apis/api';
import { kvToFh } from '../utils/utils';

const Markers = ({ id, lng, lat }) => {
  const [showPopup, setShowPopup] = useState(false);

  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [date, setDate] = useState(null);
  const [name, setName] = useState(null);

  const handleClickMark = (e) => {
    e.originalEvent.stopPropagation(); // If we let the click event propagates to the map, it will immediately close the popup
    setShowPopup(true);
  };

  //sensors value
  useEffect(() => {
    getStationSensorOne(id).then((data) => {
      if (data) {
        setTemperature(kvToFh(data.air.temperature));
        setHumidity(data.air.humidity.toFixed(0));
        setPressure((data.air.pressure / 10).toFixed(1));
        setWindSpeed(data.windSpeed.toFixed(0));
        const ago = moment(data.dateTime).fromNow();
        setDate(ago);
      }
    });
  }, [id]);

  useEffect(() => {
    getStation(id).then((data) => {
      if (data) {
        setName(data.name);
      }
    });
  });

  return (
    <>
      <Marker
        key={id}
        longitude={lng}
        latitude={lat}
        anchor='center'
        onClick={handleClickMark}
      >
        <Pin size={25} name={name} />
      </Marker>
      {showPopup && (
        <Popup
          longitude={lng}
          latitude={lat}
          anchor='bottom'
          onClose={() => setShowPopup(false)}
        >
          <Container>
            <Header>
              <Title>Farm Data</Title>
              <Time>{date}</Time>
            </Header>
            <Body>
              <DataWrapper>
                <DataContainer>
                  <Icon src={temperatureImg} alt='temperature icon'></Icon>
                  <Value>{temperature} Fº</Value>
                </DataContainer>
                <DataContainer>
                  <Icon src={humidityImg} alt='humidity icon'></Icon>
                  <Value>{humidity} %</Value>
                </DataContainer>
              </DataWrapper>
              <DataWrapper>
                <DataContainer>
                  <Icon src={pressureImg} alt='pressure icon'></Icon>
                  <Value>{pressure} ㎪</Value>
                </DataContainer>
                <DataContainer>
                  <Icon src={anemometerImg} alt='anemometer icon'></Icon>
                  <Value>{windSpeed} ㎧</Value>
                </DataContainer>
              </DataWrapper>
            </Body>
          </Container>
        </Popup>
      )}
    </>
  );
};

export default Markers;

const Container = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 2.5vh 2.5vh 1.5vh 2.5vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    padding: 1.8vh 1.8vh 1.3vh 1.8vh;
  }
`;

const Header = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #65b065;
  border-bottom: 1px solid #65b065;
  padding-bottom: 0.5vh;
  margin-bottom: 1.5vh;
`;

const Title = styled.div`
  font-family: 'poppinsB';
  font-size: 16px;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 15px;
  }
`;

const Time = styled.div`
  font-family: 'poppinsL';
  font-size: 11px;
  color: #b3b3b3;
  margin: 0 2vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 9px;
    margin: 0 1.4vh;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const DataContainer = styled.div`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5vh 1vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    margin: 1vh;
  }
`;

const Icon = styled.img`
  height: 3.5vh;
  margin-right: 1.5vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 2.9vh;
    margin-right: 1vh;
  }
`;

const Value = styled.span`
  font-family: 'poppinsSB';
  color: #727272;
  font-size: 18px;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 17px;
  }
`;
