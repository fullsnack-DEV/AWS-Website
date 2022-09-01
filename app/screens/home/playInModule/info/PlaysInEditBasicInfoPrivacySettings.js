import {FlatList, View} from 'react-native';
import React, {useState} from 'react';
import EventItemRender from '../../../../components/Schedule/EventItemRender';
import RadioBtnItem from '../../../../components/Schedule/RadioBtnItem';
import TCThinDivider from '../../../../components/TCThinDivider';
import {strings} from '../../../../../Localization/translation';

const privacy_Data = [
  {
    id: 0,
    title: 'Everyone',
    isSelected: true,
  },
  {
    id: 1,
    title: 'Followers',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Members in groups',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Only me',
    isSelected: false,
  },
];
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
      title={'Who can see each category in Basic Info?'}
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
        title={'Year of Birth'}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/* Height */}
      <RenderPrivacySettingSection
        title={'Height'}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/* Width */}
      <RenderPrivacySettingSection
        title={'Width'}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/* Most used foot */}
      <RenderPrivacySettingSection
        title={'Most used foot'}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />

      {/* Current City */}
      <RenderPrivacySettingSection
        title={'Current City'}
        privacyData={privacyData}
        setPrivacyData={setPrivacyData}
      />
      <TCThinDivider />
    </EventItemRender>
  );
};
export default PlaysInEditBasicInfoPrivacySettings;
