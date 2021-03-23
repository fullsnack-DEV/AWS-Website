import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Agenda, LocaleConfig, calendarTheme } from 'react-native-calendars';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

LocaleConfig.locales[LocaleConfig.defaultLocale].dayNamesShort = [
  'Su',
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
];
export default function EventAgendaSection({ items, onDayPress, renderItem }) {
  return (
    <Agenda
      items={items}
      minDate={new Date()}
      theme={{
        ...calendarTheme,
        agendaKnobColor: colors.lightgrayColor,
        selectedDayBackgroundColor: colors.orangeColor,
        todayTextColor: colors.orangeColor,
        textSectionTitleColor: colors.googleColor,
        textDayHeaderFontFamily: fonts.RBold,
        textDayHeaderFontSize: 12,
      }}
      refreshing={false}
      rowHasChanged={(r1, r2) => r1.text !== r2.text}
      renderKnob={() => (
        <Image
          source={images.dropDownArrow2}
          style={styles.imageStyle}
          resizeMode={'contain'}
        />
      )}
      renderDay={() => {}}
      // horizontal={true}
      scrollEnabled
      onDayPress={onDayPress}
      disabledByDefault={false}
      hideKnob={false}
      renderItem={renderItem}
      refreshControl={null}
      onCalendarToggled={() => {}}
    />
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 20,
    width: 20,
  },
  // SeapratorStyle: {
  //   width: wp('100%'),
  //   height: 1,
  //   backgroundColor: colors.lightgrayColor,
  // },
});
