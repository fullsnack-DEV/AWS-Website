/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */

import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigationState,
} from '@react-navigation/native';

import ActionSheet from '@alessiocancian/react-native-actionsheet';

import AuthContext from '../../../auth/context';
import TCSearchBox from '../../../components/TCSearchBox';

import {
  getGroupDetails,
  getGroupMembers,
  getJoinedGroups,
} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';

import {strings} from '../../../../Localization/translation';

import fonts from '../../../Constants/Fonts';
import TCUserRoleBadge from '../../../components/TCUserRoleBadge';
import TCThinDivider from '../../../components/TCThinDivider';
import {getHitSlop} from '../../../utils';
import {followUser, unfollowUser} from '../../../api/Users';
import TCFollowUnfollwButton from '../../../components/TCFollowUnfollwButton';
import Verbs from '../../../Constants/Verbs';
import Header from '../../../components/Home/Header';
import GroupMemberShimmer from './GroupMemberShimmer';
import ScreenHeader from '../../../components/ScreenHeader';

export default function GroupMembersScreen({navigation, route}) {
  const actionSheet = useRef();
  const actionSheetPlus = useRef();
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [searchMember, setSearchMember] = useState();

  const [members, setMembers] = useState([]);

  const [switchUser] = useState(authContext.entity);

  const [pointEvent] = useState('auto');
  const [active, setActive] = useState(true);

  const [groupObjNew, setGroupObjNew] = useState({});
  const [groupID] = useState(route.params?.groupID ?? authContext.entity.uid);
  const routes = useNavigationState((state) => state.routes);
  const currentRoute = routes[0].name;
  const [userJoinedGrpList, setUserJoinedGrpList] = useState();
  const [clubToCheckAdmin, setClubToCheckAdmin] = useState(false);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: isFocused ? 'flex' : 'none',
      },
    });
  }, [navigation, isFocused]);

  const callGroup = async (groupIDs, authContexts) => {
    const response = await getGroupDetails(groupIDs, authContexts);

    setGroupObjNew(response.payload);
  };
  const getGroupsLoggedInUser = useCallback(() => {
    getJoinedGroups(Verbs.entityTypeClub, authContext).then((response) => {
      setUserJoinedGrpList(response.payload);
    });
  }, [authContext]);

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
          const unsortedReponse = response.payload;
          unsortedReponse.sort((a, b) =>
            a.first_name.normalize().localeCompare(b.first_name.normalize()),
          );

          const adminMembers = unsortedReponse.filter(
            (item) => item.is_admin === true,
          );

          const normalMembers = unsortedReponse.filter(
            (item) => item.is_admin !== true,
          );

          const SortedMembers = [...adminMembers, ...normalMembers];

          setMembers(SortedMembers);

          setSearchMember(SortedMembers);
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

  useEffect(() => {
    callGroup(groupID, authContext);
    getGroupsLoggedInUser();
  }, [authContext, getGroupsLoggedInUser, groupID]);

  const searchFilterFunction = (text) => {
    const filteredData = members.filter((item) => {
      const fullName = `${item.first_name}${item.last_name}`.toLowerCase();

      return fullName.includes(text);
    });

    if (text.length > 0) {
      setMembers(filteredData);
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
    const commonClub = authContext.entity.obj?.clubIds?.filter((el) =>
      groupObjNew?.parent_groups?.includes(el),
    );

    const response = await getGroupDetails(commonClub[0], authContext);

    setClubToCheckAdmin(response.payload.am_i_admin);
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
              hitSlop={getHitSlop(20)}>
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
                    {/* {groupObjNew?.who_can_see_member_profile ===
                      Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS &&
                      userJoinedGrpList?.some((el) =>
                        groupObjNew?.parent_groups?.includes(el.group_id),
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
                      )} */}

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

                    {/* {groupObjNew?.who_can_see_member_profile ===
                      Verbs.PRIVACY_GROUP_MEMBER_TEAMMEMBERS &&
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
                      )} */}

                    {/* Team admin only */}
                    {groupObjNew?.who_can_see_member_profile ===
                      Verbs.PRIVACY_GROUP_MEMBER_TEAM &&
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

                    {/* club and team admin */}

                    {groupObjNew?.who_can_see_member_profile ===
                      Verbs.PRIVACY_GROUP_MEMBER_TEAMCLUB &&
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

                    {/* {groupObjNew?.who_can_see_member_profile ===
                      Verbs.PRIVACY_GROUP_MEMBER_TEAMCLUB &&
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
                      )} */}

                    {/* to find club admin get the club deta */}
                  </>
                )}

              {groupObjNew?.entity_type === Verbs.entityTypeClub && (
                <>
                  {/* {groupObjNew?.who_can_see_member_profile ===
                    Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS &&
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
                    )} */}

                  {/* club admin */}
                  {/* {groupObjNew?.who_can_see_member_profile ===
                    Verbs.PRIVACY_GROUP_MEMBER_CLUB &&
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
                    )} */}
                </>
              )}

              {groupObjNew?.entity_type === Verbs.entityTypeTeam &&
                !groupObjNew?.parent_groups?.length > 0 && (
                  <>
                    {/* {groupObjNew?.who_can_see_member_profile ===
                      Verbs.PRIVACY_GROUP_MEMBER_TEAMMEMBERS &&
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
                      )} */}
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                    alignSelf: 'flex-start',
                  }}
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
                {(authContext.entity.obj.entity_type === Verbs.entityTypeTeam ||
                  authContext.entity.obj.entity_type ===
                    Verbs.entityTypeClub) && (
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
                    {data?.is_player && (
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
                )}
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

  const SearchBox = () => (
    <View style={styles.searchBarView}>
      <TCSearchBox
        onChangeText={(text) => searchFilterFunction(text)}
        placeholderText={strings.searchText}
        style={{
          height: 40,
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View
        style={{
          opacity: authContext.isAccountDeactivated ? 0.5 : 1,
        }}
        pointerEvents={pointEvent}>
        <ScreenHeader
          leftIcon={images.backArrow}
          leftIconPress={() => navigation.goBack()}
          title={strings.membersTitle}
          rightIcon1={switchUser.uid === groupID ? images.createMember : null}
          rightIcon2={switchUser.uid === groupID ? images.vertical3Dot : null}
          rightIcon1Press={() => actionSheet.current.show()}
          rightIcon2Press={() => actionSheetPlus.current.show()}
        />
      </View>
      <View tabLabel={strings.membersTitle} style={{flex: 1}}>
        {SearchBox()}

        {/* eslint-disable-next-line no-nested-ternary */}
        {members.length > 0 ? (
          <FlatList
            extraData={members}
            style={{marginTop: -10}}
            data={members}
            renderItem={renderMembers}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.first_name}/${index}`}
          />
        ) : (
          <GroupMemberShimmer />
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
            navigation.navigate('RequestMultipleBasicInfoScreen', {
              groupID,
            });
          } else if (index === 1) {
            Alert.alert(strings.underDevelopment);
          } else if (index === 2) {
            navigation.navigate('MembersViewPrivacyScreen', {groupID});
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  searchBarView: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 20,
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

    paddingLeft: 50,
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
