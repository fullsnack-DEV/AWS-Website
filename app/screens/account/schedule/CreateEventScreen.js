import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../../components/Home/Header';
import EventColorItem from '../../../components/Schedule/EventColorItem';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
import EventTextInputItem from '../../../components/Schedule/EventTextInputItem';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import ToggleView from '../../../components/Schedule/ToggleView';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

const eventColorsData = [
  {
    id: 0,
    color: colors.themeColor,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.yellowColor,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.greeColor,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.eventBlueColor,
    isSelected: false,
  },
];

export default function CreateEventScreen({ navigation }) {
  const [eventColors, setEventColors] = useState(eventColorsData);
  const [toggle, setToggle] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('Weekly');

  return (
    <SafeAreaView style={ styles.mainContainerStyle }>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Event</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
      <ScrollView>
        <EventTextInputItem
          title={strings.title}
          placeholder={strings.titlePlaceholder}
          onChangeText={() => {}}
          value={strings.createTitleValue}
        />
        <EventTextInputItem
          title={strings.about}
          placeholder={strings.aboutPlaceholder}
          onChangeText={() => {}}
          multiline={true}
          value={strings.createAboutValue}
        />
        <EventItemRender
          title={strings.eventColorTitle}
        >
          <FlatList
            data={eventColors}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{ width: wp('3%') }} />}
            ListFooterComponent={() => <EventColorItem
              eventColorViewStyle={{ marginLeft: wp('3%') }}
              source={images.plus}
            />}
            renderItem={ ({ item, index }) => <EventColorItem
              source={item.isSelected ? images.check : null}
              imageStyle={{ tintColor: colors.whiteColor }}
              onItemPress={() => {
                eventColors[index].isSelected = !eventColors[index].isSelected;
                setEventColors([...eventColors]);
              }}
              eventColorViewStyle={{ backgroundColor: item.color, borderWidth: item.isSelected ? 2 : 0, borderColor: colors.whiteColor }}
            /> }
            keyExtractor={ (item, index) => index.toString() }
        />
        </EventItemRender>

        <EventItemRender
          title={strings.timeTitle}
        >
          <View style={styles.toggleViewStyle}>
            <Text style={styles.allDayText}>{strings.allDay}</Text>
            <ToggleView
              isOn={toggle}
              onColor={colors.toggleOnColor}
              offColor={colors.userPostTimeColor}
              size={'medium'}
              onToggle={(isOn) => setToggle(isOn)}
            />
          </View>
          <EventTimeSelectItem
            title={strings.starts}
            date={strings.date}
            time={strings.time}
          />
          <EventTimeSelectItem
            title={strings.ends}
            date={strings.date}
            time={strings.time}
            containerStyle={{ marginBottom: 12 }}
          />
          <EventMonthlySelection
            dataSource={[
              { label: 'Weekly', value: 'Weekly' },
              { label: 'Monthly', value: 'Monthly' },
            ]}
            value={selectWeekMonth}
            onValueChange={(value) => {
              setSelectWeekMonth(value);
            }}
          />
        </EventItemRender>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  toggleViewStyle: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    paddingVertical: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  allDayText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
