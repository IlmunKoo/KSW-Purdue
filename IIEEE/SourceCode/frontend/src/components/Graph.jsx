import React, { useState } from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import Setting from './Setting';
import setting from '../assets/settings.png';
import { rangeMinMax } from '../assets/data/rangeMinMax';

const Graph = ({ toggle, title, data }) => {
  const rangeData = window.localStorage.getItem(title);
  const rangeVal = JSON.parse(rangeData) || [
    rangeMinMax[title].min,
    rangeMinMax[title].min,
  ];
  const [range, setRange] = useState({
    lower: rangeVal[0],
    upper: rangeVal[1],
  });

  const [open, setOpen] = useState(false);
  const isOpen = (open) => {
    setOpen(open);
  };

  const property = {
    series: [
      {
        name: title,
        data: data,
      },
    ],
    options: {
      annotations: {
        yaxis: [
          {
            y: rangeVal[0],
            y2: rangeVal[1],
            fillColor: '#6bcbff',
            opacity: 0.15,
          },
        ],
      },
      chart: {
        type: 'line',
        stacked: false,
        foreColor: '#a8a8a8',
        fontFamily: 'poppinsM',
        parentHeightOffset: 0,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
          zoomedArea: {
            fill: {
              color: '#65B065',
              opacity: 0.15,
            },
            stroke: {
              opacity: 0,
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
      legend: {
        position: 'bottom',
      },
      colors: ['#65B065'],
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent'],
        },
      },
      responsive: [
        {
          breakpoint: 1174,
          options: {
            chart: {
              width: '100%',
              parentHeightOffset: 0,
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              height: '160',
              parentHeightOffset: 0,
            },
          },
        },
      ],
      xaxis: {
        type: 'datetime',
      },
    },
    yaxis: {
      formatter: function (data) {
        return (data / 100000000).toFixed(0);
      },
    },
  };

  return (
    <Container>
      <TitleContainer>
        <DataTitle>{title}</DataTitle>
        <SettingButton type='button' onClick={() => setOpen(true)}>
          <SettingButtonImage src={setting} alt='setting button' />
        </SettingButton>
      </TitleContainer>
      {open && (
        <Setting
          open={open}
          isOpen={isOpen}
          range={range}
          setRange={setRange}
          title={title}
          rangeVal={rangeVal}
        />
      )}
      <GraphContainer>
        <ReactApexChart
          options={property.options}
          series={property.series}
          type='line'
          height={toggle ? 150 : 320}
          width={toggle ? '100%' : 410}
        />
      </GraphContainer>
    </Container>
  );
};

export default Graph;

const Container = styled.div`
  width: 93%;
  height: fit-content;
  margin: 0 auto;
  padding: 1vh 2vh;
  overflow: hidden;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    padding: 1vh;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    margin: 1.2vh 0;
  }
`;

const DataTitle = styled.div`
  font-family: 'poppinsSB';
  font-size: 14px;
  color: #5f5f5f;
  margin-left: 1vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    font-size: 13px;
    margin-left: 0.5vh;
  }
`;

const SettingButton = styled.button`
  width: 7%;
  height: 2.5vh;
  margin-right: 1vh;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 1.8vh;
    margin-right: 0.5vh;
  }
`;

const SettingButtonImage = styled.img`
  height: 2.5vh;
  @media screen and (max-width: 767px) and (orientation: portrait) {
    height: 1.8vh;
  }
`;

const GraphContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  background: #ffffff;
  padding-top: 1vh;
  border-radius: 15px;
  box-shadow: 1px 3px 6px #8e8e8e29;
`;
