/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import ActionSheet from 'react-native-actionsheet';
// import Modal from 'react-native-modal';
// import LinearGradient from 'react-native-linear-gradient';
import QB from 'quickblox-react-native-sdk';
import AuthContext from '../../../auth/context';
import TCSearchBox from '../../../components/TCSearchBox';
import TCNoDataView from '../../../components/TCNoDataView';

import {getGroupMembers} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
// import fonts from '../../../Constants/Fonts'
// import TCThinDivider from '../../../components/TCThinDivider';
import {strings} from '../../../../Localization/translation';
import {
  QB_DIALOG_TYPE,
  QBcreateDialog,
  QBgetUserDetail,
} from '../../../utils/QuickBlox';
import UserListShimmer from '../../../components/shimmer/commonComponents/UserListShimmer';
import fonts from '../../../Constants/Fonts';
import TCUserRoleBadge from '../../../components/TCUserRoleBadge';
import TCThinDivider from '../../../components/TCThinDivider';
import {getHitSlop} from '../../../utils';
import {followUser, unfollowUser} from '../../../api/Users';
import TCFollowUnfollwButton from '../../../components/TCFollowUnfollwButton';
import Verbs from '../../../Constants/Verbs';

let entity = {};
export default function GroupMembersScreen({navigation, route}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const actionSheetInvite = useRef();
  const [searchMember, setSearchMember] = useState();
  // const [isModalVisible, setModalVisible] = useState(false);
  // const [allSelected, setAllSelected] = useState(false);
  // const [filter, setFilter] = useState([]);
  const [members, setMembers] = useState();
  const [switchUser, setSwitchUser] = useState({});
  const [groupID] = useState(route.params?.groupID);

  useEffect(() => {
    console.log('NAVIGATION:', navigation);
    const getAuthEntity = async () => {
      entity = authContext.entity;
      setSwitchUser(entity);
    };
    getMembers();
    getAuthEntity();
  }, [isFocused]);

  const getMembers = async () => {
    if (groupID) {
      getGroupMembers(groupID, authContext)
        .then((response) => {
          setMembers(response.payload);
          setSearchMember(response.payload);
          setFirstTimeLoading(false);
        })
        .catch((e) => {
          setFirstTimeLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        switchUser.uid === route?.params?.groupID && (
          <TouchableWithoutFeedback onPress={() => actionSheet.current.show()}>
            <Image
              source={images.vertical3Dot}
              style={styles.navigationRightItem}
            />
          </TouchableWithoutFeedback>
        ),
    });
  }, [navigation, switchUser]);

  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };
  // const isIconCheckedOrNot = ({ item, index }) => {
  //   console.log('SELECTED:::', index);
  //   // eslint-disable-next-line no-param-reassign
  //   item.isSelected = !item.isSelected;

  //   setFilter([...filter]);

  //   for (const temp of filter) {
  //     if (temp.isSelected) {
  //       setFilter.push(temp.data);
  //     }
  //   }
  // };
  // const makAllSelected = () => {
  //   setAllSelected(!allSelected)
  //   const arr = filterArray.map((el) => (
  //     // eslint-disable-next-line no-return-assign
  //     el.data.map((d) => (
  //     // eslint-disable-next-line no-param-reassign
  //       d.isSelected = !allSelected
  //     ))
  //   ))
  //   setFilter(arr);
  // }
  const searchFilterFunction = (text) => {
    const result = (searchMember ?? []).filter(
      (x) => x?.first_name?.includes(text) || x?.last_name?.includes(text),
    );
    setMembers(result);
  };
  // const renderFilterItem = ({ item, index }) => (
  //   <TouchableWithoutFeedback onPress={() => {
  //     isIconCheckedOrNot({ item, index });
  //   }}>

  //     {item.isSelected ? <LinearGradient
  //      colors={[colors.greenGradientStart, colors.greenGradientEnd]}
  //      style={styles.rowStyleSelected}>
  //       <Text style={styles.rowTitle}>{item.innerOptionName}</Text>
  //       <Image source={images.checkGreen} style={styles.checkGreenImage}/>
  //     </LinearGradient>
  //       : <View
  //       style={styles.rowStyleUnSelected}>
  //         <Text style={styles.rowTitleBlack}>{item.innerOptionName}</Text>
  //         <Image source={images.uncheckWhite} style={styles.rowCheckImage}/>
  //       </View>
  //     }
  //   </TouchableWithoutFeedback>
  // );

  const navigateToGroupMessage = () => {
    setloading(true);
    const UIDs = [];
    if (members?.length) {
      members?.map((data) => {
        if (data?.connected) {
          UIDs.push(data?.user_id);
          return data;
        }
        return null;
      });
    }
    console.log('UIDsUIDs', UIDs);
    if (UIDs.length > 0) {
      QBgetUserDetail(
        QB.users.USERS_FILTER.FIELD.LOGIN,
        QB.users.USERS_FILTER.TYPE.STRING,
        [UIDs].join(),
      )
        .then((userData) => {
          const IDs = [];
          userData.users.map((item) => IDs.push(item?.id));
          const groupName = authContext?.entity?.obj?.group_name;
          QBcreateDialog(IDs, QB_DIALOG_TYPE.GROUP, groupName)
            .then((dialog) => {
              console.log('dialogdialogdialog', dialog);
              setloading(false);
              navigation.navigate('MessageChat', {
                screen: 'MessageChat',
                params: {dialog},
              });
            })
            .catch((error) => {
              setloading(false);
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
          setloading(false);
        });
    }
  };

  const onPressProfile = useCallback(
    (item) => {
      navigation.navigate('MembersProfileScreen', {
        memberID: item?.user_id,
        whoSeeID: item?.group_id,
        groupID,
      });
    },
    [navigation, groupID],
  );

  // const onPressMessage = useCallback(
  //   (item) => {
  //     const accountType = getQBAccountType(item?.entity_type);
  //     QBcreateUser(item?.user_id, item, accountType)
  //       .then(() => {
  //         navigation.navigate('MessageChat', {
  //           screen: 'MessageChat',
  //           params: {userId: item.user_id},
  //         });
  //       })
  //       .catch(() => {
  //         navigation.navigate('MessageChat', {
  //           screen: 'MessageChat',
  //           params: {userId: item.user_id},
  //         });
  //       });
  //   },
  //   [navigation],
  // );

  const callFollowUser = async (data, index) => {
    const tempMember = [...members];
    tempMember[index].is_following = true;
    setMembers(tempMember);

    const params = {
      entity_type: 'player',
    };
    followUser(params, data.user_id, authContext)
      .then(() => {
        console.log('follow user');
      })
      .catch((error) => {
        console.log('callFollowUser error with userID', error, data.user_id);
        const tempMem = [...members];
        tempMem[index].is_following = false;
        setMembers(tempMem);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const callUnfollowUser = async (data, index) => {
    const tempMember = [...members];
    tempMember[index].is_following = false;
    setMembers(tempMember);

    const params = {
      entity_type: 'player',
    };
    unfollowUser(params, data.user_id, authContext)
      .then(() => {
        console.log('unfollow user');
      })
      .catch((error) => {
        console.log('callUnfollowUser error with userID', error, data.user_id);
        const tempMem = [...members];
        tempMem[index].is_following = true;
        setMembers(tempMem);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onUserAction = useCallback(
    (action, data, index) => {
      switch (action) {
        case 'follow':
          callFollowUser(data, index);
          break;
        case 'unfollow':
          callUnfollowUser(data, index);
          break;
        default:
      }
    },
    [callFollowUser, callUnfollowUser, navigation],
  );
  const onPressProfilePhotoAndTitle = useCallback(
    (item) => {
      console.log('Profile photo & title press', item);
      if (item.connected) {
        navigation.navigate('HomeScreen', {
          uid: item?.user_id,
          role: 'user',
          backButtonVisible: true,
          menuBtnVisible: false,
        });
      }
    },
    [navigation],
  );

  const renderFirstNameAndLastName = useCallback((item) => {
    if (item.connected) {
      return (
        <Text style={styles.nameText} numberOfLines={1}>
          {item.first_name} {item.last_name}
        </Text>
      );
    }
    return (
      <Text
        style={{
          ...styles.nameText,
          color: colors.userPostTimeColor,
        }}
        numberOfLines={1}>
        {item.first_name} {item.last_name}
      </Text>
    );
  }, []);

  const renderMembers = useCallback(
    ({item: data, index}) => (
      // <UserRoleView
      //   data={item}
      //   onPressProfile={() => onPressProfile(item)}
      //   onPressMessage={() => onPressMessage(item)}
      // />
      <>
        <View style={styles.roleViewContainer}>
          <View
            style={{
              width: 0,
              flexGrow: 1,
              flex: 1,
            }}>
            <View style={styles.topViewContainer}>
              <TouchableOpacity
                onPress={() => onPressProfilePhotoAndTitle(data)}
                style={styles.imageTouchStyle}>
                <View style={styles.profileView}>
                  <Image
                    source={
                      data.thumbnail
                        ? {uri: data.thumbnail}
                        : images.profilePlaceHolder
                    }
                    style={styles.profileImage}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.topTextContainer}>
                <TouchableOpacity
                  onPress={() => onPressProfilePhotoAndTitle(data)}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {renderFirstNameAndLastName(data)}
                  </Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  {data?.is_admin && (
                    <TCUserRoleBadge
                      title="Admin"
                      titleColor={colors.themeColor}
                    />
                  )}
                  {data?.is_coach && (
                    <TCUserRoleBadge
                      title="Coach"
                      titleColor={colors.greeColor}
                    />
                  )}
                  {data?.is_member && (
                    <TCUserRoleBadge
                      title="Player"
                      titleColor={colors.playerBadgeColor}
                    />
                  )}
                </View>
              </View>
            </View>
            <View>
              <View style={styles.bottomViewContainer}>
                {/* <Text style={styles.skillText} numberOfLines={2}>Forward, Midfielder, Goal Keeper</Text> */}
                {data?.status && (
                  <Text style={styles.awayStatusText} numberOfLines={1}>
                    {data?.status.join(', ')}
                  </Text>
                )}
              </View>
            </View>
          </View>
          {authContext.entity.role === 'club' ||
          authContext.entity.role === 'team' ? (
            authContext.entity.uid === groupID && (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => onPressProfile(data)}
                hitSlop={getHitSlop(15)}>
                <Image
                  source={images.arrowGraterthan}
                  style={styles.arrowStyle}
                />
              </TouchableOpacity>
            )
          ) : data.is_following ? (
            authContext.entity.uid !== data?.user_id ? (
              <TCFollowUnfollwButton
                outerContainerStyle={styles.firstButtonOuterStyle}
                style={styles.firstButtonStyle}
                title={strings.following}
                isFollowing={data.is_following}
                onPress={() => {
                  onUserAction('following', data, index);
                }}
              />
            ) : (
              <View />
            )
          ) : authContext.entity.uid !== data?.user_id ? (
            <TCFollowUnfollwButton
              outerContainerStyle={styles.firstButtonOuterStyle}
              style={styles.firstButtonStyle}
              title={strings.follow}
              isFollowing={data.is_following}
              onPress={() => {
                onUserAction('follow', data, index);
              }}
            />
          ) : (
            <View />
          )}
        </View>
        <TCThinDivider marginTop={20} />
      </>
    ),
    [authContext.entity.role, onPressProfile, onUserAction],
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View tabLabel={strings.membersTitle} style={{flex: 1}}>
        <View style={styles.searchBarView}>
          <TCSearchBox
            editable={members?.length > 0}
            onChangeText={(text) => searchFilterFunction(text)}
          />
        </View>
        {/* eslint-disable-next-line no-nested-ternary */}
        {firstTimeLoading ? (
          <UserListShimmer />
        ) : members.length > 0 ? (
          <FlatList
            data={members}
            renderItem={renderMembers}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <TCNoDataView title={strings.noMebersFoundText} />
        )}
      </View>

      <ActionSheet
        ref={actionSheet}
        // title={'News Feed Post'}
        options={
          switchUser.role === Verbs.entityTypeClub
            ? [
                strings.groupMessageText,
                strings.inviteMemberText,
                strings.createMemberProfileText,
                strings.connectMemberAccountText,
                strings.sendrequestForBaicInfoText,
                strings.privacySettingText,
                strings.setting,
                strings.cancel,
              ]
            : [
                strings.groupMessageText,
                strings.inviteMemberText,
                strings.createMemberProfileText,
                strings.connectMemberAccountText,
                strings.sendrequestForBaicInfoText,
                strings.privacySettingText,
                strings.cancel,
              ]
        }
        cancelButtonIndex={switchUser.role === Verbs.entityTypeClub ? 5 : 6}
        // destructiveButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            navigateToGroupMessage();
          } else if (index === 1) {
            actionSheetInvite.current.show();
          } else if (index === 2) {
            navigation.navigate('CreateMemberProfileForm1');
          } else if (index === 3) {
            navigation.navigate('ConnectMemberAccountScreen', {
              groupID,
            });
          } else if (index === 4) {
            navigation.navigate('RequestMultipleBasicInfoScreen', {groupID});
          } else if (index === 5) {
            navigation.navigate('MembersViewPrivacyScreen');
          } else if (index === 6) {
            if (switchUser.role === Verbs.entityTypeClub) {
              navigation.navigate('ClubSettingScreen');
            }
          }
        }}
      />
      <ActionSheet
        ref={actionSheetInvite}
        // title={'News Feed Post'}
        options={[
          strings.inviteBySearchText,
          strings.inviteEmailtext,
          strings.cancel,
        ]}
        cancelButtonIndex={2}
        // destructiveButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('InviteMembersBySearchScreen');
          } else if (index === 1) {
            navigation.navigate('InviteMembersByEmailScreen');
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  // filterImage: {
  //   marginLeft: 10,
  //   alignSelf: 'center',
  //   height: 25,
  //   resizeMode: 'contain',
  //   width: 25,
  // },
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'cover',
    width: 40,
    borderRadius: 80,
  },
  roleViewContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topViewContainer: {
    flexDirection: 'row',
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginRight: 10,
  },
  bottomViewContainer: {
    marginLeft: 55,
    marginTop: 5,
  },
  // skillText: {
  //   fontSize: 14,
  //   color: colors.lightBlackColor,
  //   fontFamily: fonts.RRegular,
  //   flexShrink: 1,
  // },
  awayStatusText: {
    fontSize: 12,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
  },
  imageTouchStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
