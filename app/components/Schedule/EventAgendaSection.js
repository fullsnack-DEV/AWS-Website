import React from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function EventAgendaSection({
  items, onDayPress, loadItemsForMonth, renderItem,
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.SeapratorStyle} />
      <Agenda
                items={items}
                minDate={new Date()}
                theme={{
                  agendaKnobColor: colors.lightgrayColor,
                  selectedDayBackgroundColor: colors.orangeColor,
                  todayTextColor: colors.orangeColor,
                  textSectionTitleColor: colors.googleColor,
                  textDayHeaderFontFamily: fonts.RBold,
                  textDayHeaderFontSize: 12,
                }}
                refreshing={false}
                loadItemsForMonth={loadItemsForMonth}
                rowHasChanged={(r1, r2) => r1.text !== r2.text }
                renderKnob={() => <Image source={images.dropDownArrow2} style={styles.imageStyle} resizeMode={'contain'} />}
                renderDay={() => {}}
                scrollEnabled
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
