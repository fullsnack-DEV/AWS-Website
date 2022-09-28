import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';
import {format} from 'react-string-format';
import TCNoDataView from '../../../components/TCNoDataView';
import AuthContext from '../../../auth/context';
import TCUserList from './TCUserList';

import {
  followUser,
  getUserFollowerFollowing,
  unfollowUser,
} from '../../../api/Users';
import UserListShimmer from '../../../components/shimmer/commonComponents/UserListShimmer';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

export default function UserConnections({navigation, route}) {
  const isFocused = useIsFocused();
  const tab = route?.params?.tab;
  const eType = route?.params?.entity_type;
  const user_id = route?.params?.user_id;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const authContext = useContext(AuthContext);
  const userRole = authContext?.entity?.role;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: _.startCase(tab),
    });
  }, [navigation]);
  useEffect(() => {
    if (isFocused) {
      setLoading(true);

      getUserFollowerFollowing(
        user_id,
        eType === Verbs.entityTypeUser
          ? Verbs.entityTypePlayers
          : Verbs.entityTypeGroups,
        tab,
        authContext,
      )
        .then((res) => {
          setData([...res?.payload]);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [authContext, eType, isFocused, navigation, tab, user_id]);
  return (
    <View style={styles.mainContainer}>
      <View style={{flex: 1}}>
        {data.length === 0 ? (
          <View style={{flex: 1}}>
            {loading ? (
              <UserListShimmer />
            ) : (
              <View style={{flex: 1}}>
                <TCNoDataView
                  title={format(strings.noTabsFoundText_dy, _.startCase(tab))}
                />
              </View>
            )}
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              const showFollowUnfollowButton =
                userRole === Verbs.entityTypeUser &&
                item.user_id !== authContext.entity.uid;
              return (
                <TCUserList
                  onProfilePress={() => {
                    navigation.push('HomeScreen', {
                      role: [
                        Verbs.entityTypePlayer,
                        Verbs.entityTypeUser,
                      ]?.includes(item?.entity_type)
                        ? Verbs.entityTypeUser
                        : item?.entity_type,
                      uid: [
                        Verbs.entityTypePlayer,
                        Verbs.entityTypeUser,
                      ]?.includes(item?.entity_type)
                        ? item?.user_id
                        : item?.group_id,
                      backButtonVisible: true,
                      menuBtnVisible: false,
                    });
                  }}
                  showFollowUnfollowButton={showFollowUnfollowButton}
                  profileImage={item?.full_image}
                  entityType={item?.entity_type}
                  title={
                    item?.entity_type === Verbs.entityTypePlayer
                      ? item?.full_name
                      : item?.group_name
                  }
                  subTitle={`${item?.city} , ${item?.country}`}
                  is_following={item?.is_following}
                  followUnfollowPress={(wantToFollow) => {
                    const entity_type = item?.entity_type;
                    const uid =
                      item?.entity_type === Verbs.entityTypePlayer
                        ? item?.user_id
                        : item?.group_id;
                    if (wantToFollow) {
                      followUser({entity_type}, uid, authContext);
                    } else {
                      unfollowUser({entity_type}, uid, authContext);
                    }
                  }}
                />
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
