import React, {useCallback} from 'react';
import {View} from 'react-native';
import Slider from 'rn-range-slider';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';

const TCSlider = ({
  selectedTrackColors = [colors.yellowColor, colors.themeColor],
  trackColor = colors.grayBackgroundColor,
  setValue,
  value = 0,
}) => {
  const renderThumb = useCallback(
    () => (
      <FastImage source={images.thumbImage} style={{height: 20, width: 20}} />
    ),
    [],
  );

  const handleValueChange = useCallback(
    (low) => setValue(low),
    [selectedTrackColors],
  );

  const renderRail = useCallback(
    () => (
      <View
        style={{
          flex: 1,
          height: 5,
          borderRadius: 5,
          backgroundColor: trackColor,
        }}
      />
    ),
    [trackColor],
  );

  const renderRailSelected = useCallback(
    () => (
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={selectedTrackColors}
        style={{
          height: 5,
          borderRadius: 5,
          backgroundColor: colors.redDelColor,
        }}
      />
    ),
    [selectedTrackColors],
  );
  return (
    <Slider
      low={value}
      disableRange
      min={0}
      max={5}
      step={1}
      style={{marginVertical: 2, paddingVertical: 8}}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      onValueChanged={handleValueChange}
    />
  );
};

export default TCSlider;
