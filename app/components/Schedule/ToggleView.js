import React from 'react';
import ToggleSwitch from 'toggle-switch-react-native';

function ToggleView({
  isOn, size, onToggle, onColor, offColor,
}) {
  return (
    <ToggleSwitch
        isOn={isOn}
        onColor={onColor}
        offColor={offColor}
        size={size}
        onToggle={onToggle}

    />
  );
}

export default ToggleView;
