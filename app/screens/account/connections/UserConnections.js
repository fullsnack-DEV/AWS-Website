import React, {
  useEffect, useState, useContext, useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import _ from 'lodash';
import TCNoDataView from '../../../components/TCNoDataView';
import AuthContext from '../../../auth/context';
import TCUserList from './TCUserList';
import { followUser, getUserFollowerFollowing, unfollowUser } from '../../../api/Users';
import TCInnerLoader from '../../../components/TCInnerLoader';

export default function UserConnections({ navigation, route }) {
  const isFocused = useIsFocused();
  const tab = route?.params?.tab;
  const eType = route?.params?.entity_type;
  const user_id = route?.params?.user_id;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const authContext = useContext(AuthContext)
  const userRole = authContext?.entity?.role;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: _.startCase(tab),
    });
  }, [navigation]);
  useEffect(() => {
    setLoading(true);
    if (eType === 'player') {
      getUserFollowerFollowing(user_id, 'players', tab, authContext).then((res) => {
        setData([...res?.payload]);
      }).catch(() => {
      }).finally(() => setLoading(false));
    } else {
      getUserFollowerFollowing(user_id, 'groups', tab, authContext).then((res) => {
        setData([...res?.payload]);
      }).catch(() => {
      }).finally(() => setLoading(false));
    }
    return () => setData([]);
  }, [isFocused, navigation]);
  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1 }}>{data.length === 0
        ? (
          <View style={{ flex: 1 }}>
            {loading
              ? <TCInnerLoader visible={loading}/>
              : <View style={{ flex: 1 }}><TCNoDataView title={`No ${_.startCase(tab)} Found`} /></View>
              }

          </View>
        )
        : <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                      const showFollowUnfollowButton = userRole === 'user';
                      return (
                        <TCUserList
                              showFollowUnfollowButton={showFollowUnfollowButton}
                              profileImage={item?.full_image}
                              entityType={item?.entity_type}
                              title={item?.entity_type === 'player' ? item?.full_name : item?.group_name}
                              subTitle={`${item?.city} , ${item?.country}`}
                              is_following={item?.is_following}
                              followUnfollowPress={(wantToFollow) => {
                                const entity_type = item?.entity_type
                                const uid = item?.entity_type === 'player' ? item?.user_id : item?.group_id;
                                if (wantToFollow) {
                                  followUser({ entity_type }, uid, authContext)
                                } else {
                                  unfollowUser({ entity_type }, uid, authContext)
                                }
                              }}

                          />
                      )
                    }}
                />
                }
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
