import React from 'react';
import PropTypes from 'prop-types';

function Dropdown({ label, options }) {
  return (
    <div>
      <label>{label}: </label>
      <select>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Dropdown;
