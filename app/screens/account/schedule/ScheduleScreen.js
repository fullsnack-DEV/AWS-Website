import React, {
  useState, useLayoutEffect, useRef,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
} from 'react-native';
import EventCalendar from 'react-native-events-calendar';
import {
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import TCScrollableTabs from '../../../components/TCScrollableTabs';
import TouchableIcon from '../../../components/Home/TouchableIcon';
import ScheduleTabView from '../../../components/Home/ScheduleTabView';
import EventScheduleScreen from './EventScheduleScreen';

export default function ScheduleScreen({ navigation }) {
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);

  const { width } = Dimensions.get('window');

  const events = [
    {
      start: '2017-09-07 00:30:00',
      end: '2017-09-07 01:30:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
      start: '2017-09-07 01:55:00',
      end: '2017-09-07 02:45:00',
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
          onPress={ () => { actionSheet.current.show(); } }>
          <Image source={ images.vertical3Dot } style={ styles.headerRightImg } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  const actionSheet = useRef();

  return (
    <View style={ styles.mainContainer }>
      <TCScrollableTabs initialPage={2}>
        <View tabLabel='Info' style={{ flex: 1 }}></View>
        <View tabLabel='Scoreboard' style={{ flex: 1 }}></View>
        <View tabLabel='Schedule' style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableIcon
              source={images.searchLocation}
              onItemPress={() => {}}
            />
            <ScheduleTabView
              indexCounter={scheduleIndexCounter}
              onFirstTabPress={() => setScheduleIndexCounter(0)}
              onSecondTabPress={() => setScheduleIndexCounter(1)}
            />
            <TouchableIcon
              source={images.plus}
              imageStyle={{ tintColor: colors.orangeColor }}
              onItemPress={() => { navigation.navigate('CreateEventScreen') }}
            />
          </View>
          {scheduleIndexCounter === 0 && <EventScheduleScreen
            onItemPress={() => navigation.navigate('EventScreen')}
          />}
          {scheduleIndexCounter === 1 && <EventCalendar
            eventTapped={ () => alert('Event tapped..') }
            // eventTapped={this._eventTapped.bind(this)}
            events={ events }
            width={ width }
            initDate={ '2017-09-08' }
          />}
        </View>
        <View tabLabel='Gallery' style={{ flex: 1 }}></View>
      </TCScrollableTabs>
      <ActionSheet
        ref={actionSheet}
        options={['Default Color', 'Group Events', 'View Privacy', 'Cancel']}
        cancelButtonIndex={3}
        destructiveButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('DefaultColorScreen');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
