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
import {
  useFocusEffect,
  useIsFocused,
  useNavigationState,
} from '@react-navigation/native';

import ActionSheet from '@alessiocancian/react-native-actionsheet';
// import Modal from 'react-native-modal';
// import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../auth/context';
import TCSearchBox from '../../../components/TCSearchBox';
import TCNoDataView from '../../../components/TCNoDataView';

import {
  getGroupDetails,
  getGroupMembers,
  getJoinedGroups,
} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
// import fonts from '../../../Constants/Fonts'
// import TCThinDivider from '../../../components/TCThinDivider';
import {strings} from '../../../../Localization/translation';

import fonts from '../../../Constants/Fonts';
import TCUserRoleBadge from '../../../components/TCUserRoleBadge';
import TCThinDivider from '../../../components/TCThinDivider';
import {getHitSlop} from '../../../utils';
import {followUser, unfollowUser} from '../../../api/Users';
import TCFollowUnfollwButton from '../../../components/TCFollowUnfollwButton';
import Verbs from '../../../Constants/Verbs';
import Header from '../../../components/Home/Header';

export default function GroupMembersScreen({navigation, route}) {
  const actionSheet = useRef();
  const actionSheetPlus = useRef();
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [searchMember, setSearchMember] = useState();
  // const [isModalVisible, setModalVisible] = useState(false);
  // const [allSelected, setAllSelected] = useState(false);
  // const [filter, setFilter] = useState([]);
  const [members, setMembers] = useState([]);

  const [switchUser] = useState(authContext.entity);
  const [groupObj] = useState(route.params?.groupObj);
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [active, setActive] = useState(true);

  const [groupObjNew, setGroupObjNew] = useState();
  const [groupID] = useState(route.params?.groupID ?? authContext.entity.uid);
  const routes = useNavigationState((state) => state.routes);
  const currentRoute = routes[0].name;
  const [userJoinedGrpList, setUserJoinedGrpList] = useState();
  const [clubToCheckAdmin, setClubToCheckAdmin] = useState();

  const callGroup = async (groupIDs, authContexts) => {
    const response = await getGroupDetails(groupIDs, authContexts);

    setGroupObjNew(response.payload);
  };

  const getGroupsLoggedInUser = () => {
    getJoinedGroups(Verbs.entityTypeClub, authContext).then((response) => {
      setUserJoinedGrpList(response.payload);
    });
  };

  useEffect(() => {
    getMembers();
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      if (active) {
        getMembers();
        setActive(false);
      }
    }, [isFocused, currentRoute]),
  );

  const getMembers = async () => {
    setloading(true);
    if (groupID) {
      getGroupMembers(groupID, authContext)
        .then((response) => {
          setMembers(response.payload);

          setSearchMember(response.payload);
          setloading(false);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: currentRoute !== 'GroupMembersScreen',
      headerRight: () =>
        switchUser.uid === groupID && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableWithoutFeedback
              onPress={() => actionSheet.current.show()}>
              <Image
                source={images.createMember}
                style={styles.createMemberStyle}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => actionSheetPlus.current.show()}>
              <Image
                source={images.vertical3Dot}
                style={styles.navigationRightItem}
              />
            </TouchableWithoutFeedback>
          </View>
        ),

      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation, switchUser, groupID, currentRoute]);

  useEffect(() => {
    callGroup(groupID, authContext);
    getGroupsLoggedInUser();
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      if (authContext?.entity?.obj?.is_pause === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
      if (authContext?.entity?.obj?.is_deactivate === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
    }
  }, [
    authContext.entity?.obj.entity_type,
    authContext.entity?.obj?.is_deactivate,
    authContext.entity?.obj?.is_pause,
    authContext.entity.role,
    isFocused,
  ]);

  const searchFilterFunction = (text) => {
    const result = members.filter(
      (x) =>
        x.first_name.toLowerCase().includes(text.toLowerCase()) ||
        x.last_name.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      setMembers(result);
    } else {
      setMembers(searchMember);
    }
  };

  const onPressProfile = useCallback(
    (item) => {
      navigation.navigate('MembersProfileScreen', {
        memberID: item?.user_id,
        whoSeeID: item?.group_id,
        groupID,
        members,
      });
    },
    [navigation, groupID, members],
  );

  const callFollowUser = useCallback(
    (data, index) => {
      const tempMember = [...members];
      tempMember[index].is_following = true;
      setMembers(tempMember);

      const params = {
        entity_type: Verbs.entityTypePlayer,
      };
      followUser(params, data.user_id, authContext)
        .then(() => {})
        .catch((error) => {
          const tempMem = [...members];
          tempMem[index].is_following = false;
          setMembers(tempMem);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, members],
  );

  const callUnfollowUser = useCallback(
    (data, index) => {
      const tempMember = [...members];
      tempMember[index].is_following = false;
      setMembers(tempMember);

      const params = {
        entity_type: Verbs.entityTypePlayer,
      };
      unfollowUser(params, data.user_id, authContext)
        .then(() => {})
        .catch((error) => {
          const tempMem = [...members];
          tempMem[index].is_following = true;
          setMembers(tempMem);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, members],
  );

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
    [callFollowUser, callUnfollowUser],
  );
  const onPressProfilePhotoAndTitle = useCallback(
    (item) => {
      if (item.connected) {
        navigation.push('HomeScreen', {
          uid: item?.user_id,
          role: Verbs.entityTypeUser,
          backButtonVisible: true,
          menuBtnVisible: false,
        });
      }
    },
    [navigation],
  );

  const checkIfClubAdmin = async () => {
    const op = authContext.user?.clubIds?.filter((el) =>
      groupObjNew?.parent_groups?.includes(el),
    );

    const response = await getGroupDetails(op[0], authContext);

    setClubToCheckAdmin(response.payload.am_i_admin);
    // if(response.payload)
  };

  const renderFollowUnfollowArrow = useCallback(
    (data, index) => {
      if (
        authContext.entity.role === Verbs.entityTypeClub ||
        authContext.entity.role === Verbs.entityTypeTeam
      ) {
        if (authContext.entity.uid === groupID) {
          return (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => onPressProfile(data)}
              hitSlop={getHitSlop(15)}>
              <Image
                source={images.arrowGraterthan}
                style={styles.arrowStyle}
              />
            </TouchableOpacity>
          );
        }
        return <View />;
      }
      if (data.is_following) {
        if (authContext.entity.uid !== data?.user_id && data?.connected) {
          checkIfClubAdmin();
          return (
            <View style={{flexDirection: 'row'}}>
              <TCFollowUnfollwButton
                outerContainerStyles={styles.firstButtonOuterStyle}
                style={styles.firstButtonStyle}
                title={strings.following}
                isFollowing={data.is_following}
                startGradientColor={colors.lightGrey}
                endGradientColor={colors.lightGrey}
                onPress={() => {
                  onUserAction('unfollow', data, index);
                }}
              />

              {/* when team is connected to club */}

              {groupObjNew?.entity_type === Verbs.entityTypeTeam &&
                groupObjNew?.parent_groups?.length > 0 && (
                  <>
                    {/* 3 for Club member */}
                    {groupObjNew?.who_can_see_member_profile === 3 &&
                      userJoinedGrpList?.some((el) =>
                        groupObjNew?.parent_groups?.includes(el.group_id),
                      ) && (
                        <TouchableOpacity
                          style={[
                            styles.buttonContainer,
                            {marginLeft: 15, backgroundColor: 'red'},
                          ]}
                          onPress={() => onPressProfile(data)}
                          hitSlop={getHitSlop(15)}>
                          <Image
                            source={images.arrowGraterthan}
                            style={styles.arrowStyle}
                          />
                        </TouchableOpacity>
                      )}

                    {/* 2 for Team member with club selected */}

                    {/* if club member is selected and the team member can also see the arrow */}

                    {/* {groupObjNew?.who_can_see_member_profile === 3 &&
                members.some(
                  (el) => el.user_id === authContext.user.user_id,
                ) && (
                  <TouchableOpacity
                    style={[
                      styles.buttonContainer,
                      {marginLeft: 15, backgroundColor: 'hotpink'},
                    ]}
                    onPress={() => onPressProfile(data)}
                    hitSlop={getHitSlop(15)}>
                    <Image
                      source={images.arrowGraterthan}
                      style={styles.arrowStyle}
                    />
                  </TouchableOpacity>
                )} */}

                    {/* Team member */}

                    {groupObjNew?.who_can_see_member_profile === 2 &&
                      members.some(
                        (el) => el.user_id === authContext.user.user_id,
                      ) && (
                        <TouchableOpacity
                          style={[
                            styles.buttonContainer,
                            {marginLeft: 15, backgroundColor: 'yellow'},
                          ]}
                          onPress={() => onPressProfile(data)}
                          hitSlop={getHitSlop(15)}>
                          <Image
                            source={images.arrowGraterthan}
                            style={styles.arrowStyle}
                          />
                        </TouchableOpacity>
                      )}

                    {/* Team admin only */}
                    {groupObjNew?.who_can_see_member_profile === 4 &&
                      groupObjNew?.am_i_admin && (
                        <TouchableOpacity
                          style={[
                            styles.buttonContainer,
                            {marginLeft: 15, backgroundColor: 'green'},
                          ]}
                          onPress={() => onPressProfile(data)}
                          hitSlop={getHitSlop(15)}>
                          <Image
                            source={images.arrowGraterthan}
                            style={styles.arrowStyle}
                          />
                        </TouchableOpacity>
                      )}

                    {/* club and team admin */}

                    {groupObjNew?.who_can_see_member_profile === 6 &&
                      clubToCheckAdmin && (
                        <TouchableOpacity
                          style={[styles.buttonContainer, {marginLeft: 15}]}
                          onPress={() => onPressProfile(data)}
                          hitSlop={getHitSlop(15)}>
                          <Image
                            source={images.arrowGraterthan}
                            style={styles.arrowStyle}
                          />
                        </TouchableOpacity>
                      )}

                    {groupObjNew?.who_can_see_member_profile === 6 &&
                      groupObjNew?.am_i_admin && (
                        <TouchableOpacity
                          style={[
                            styles.buttonContainer,
                            {marginLeft: 15, backgroundColor: 'orange'},
                          ]}
                          onPress={() => onPressProfile(data)}
                          hitSlop={getHitSlop(15)}>
                          <Image
                            source={images.arrowGraterthan}
                            style={styles.arrowStyle}
                          />
                        </TouchableOpacity>
                      )}

                    {/* to find club admin get the club deta */}
                  </>
                )}

              {groupObjNew?.entity_type === Verbs.entityTypeClub && (
                <>
                  {groupObjNew?.who_can_see_member_profile === 3 &&
                    members.some(
                      (el) => el.user_id === authContext.user.user_id,
                    ) && (
                      <TouchableOpacity
                        style={[styles.buttonContainer, {marginLeft: 15}]}
                        onPress={() => onPressProfile(data)}
                        hitSlop={getHitSlop(15)}>
                        <Image
                          source={images.arrowGraterthan}
                          style={styles.arrowStyle}
                        />
                      </TouchableOpacity>
                    )}

                  {/* club admin */}
                  {groupObjNew?.who_can_see_member_profile === 5 &&
                    groupObjNew?.am_i_admin && (
                      <TouchableOpacity
                        style={[styles.buttonContainer, {marginLeft: 15}]}
                        onPress={() => onPressProfile(data)}
                        hitSlop={getHitSlop(15)}>
                        <Image
                          source={images.arrowGraterthan}
                          style={styles.arrowStyle}
                        />
                      </TouchableOpacity>
                    )}
                </>
              )}

              {groupObjNew?.entity_type === Verbs.entityTypeTeam &&
                !groupObjNew?.parent_groups?.length > 0 && (
                  <>
                    {groupObjNew?.who_can_see_member_profile === 2 &&
                      members.some(
                        (el) => el.user_id === authContext.user.user_id,
                      ) && (
                        <TouchableOpacity
                          style={[styles.buttonContainer, {marginLeft: 15}]}
                          onPress={() => onPressProfile(data)}
                          hitSlop={getHitSlop(15)}>
                          <Image
                            source={images.arrowGraterthan}
                            style={styles.arrowStyle}
                          />
                        </TouchableOpacity>
                      )}

                    {groupObjNew?.who_can_see_member_profile === 4 &&
                      groupObjNew?.am_i_admin && (
                        <TouchableOpacity
                          style={[styles.buttonContainer, {marginLeft: 15}]}
                          onPress={() => onPressProfile(data)}
                          hitSlop={getHitSlop(15)}>
                          <Image
                            source={images.arrowGraterthan}
                            style={styles.arrowStyle}
                          />
                        </TouchableOpacity>
                      )}
                  </>
                )}
            </View>
          );
        }
        return <View />;
      }
      if (authContext.entity.uid !== data?.user_id && data?.connected) {
        return (
          <View style={{flexDirection: 'row'}}>
            <TCFollowUnfollwButton
              outerContainerStyles={styles.firstButtonOuterStyle}
              style={styles.firstButtonStyle}
              title={strings.follow}
              isFollowing={data.is_following}
              startGradientColor={colors.lightGrey}
              endGradientColor={colors.lightGrey}
              onPress={() => {
                onUserAction('follow', data, index);
              }}
            />

            {groupObj?.who_can_see_member_profile === 2 && (
              <TouchableOpacity
                style={[styles.buttonContainer, {marginLeft: 15}]}
                onPress={() => onPressProfile(data)}
                hitSlop={getHitSlop(15)}>
                <Image
                  source={images.arrowGraterthan}
                  style={styles.arrowStyle}
                />
              </TouchableOpacity>
            )}
          </View>
        );
      }

      return <View />;
    },
    [
      authContext.entity.role,
      authContext.entity.uid,
      groupID,
      onPressProfile,
      onUserAction,
    ],
  );

  const renderMembers = useCallback(
    ({item: data, index}) => (
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
                disabled={!data.connected}
                onPress={() => onPressProfilePhotoAndTitle(data)}
                style={styles.imageTouchStyle}>
                <Image
                  source={
                    data.thumbnail
                      ? {uri: data.thumbnail}
                      : images.profilePlaceHolder
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              <View style={styles.topTextContainer}>
                <TouchableOpacity
                  disabled={!data.connected}
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => onPressProfilePhotoAndTitle(data)}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {data.first_name} {data.last_name}
                  </Text>
                  {!data.connected && (
                    <Image
                      source={images.unlinked}
                      style={styles.unlinedImage}
                    />
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {data?.is_admin && (
                    <TCUserRoleBadge
                      title={strings.admin}
                      titleColor={colors.themeColor}
                      gradientColor={colors.lightGrayBackground}
                      gradientColor1={colors.lightGrayBackground}
                      style={{
                        marginLeft: 5,
                      }}
                    />
                  )}
                  {data?.is_coach && (
                    <TCUserRoleBadge
                      title={strings.coach}
                      titleColor={colors.greeColor}
                      gradientColor={colors.lightGrayBackground}
                      gradientColor1={colors.lightGrayBackground}
                      style={{
                        marginLeft: 5,
                      }}
                    />
                  )}
                  {data?.is_member && (
                    <TCUserRoleBadge
                      title={strings.player}
                      titleColor={colors.playerBadgeColor}
                      gradientColor={colors.lightGrayBackground}
                      gradientColor1={colors.lightGrayBackground}
                      style={{
                        marginLeft: 5,
                      }}
                    />
                  )}
                  {data?.is_parent && (
                    <TCUserRoleBadge
                      title={strings.parentBadgeText}
                      titleColor={colors.yellowColor}
                      gradientColor={colors.lightGrayBackground}
                      gradientColor1={colors.lightGrayBackground}
                      style={{
                        marginLeft: 5,
                      }}
                    />
                  )}
                  {data?.is_others && (
                    <TCUserRoleBadge
                      title={strings.other}
                      titleColor={colors.veryLightBlack}
                      gradientColor={colors.lightGrayBackground}
                      gradientColor1={colors.lightGrayBackground}
                      style={{
                        marginLeft: 5,
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
          {renderFollowUnfollowArrow(data, index)}
        </View>
        <TCThinDivider />
      </>
    ),
    [onPressProfilePhotoAndTitle, renderFollowUnfollowArrow],
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View
        style={{
          opacity: isAccountDeactivated ? 0.5 : 1,
        }}
        pointerEvents={pointEvent}>
        {currentRoute === 'GroupMembersScreen' && (
          <Header
            leftComponent={
              <Text style={styles.eventTitleTextStyle}>
                {strings.membersTitle}
              </Text>
            }
            showBackgroundColor={true}
            rightComponent={
              <View>
                {switchUser.uid === groupID && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableWithoutFeedback
                      onPress={() => actionSheet.current.show()}>
                      <Image
                        source={images.createMember}
                        style={styles.createMemberStyle}
                      />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => actionSheetPlus.current.show()}>
                      <Image
                        source={images.vertical3Dot}
                        style={styles.navigationRightItem}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                )}
              </View>
            }
          />
        )}
        <View style={styles.headerSeperator} />
      </View>
      <View tabLabel={strings.membersTitle} style={{flex: 1}}>
        <View style={styles.searchBarView}>
          <TCSearchBox
            onChangeText={(text) => searchFilterFunction(text)}
            placeholderText={strings.searchText}
            style={{
              height: 40,
            }}
          />
        </View>
        {/* eslint-disable-next-line no-nested-ternary */}
        {members.length > 0 ? (
          <FlatList
            style={{marginTop: -10}}
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
        options={[
          strings.inviteMemberText,
          strings.createMemberProfileText,
          strings.cancel,
        ]}
        userInterfaceStyle="light"
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('InviteMembersBySearchScreen');
          } else if (index === 1) {
            navigation.navigate('CreateMemberProfileForm1');
          }
        }}
      />

      <ActionSheet
        ref={actionSheetPlus}
        options={[
          strings.sendrequestForBaicInfoText,
          strings.invoice,
          strings.privacyPolicy,
          strings.cancel,
        ]}
        userInterfaceStyle="light"
        cancelButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('RequestMultipleBasicInfoScreen', {groupID});
          } else if (index === 1) {
            Alert.alert(strings.underDevelopment);
          } else if (index === 2) {
            navigation.navigate('MembersViewPrivacyScreen', {groupID});
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
    margin: 15,
  },
  navigationRightItem: {
    height: 25,
    marginRight: 10,
    resizeMode: 'contain',
    width: 25,
  },
  createMemberStyle: {
    height: 25,
    marginRight: 15,
    resizeMode: 'contain',
    width: 25,
  },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'cover',
    width: 40,
    borderRadius: 80,
  },
  roleViewContainer: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topViewContainer: {
    flexDirection: 'row',

    height: 35,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },

  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    marginRight: 10,
    fontFamily: fonts.RMedium,
    lineHeight: 24,
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
  unlinedImage: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  imageTouchStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  eventTitleTextStyle: {
    width: 120,
    textAlign: 'center',
    fontFamily: fonts.RBold,

    fontSize: 20,
    lineHeight: 18,
    paddingTop: 5,
    color: colors.lightBlackColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSeperator: {
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 0,
    height: 2,
    width: '100%',
  },
  backArrowStyle: {
    height: 22,
    marginLeft: 10,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
  firstButtonStyle: {
    paddingHorizontal: 12,
  },
  firstButtonOuterStyle: {
    width: 100,
    height: 30,
    paddingTop: 5,
    padding: 6,

    borderRadius: 5,
  },
});
