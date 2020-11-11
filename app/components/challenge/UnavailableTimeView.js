import React from 'react';
import {
  StyleSheet,
  View,
  Text,

} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

export default function UnavailableTimeView({ startDate, endDate }) {
  return (
    <View style={{ marginLeft: 15, marginRight: 15 }}>
      <View style={styles.fieldView}>
        <View style={{
          backgroundColor: colors.lightgrayColor, flex: 0.4, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 5,
        }}>
          <Text style={styles.fieldTitle} numberOfLines={1}>Blocked zone</Text>
        </View>
        <View style={{ flex: 0.6 }}>
          <Text style={styles.fieldValue} numberOfLines={3} >{`${new Date(startDate * 1000).getHours()}:${new Date(startDate * 1000).getMinutes()} - ${new Date(endDate * 1000).getHours()}:${new Date(endDate * 1000).getMinutes()}`}</Text>
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
