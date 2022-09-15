import {FlatList, View} from 'react-native';
import React, {useState} from 'react';
import EventItemRender from '../../../../components/Schedule/EventItemRender';
import RadioBtnItem from '../../../../components/Schedule/RadioBtnItem';
import TCThinDivider from '../../../../components/TCThinDivider';
import {strings} from '../../../../../Localization/translation';
import {privacy_Data} from '../../../../utils/constant';

const RenderPrivacySettingSection = ({title, privacyData, setPrivacyData}) => (
  <EventItemRender title={title} containerStyle={{marginTop: 10, padding: 15}}>
    <FlatList
      data={privacyData}
      style={{marginTop: 10}}
      ItemSeparatorComponent={() => <View style={{height: 15}} />}
      renderItem={({item}) => (
        <RadioBtnItem
          titleName={item.title}
          selected={item.isSelected}
          touchRadioBtnStyle={{marginRight: 5}}
          onRadioBtnPress={() => {
            privacyData.map((scheduleItem) => {
              const schedule = scheduleItem;
              if (schedule.id === item.id) {
                schedule.isSelected = true;
              } else {
                schedule.isSelected = false;
              }
              return null;
            });
            setPrivacyData([...privacyData]);
          }}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  </EventItemRender>
);
const PlaysInEditBasicInfoPrivacySettings = () => {
  const [privacyData, setPrivacyData] = useState(privacy_Data);
  return (
    <EventItemRender
      title={strings.whoCanSeeCategory}
      containerStyle={{marginTop: 10}}>
      {/*  Gender */}
      <RenderPrivacySettingSection
        title={strings.gender}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/*  Year of Birth */}
      <RenderPrivacySettingSection
        title={strings.yearOfBirth}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/* Height */}
      <RenderPrivacySettingSection
        title={strings.height}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/* Width */}
      <RenderPrivacySettingSection
        title={strings.weight}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/* Most used foot */}
      <RenderPrivacySettingSection
        title={strings.mostUsedFoot}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/* Current City */}
      <RenderPrivacySettingSection
        title={strings.currrentCityTitle}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />
    </EventItemRender>
  );
};
export default PlaysInEditBasicInfoPrivacySettings;
