import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import fonts from '../../Constants/Fonts';

function EventItemRender({ title, children }) {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.headerTextStyle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
  },
  headerTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginVertical: 3,
  },
});

export default EventItemRender;
