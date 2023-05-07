import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../../../components/Home/Header';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import RadioBtnItem from '../../../components/Schedule/RadioBtnItem';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';

const schedule_Data = [
  {
    id: 0,
    title: strings.everyoneTitleText,
    isSelected: true,
  },
  {
    id: 1,
    title: strings.followerTitleText,
    isSelected: false,
  },
  {
    id: 2,
    title: strings.onlymeTitleText,
    isSelected: false,
  },
];

export default function ViewPrivacyScreen({navigation}) {
  const [scheduleData, setScheduleData] = useState(schedule_Data);

  return (
    <KeyboardAvoidingView
      style={styles.mainContainerStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>{strings.privacySettings}</Text>
        }
        rightComponent={
          <TouchableOpacity
            style={{padding: 2}}
            onPress={() => navigation.goBack()}>
            <Text style={{fontFamily: fonts.RMedium, fontSize: 16}}>
              {strings.save}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.sperateLine} />
      <SafeAreaView>
        <EventItemRender
          title={strings.whoCanSeeShcedule}
          containerStyle={{marginTop: 10}}>
          <FlatList
            data={scheduleData}
            style={{marginTop: 15}}
            ItemSeparatorComponent={() => <View style={{height: 15}} />}
            renderItem={({item}) => (
              <RadioBtnItem
                titleName={item.title}
                selected={item.isSelected}
                touchRadioBtnStyle={{marginRight: 5}}
                onRadioBtnPress={() => {
                  scheduleData.map((scheduleItem) => {
                    const schedule = scheduleItem;
                    if (schedule.id === item.id) {
                      schedule.isSelected = true;
                    } else {
                      schedule.isSelected = false;
                    }
                    return null;
                  });
                  setScheduleData([...scheduleData]);
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
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
