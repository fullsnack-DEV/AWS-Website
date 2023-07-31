import React, {useLayoutEffect, useState} from 'react';

import {View, FlatList, StyleSheet, Text, SafeAreaView} from 'react-native';

import {strings} from '../../../Localization/translation';
import GroupListItemView from '../../components/Home/GroupListItemView';
import Verbs from '../../Constants/Verbs';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';

export default function GroupListScreen({navigation, route}) {
  const [groups] = useState(route.params.groups);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        route.params.entity_type === Verbs.entityTypeClub
          ? strings.clubstitle
          : strings.teamstitle,
    });
  }, [navigation]);

  const onPressGroupList = (group) => {
    navigation.push('HomeScreen', {
      uid: group.group_id,
      backButtonVisible: true,
      menuBtnVisible: false,
      role: group.entity_type,
    });
  };

  const renderItems = ({item}) => (
    <GroupListItemView groupData={item} onPress={onPressGroupList} />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={
          route.params.entity_type === Verbs.entityTypeClub
            ? strings.clubstitle
            : strings.teamstitle
        }
        backButtonVisible
        leftIconPress={() => navigation.goBack()}
        leftIcon={images.backArrow}
      />
      <View stryle={styles.mainContainer}>
        <FlatList
          keyExtractor={(item) => item?.group_id}
          bounces={false}
          data={groups}
          renderItem={renderItems}
          ListEmptyComponent={() => (
            <View>
              <Text>{strings.noGroupFond}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
