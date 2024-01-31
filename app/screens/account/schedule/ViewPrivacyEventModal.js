import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import RadioBtnItem from '../../../components/Schedule/RadioBtnItem';

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

export default function ViewPrivacyEventModal({visible, closeModal}) {
  const [scheduleData, setScheduleData] = useState(schedule_Data);

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={closeModal}
      modalType={ModalTypes.style1}
      containerStyle={{padding: 0, flex: 1}}
      title={strings.privacySettings}
      leftIconPress={() => closeModal()}
      isRightIconText
      headerRightButtonText={strings.save}
      onRightButtonPress={() => closeModal()}>
      <KeyboardAvoidingView
        style={styles.mainContainerStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
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
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
});
