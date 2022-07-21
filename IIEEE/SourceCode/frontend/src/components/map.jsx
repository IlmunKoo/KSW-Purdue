import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
} from '@react-google-maps/api';
import styled from 'styled-components';
import './map.css';
import temperature from '../assets/temperature.png';
import humidity from '../assets/humidity.png';
import anemometer from '../assets/anemometer.png';
import uv from '../assets/uv.png';

import { useSelector } from 'react-redux';
import { getStation } from '../apis/api';

// test data
const containerStyle = {
  width: '97%',
  height: '66vh',
  borderRadius: '15px',
  margin: '3vh',
  boxShadow: '1px 3px 6px #8e8e8e29',
};

const containerStyleR = {
  width: '90%',
  height: '45vh',
  margin: '4vh auto',
  borderRadius: '15px',
  boxShadow: '1px 3px 6px #8e8e8e29',
};

const markers = [
  {
    id: 1,
    name: 'Chicago, Illinois',
    position: { lat: 41.881832, lng: -87.623177 },
  },
  {
    id: 2,
    name: 'Denver, Colorado',
    position: { lat: 39.739235, lng: -104.99025 },
  },
  {
    id: 3,
    name: 'Los Angeles, California',
    position: { lat: 34.052235, lng: -118.243683 },
  },
  {
    id: 4,
    name: 'New York, New York',
    position: { lat: 40.712776, lng: -74.005974 },
  },
  {
    id: 5,
    name: 'K-SW',
    position: { lat: 40.4260992, lng: -86.9096536 },
  },
];

const Map = () => {
  //update information by user select
  const stationId = useSelector(({ station }) => station.id);
  // const [markers, setMarkers] = useState([]);

  // Get current location
  const centerRef = useRef({ lat: null, lng: null });
  const [isGeoLoaded, setIsGeoLoaded] = useState(false);

  const handleGeoSuccess = (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const coordsObj = {
      lat,
      lng,
    };
    centerRef.current = coordsObj;
    setIsGeoLoaded(true);
  };
  const handleGeoError = (err) => {
    console.log(err);
  };

  useEffect(() => {
    const getGeoLoc = () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(
          handleGeoSuccess,
          handleGeoError
        );
      }
    };
    getGeoLoc();
  }, []);

  useEffect(() => {
    //위치 업데이트
    if (stationId) {
      getStation(stationId).then((data) => {
        const coordsObj = {
          lat: data.location.latitude,
          lng: data.location.longitude,
        };
        centerRef.current = coordsObj;

        console.log(data);
      });
    }
  }, [stationId]);

  // Googl Map API
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(centerRef.current);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  return isLoaded ? (
    isGeoLoaded ? (
      <GoogleMap
        mapContainerStyle={
          matchMedia(
            'screen and (max-width: 767px) and (orientation: portrait)'
          ).matches
            ? containerStyleR
            : containerStyle
        }
        center={centerRef.current}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={() => setActiveMarker(null)}
      >
        {markers &&
          markers.map(({ id, name, position }) => (
            <Marker
              key={id}
              position={position}
              onMouseOver={() => handleActiveMarker(id)}
            >
              {activeMarker === id && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <Container>
                    <Header>
                      <Title>Farm Data</Title>
                      <Time>2 min ago</Time>
                    </Header>
                    <Body>
                      <DataContainer>
                        <Icon src={temperature} alt='temperature icon'></Icon>
                        <Value>67 Fº</Value>
                      </DataContainer>
                      <DataContainer>
                        <Icon src={humidity} alt='humidity icon'></Icon>
                        <Value>83 %</Value>
                      </DataContainer>
                      <DataContainer>
                        <Icon src={anemometer} alt='anemometer icon'></Icon>
                        <Value>20 ㎧</Value>
                      </DataContainer>
                      <DataContainer>
                        <Icon src={uv} alt='uv icon'></Icon>
                        <Value>67 Fº</Value>
                      </DataContainer>
                    </Body>
                  </Container>
                </InfoWindow>
              )}
            </Marker>
          ))}
      </GoogleMap>
    ) : (
      <>Looking for your location...</>
    )
  ) : (
    <></>
  );
};

export default Map;

const Container = styled.div`
  width: 170px;
  height: 100px;
  padding: 0;
  padding: 2vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    width: 120px;
    height: 80px;
    padding: 1vh;
  }
`;

const Header = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #65b065;
  border-bottom: 1px solid #65b065;
  @media screen and (max-width: 767px) and (orientation: portrait) {
  }
`;

const Title = styled.div`
  font-family: 'poppinsB';
  font-size: 14px;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 12px;
  }
`;

const Time = styled.div`
  font-family: 'poppinsL';
  font-size: 6px;
  color: #d1d1d1;
  margin-right: 2vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 3px;
    margin-right: 0;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  height: 80%;
`;

const DataContainer = styled.div`
  padding-top: 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    padding-top: 0.3vh;
  }
`;

const Icon = styled.img`
  height: 3.4vh;
  margin-right: 1vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 2vh;
    margin-right: 0.6vh;
  }
`;

const Value = styled.span`
  font-family: 'poppinsSB';
  color: #727272;
  font-size: 16px;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 13px;
  }
`;
