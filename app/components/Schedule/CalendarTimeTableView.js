import React from 'react';
import {
 View, StyleSheet, Text, Image,
 } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function CalendarTimeTableView({
  containerStyle,
  onPress,
  eventObj,
  type,
}) {
  return (
    <TouchableOpacity
      style={[styles.containerStyle, containerStyle]}
      onPress={onPress}>
      <View style={styles.eventViewStyle}>
        {type === 'game' && <Text style={styles.vsText}>VS</Text>}
        {type === 'game' && <Image
          source={eventObj?.game?.home_team?.thumbnail ? { uri: eventObj?.game?.home_team?.thumbnail } : images.profilePlaceHolder}
          style={{ height: 20, width: 20, borderRadius: 40 }}
          resizeMode={'contain'}
        />}
        {type === 'event' && <Text numberOfLines={1} style={styles.eventSummaryStyle}>{eventObj?.title}</Text>}
        {type === 'game' && <Text numberOfLines={1} style={styles.eventSummaryStyle}>{eventObj?.game?.home_team?.group_name || eventObj?.game?.home_team?.full_name}</Text>}
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
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eventSummaryStyle: {
    color: colors.lightBlackColor,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    marginLeft: 8,
    marginTop: 2,

  },
  vsText: {
    color: colors.themeColor,
    fontSize: 10,
    fontFamily: fonts.RBold,
    marginRight: 8,
    alignSelf: 'center',
  },
});
