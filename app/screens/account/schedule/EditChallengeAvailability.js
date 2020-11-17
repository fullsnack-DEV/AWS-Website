import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Utility from '../../../utils/index';
import Header from '../../../components/Home/Header';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import ChallengeAvailabilityItem from '../../../components/Schedule/ChallengeAvailabilityItem';
import AddTimeItem from '../../../components/Schedule/AddTimeItem';
import { editSlots } from '../../../api/Schedule';

const challegeAvailability = [
  {
    id: 0,
    isBlock: false,
    allDay: false,
    startDateTime: '2020-05-15 00:00:00',
    endDateTime: '2020-05-15 23:59:59',
  },
];

export default function EditChallengeAvailability({ navigation }) {
  const [challengeAvailable, setChallengeAvailable] = useState(challegeAvailability);

  const deleteItemById = (id) => {
    const filteredData = challengeAvailable.filter((item) => item.id !== id);
    setChallengeAvailable(filteredData);
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainerStyle} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Edit Challenge Availability</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={async () => {
            const entity = await Utility.getStorage('loggedInEntity');
            const uid = entity.uid || entity.auth.user_id;
            const entityRole = entity.role === 'user' ? 'users' : 'groups';
            const filterData = [];
            let obj = {};
            challengeAvailable.map((challenge_item) => {
              obj = {
                blocked: challenge_item.isBlock,
                allDay: challenge_item.allDay,
                start_datetime: new Date(challenge_item.startDateTime).getTime() / 1000,
                end_datetime: new Date(challenge_item.endDateTime).getTime() / 1000,
              };
              filterData.push(obj);
              return null;
            })
            editSlots(entityRole, uid, filterData).then(() => {
              navigation.goBack();
            }).catch((error) => {
              console.log('Error ::--', error);
            })
          }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
      <ScrollView bounces={false}>
        <SafeAreaView>

          <EventItemRender
            title={strings.editChallengeTitle}
          >
            <FlatList
                data={challengeAvailable}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={ false }
                renderItem={ ({ item }) => (
                  <ChallengeAvailabilityItem
                    data={item}
                    onDeletePress={() => { deleteItemById(item.id) }}
                    changeAvailablilityItem={(data) => {
                      const filterArray = [...challengeAvailable];
                      const idx = filterArray.findIndex((ca_item) => ca_item.id === data.id);
                      if (idx > -1) {
                        filterArray[idx] = data;
                      }
                      setChallengeAvailable(filterArray);
                    }}
                 />
                )}
                ListFooterComponent={() => (
                  <AddTimeItem
                    addTimeText={strings.addTime}
                    source={images.plus}
                    onAddTimePress={() => {
                      const data = [...challengeAvailable];
                      const obj = {
                        id: data.length,
                        isBlock: true,
                        allDay: false,
                        startDateTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                        endDateTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                      };
                      data.push(obj);
                      setChallengeAvailable(data);
                    }}
                  />
                )}
                ListFooterComponentStyle={{ marginTop: 20 }}
                ItemSeparatorComponent={ () => (
                  <View style={ { height: wp('3%') } } />
                ) }
                style={ { paddingVertical: wp('4%') } }
                keyExtractor={(itemValue, index) => index.toString() }
            />
          </EventItemRender>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
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
});
