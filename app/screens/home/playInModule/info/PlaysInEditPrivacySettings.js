import {
  FlatList, View,
} from 'react-native';
import React, { useState } from 'react';
import EventItemRender from '../../../../components/Schedule/EventItemRender';
import RadioBtnItem from '../../../../components/Schedule/RadioBtnItem';

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

const PlaysInEditPrivacySettings = ({
  title,
}) => {
  const [privacyData, setPrivacyData] = useState(privacy_Data);
  return (
    <EventItemRender
            title={title}
            containerStyle={{ marginTop: 10 }}
        >
      <FlatList
                data={privacyData}
                style={{ marginTop: 10 }}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                renderItem={ ({ item }) => <RadioBtnItem
                    titleName={item.title}
                    selected={item.isSelected}
                    touchRadioBtnStyle={{ marginRight: 5 }}
                    onRadioBtnPress={() => {
                      privacyData.map((scheduleItem) => {
                        const schedule = scheduleItem;
                        if (schedule.id === item.id) {
                          schedule.isSelected = true;
                        } else {
                          schedule.isSelected = false;
                        }
                        return null;
                      })
                      setPrivacyData([...privacyData])
                    }}
                />
                }
                keyExtractor={ (item, index) => index.toString() }
            />
    </EventItemRender>
  )
};
export default PlaysInEditPrivacySettings;
