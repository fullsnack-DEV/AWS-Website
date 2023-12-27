import {View, SafeAreaView} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import {myLikeEvents} from '../../../api/Schedule';
import AuthContext from '../../../auth/context';
import EventList from '../../search/components/EventList';

export default function LikedEventScreen({navigation}) {
  const [likeEventData, setLikeEventData] = useState([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    // call API

    myLikeEvents(authContext)
      .then((res) => {
        setLikeEventData(res.payload);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [authContext]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.likeEvent}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <View style={{flex: 1, marginTop: 15}}>
        <EventList
          list={likeEventData}
          isUpcoming={false}
          onItemPress={(item) => {
            navigation.navigate('ScheduleStack', {
              screen: 'EventScreen',
              params: {
                data: item,
                gameData: item,
                comeFrom: 'LocalHomeStack',
                screen: 'LocalHomeEventScreen',
              },
            });
          }}
          filters={'Pune'}
          eventType={strings.upcomingTitleText}
        />
      </View>
    </SafeAreaView>
  );
}
