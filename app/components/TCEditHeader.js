import React, {memo} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';

import ImageButton from './WritePost/ImageButton';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import {strings} from '../../Localization/translation';
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
  showSeeAll,
  textButtonStyle,
  onSeeAll = () => {},
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={styles.row}>
        <Text style={[styles.textStyle, textStyle]}>{title.toUpperCase()}</Text>
        {subTitle && (
          <Text style={[styles.subTitleTextStyle, subTitleTextStyle]}>
            {subTitle}
          </Text>
        )}
      </View>
      <View style={styles.row}>
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
        {showSeeAll && (
          <Pressable
            onPress={onSeeAll}
            style={[showEditButton ? {marginRight: 15} : {}, textButtonStyle]}>
            <Text style={styles.buttonText}>{strings.seeAllText}</Text>
          </Pressable>
        )}
        {showEditButton && (
          <ImageButton
            source={images.editPencil}
            style={[styles.imageContainerStyle, imageContainerStyle]}
            imageStyle={[styles.imageStyle, imageStyle]}
            onImagePress={onEditPress}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
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
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    textAlign: 'right',
    color: colors.themeColor,
  },
});

export default memo(TCEditHeader);
