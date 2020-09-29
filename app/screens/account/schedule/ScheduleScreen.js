import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SectionList,
  Dimensions,
} from 'react-native';

import SegmentedControlTab from 'react-native-segmented-control-tab';
import EventCalendar from 'react-native-events-calendar';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

import AsyncStorage from '@react-native-community/async-storage';
import ActionSheet from 'react-native-actionsheet';

import {
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import AuthContext from '../../../auth/context';
import TCEventView from '../../../components/TCEventView';

export default function ScheduleScreen({navigation, route}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const authContext = useContext(AuthContext);

  let {width} = Dimensions.get('window');
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
          onPress={() => alert('This is a 3 dot button!')}>
          <Image source={PATH.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);
  useEffect(() => {});
  handleIndexChange = (index) => {
    setSelectedIndex(index);
  };

  return (
    <View style={styles.mainContainer}>
      <SegmentedControlTab
        values={['Events', 'Calendar']}
        selectedIndex={selectedIndex}
        onTabPress={handleIndexChange}
        borderRadius={20}
        tabsContainerStyle={styles.segmentContainer}
        tabStyle={styles.tab}
        activeTabStyle={styles.activeTab}
        tabTextStyle={styles.tabTextStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
      />
      {selectedIndex == 0 ? (
        <SectionList
          renderItem={({item, index, section}) => (
            // <Text key={index}>.{item}</Text>
            <TCEventView onPress={() => navigation.navigate('GameDetail')} />
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          sections={[
            {title: 'TODAY', data: ['item1', 'item2', 'item7', 'item8']},
            {
              title: 'TOMORROW',
              data: ['item3', 'item4', 'item9', 'item10', 'item11'],
            },
            {title: 'FUTURE', data: ['item5', 'item6', 'item12']},
          ]}
          keyExtractor={(item, index) => item + index}
        />
      ) : (
        <EventCalendar
          eventTapped={() => alert('Event tapped..')}
          // eventTapped={this._eventTapped.bind(this)}
          events={events}
          width={width}
          initDate={'2017-09-08'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  headerRightImg: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    marginRight: 20,
  },
  segmentContainer: {
    alignSelf: 'center',
    marginTop: hp('3%'),
    borderWidth: 1,
    borderColor: colors.lightBlueColor,
    borderRadius: 19,
    height: 38,
    width: wp('50%'),
    padding: 1,
  },
  tab: {
    borderColor: colors.whiteColor,
    height: 32,
  },
  activeTab: {
    backgroundColor: colors.blueColor,
    borderRadius: 20,
    borderColor: colors.blueColor,
    alignSelf: 'center',
  },
  tabTextStyle: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RBold,
    color: colors.blueColor,
  },
  activeTabTextStyle: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RBold,
    color: colors.whiteColor,
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
});
