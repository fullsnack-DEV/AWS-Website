import React, {
  useEffect, useState, useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,

  SectionList,
  Dimensions,
} from 'react-native';

import SegmentedControlTab from 'react-native-segmented-control-tab';
import EventCalendar from 'react-native-events-calendar';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import images from '../../../Constants/ImagePath';

import TCEventView from '../../../components/TCEventView';
import colors from '../../../Constants/Colors'

export default function ScheduleScreen({ navigation }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { width } = Dimensions.get('window');
  const events = [
    {
      start: '2017-09-07 00:30:00',
      end: '2017-09-07 01:30:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-07 01:30:00',
      end: '2017-09-07 02:20:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-07 04:10:00',
      end: '2017-09-07 04:40:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-07 01:05:00',
      end: '2017-09-07 01:45:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-07 14:30:00',
      end: '2017-09-07 16:30:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-08 01:20:00',
      end: '2017-09-08 02:20:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-08 04:10:00',
      end: '2017-09-08 04:40:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-08 00:45:00',
      end: '2017-09-08 01:45:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-08 01:20:00',
      end: '2017-09-08 03:45:00',
      title: 'Dr. Kishan Makani',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-08 11:30:00',
      end: '2017-09-08 12:30:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-09 01:30:00',
      end: '2017-09-09 02:00:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-09 03:10:00',
      end: '2017-09-09 03:40:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-09 00:10:00',
      end: '2017-09-09 01:45:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => alert('This is a 3 dot button!') }>
          <Image source={ images.vertical3Dot } style={ styles.headerRightImg } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);
  useEffect(() => {});
  const handleIndexChange = (index) => {
    setSelectedIndex(index);
  };

  return (
    <View style={ styles.mainContainer }>
      <SegmentedControlTab
        values={ ['Events', 'Calendar'] }
        selectedIndex={ selectedIndex }
        onTabPress={ handleIndexChange }
        borderRadius={ 20 }
        tabsContainerStyle={ styles.segmentContainer }
        tabStyle={ styles.tab }
        activeTabStyle={ styles.activeTab }
        tabTextStyle={ styles.tabTextStyle }
        activeTabTextStyle={ styles.activeTabTextStyle }
      />
      {selectedIndex === 0 ? (
        <SectionList
          renderItem={ () => (
            // <Text key={index}>.{item}</Text>
            <TCEventView onPress={ () => navigation.navigate('GameDetail') } />
          ) }
          renderSectionHeader={ ({ section: { title } }) => (
            <Text style={ styles.sectionHeader }>{title}</Text>
          ) }
          sections={ [
            { title: 'TODAY', data: ['item1', 'item2', 'item7', 'item8'] },
            {
              title: 'TOMORROW',
              data: ['item3', 'item4', 'item9', 'item10', 'item11'],
            },
            { title: 'FUTURE', data: ['item5', 'item6', 'item12'] },
          ] }
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <EventCalendar
          eventTapped={ () => alert('Event tapped..') }
          // eventTapped={this._eventTapped.bind(this)}
          events={ events }
          width={ width }
          initDate={ '2017-09-08' }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    alignSelf: 'center',
    backgroundColor: colors.blueColor,
    borderColor: colors.blueColor,
    borderRadius: 20,
  },
  activeTabTextStyle: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    fontSize: wp('3.5%'),
    // fontFamily: fonts.RBold,
    color: colors.grayColor,
    paddingBottom: 8,
    marginBottom: 5,
    paddingLeft: 10,
    backgroundColor: colors.whiteColor,
  },
  segmentContainer: {
    alignSelf: 'center',
    borderColor: colors.lightBlueColor,
    borderRadius: 19,
    borderWidth: 1,
    height: 38,
    marginTop: hp('3%'),
    padding: 1,
    width: wp('50%'),
  },
  tab: {
    borderColor: colors.whiteColor,
    height: 32,
  },
  tabTextStyle: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RBold,
    color: colors.blueColor,
  },
});
