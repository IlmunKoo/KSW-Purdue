import React from 'react';
import Map from 'react-map-gl';
import Markers from './Markers';

const MapComponent = ({ lng, lat, zoom, markers }) => {
  return (
    <Map
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: zoom,
      }}
      style={
        matchMedia('screen and (max-width: 767px) and (orientation: portrait)')
          .matches
          ? containerStyleR
          : containerStyle
      }
      mapStyle='mapbox://styles/mapbox/streets-v9'
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
    >
      {markers &&
        markers.map((m) => (
          <Markers
            key={m.id}
            id={m.id}
            lng={m.position.lng}
            lat={m.position.lat}
          />
        ))}
    </Map>
  );
};

export default MapComponent;

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
