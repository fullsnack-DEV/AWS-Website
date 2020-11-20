import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import ImageButton from './WritePost/ImageButton'
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'
import images from '../Constants/ImagePath'

function TCEditHeader({
  title,
  containerStyle,
  textStyle,
  imageContainerStyle,
  imageStyle,
  onEditPress,
  onNextArrowPress,
  showNextArrow,
  showEditButton,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.textStyle, textStyle]}>{title}</Text>
        {showNextArrow && <ImageButton source={images.nextArrow}
        style={{
          paddingTop: 2,
          width: 20,
          height: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      imageStyle={ { width: 8, height: 13 }}
      onImagePress={onNextArrowPress}/>
      }
      </View>
      {showEditButton
      && <ImageButton source={images.editButton}
      style={[styles.imageContainerStyle, imageContainerStyle]}
      imageStyle={ [styles.imageStyle, imageStyle]}
      onImagePress={onEditPress}/>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 0,
  },
  textStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  imageContainerStyle: {
    width: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  imageStyle: {
    height: 11, width: 11,
  },
});

export default TCEditHeader;
