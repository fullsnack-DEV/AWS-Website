import React, {
  useLayoutEffect,
  useState,
} from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';

import strings from '../../Constants/String';
import GroupListItemView from '../../components/Home/GroupListItemView';

export default function GroupListScreen({ navigation, route }) {
  const [groups] = useState(route.params.groups);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.entity_type === 'club' ? strings.clubstitle : strings.teamstitle,
    });
  }, [navigation]);

  const onPressGroupList = (group) => {
    navigation.push('HomeScreen', {
      uid: group.group_id,
      backButtonVisible: true,
      role: group.entity_type,
    })
  }

  const renderItems = ({ item }) => (
    <GroupListItemView groupData={item}
          onPress={onPressGroupList}
      />
  )

  return (
    <>
      <View stryle={styles.mainContainer}>
        <FlatList
              keyExtractor={(item) => item?.group_id}
              bounces={false}
              data={groups}
              renderItem={renderItems}
              ListEmptyComponent={() => (
                <View>
                  <Text>
                    No Groups Found
                  </Text>
                </View>
              )}/>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
