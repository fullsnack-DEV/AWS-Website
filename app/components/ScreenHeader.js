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
  loading = false,
  isRightIconText = false,
  rightButtonText = '',
  onRightButtonPress = () => {},
  leftIconPress = () => {},
  rightIcon1Press = () => {},
  rightIcon2Press = () => {},
  containerStyle = {},
  labelStyle = {},
}) => (
  <View style={[styles.headerRow, containerStyle]}>
    {leftIcon ? (
      <TouchableOpacity style={styles.iconContainer} onPress={leftIconPress}>
        <Image source={leftIcon} style={styles.image} />
      </TouchableOpacity>
    ) : (
      <View />
    )}

    <View style={styles.titleContainer}>
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

      <Text style={[styles.headerTitle, labelStyle]} numberOfLines={1}>
        {title}
      </Text>
    </View>

    {isRightIconText ? (
      <View style={{alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={onRightButtonPress}>
          {loading ? (
            <ActivityIndicator size={'small'} />
          ) : (
            <Text style={styles.buttonText}>{rightButtonText}</Text>
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
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 16,
    paddingBottom: 4,
    paddingTop: 10,
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
    flex: 1,
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
