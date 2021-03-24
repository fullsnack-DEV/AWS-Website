import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function CalendarTimeTableView({
  containerStyle, eventTitleStyle, title, summary, onPress,
}) {
  return (

    <TouchableOpacity style={[styles.containerStyle, containerStyle]} onPress={onPress}>
      <View style={styles.eventViewStyle}>
        <Text style={[styles.eventTitleStyle, eventTitleStyle]}>{summary}</Text>
        <Text style={styles.eventSummaryStyle}>{title}</Text>
      </View>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    flex: 1,
    borderLeftWidth: 8,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  eventViewStyle: {
    marginLeft: 8,
    marginTop: 5,
  },
  eventTitleStyle: {
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
  eventSummaryStyle: {
    color: colors.lightBlackColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
    top: 4,
  },
});
