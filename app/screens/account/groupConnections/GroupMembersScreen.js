/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */

import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  BackHandler,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import AuthContext from '../../../auth/context';

import {
  getGroupDetails,
  getGroupMembers,
  getJoinedGroups,
} from '../../../api/Groups';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import TCUserRoleBadge from '../../../components/TCUserRoleBadge';
import TCThinDivider from '../../../components/TCThinDivider';
import {getHitSlop, getStorage} from '../../../utils';
import {followUser, unfollowUser} from '../../../api/Users';
import TCFollowUnfollwButton from '../../../components/TCFollowUnfollwButton';
import Verbs from '../../../Constants/Verbs';
import GroupMemberShimmer from './GroupMemberShimmer';
import ScreenHeader from '../../../components/ScreenHeader';
import SendNewInvoiceModal from '../Invoice/SendNewInvoiceModal';
import InviteMemberModal from '../../../components/InviteMemberModal';
import RequestBasicInfoModal from './RequestBasicInfoModal';
import MemberFilterModal from './MemberFilterModal';
import {getPendingRequest} from '../../../api/Notificaitons';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import BottomSheet from '../../../components/modals/BottomSheet';
import PrivacySettingsModal from '../../../components/PrivacySettingsModal';
import {
  PrivacyKeyEnum,
  defaultClubPrivacyOptions,
  groupDefaultPrivacyOptionsForDoubleTeam,
  groupInviteToJoinForTeamSportOptions,
  groupInviteToJoinOptions,
  groupJoinOptions,
  inviteToJoinClubOptions,
} from '../../../Constants/PrivacyOptionsConstant';
import RequestBasicInfoInformationModal from './RequestBasicInfoInformationModal';

export default function GroupMembersScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [searchMember, setSearchMember] = useState();
  const [searchText, setSearchText] = useState('');
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [members, setMembers] = useState([]);

  const [switchUser] = useState(authContext.entity);
  const [sendNewInvoice, SetSendNewInvoice] = useState(false);

  const [pointEvent] = useState('auto');
  const [active, setActive] = useState(true);

  const [groupObjNew, setGroupObjNew] = useState({});
  const [groupID] = useState(route.params?.groupID ?? authContext.entity.uid);
  const [userJoinedGrpList, setUserJoinedGrpList] = useState();
  const [clubToCheckAdmin, setClubToCheckAdmin] = useState(false);
  const [visibleFilterModal, setVisibleFilterModal] = useState(false);
  const [pendingReqNumber, setpendingReqNumber] = useState(10);
  const [filterloading, setFilterLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shimmerLoading, setShimmerLoading] = useState(false);
  const [showActionSheetPlus, setShowActionSheetPlus] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showViewPrivacyModal, setShowViewPrivacyModal] = useState(false);
  const [selectedPrivacyOption, setSelectedPrivacyOption] = useState({});
  const [viewPrivacyOptions, setViewPrivacyOptions] = useState([]);

  const [tagArray, setTagArray] = useState([]);
  const [connectedArray, setConnectArray] = useState([]);
  const [filteredTeams, setFilterTeams] = useState([]);

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);


  useEffect(() => {
    if (isFocused) {
      if (authContext.entity.role === Verbs.entityTypeTeam) {
        setViewPrivacyOptions([
          {
            question: 'whoCanJoinYourTeam',
            options: groupJoinOptions,
            key: PrivacyKeyEnum.JoinAsMember,
          },
          {
            question: 'whoCanInvitePersonToJoinYourTeam',
            options:
              authContext.entity.obj.sport_type === Verbs.doubleSport
                ? groupInviteToJoinOptions
                : groupInviteToJoinForTeamSportOptions,
            key: PrivacyKeyEnum.InvitePersonToJoinGroup,
          },
          {
            question: 'whoCanViewYourTeamMembers',
            options: groupDefaultPrivacyOptionsForDoubleTeam,
            key: PrivacyKeyEnum.ViewYourGroupMembers,
          },
        ]);
      } else if (authContext.entity.role === Verbs.entityTypeClub) {
        setViewPrivacyOptions([
          {
            question: 'whoCanJoinYourClub',
            options: groupJoinOptions,
            key: PrivacyKeyEnum.JoinAsMember,
          },
          {
            question: 'whoCanInviteToJoinClub',
            options: inviteToJoinClubOptions,
            key: PrivacyKeyEnum.InvitePersonToJoinGroup,
          },
          {
            question: 'whoCanViewClubMembers',
            options: defaultClubPrivacyOptions,
            key: PrivacyKeyEnum.ViewYourGroupMembers,
          },
        ]);
      }
    }
  }, [isFocused, authContext.entity.role]);

  useEffect(() => {
    if (isFocused && viewPrivacyOptions.length > 0) {
      const obj = {};
      viewPrivacyOptions.forEach((item) => {
        const privacyVal =
          authContext.entity.obj[item.key] !== undefined
            ? authContext.entity.obj[item.key]
            : 1;
        const option = item.options.find((ele) => ele.value === privacyVal);
        obj[item.key] = option;
      });

      setSelectedPrivacyOption(obj);
    }
  }, [isFocused, authContext.entity.obj, viewPrivacyOptions]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(strings.holdOn, strings.doYouWantToExit, [
        {
          text: strings.cancel,
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: strings.yes,
          onPress: () => BackHandler.exitApp(),
          style: 'destructive',
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const callGroup = async (groupIDs, authContexts) => {
    const response = await getGroupDetails(groupIDs, authContexts);

    setGroupObjNew(response.payload);
  };
  const getGroupsLoggedInUser = useCallback(() => {
    getJoinedGroups(Verbs.entityTypeClub, authContext).then((response) => {
      setUserJoinedGrpList(response.payload);
    });
  }, [authContext]);

  const getPendingRequestData = () => {
    const entity = authContext.entity.obj;

    const params = {
      uid: entity.group_id,
    };

    getPendingRequest(params, authContext).then(async (response) => {
      setloading(false);

      setpendingReqNumber(response.payload.requests.length);
    });
  };

  useEffect(() => {
    if (visibleFilterModal) {
      setTimeout(() => {
        getMembers(groupID, authContext);
      }, 300);
    }

    getPendingRequestData();
  }, [visibleFilterModal]);

  useFocusEffect(
    React.useCallback(() => {
      getMembers(groupID, authContext);
    }, [active, authContext, groupID]),
  );

  // eslint-disable-next-line consistent-return
  const getFilteredMember = (roleArray, connectArray, filterTeams = []) => {
    const resultfilterTeams = filterTeams.filter(
      (item) => item !== Verbs.ALL_ROLE && item !== Verbs.NonTeamMember_Role,
    );

    const isNonTeamMember = filterTeams.includes(Verbs.NonTeamMember_Role);

    const resultString = resultfilterTeams.join(',');

    if (filterTeams.length >= 1) {
      if (filterTeams.includes(Verbs.ALL_ROLE)) {
        getOtherTeamsFilterMembers(
          groupID,
          authContext,
          roleArray,
          connectArray,
        );

        return;
      }

      getOtherTeamsFilterMembers(
        groupID,
        authContext,
        roleArray,
        connectArray,
        resultString,
        isNonTeamMember,
      );
      return;
    }

    const filteredMembers = searchMember.filter((item) => {
      // Role Filter

      if (
        !roleArray.includes(Verbs.ALL_ROLE, Verbs.NOROLE_ROLE) &&
        !connectArray.length > 0
      ) {
        if (roleArray.some((role) => item[role] === true)) {
          return item;
        }
      }

      if (
        roleArray.length > 0 &&
        !roleArray.includes(Verbs.ALL_ROLE, Verbs.NOROLE_ROLE) &&
        connectArray.length > 0 &&
        !connectArray.includes(Verbs.ALL_ROLE)
      ) {
        if (
          roleArray.some((role) => item[role] === true) &&
          connectArray.some((connected) => item.connected === connected)
        ) {
          return item;
        }
      }

      if (roleArray.includes(Verbs.ALL_ROLE)) {
        if (
          connectArray.includes(true) &&
          !connectArray.includes(Verbs.ALL_ROLE)
        ) {
          return item.connected === true;
        }
        if (
          connectArray.includes(false) &&
          !connectArray.includes(Verbs.ALL_ROLE)
        ) {
          return item.connected === false;
        }
        return true;
      }

      if (roleArray.includes(Verbs.NOROLE_ROLE)) {
        const propertiesToCheck = [
          Verbs.ADMIN_ROLE,
          Verbs.PLAYER_ROLE,
          Verbs.COACH_ROLE,
          Verbs.PARENT_ROLE,
        ];

        const hasAllFalseProperties = propertiesToCheck.every(
          (prop) =>
            // Check if the property exists and is set to false, or if it doesn't exist
            typeof item[prop] === 'undefined' || item[prop] === false,
        );

        if (hasAllFalseProperties) {
          return item;
        }
      }

      // connected All
      if (roleArray.includes(Verbs.ALL_ROLE)) {
        return true;
      }

      if (connectArray.includes(Verbs.ALL_ROLE)) {
        if (roleArray.some((role) => item[role] === true)) {
          return item;
        }
      }

      return false;
    });

    setSearchMember(filteredMembers);
  };

  const handleRefresh = () => {
    getMembers(groupID, authContext);
    setIsRefreshing(true);
  };

  const getOtherTeamsFilterMembers = async (
    groupIDs,
    authContexts,
    roleArray,
    connectArray,
    grp_ids = '',
    isNonTeamMember = false,
  ) => {
    setFilterLoading(true);

    if (groupIDs) {
      getGroupMembers(groupIDs, authContexts, grp_ids)
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

          // filtering for Role and connect
          const filteredMembers = SortedMembers.filter((item) => {
            if (roleArray.includes(Verbs.ALL_ROLE)) {
              if (
                connectArray.includes(true) &&
                !connectArray.includes(Verbs.ALL_ROLE)
              ) {
                return item.connected === true;
              }
              if (
                connectArray.includes(false) &&
                !connectArray.includes(Verbs.ALL_ROLE)
              ) {
                return item.connected === false;
              }
              return true;
            }

            if (roleArray.includes(Verbs.NOROLE_ROLE)) {
              const propertiesToCheck = [
                Verbs.ADMIN_ROLE,
                Verbs.PLAYER_ROLE,
                Verbs.COACH_ROLE,
                Verbs.PARENT_ROLE,
              ];

              const hasAllFalseProperties = propertiesToCheck.every(
                (prop) =>
                  // Check if the property exists and is set to false, or if it doesn't exist
                  typeof item[prop] === 'undefined' || item[prop] === false,
              );

              if (hasAllFalseProperties) {
                return item;
              }
            }
            // Role Filter
            if (roleArray.some((role) => item[role] === true)) {
              return item;
            }
            // connected All
            if (roleArray.includes(Verbs.ALL_ROLE)) {
              return true;
            }
            // connected Filter
            if (connectArray.some((role) => item.connected === role)) {
              return item;
            }

            return false;
          });

          if (isNonTeamMember) {
            const filteredResult = members.filter(
              (member) =>
                !filteredMembers.some(
                  (fMember) => fMember.user_id === member.user_id,
                ),
            );

            const nonMemberFilterResult = filteredResult.filter((item) => {
              // connected Filter

              if (connectArray.some((role) => item.connected === role)) {
                return item;
              }
              if (connectArray.includes(Verbs.ALL_ROLE)) {
                return item;
              }
              return false;
            });

            setMembers(nonMemberFilterResult);

            setSearchMember(nonMemberFilterResult);
            setFilterLoading(false);

            return;
          }

          setMembers(filteredMembers);

          setSearchMember(filteredMembers);

          setFilterLoading(false);
        })
        .catch((e) => {
          setFilterLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const getMembers = async (groupIDs, authContexts, grp_ids = '') => {
    // eslint-disable-next-line no-unused-expressions
    grp_ids.length >= 1 ? setFilterLoading(true) : setShimmerLoading(true);

    if (groupIDs) {
      getGroupMembers(groupIDs, authContexts, grp_ids)
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
          setShimmerLoading(false);
          setFilterLoading(false);
          setIsRefreshing(false);
        })
        .catch((e) => {
          setShimmerLoading(false);
          setFilterLoading(false);
          setIsRefreshing(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  useEffect(() => {
    callGroup(groupID, authContext);
    getGroupsLoggedInUser();
  }, [authContext, getGroupsLoggedInUser, groupID, isFocused]);

  useEffect(() => {
    if (searchText.length > 0) {
      const searchParts = searchText.toLowerCase().split(' ');
      const list = members.filter((item) =>
        searchParts.every(
          (part) =>
            item.first_name.toLowerCase().includes(part) ||
            item.last_name.toLowerCase().includes(part),
        ),
      );

      setSearchMember(list);
    } else {
      setSearchMember(members);
    }
  }, [searchText]);

  const onPressProfile = useCallback(
    (item) => {
      navigation.navigate('MebmersStack', {
        screen: 'MembersProfileScreen',
        params: {
          memberID: item?.user_id,
          whoSeeID: item?.group_id,
          groupID,
          members,
          routeParams: {...route.params},
          group_sport_type: groupObjNew.sport_type,
        },
      });
    },
    [navigation, groupID, members, route.params, groupObjNew.sport_type],
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
        if (item?.is_player) {
          const groupInfo = route.params?.groupObj ?? {
            ...authContext.entity.obj,
          };
          const obj = {
            sport: groupInfo.sport,
            sportType: groupInfo.sport_type,
            uid: item.user_id,
            entityType: Verbs.entityTypePlayer,
            parentStack: 'App',
            backScreen: 'Members',
            backScreenParams: route.params
              ? {...route.params}
              : {groupID: authContext.entity.uid},
          };
          navigation.navigate('HomeStack', {
            screen: 'SportActivityHome',
            params: obj,
          });
        } else {
          navigation.push('HomeStack', {
            screen: 'HomeScreen',
            params: {
              uid: item?.user_id,
              role: Verbs.entityTypeUser,
              Groupmembers: members,
            },
          });
        }
      }
    },
    [members, navigation, route.params, authContext.entity],
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
            </View>
          );
        }
        return <View />;
      }
      if (
        authContext.entity.uid !== data?.user_id &&
        data?.connected &&
        (authContext.entity.role !== Verbs.entityTypeTeam ||
          authContext.entity.role !== Verbs.entityTypeClub)
      ) {
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
                    {data?.is_other && data?.other_role !== '' && (
                      <TCUserRoleBadge
                        title={data.other_role}
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
      <View style={styles.floatingInput}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.userPostTimeColor}
            style={styles.textInputStyle}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
            }}
            placeholder={strings.searchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
              }}>
              <Image
                source={images.closeRound}
                style={{height: 15, width: 15}}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setVisibleFilterModal(true)}>
            <Image source={images.filterIcon} style={{height: 25, width: 25}} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleBackPress = useCallback(() => {
    if (route.params?.comeFrom === 'HomeScreen') {
      navigation.setOptions({});
      navigation.navigate('HomeStack', {
        screen: 'HomeScreen',
        params: {
          ...route.params?.routeParams,

          comeFrom: 'GroupMemberScreen',
        },
      });
    } else if (route.params?.comeFrom) {
      navigation.setOptions({});
      navigation.navigate(route.params?.comeFrom, {
        ...route.params?.routeParams,
      });
    } else {
      navigation.goBack();
    }
  }, [route.params, navigation]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={filterloading} />

      <View
        style={{
          opacity: authContext.isAccountDeactivated ? 0.5 : 1,
        }}
        pointerEvents={pointEvent}>
        <ScreenHeader
          leftIcon={route.params?.showBackArrow ? images.backArrow : null}
          leftIconPress={handleBackPress}
          title={strings.membersTitle}
          rightIcon1={switchUser.uid === groupID ? images.createMember : null}
          rightIcon2={switchUser.uid === groupID ? images.vertical3Dot : null}
          rightIcon1Press={() => {
            if (authContext.entity.obj?.is_pause) {
              return;
            }
            setShowActionSheet(true);
          }}
          rightIcon2Press={() => {
            if (authContext.entity.obj?.is_pause) {
              return;
            }
            setShowActionSheetPlus(true);
          }}
          iconContainerStyle={{marginRight: 7}}
        />
      </View>
      <View tabLabel={strings.membersTitle} style={{flex: 1}}>
        {SearchBox()}

        {shimmerLoading ? (
          <GroupMemberShimmer />
        ) : (
          <FlatList
            style={{marginTop: -10}}
            extraData={searchMember}
            data={searchMember}
            renderItem={renderMembers}
            ListHeaderComponent={() => (
              <FlatList
                data={tagArray}
                horizontal
                style={{marginLeft: 15}}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingVertical: 5,
                  marginBottom: 5,
                }}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.textContainer,
                      index !== 0 ? {marginLeft: 15} : {},
                    ]}>
                    <View>
                      <Text style={styles.tagTitleText}>{item}</Text>
                    </View>
                    <View style={styles.dividerImage} />
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => {
                        console.log(item);
                        const filterRoles = tagArray.filter((i) => i !== item);
                        if (filterRoles.length === 0) {
                          getMembers(groupID, authContext);
                          setTagArray(filterRoles);
                        } else {
                          setTagArray(filterRoles);
                          getFilteredMember(
                            filterRoles,
                            connectedArray,
                            filteredTeams,
                          );
                        }
                      }}>
                      <Image source={images.cancelImage} style={styles.image} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.listemptyView}>
                <Text style={{textAlign: 'center'}}>
                  {strings.liseemptyText}
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            keyExtractor={(item, index) => `${item.first_name}/${index}`}
          />
        )}
      </View>

      <BottomSheet
        isVisible={showActionSheet}
        closeModal={() => setShowActionSheet(false)}
        optionList={[strings.inviteMemberText, strings.createMemberProfileText]}
        onSelect={(option) => {
          setShowActionSheet(false);
          switch (option) {
            case strings.inviteMemberText:
              setShowInviteMember(true);
              break;

            case strings.createMemberProfileText:
              navigation.navigate('MebmersStack', {
                screen: 'CreateMemberProfileForm1',
                params: {
                  routeParams: {...route.params},
                },
              });
              break;

            default:
              break;
          }
        }}
      />

      <BottomSheet
        optionList={[
          strings.sendrequestForBaicInfoText,
          strings.invoice,
          strings.privacyPolicy,
        ]}
        isVisible={showActionSheetPlus}
        closeModal={() => setShowActionSheetPlus(false)}
        onSelect={(option) => {
          setShowActionSheetPlus(false);
          switch (option) {
            case strings.sendrequestForBaicInfoText:
              setShowInfoModal(true);
              setTimeout(() => {
                getStorage('showPopup').then((res) => {
                  const isShow = res[groupID];
                  if (!isShow) {
                    setIsInfoModalVisible(true);
                  }
                });
              }, 300);
              break;

            case strings.invoice:
              setTimeout(() => {
                SetSendNewInvoice(true);
              }, 20);
              break;

            case strings.privacyPolicy:
              // setVisiblePrivacyModal(true);
              setShowViewPrivacyModal(true);
              break;

            default:
              break;
          }
          setShowActionSheetPlus(false);
        }}
      />

      <PrivacySettingsModal
        isVisible={showViewPrivacyModal}
        closeModal={() => setShowViewPrivacyModal(false)}
        title={strings.viewPrivacySettings}
        options={viewPrivacyOptions}
        onSelect={(key, option) => {
          const obj = {...selectedPrivacyOption};
          obj[key] = option;
          setSelectedPrivacyOption(obj);
        }}
        selectedOptions={selectedPrivacyOption}
        onSave={() => {
          setShowViewPrivacyModal(false);
        }}
      />

      <SendNewInvoiceModal
        isVisible={sendNewInvoice}
        onClose={() => SetSendNewInvoice(false)}
      />

      <InviteMemberModal
        isVisible={showInviteMember}
        closeModal={() => setShowInviteMember(false)}
        members={members}
      />
      <RequestBasicInfoModal
        isVisible={showInfoModal}
        groupID={groupID}
        closeModal={() => setShowInfoModal(false)}
      />

      <RequestBasicInfoInformationModal
        isVisible={isInfoModalVisible}
        closeModal={() => {
          setIsInfoModalVisible(false);
        }}
        groupId={groupID}
      />

      <MemberFilterModal
        visible={visibleFilterModal}
        groupID={groupID}
        authContext={authContext}
        closeModal={() => setVisibleFilterModal(false)}
        onApplyPress={(role, connectArray, filterTeams) => {
          getFilteredMember(role, connectArray, filterTeams);
          setVisibleFilterModal(false);
          setTagArray(role);
          setConnectArray(connectArray);
          setFilterTeams(filterTeams);
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
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 20,
    zIndex: -1,
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
  listemptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 300,
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
  },
  textContainer: {
    height: 25,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: colors.textFieldBackground,
  },
  closeButton: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  dividerImage: {
    width: 1,
    height: 25,
    backgroundColor: colors.bgColor,
    marginLeft: 10,
    marginRight: 5,
  },

  tagTitleText: {
    fontSize: 12,
    lineHeight: 21,
    textAlign: 'center',
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
