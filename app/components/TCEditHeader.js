import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import ImageButton from './WritePost/ImageButton';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
// import TCPopupMessage from './TCPopupMessage';

function TCEditHeader({
  title,
  iconImage,
  iconStyle,
  subTitle,
  containerStyle,
  textStyle,
  subTitleTextStyle,
  imageContainerStyle,
  imageStyle,
  onEditPress,
  onIconPress,
  onNextArrowPress,
  showNextArrow,
  showEditButton,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={[styles.textStyle, textStyle]}>{title}</Text>
        {/* <TCPopupMessage
              visible={true}
              message={'this tc warning message'}
              arrowFromLeft={85}
          /> */}
        {iconImage && (
          <ImageButton
            style={[
              {
                height: 32,
                width: 32,
              },
              iconStyle,
            ]}
            source={iconImage}
            onImagePress={onIconPress}
          />
        )}
        {subTitle && (
          <Text style={[styles.subTitleTextStyle, subTitleTextStyle]}>
            {subTitle}
          </Text>
        )}
        {showNextArrow && (
          <ImageButton
            source={images.nextArrow}
            style={{
              paddingTop: 2,
              width: 20,
              height: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            imageStyle={{width: 8, height: 13}}
            onImagePress={onNextArrowPress}
          />
        )}
      </View>
      {showEditButton && (
        <ImageButton
          source={images.editPencil}
          style={[styles.imageContainerStyle, imageContainerStyle]}
          imageStyle={[styles.imageStyle, imageStyle]}
          onImagePress={onEditPress}
        />
      )}
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
  subTitleTextStyle: {
    paddingLeft: 12,
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
  imageContainerStyle: {
    width: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  imageStyle: {
    height: 20,
    width: 18,
  },
});

export default memo(TCEditHeader);
