// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

const ScreenHeader = ({
  leftIcon,
  sportIcon,
  showSportIcon = false,
  title,
  rightIcon1,
  rightIcon2,
  rightIcon3,
  loading = false,
  isRightIconText = false,
  isFullTitle = false,
  rightButtonText = '',
  onRightButtonPress = () => {},
  leftIconPress = () => {},
  rightIcon1Press = () => {},
  rightIcon2Press = () => {},
  rightIcon3Press = () => {},
  containerStyle = {},
  labelStyle = {},
  rightButtonTextStyle = {},
}) => (
  <View style={[styles.headerRow, containerStyle]}>
    <View style={{width: 80}}>
      {leftIcon ? (
        <TouchableOpacity style={styles.iconContainer} onPress={leftIconPress}>
          <Image source={leftIcon} style={styles.image} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>

    <View style={[styles.titleContainer, {flex: isFullTitle ? 0 : 1}]}>
      {sportIcon ? (
        <View style={styles.largeIconContainer}>
          <Image source={{uri: sportIcon}} style={styles.image} />
        </View>
      ) : (
        showSportIcon && (
          <View style={styles.largeIconContainer}>
            <Image source={images.accountMySports} style={styles.image} />
          </View>
        )
      )}

      <Text style={[styles.headerTitle, labelStyle]}>{title}</Text>
    </View>

    <View style={{width: 80}}>
      {isRightIconText ? (
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={onRightButtonPress}>
            {loading ? (
              <ActivityIndicator size={'small'} />
            ) : (
              <Text style={[styles.buttonText, rightButtonTextStyle]}>
                {rightButtonText}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {!isRightIconText ? (
        <View style={styles.rightButtonContainer}>
          {rightIcon1 ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={rightIcon1Press}>
              <Image source={rightIcon1} style={styles.image} />
            </TouchableOpacity>
          ) : null}

          {rightIcon2 ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={rightIcon2Press}>
              {loading ? (
                <ActivityIndicator size={'small'} />
              ) : (
                <Image source={rightIcon2} style={styles.image} />
              )}
            </TouchableOpacity>
          ) : null}
          {rightIcon3 ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={rightIcon3Press}>
              {loading ? (
                <ActivityIndicator size={'small'} />
              ) : (
                <Image source={rightIcon3} style={styles.image} />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  iconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
export default ScreenHeader;
