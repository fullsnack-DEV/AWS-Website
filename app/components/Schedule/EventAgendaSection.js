import React from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';

export default function EventAgendaSection({
  items, onDayPress, loadItemsForMonth, renderItem,
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.SeapratorStyle} />
      <Agenda
                items={items}
                theme={{
                  agendaKnobColor: colors.lightgrayColor,
                  selectedDayBackgroundColor: colors.orangeColor,
                  todayTextColor: colors.orangeColor,
                }}
                refreshing={false}
                loadItemsForMonth={loadItemsForMonth}
                renderKnob={() => <Image source={images.dropDownArrow2} style={styles.imageStyle} resizeMode={'contain'} />}
                renderDay={() => {}}
                onDayPress={onDayPress}
                disabledByDefault={false}
                hideKnob={false}
                renderItem={renderItem}
                refreshControl={null}
                onCalendarToggled={() => {}}
              />
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 20,
    width: 20,
  },
  SeapratorStyle: {
    width: wp('100%'),
    height: 1,
    backgroundColor: colors.lightgrayColor,
  },
});
