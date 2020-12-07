import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { getUserDetails, patchPlayer } from '../../../api/Users';
import * as Utility from '../../../utils/index';
import AuthContext from '../../../auth/context'
import Header from '../../../components/Home/Header';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import GroupEventHeaderItem from '../../../components/Schedule/GroupEvent/GroupEventHeaderItem';
import GroupEventItems from '../../../components/Schedule/GroupEvent/GroupEventItems';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

const eventGroups = [
  {
    id: 0,
    groupEvent: images.myTeams,
    eventImage: images.commentReport,
    value: 'Vancouver starts',
    isSelected: false,
  },
  {
    id: 1,
    groupEvent: images.myTeams,
    eventImage: images.commentReport,
    value: 'Vancouver Whitecaps FC',
    isSelected: false,
  },
  {
    id: 2,
    groupEvent: images.myTeams,
    eventImage: images.usaImage,
    value: 'New York City FC',
    isSelected: false,
  },
  {
    id: 3,
    groupEvent: images.myClubs,
    eventImage: images.clubPlaceholderSmall,
    value: 'Vancouver starts',
    isSelected: false,
  },
  {
    id: 4,
    groupEvent: images.myClubs,
    eventImage: images.commentReport,
    value: 'Vancouver Whitecapse',
    isSelected: false,
  },
  {
    id: 5,
    groupEvent: images.myLeagues,
    eventImage: images.usaImage,
    value: 'New York City FC',
    isSelected: false,
  },
  {
    id: 6,
    groupEvent: images.myLeagues,
    eventImage: images.teamPlaceholderSmall,
    value: 'Uefa',
    isSelected: false,
  },
];

export default function GroupEventScreen({ navigation }) {
  const authContext = useContext(AuthContext)
  const [eventGroupsData, setEventGroupsData] = useState(eventGroups);
  const [checkBoxSelect, setCheckBoxSelect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const allSelectValue = await Utility.getStorage('groupEventValue');
      setCheckBoxSelect(allSelectValue);
      eventGroupsData.filter(async (event_item) => {
        const event_data = event_item;
        if (allSelectValue) {
          event_data.isSelected = true;
          setCheckBoxSelect(true);
        } else {
          event_data.isSelected = false;
          setCheckBoxSelect(false);
        }
        return null;
      })
      setEventGroupsData([...eventGroupsData]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <KeyboardAvoidingView style={styles.mainContainerStyle} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ActivityLoader visible={loading} />
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Group Events</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={async () => {
            setLoading(true);
            const entity = authContext.entity
            const uid = entity.uid || entity.auth.user_id;
            const params = {
              group_events: checkBoxSelect,
            }
            patchPlayer(params, authContext)
              .then(() => getUserDetails(uid, authContext))
              .then(() => {
                setLoading(false);
                navigation.goBack();
              })
              .catch((e) => {
                setLoading(false);
                Alert.alert('', e.messages)
              });
          }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
      <SafeAreaView>
        <EventItemRender
          title={strings.groupEventTitle}
        >
          <FlatList
            data={['0', ...eventGroupsData]}
            bounces={false}
            style={{ paddingVertical: hp('1.5%') }}
            ItemSeparatorComponent={() => <View style={{ height: wp('4%') }} />}
            renderItem={ ({ item, index }) => {
              if (index === 0) {
                return (
                  <GroupEventHeaderItem
                    title={strings.all}
                    source={checkBoxSelect ? images.checkWhiteLanguage : images.uncheckWhite}
                    onHeaderItemPress={() => {
                      eventGroupsData.filter((event_item) => {
                        const event_data = event_item;
                        if (checkBoxSelect) {
                          event_data.isSelected = false;
                          Utility.setStorage('groupEventValue', false);
                          setCheckBoxSelect(false);
                        } else {
                          event_data.isSelected = true;
                          Utility.setStorage('groupEventValue', true);
                          setCheckBoxSelect(true);
                        }
                        return null;
                      })
                      setEventGroupsData([...eventGroupsData]);
                    }}
                  />
                );
              }
              return (
                <GroupEventItems
                  eventImageSource={item.eventImage}
                  eventText={item.value}
                  groupImageSource={item.groupEvent}
                  checkBoxImage={item.isSelected ? images.checkWhiteLanguage : images.uncheckWhite}
                  onCheckBoxPress={() => {
                    eventGroupsData[index - 1].isSelected = !eventGroupsData[index - 1].isSelected;
                    setEventGroupsData([...eventGroupsData]);
                  }}
                />
              );
            }}
            keyExtractor={ (item, index) => index.toString() }
          />
        </EventItemRender>
      </SafeAreaView>
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
