import React from 'react';
import {
  StyleSheet, Text,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function SearchLocationTextView({
  value, onItemPress,
}) {
  return (
    <TouchableWithoutFeedback style={styles.containerStyle} onPress={onItemPress}>
      <Text style={styles.textStyle}>{value}</Text>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
  },
  textStyle: {
    backgroundColor: colors.offwhite,
    borderColor: colors.offwhite,
    borderRadius: 5,
    borderWidth: 1,
    color: colors.lightBlackColor,
    padding: 10,
    marginTop: 10,
    elevation: 3,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 0.8,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    maxHeight: hp('12%'),
  },
});

export default SearchLocationTextView;
