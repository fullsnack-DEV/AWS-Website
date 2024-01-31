import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import React, {useState, useCallback, useContext, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {format} from 'react-string-format';
import {useNavigation} from '@react-navigation/native';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import {unfollowGroup} from '../../api/Groups';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';

import Verbs from '../../Constants/Verbs';
import GroupIcon from '../../components/GroupIcon';
import {displayLocation} from '../../utils';

import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import {
  followUser,
  getUserFollowerFollowing,
  unfollowUser,
} from '../../api/Users';
import images from '../../Constants/ImagePath';
import CustomModalWrapper from '../../components/CustomModalWrapper';

const tabList = [strings.following, strings.followerTitleText];

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

export default function UserConnectionModal({
  closeModal,
  refreshModal,
  entityType,
  userId,
  tab,
  viewPrivacyStatus = true,
}) {
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const authContext = useContext(AuthContext);

  const [data, setData] = useState(obj);
  const [selectedTab, setSelectedTab] = useState('');

  const navigation = useNavigation();

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
      .then(([following, follower]) => {
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
      .catch(() => {
        setLoading(false);
      });
  }, [authContext, userId]);

  useEffect(() => {
    if (refreshModal) {
      getData();
    }
  }, [userId, refreshModal, getData]);

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
      authContext.entity.role === Verbs.entityTypePlayer ||
      authContext.entity.role === Verbs.entityTypeUser
    ) {
      followUser(
        {entity_type: authContext.entity.role},
        entityData.user_id ?? entityData.group_id,
        authContext,
      )
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
          getData();
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          Alert.alert(strings.alertmessagetitle, err.message);
        });
    }
  };

  const renderList = (option) => {
    if (!viewPrivacyStatus) {
      return null;
    }
    let list = [];

    if (option === strings.followerTitleText && data.follower.count > 0) {
      list = [...data.follower.data];
    } else if (option === strings.following && data.following.count > 0) {
      list = [...data.following.data];
    }

    list = list.filter((item) => {
      const itemName = item.group_name ?? item.full_name;
      return itemName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (list.length > 0) {
      return (
        <FlatList
          data={list}
          keyExtractor={(item, index) => index.toString()}
          style={{paddingHorizontal: 15}}
          ListFooterComponent={() => <View style={{marginBottom: 70}} />}
          renderItem={({item}) =>
            authContext.entity.uid === (item.user_id ?? item.group_id) &&
            option !== strings.followerTitleText &&
            data.follower.count > 0 ? null : (
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
                      entityType={item.entity_type}
                      groupName={item.group_name}
                      // showPlaceholder={false}
                      textstyle={{fontSize: 12}}
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
                  {authContext.entity.uid !== item.user_id &&
                  (authContext.entity.role === Verbs.entityTypeUser ||
                    authContext.entity.role === Verbs.entityTypePlayer) ? (
                    // eslint-disable-next-line react/jsx-indent
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
                          item.is_following
                            ? {color: colors.lightBlackColor}
                            : {},
                        ]}>
                        {item.is_following ? strings.following : strings.follow}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={styles.separator} />
              </>
            )
          }
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
    <CustomModalWrapper
      isVisible={refreshModal}
      closeModal={closeModal}
      containerStyle={{padding: 0, flex: 1}}>
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
        <View style={styles.searchBarView}>
          <View style={styles.floatingInput}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={colors.userPostTimeColor}
                style={styles.textInputStyle}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                }}
                placeholder={strings.searchText}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                  }}>
                  <Image
                    source={images.closeRound}
                    style={{height: 15, width: 15}}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {!viewPrivacyStatus && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 90,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: colors.googleColor,
                fontFamily: fonts.RRegular,
              }}>
              {selectedTab === strings.followerTitleText
                ? strings.noFollowersToShow
                : strings.noFollowingsToShow}
            </Text>
          </View>
        )}

        {viewPrivacyStatus && loading ? (
          <UserListShimmer />
        ) : (
          renderList(selectedTab)
        )}
      </View>
    </CustomModalWrapper>
  );
}
const styles = StyleSheet.create({
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
    borderWidth: StyleSheet.hairlineWidth,
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

  searchBarView: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: colors.inputBgOpacityColor,
    height: 45,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
  floatingInput: {
    alignSelf: 'center',
    zIndex: 1,
    width: '90%',
    // marginTop: 20,
  },
});
