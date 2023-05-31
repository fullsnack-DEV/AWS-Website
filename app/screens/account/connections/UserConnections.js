import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import TCNoDataView from '../../../components/TCNoDataView';
import AuthContext from '../../../auth/context';

import {
  followUser,
  getUserFollowerFollowing,
  unfollowUser,
} from '../../../api/Users';
import UserListShimmer from '../../../components/shimmer/commonComponents/UserListShimmer';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import GroupIcon from '../../../components/GroupIcon';
import {displayLocation} from '../../../utils';
import {unfollowGroup} from '../../../api/Groups';

const tabList = [strings.followerTitleText, strings.following];

const obj = {
  following: {
    count: 0,
    data: [],
  },
  follower: {
    count: 0,
    data: [],
  },
};

export default function UserConnections({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const {entityType, userId, userName, tab} = route.params;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(obj);
  const [selectedTab, setSelectedTab] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (tab) {
      setSelectedTab(tab);
    }
  }, [tab]);

  const getData = useCallback(() => {
    setLoading(true);
    const list = [];
    tabList.forEach((item) => {
      list.push(
        getUserFollowerFollowing(
          userId,
          Verbs.entityTypePlayers,
          item === strings.following
            ? Verbs.followingVerb
            : Verbs.privacyTypeFollowers,
          authContext,
        ),
      );
    });

    Promise.all(list)
      .then(([follower, following]) => {
        const newData = {};
        newData.following = {
          count: following.payload.length ?? 0,
          data: following.payload.length > 0 ? [...following.payload] : [],
        };

        newData.follower = {
          count: follower.payload.length ?? 0,
          data: follower.payload.length > 0 ? [...follower.payload] : [],
        };

        setData({...newData});
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [authContext, userId]);

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused, getData]);

  const getCount = (option) => {
    if (option === strings.following) {
      return data.following.count;
    }

    if (option === strings.followerTitleText) {
      return data.follower.count;
    }
    return 0;
  };

  const handleFollow = (entityData = {}) => {
    setLoading(true);
    if (
      entityData.entity_type === Verbs.entityTypePlayer ||
      entityData.entity_type === Verbs.entityTypeUser
    ) {
      followUser({entity_type: entityType}, entityData.user_id, authContext)
        .then(() => {
          getData();
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          Alert.alert(strings.alertmessagetitle, err.message);
        });
    }
  };

  const handleUnfollow = (entityData = {}) => {
    setLoading(true);
    if (
      entityData.entity_type === Verbs.entityTypePlayer ||
      entityData.entity_type === Verbs.entityTypeUser
    ) {
      const params = {entity_type: entityType};
      if (selectedTab === strings.followerTitleText) {
        params.follower_id = entityData.user_id;
      }
      const entityId =
        selectedTab === strings.followerTitleText
          ? authContext.entity.uid
          : entityData.user_id;

      unfollowUser(params, entityId, authContext)
        .then(() => {
          getData();
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          Alert.alert(strings.alertmessagetitle, err.message);
        });
    } else {
      const params = {
        entity_type: entityData.entity_type,
      };
      unfollowGroup(params, entityData.group_id, authContext)
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          Alert.alert(strings.alertmessagetitle, err.message);
        });
    }
  };

  const renderList = (option) => {
    let list = [];
    if (option === strings.followerTitleText && data.follower.count > 0) {
      list = [...data.follower.data];
    } else if (option === strings.following && data.following.count > 0) {
      list = [...data.following.data];
    }

    if (list.length > 0) {
      return (
        <FlatList
          data={list}
          keyExtractor={(item, index) => index.toString()}
          style={{paddingHorizontal: 15}}
          renderItem={({item}) => (
            <>
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    navigation.navigate('HomeScreen', {
                      uid: item.user_id ?? item.group_id,
                      role: item.entity_type,
                    });
                  }}>
                  <GroupIcon
                    imageUrl={item.full_image}
                    entityType={Verbs.entityTypePlayer}
                    containerStyle={styles.iconContainer}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.userName}>
                      {item.group_name ?? item.full_name}
                    </Text>
                    <Text style={styles.locationText}>
                      {displayLocation(item)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    if (item.is_following) {
                      handleUnfollow(item);
                    } else {
                      handleFollow(item);
                    }
                  }}>
                  <Text
                    style={[
                      styles.buttonText,
                      item.is_following ? {color: colors.lightBlackColor} : {},
                    ]}>
                    {item.is_following ? strings.following : strings.follow}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
            </>
          )}
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        <TCNoDataView title={format(strings.noTabsFoundText_dy, selectedTab)} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={userName}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <View style={styles.tabRow}>
        {tabList.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.tabItem,
              selectedTab === item
                ? {
                    paddingBottom: 7,
                    borderBottomWidth: 3,
                    borderBottomColor: colors.orangeColorCard,
                  }
                : {},
            ]}
            onPress={() => setSelectedTab(item)}>
            <Text
              style={[
                styles.tabItemText,
                selectedTab === item
                  ? {color: colors.orangeColorCard, fontFamily: fonts.RBlack}
                  : {},
              ]}>
              {`${getCount(item)} ${item}`}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={{flex: 1}}>
        <TextInput
          placeholder={strings.searchText}
          placeholderTextColor={colors.placeHolderColor}
          style={styles.input}
        />

        {loading ? <UserListShimmer /> : renderList(selectedTab)}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
    paddingBottom: 9,
    paddingTop: 15,
  },
  tabItemText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderWidth: 0,
  },
  userName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  buttonContainer: {
    backgroundColor: colors.textFieldBackground,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RBold,
    color: colors.themeColor,
  },
  separator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderRadius: 5,
    marginVertical: 15,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    backgroundColor: colors.textFieldBackground,
  },
});
