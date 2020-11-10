import React from 'react';
import {
  StyleSheet,
  View,
  Text,

} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

export default function UnavailableTimeView() {
  return (
    <View style={{ marginLeft: 15, marginRight: 15 }}>
      <View style={styles.fieldView}>
        <View style={{
          backgroundColor: colors.lightgrayColor, flex: 0.4, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 5,
        }}>
          <Text style={styles.fieldTitle} numberOfLines={1}>Unavailable time</Text>
        </View>
        <View style={{ flex: 0.6 }}>
          <Text style={styles.fieldValue} numberOfLines={3} >12:00am - 02:00am</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  fieldView: {
    flexDirection: 'row',
    marginTop: 10,
    height: 25,
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
  },
  fieldTitle: {
    fontSize: 14,
    color: '#8c8c8c',
    fontFamily: fonts.RRegular,
    backgroundColor: '#e2e2e2',
  },
  fieldValue: {
    fontSize: 16,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
});
