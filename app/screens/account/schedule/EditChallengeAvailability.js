import React, { useState, useContext } from 'react';
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
import AuthContext from '../../../auth/context'
import Header from '../../../components/Home/Header';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import ChallengeAvailabilityItem from '../../../components/Schedule/ChallengeAvailabilityItem';
import AddTimeItem from '../../../components/Schedule/AddTimeItem';
import { editSlots } from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';

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
  const authContext = useContext(AuthContext)
  const [challengeAvailable, setChallengeAvailable] = useState(challegeAvailability);
  const [loading, setLoading] = useState(false);

  const deleteItemById = (id) => {
    const filteredData = challengeAvailable.filter((item) => item.id !== id);
    setChallengeAvailable(filteredData);
  };


  // eslint-disable-next-line no-unused-vars
  const convertDateToUTC = (date) => {
    const dt = new Date(date);
    return new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainerStyle} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ActivityLoader visible={loading} />

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
            setLoading(true)
            const entity = authContext.entity
            const uid = entity.uid || entity.auth.user_id;
            const entityRole = entity.role === 'user' ? 'users' : 'groups';
            const filterData = [];
            let obj = {};
            challengeAvailable.map((challenge_item) => {
              console.log('new Date(challenge_item.startDateTime)',new Date(challenge_item.startDateTime));

              obj = {
                blocked: challenge_item.isBlock,
                allDay: challenge_item.allDay,
                start_datetime: new Date(challenge_item.startDateTime).getTime() / 1000,
                end_datetime: new Date(challenge_item.endDateTime).getTime() / 1000,
                // start_datetime: Number(
                //   parseFloat(
                //     new Date(convertDateToUTC(new Date(challenge_item.startDateTime))).getTime() / 1000,
                //   ).toFixed(0),
                // ),
                // end_datetime: Number(
                //   parseFloat(
                //     new Date(convertDateToUTC( new Date(challenge_item.endDateTime))).getTime() / 1000,
                //   ).toFixed(0),
                // ),
              };
              filterData.push(obj);
              return null;
            })

            console.log('Entity role', entityRole);
            console.log('filterData', filterData);

            editSlots(entityRole, uid, filterData, authContext).then(() => {
              setTimeout(() => {
                setLoading(false)
                navigation.goBack();
            }, 5000);
            }).catch((error) => {
              setLoading(false)
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
