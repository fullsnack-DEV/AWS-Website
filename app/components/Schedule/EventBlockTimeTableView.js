import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventBlockTimeTableView({blockText, blockZoneTime}) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.blockZoneView}>
        <Text style={styles.blockedZoneText}>{blockText}</Text>
      </View>
      <Text style={[styles.blockZoneTimeStyle, {fontSize: 16}]}>
        {blockZoneTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('92%'),
    backgroundColor: colors.whiteColor,
    alignSelf: 'center',
    flexDirection: 'row',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 5,
    borderRadius: 8,
  },
  blockZoneView: {
    width: wp('35%'),
    backgroundColor: colors.blocklightgraycolor,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  blockedZoneText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.blockZoneText,
  },
  blockZoneTimeStyle: {
    width: wp('57%'),
    paddingVertical: 8,
    textAlign: 'center',
    borderRadius: 8,
    color: colors.blockZoneText,
  },
});

export default EventBlockTimeTableView;
