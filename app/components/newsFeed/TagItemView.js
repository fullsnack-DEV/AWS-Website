import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

function TagItemView({
  source,
  userName,
  userLocation,
  onItemPress,
  checkUncheckSource,
}) {
  return (
    <TouchableWithoutFeedback
      style={styles.mainContainerStyle}
      onPress={onItemPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={source} style={styles.imageStyle} resizeMode={'cover'} />
        <View style={styles.textViewStyle}>
          <Text style={styles.userNameTextStyle}>{userName}</Text>
          <Text style={styles.userLocationTextStyle}>{userLocation}</Text>
        </View>
      </View>
      <Image
        source={checkUncheckSource}
        style={styles.imageCheckBoxStyle}
        resizeMode={'cover'}
      />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  imageStyle: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
  },
  textViewStyle: {
    marginLeft: 12,
  },
  userNameTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  userLocationTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.userPostTimeColor,
    top: 2,
  },
  imageCheckBoxStyle: {
    height: 22,
    width: 22,
  },
});

export default TagItemView;
