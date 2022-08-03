import React from 'react';
import Tooltip from 'rc-tooltip';
import Slider, { Range } from 'rc-slider';
import { rangeMinMax } from '../assets/data/rangeMinMax';
import './slider.css';

const Handle = Slider.Handle;

const handle = (props) => {
  const { value, index, ...restProps } = props;

  return (
    <Tooltip
      prefixCls='rc-slider-tooltip'
      overlay={value}
      visible
      placement='top'
      key={index}
      overlayStyle={{
        zIndex: 9999,
        fontFamily: 'poppinsR',
      }}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const Sliders = ({ range, setRange, title }) => {
  const onSliderChange = (val) => {
    const value = { lower: val[0], upper: val[1] };
    setRange(value);
  };

  const min = rangeMinMax[title].min;
  const max = rangeMinMax[title].max;
  const marks = {
    [min]: {
      label: min,
      style: {
        fontFamily: 'poppinsR',
      },
    },
    [max]: {
      label: max,
      style: {
        fontFamily: 'poppinsR',
      },
    },
  };

  return (
    <Range
      allowCross={false}
      min={min}
      max={max}
      defaultValue={[range.lower, range.upper]}
      value={[range.lower, range.upper]}
      marks={marks}
      handle={handle}
      onChange={onSliderChange}
    />
  );
};

export default Sliders;
