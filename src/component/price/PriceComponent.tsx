import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface PriceRangeComponentProps {
  minPrice: number;
  maxPrice: number;
  onValueChange: (minPrice: number, maxPrice: number) => void;
}
const PriceRangeComponent: React.FC<PriceRangeComponentProps> = ({ minPrice, maxPrice, onValueChange }) => {
  const [range, setRange] = useState<[number, number]>([minPrice, maxPrice]);

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setRange([value[0], value[1]]);
      onValueChange(value[0], value[1]); // Call the callback function
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <label>
        Price Range:
        <Slider
          range
          min={minPrice}
          max={maxPrice}
          step={1}
          defaultValue={range}
          onChange={handleSliderChange}
          value={range}
        />
      </label>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <label>
            Min Price: 
            <input
              type="number"
              value={range[0]}
              onChange={(e) => handleSliderChange([+e.target.value, range[1]])}
              step="1"
              min={minPrice}
              max={maxPrice}
              style={{ width: '100px', marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <label>
            Max Price:
            <input
              type="number"
              value={range[1]}
              onChange={(e) => handleSliderChange([range[0], +e.target.value])}
              step="1"
              min={minPrice}
              max={maxPrice}
              style={{ width: '100px', marginLeft: '10px' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeComponent;