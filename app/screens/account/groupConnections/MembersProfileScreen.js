/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-param-reassign  */
/* eslint-disable no-prototype-builtins  */

import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  Linking,
  Pressable,
  Platform,
  Animated,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';

import {
  getGroupMembersInfo,
  deleteMember,
  patchMember,
  sendBasicInfoRequest,
  getGroupMembers,
} from '../../../api/Groups';
import locationModalStyles from '../../../Constants/LocationModalStyle';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCProfileView from '../../../components/TCProfileView';
import TCThickDivider from '../../../components/TCThickDivider';
import TCInfoField from '../../../components/TCInfoField';
import {strings} from '../../../../Localization/translation';
import TCMessageButton from '../../../components/TCMessageButton';
import TCThinDivider from '../../../components/TCThinDivider';
import GroupMembership from '../../../components/groupConnections/GroupMembership';
import TCInnerLoader from '../../../components/TCInnerLoader';
import TCMemberProfile from '../../../components/TCMemberProfile';
import {shortMonthNames} from '../../../utils/constant';
import Verbs from '../../../Constants/Verbs';
import {sendInvitationInGroup} from '../../../api/Users';
import {getHitSlop, getJSDate, showAlert} from '../../../utils';
import TCProfileButton from '../../../components/TCProfileButton';
import TCKeyboardView from '../../../components/TCKeyboardView';

import TCLable from '../../../components/TCLabel';
import TCTextField from '../../../components/TCTextField';

let entity = {};
export default function MembersProfileScreen({navigation, route}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  // const [editable, setEditable] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [editBasicInfo, setEditBasicInfo] = useState(false);
  const [editTeam, setEditTeam] = useState(false);
  const [editMembership, setEditMembership] = useState(false);
  const [memberDetail, setMemberDetail] = useState();
  const [switchUser, setSwitchUser] = useState({});
  const [from] = useState(route?.params?.from);
  const [groupID] = useState(route?.params?.groupID);
  const [memberID] = useState(route?.params?.memberID);
  const [whoSeeID] = useState(route?.params?.whoSeeID);
  const [members, setMembers] = useState(route.params?.members);
  const [visibleRefranceModal, setVisibleRefranceModal] = useState(false);
  const [visibleNotesModal, setVisibleNotesModal] = useState(false);
  const [memberInfo, setMemberInfo] = useState({});
  const [groupMemberDetail, setGroupMemberDetail] = useState({});
  const [showBasicInfoRequestModal, setShowBasicInfoRequestModal] =
    useState(false);
  const [showAdminPrivillege, setShowAdminPrivillege] = useState(false);
  const [positions, setPositions] = useState();
  const [setting, setSetting] = useState({
    is_member: true,
    is_admin: memberDetail?.is_admin,
  });
  const [showSwitchScreen, setShowSwitchScreen] = useState(false);

  entity = authContext.entity;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: showSwitchScreen ? false : true,

      headerRight: () =>
        whoSeeID === entity.uid &&
        !loading && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback>
              <Image
                source={images.invoiceIcon}
                style={[
                  styles.navigationRightItem,
                  {marginRight: memberDetail?.connected ? 5 : 12},
                ]}
              />
            </TouchableWithoutFeedback>

            {memberDetail?.connected && (
              <TouchableWithoutFeedback
                onPress={() => actionSheet?.current?.show()}>
                <Image
                  source={images.vertical3Dot}
                  style={[styles.navigationRightItem, {marginRight: 10}]}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
        ),
      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            if (from === 'CreateMemberProfileTeamForm3') {
              navigation.navigate('GroupMembersScreen');
            } else if (from === 'CreateMemberProfileClubForm3') {
              navigation.navigate('GroupMembersScreen');
            } else {
              navigation.navigate('GroupMembersScreen');
            }
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [
    navigation,
    memberDetail,
    editBasicInfo,
    editMembership,
    editTeam,
    switchUser,
    editProfile,
    loading,
    whoSeeID,
    from,
  ]);

  const editTeamProfile = useCallback(() => {
    setloading(true);
    const bodyParams = {};
    if (
      groupMemberDetail.jersey_number &&
      groupMemberDetail.jersey_number !== ''
    ) {
      bodyParams.jersey_number = groupMemberDetail.jersey_number;
    }
    if (groupMemberDetail.appearance && groupMemberDetail.appearance !== '') {
      bodyParams.appearance = groupMemberDetail.appearance;
    }
    if (groupMemberDetail.note && groupMemberDetail.note !== '') {
      bodyParams.note = groupMemberDetail.note;
    }
    if (positions?.length > 0) {
      bodyParams.positions = positions.filter(
        (obj) => !(obj && Object.keys(obj).length === 0),
      );
    }
    if (groupMemberDetail.status) {
      bodyParams.status = groupMemberDetail.status;
    }

    bodyParams.is_admin = groupMemberDetail.is_admin;
    bodyParams.is_coach = groupMemberDetail.is_coach;
    bodyParams.is_member = groupMemberDetail.is_member;
    bodyParams.is_parent = groupMemberDetail.is_parent;
    bodyParams.is_others = groupMemberDetail.is_others;

    const body = {
      ...bodyParams,
    };

    patchMember(
      groupMemberDetail.group_id,
      groupMemberDetail.user_id,
      body,
      authContext,
    )
      .then(() => {
        setloading(false);
        getMemberInformation();
        setVisibleRefranceModal(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, groupMemberDetail, navigation, positions]);

  const renderPosition = ({item, index}) => (
    <TCTextField
      value={item.position}
      onChangeText={(text) => {
        const tempPosition = [...positions];
        tempPosition[index] = text;
        setPositions(tempPosition);

        // setGroupMemberDetail({...groupMemberDetail, positions});
      }}
      placeholder={strings.positionPlaceholder}
      keyboardType={'default'}
      style={{marginBottom: 10, marginTop: 6}}
    />
  );

  const addPosition = () => {
    if (positions.length > 4) {
      return;
    }

    const obj = {};

    setPositions([...positions, obj]);
  };

  useEffect(() => {
    if (isFocused) {
      getMemberInformation();
      getMembers();
    }
  }, [isFocused, navigation, route]);

  useEffect(() => {
    setSetting({
      is_member: true,
      is_admin: memberDetail?.is_admin,
    });
  }, [isFocused, showAdminPrivillege]);

  useEffect(() => {
    if (memberDetail?.connected) {
      setEditProfile(false);
    }
  });

  const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  };

  const getMembers = async () => {
    setloading(true);
    if (groupID) {
      getGroupMembers(groupID, authContext)
        .then((response) => {
          setMembers(response.payload);

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

  const getMemberInformation = () => {
    if (!firstTimeLoad) setloading(true);
    entity = authContext.entity;
    setSwitchUser(entity);

    // Setting of Edit option

    getGroupMembersInfo(groupID, memberID, authContext)
      .then((response) => {
        setMemberDetail(response?.payload);

        if (entity.role === Verbs.entityTypeTeam) {
          setEditProfile(true);
          setEditBasicInfo(true);
          setEditTeam(true);
          setEditMembership(true);
        } else if (entity.role === Verbs.entityTypeClub) {
          if (response?.payload?.group?.parent_groups?.includes(entity.uid)) {
            setEditProfile(true);
            setEditBasicInfo(true);
            setEditTeam(false);
            setEditMembership(true);
          }
        } else if (whoSeeID === entity.uid) {
          setEditProfile(true);
          setEditBasicInfo(true);
        }

        setloading(false);
        if (firstTimeLoad) setFirstTimeLoad(false);
      })
      .catch((e) => {
        setloading(false);
        if (firstTimeLoad) setFirstTimeLoad(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const deleteMemberValidations = (groupId, memberId) => {
    const adminCount = members.filter((item) => item.is_admin === true);

    if (
      members.length === 1 &&
      adminCount.length === 1 &&
      memberID === authContext.entity.auth.user_id
    ) {
      Alert.alert(
        strings.appName,
        //  strings.lastmember,
        format(strings.lastmember, authContext.entity.role),
        [
          {
            text: 'Cancel',
            onPress: () => console.log('PRessed'),
          },
          {
            text: 'Remove',
            onPress: () => {
              const toaccount = true;

              onDeleteMemberProfile(groupId, memberId, toaccount);
            },
          },
        ],
      );
    } else if (
      memberID === authContext.entity.auth.user_id &&
      members.length > 1 &&
      adminCount.length >= 2
    ) {
      Alert.alert(
        strings.alertmessagetitle,
        format(
          strings.doYouWantToRemoText_dy,
          memberDetail.first_name,
          memberDetail.last_name,
          switchUser.obj.group_name,
        ),

        [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel cancel'),
            style: 'cancel',
          },
          {
            text: strings.removeTextTitle,
            style: 'destructive',
            onPress: () => {
              const toaccount = true;
              onDeleteMemberProfile(groupId, memberId, toaccount);
            },
          },
        ],
        {cancelable: false},
      );
    } else if (
      memberID === authContext.entity.auth.user_id &&
      members.length > 1 &&
      adminCount.length === 1
    ) {
      Alert.alert(
        strings.alertmessagetitle,
        format(
          strings.onlyAdmin,
          memberDetail.first_name,
          switchUser.obj.group_name,
        ),

        [
          {
            text: 'OK',
            onPress: () => console.log('PRessed'),
          },
        ],
        {cancelable: false},
      );
    } else {
      Alert.alert(
        strings.alertmessagetitle,
        format(
          strings.doYouWantToRemoText_dy,
          memberDetail.first_name,
          memberDetail.last_name,
          switchUser.obj.group_name,
        ),

        [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel cancel'),
            style: 'cancel',
          },
          {
            text: strings.removeTextTitle,
            style: 'destructive',
            onPress: () => {
              onDeleteMemberProfile(groupId, memberId);
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  const onDeleteMemberProfile = (groupId, memberId, toaccount = false) => {
    if (toaccount) {
      setShowSwitchScreen(true);

      Animated.timing(animProgress, {
        useNativeDriver: false,
        toValue: 100,
        duration: 200,
      }).start();
    } else {
      setloading(true);
    }

    deleteMember(groupId, memberId, authContext)
      .then((response) => {
        setloading(false);
        setShowSwitchScreen(false);

        const validator = 102;

        if (toaccount) {
          navigation.navigate('Account', {
            screen: 'AccountScreen',
            params: {
              switchToUser: 'fromMember',
              authFromMember: authContext.user,
              grpname: switchUser,
            },
          });
        } else if (response?.payload.error_code === validator) {
          Alert.alert(
            strings.appName,
            strings.childMemberError,
            [
              {
                text: 'OK',
                onPress: () => console.log('PRessed'),
              },
            ],
            {cancelable: false},
          );
        } else {
          navigation.navigate('GroupMembersScreen');
        }
      })
      .catch((e) => {
        setloading(false);
        setShowSwitchScreen(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const getMemberPhoneNumber = () => {
    let numbersString;
    if (memberDetail?.phone_numbers) {
      const numbers = memberDetail?.phone_numbers.map(
        (e) => `${e.country_code} ${e.phone_number}`,
      );
      numbersString = numbers.join('\n');
    } else {
      numbersString = strings.NAText;
    }
    return numbersString;
  };
  const listEmptyView = () => (
    <View style={{margin: 15, marginLeft: 25}}>
      <Text
        style={{
          fontFamily: fonts.RMedium,
          fontSize: 18,
          color: colors.userPostTimeColor,
        }}>
        {strings.nojoinedTeamAvailable}
      </Text>
    </View>
  );

  const renderSeparator = () => <TCThinDivider marginTop={20} width={'95%'} />;

  const getLocation = () => {
    let locationString = '';

    if (memberDetail?.connected) {
      if (
        memberDetail?.user_city &&
        memberDetail?.user_country &&
        memberDetail?.user_state_abbr
      ) {
        locationString = `${memberDetail?.user_city}, ${memberDetail?.user_state_abbr}, ${memberDetail?.user_country}`;
      }
    } else if (
      memberDetail?.city &&
      memberDetail?.country &&
      memberDetail?.state_abbr
    ) {
      locationString = `${memberDetail?.city}, ${memberDetail?.state_abbr}, ${memberDetail?.country}`;
    }
    return locationString;
  };

  const sendRequestforInfo = () => {
    const ids = [];
    ids.push(memberDetail?.user_id);

    setloading(true);

    sendBasicInfoRequest(route?.params?.groupID, ids, authContext)
      .then(() => {
        setloading(false);

        setTimeout(() => {
          showAlert(format(strings.basicInfoRequestSent), () => {
            setShowBasicInfoRequestModal(false);
          });
        }, 10);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onEditAdminPrivPress = () => {
    setloading(true);
    const bodyParams = {...memberDetail, ...setting};

    patchMember(
      entity?.obj?.group_id,
      memberDetail.user_id,
      bodyParams,
      authContext,
    )
      .then(() => {
        setloading(false);
        getMemberInformation();
        // navigation.pop(2);
        setShowAdminPrivillege(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const OpenRefreanceModal = () => (
    <Modal
      isVisible={visibleRefranceModal}
      animationInTiming={300}
      animationOutTiming={800}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={800}
      style={{
        margin: 0,
      }}>
      <View
        behavior="height"
        enabled={false}
        style={locationModalStyles.mainView}>
        <View style={locationModalStyles.headerView}>
          <TouchableOpacity
            hitSlop={getHitSlop(15)}
            onPress={() => {
              setVisibleRefranceModal(false);
            }}>
            <Image
              source={images.crossImage}
              style={[
                locationModalStyles.closeButton,

                {
                  marginLeft: 0,
                  marginRight: 0,
                  width: 20,
                  height: 20,
                  marginTop: 10,
                },
              ]}
            />
          </TouchableOpacity>
          <Text style={locationModalStyles.headerText}>
            {strings.editSpecification}
          </Text>
          <View style={{paddingTop: 20, height: '100%'}}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              onPress={() => editTeamProfile()}>
              <Text
                style={{
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                }}>
                {strings.save}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={locationModalStyles.separatorLine} />

        {/* Main comtent */}
        <TCKeyboardView>
          <ActivityLoader visible={loading} />

          <View style={styles.mainCheckBoxContainer}>
            <Text style={styles.checkBoxTitle}>
              {strings.adminAuthorityText}
            </Text>

            <View
              pointerEvents={memberDetail?.connected ? 'auto' : 'none'}
              style={[
                styles.checkBoxContainer,
                {
                  marginBottom: 35,
                  opacity: memberDetail?.connected ? 1 : 0.3,
                },
              ]}>
              <Text style={styles.checkBoxItemText}>{strings.admin}</Text>

              <TouchableOpacity
                onPress={() => {
                  setGroupMemberDetail({
                    ...groupMemberDetail,
                    is_admin: !groupMemberDetail.is_admin,
                  });
                }}>
                <Image
                  source={
                    groupMemberDetail.is_admin
                      ? images.orangeCheckBox
                      : images.uncheckWhite
                  }
                  style={{height: 22, width: 22, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.checkBoxTitle}>{strings.roles}</Text>
              <View style={styles.checkBoxContainer}>
                <Text style={styles.checkBoxItemText}>{strings.player}</Text>

                <TouchableOpacity
                  onPress={() => {
                    setGroupMemberDetail({
                      ...groupMemberDetail,
                      is_member: !groupMemberDetail.is_member,
                    });
                  }}>
                  <Image
                    source={
                      groupMemberDetail.is_member
                        ? images.orangeCheckBox
                        : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.checkBoxContainer}>
                <Text style={styles.checkBoxItemText}>{strings.coach}</Text>

                <TouchableOpacity
                  onPress={() => {
                    setGroupMemberDetail({
                      ...groupMemberDetail,
                      is_coach: !groupMemberDetail.is_coach,
                    });
                  }}>
                  <Image
                    source={
                      groupMemberDetail.is_coach
                        ? images.orangeCheckBox
                        : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.checkBoxContainer}>
                <Text style={styles.checkBoxItemText}>{strings.parent}</Text>

                <TouchableOpacity
                  onPress={() => {
                    if (groupMemberDetail.is_parent === null) {
                      setGroupMemberDetail({
                        ...groupMemberDetail,
                        is_parent: true,
                      });
                    } else {
                      setGroupMemberDetail({
                        ...groupMemberDetail,
                        is_parent: !groupMemberDetail.is_parent,
                      });
                    }
                  }}>
                  <Image
                    source={
                      groupMemberDetail.is_parent
                        ? images.orangeCheckBox
                        : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.checkBoxContainer}>
                <Text style={styles.checkBoxItemText}>{strings.other}</Text>

                <TouchableOpacity
                  onPress={() => {
                    setGroupMemberDetail({
                      ...groupMemberDetail,
                      is_others: !groupMemberDetail.is_others,
                    });
                  }}>
                  <Image
                    source={
                      groupMemberDetail.is_others
                        ? images.orangeCheckBox
                        : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <TCLable
              title={'Position'}
              style={{textTransform: 'uppercase', lineHeight: 26}}
            />
            <FlatList
              data={positions}
              renderItem={renderPosition}
              keyExtractor={(item, index) => index.toString()}
              // style={styles.flateListStyle}
            ></FlatList>
          </View>
          <TCMessageButton
            title={strings.addPosition}
            width={125}
            height={30}
            borderColor={colors.whiteColor}
            color={colors.lightBlackColor}
            alignSelf="center"
            marginTop={15}
            onPress={() => addPosition()}
            elevation={0}
            backgroundColor={'#F5F5F5'}
            styletext={{
              fontFamily: fonts.RBold,
              paddingHorizontal: 10,
              textAlign: 'center',
            }}
          />
          <View>
            <TCLable
              title={strings.jerseyNumberPlaceholder}
              style={{
                textTransform: 'uppercase',
                lineHeight: 26,
                fontSize: 16,
              }}
            />
            <TCTextField
              value={groupMemberDetail.jersey_number}
              onChangeText={(text) =>
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  jersey_number: text,
                })
              }
              placeholder={strings.jerseyNumberPlaceholder}
              keyboardType={'number-pad'}
              style={{
                marginTop: 6,
              }}
            />
          </View>

          {/* player status */}
          <View style={styles.mainCheckBoxContainer}>
            <View>
              <Text style={[styles.checkBoxTitle, {marginTop: 12}]}>
                {strings.status}
              </Text>
              <View style={styles.checkBoxContainer}>
                <Text style={styles.checkBoxItemText}>
                  {strings.injuredPlaceholder}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (
                      groupMemberDetail?.status?.includes(
                        strings.injuredPlaceholder,
                      )
                    ) {
                      setGroupMemberDetail({
                        ...groupMemberDetail,
                        status: groupMemberDetail?.status?.filter(
                          (el) => el !== strings.injuredPlaceholder,
                        ),
                      });
                    } else {
                      setGroupMemberDetail({
                        ...groupMemberDetail,
                        status: groupMemberDetail?.status?.concat(
                          strings.injuredPlaceholder,
                        ),
                      });
                    }
                  }}>
                  <Image
                    source={
                      groupMemberDetail?.status?.includes(
                        strings.injuredPlaceholder,
                      )
                        ? images.orangeCheckBox
                        : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.checkBoxContainer}>
                <Text style={styles.checkBoxItemText}>
                  {strings.longTermAwayPlaceholder}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (
                      groupMemberDetail?.status?.includes(
                        strings.longTermAwayPlaceholder,
                      )
                    ) {
                      setGroupMemberDetail({
                        ...groupMemberDetail,
                        status: groupMemberDetail?.status?.filter(
                          (el) => el !== strings.longTermAwayPlaceholder,
                        ),
                      });
                    } else {
                      setGroupMemberDetail({
                        ...groupMemberDetail,
                        status: groupMemberDetail?.status?.concat(
                          strings.longTermAwayPlaceholder,
                        ),
                      });
                    }
                  }}>
                  <Image
                    source={
                      groupMemberDetail?.status?.includes('en_Long-term Away')
                        ? images.orangeCheckBox
                        : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.checkBoxContainer}>
                <Text style={styles.checkBoxItemText}>
                  {strings.suspendedPlaceholder}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (
                      groupMemberDetail?.status?.includes(
                        strings.suspendedPlaceholder,
                      )
                    ) {
                      setGroupMemberDetail({
                        ...groupMemberDetail,
                        status: groupMemberDetail?.status?.filter(
                          (el) => el !== strings.suspendedPlaceholder,
                        ),
                      });
                    } else {
                      setGroupMemberDetail({
                        ...groupMemberDetail,
                        status: groupMemberDetail?.status?.concat(
                          strings.suspendedPlaceholder,
                        ),
                      });
                    }
                  }}>
                  <Image
                    source={
                      groupMemberDetail?.status?.includes(
                        strings.suspendedPlaceholder,
                      )
                        ? images.orangeCheckBox
                        : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{marginBottom: 20}} />
        </TCKeyboardView>
      </View>
    </Modal>
  );

  const editNote = () => {
    setloading(true);
    const bodyParams = {};
    if (memberInfo?.note && memberInfo?.note !== '') {
      bodyParams.note = memberInfo?.note;
      // bodyParams.is_admin = false;
    }

    patchMember(
      memberInfo?.group?.group_id,
      memberInfo.user_id,
      bodyParams,
      authContext,
    )
      .then(() => {
        setloading(false);
        getMemberInformation();
        setVisibleNotesModal(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const OpenNoteModal = () => (
    <Modal
      isVisible={visibleNotesModal}
      animationInTiming={300}
      animationOutTiming={800}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={800}
      style={{
        margin: 0,
      }}>
      <View
        behavior="height"
        enabled={false}
        style={locationModalStyles.mainView}>
        <View style={locationModalStyles.headerView}>
          <TouchableOpacity
            hitSlop={getHitSlop(15)}
            onPress={() => {
              setVisibleNotesModal(false);
            }}>
            <Image
              source={images.crossImage}
              style={[
                locationModalStyles.closeButton,

                {
                  marginLeft: 0,
                  marginRight: 0,
                  width: 20,
                  height: 20,
                  marginTop: 10,
                },
              ]}
            />
          </TouchableOpacity>
          <Text style={locationModalStyles.headerText}>
            {strings.noteTitle}
          </Text>
          <View style={{paddingTop: 20, height: '100%'}}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              onPress={() => editNote()}>
              <Text
                style={{
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                }}>
                {strings.save}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ActivityLoader visible={loading} />
        <View style={locationModalStyles.separatorLine} />
        <View
          style={{
            height: 100,
            marginTop: 17,
          }}>
          <TCTextField
            value={memberInfo.note}
            height={100}
            multiline={true}
            onChangeText={(text) => setMemberInfo({...memberInfo, note: text})}
            placeholder={strings.writeNotesPlaceholder}
            keyboardType={'default'}
            style={{
              backgroundColor: colors.grayBackgroundColor,
            }}
          />
        </View>
      </View>
    </Modal>
  );

  const OpenInfoRequestModal = () => (
    <Modal
      isVisible={showBasicInfoRequestModal}
      onBackdropPress={() => setShowBasicInfoRequestModal(false)}
      animationInTiming={300}
      animationOutTiming={800}
      backdropTransitionInTiming={50}
      backdropTransitionOutTiming={50}
      style={{
        margin: 0,
        top: 0,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,

          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <View style={styles.titlePopup}>
          <Text style={styles.startTime}>
            {strings.sendrequestForBaicInfoText}
          </Text>
          <Pressable
            hitSlop={getHitSlop(15)}
            onPress={() => {
              setShowBasicInfoRequestModal(false);
            }}>
            <Image source={images.cancelImage} style={styles.closeButton} />
          </Pressable>
        </View>
        <View style={locationModalStyles.separatorLine} />
        <ActivityLoader visible={loading} />
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 20,
            marginLeft: 30,
            marginRight: 44,
            marginTop: 25,
            color: colors.lightBlackColor,
          }}>
          {strings.collectBasicInfo}
        </Text>

        <Text style={styles.basicInfoRequestText}>
          {strings.collectBasicInfoSubTxt}
        </Text>
        <Text style={styles.basicInfoSubtxt}>{strings.basicRequestText}</Text>

        <TouchableOpacity
          style={styles.sendbtn}
          onPress={() => sendRequestforInfo()}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RBold,
              lineHeight: 24,
              textTransform: 'uppercase',
              color: colors.orangeColor,
            }}>
            {strings.send}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const OpenAdminPrivillege = () => (
    <Modal
      isVisible={showAdminPrivillege}
      onBackdropPress={() => setShowBasicInfoRequestModal(false)}
      animationInTiming={300}
      animationOutTiming={800}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={800}
      style={{
        margin: 0,
      }}>
      <View
        behavior="height"
        enabled={false}
        style={{
          width: '100%',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 15,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          flex: 1,
        }}>
        <View style={styles.privellegtitle}>
          <Pressable
            hitSlop={getHitSlop(15)}
            onPress={() => {
              setShowAdminPrivillege(false);
            }}>
            <Image
              source={images.cancelImage}
              style={styles.closebtnprivillege}
            />
          </Pressable>
          <Text
            style={[
              styles.startTime,
              {alignSelf: 'center', marginLeft: 20, marginTop: 16},
            ]}>
            {strings.editAdminPrivillege}
          </Text>
          <Pressable onPress={() => onEditAdminPrivPress()}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RMedium,
                marginRight: 20,
                marginTop: 10,
              }}>
              {strings.save}
            </Text>
          </Pressable>
        </View>
        <ActivityLoader visible={loading} />
        <View style={locationModalStyles.separatorLine} />
        <View style={styles.checkBoxContainerPrv}>
          <Text style={styles.checkBoxItemText}>
            {format(
              strings.adminText_dy,
              entity.role.charAt(0).toUpperCase() + entity.role.slice(1),
            )}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const admin_setting = !setting.is_admin;
              if (admin_setting) {
                setSetting({
                  ...setting,
                  is_member: true,
                  is_admin: admin_setting,
                });
              } else {
                setSetting({
                  ...setting,
                  is_admin: false,
                });
              }
            }}>
            <Image
              source={
                setting.is_admin ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const animProgress = React.useState(new Animated.Value(0))[0];

  const animWidthPrecent = animProgress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['0%', '50%', '100%'],
  });

  const placeHolder = images.profilePlaceHolder;

  return (
    <SafeAreaView>
      {showSwitchScreen && (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.whiteColor,
            justifyContent: 'center',
            alignItems: 'center',
            ...StyleSheet.absoluteFillObject,
            zIndex: 10,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.whiteColor,

              justifyContent: 'center',
              alignItems: 'center',
              ...StyleSheet.absoluteFillObject,
              marginTop: 300,
              zIndex: 1000,
            }}>
            <ActivityLoader visible={false} />
            <TouchableOpacity
              onPress={() => {
                Animated.timing(animProgress, {
                  useNativeDriver: false,
                  toValue: 100,
                  duration: 700,
                }).start();
              }}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={
                    authContext.user?.thumbnail || ''
                      ? {uri: authContext.user?.thumbnail}
                      : placeHolder
                  }
                  style={styles.profileImg}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 15,
              }}>
              <Text
                style={{
                  lineHeight: 24,
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Switching to
              </Text>
              <Text
                style={{
                  lineHeight: 24,
                  fontFamily: fonts.RBold,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                {authContext.user?.full_name}
              </Text>
            </View>

            <View
              style={{
                width: 135,
                height: 5,
                backgroundColor: '#F2F2F2',
                borderRadius: 20,

                marginTop: 279,
              }}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: animWidthPrecent,
                    backgroundColor: colors.orangeGradientColor,
                  },
                ]}
              />
            </View>
          </View>
          {/* PRogree Bar */}
        </View>
      )}

      <ActivityLoader visible={loading} />
      <TCInnerLoader visible={firstTimeLoad} size={50} />
      {OpenNoteModal()}
      {OpenRefreanceModal()}
      {OpenInfoRequestModal()}
      {OpenAdminPrivillege()}

      {memberDetail && !firstTimeLoad && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.roleViewContainer}>
            <View style={styles.roleView}>
              <TCMemberProfile
                marginLeft={0}
                image={
                  memberDetail?.thumbnail
                    ? {uri: memberDetail?.thumbnail}
                    : images.profilePlaceHolder
                }
                name={
                  `${memberDetail?.first_name} ${memberDetail?.last_name}` ?? ''
                }
                location={memberDetail?.home_city || getLocation()}
              />

              {!memberDetail?.connected && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate('EditMemberInfoScreen', {
                      memberInfo: memberDetail,
                    });
                  }}>
                  <Image
                    source={images.editProfilePencil}
                    style={styles.editImage}
                  />
                </TouchableWithoutFeedback>
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 15,
                paddingRight: 14,

                marginTop: 11,
              }}>
              <Text style={styles.undatedTimeText} numberOfLines={2}>
                {format(
                  entity.role === Verbs.entityTypeClub
                    ? strings.joinedClubOnText
                    : strings.joinedTeamOnText,
                  shortMonthNames[
                    getJSDate(memberDetail.joined_date).getMonth()
                  ],
                  getJSDate(memberDetail.joined_date).getDate(),
                  getJSDate(memberDetail.joined_date).getFullYear(),

                  memberDetail.last_updatedBy
                    ? memberDetail.last_updatedBy
                    : memberDetail.first_name,

                  memberDetail.last_updatedBy ? null : memberDetail.last_name,
                  shortMonthNames[
                    getJSDate(memberDetail.updated_date).getMonth()
                  ],
                  getJSDate(memberDetail.updated_date).getDate(),
                  getJSDate(memberDetail.updated_date).getFullYear(),
                )}
              </Text>
              <TCProfileButton
                title={memberDetail.connected ? strings.message : strings.email}
                style={[styles.messageButtonStyle, {width: 80}]}
                textStyle={styles.buttonTextStyle}
                showArrow={false}
                onPressProfile={() => {
                  if (memberDetail.connected) {
                    navigation.push('MessageChat', {
                      screen: 'MessageChat',
                      params: {userId: memberDetail.user_id},
                    });
                  } else {
                    Linking.canOpenURL('mailto:')
                      .then((supported) => {
                        if (!supported) {
                          Alert.alert(
                            strings.townsCupTitle,
                            strings.configureEmailAccounttext,
                          );
                        } else {
                          return Linking.openURL(
                            `mailto:${memberDetail.email}`,
                          );
                        }
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }
                }}
              />
            </View>

            {!memberDetail.connected && (
              <TouchableOpacity
                onPress={() => {
                  setloading(true);

                  const obj = {
                    entity_type: entity.role,
                    emailIds: [memberDetail.email],
                    uid: entity.uid,
                  };
                  sendInvitationInGroup(obj, authContext)
                    .then(() => {
                      setloading(false);
                      showAlert(strings.emailInviteSent);
                    })
                    .catch((e) => {
                      setloading(false);

                      setTimeout(() => {
                        showAlert(e.message);
                      }, 10);
                    });
                }}>
                <View style={styles.inviteButtonContainer}>
                  <Text style={styles.inviteTextStyle}>
                    {format(
                      strings.inviteMemberToGroup,
                      authContext.entity.role,
                    ).toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <TCThickDivider marginTop={26} />
          <View>
            <View style={styles.sectionEditView}>
              <Text style={styles.basicInfoTitle}>
                {strings.basicinfotitle}
              </Text>

              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('EditMemberBasicInfoScreen', {
                    memberInfo: memberDetail,
                  });
                }}>
                <Image
                  source={images.editProfilePencil}
                  style={styles.editImage}
                />
              </TouchableWithoutFeedback>
            </View>
            <TCInfoField
              valueStyle={{
                textTransform: 'capitalize',
              }}
              title={strings.gender}
              value={
                memberDetail?.gender ? memberDetail?.gender : strings.NAText
              }
            />
            <TCInfoField
              title={strings.birthDatePlaceholder}
              value={
                memberDetail.birthday
                  ? `${
                      shortMonthNames[
                        new Date(memberDetail?.birthday).getMonth()
                      ]
                    } ${new Date(memberDetail?.birthday).getDate()} ,${new Date(
                      memberDetail?.birthday,
                    ).getFullYear()}`
                  : strings.NAText
              }
            />

            <TCInfoField
              title={strings.age}
              value={
                memberDetail?.birthday
                  ? getAge(new Date(memberDetail?.birthday))
                  : strings.NAText
              }
            />

            <TCInfoField
              title={strings.height}
              value={
                memberDetail?.height
                  ? memberDetail?.height.height === 0
                    ? strings.NAText
                    : `${memberDetail.height.height} ${memberDetail.height.height_type}`
                  : strings.NAText
              }
            />

            <TCInfoField
              title={strings.weight}
              value={
                memberDetail?.weight
                  ? memberDetail?.weight.weight === 0
                    ? strings.NAText
                    : `${memberDetail.weight.weight} ${memberDetail.weight.weight_type}`
                  : strings.NAText
              }
            />

            <TCInfoField title={strings.phone} value={getMemberPhoneNumber()} />
            <TCInfoField
              title={strings.emailtitle}
              value={memberDetail.email ? memberDetail.email : strings.NAText}
            />
            <TCInfoField
              title={strings.addressPlaceholder}
              value={
                memberDetail.street_address
                  ? `${memberDetail?.street_address},`
                  : memberDetail?.city &&
                    memberDetail?.state_abbr &&
                    memberDetail?.country
                  ? `${memberDetail?.city}, ${memberDetail?.state_abbr}, ${memberDetail?.country}`
                  : strings.NAText
              }
            />
          </View>
          <TCThickDivider marginTop={20} />

          {memberDetail.family && (
            <>
              <View>
                <View style={styles.sectionEditView}>
                  <Text style={styles.basicInfoTitle}>{strings.family}</Text>
                  <TouchableWithoutFeedback>
                    <Image
                      source={images.editProfilePencil}
                      style={styles.editImage}
                    />
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.familyView}>
                  <TCProfileView type={'medium'} />
                  <TCMessageButton
                    title={strings.emailPlaceHolder}
                    color={colors.googleColor}
                  />
                </View>
                <TCThinDivider />
                <View style={styles.familyView}>
                  <TCProfileView type={'medium'} />
                  <TCMessageButton />
                </View>
              </View>
              <TCThickDivider marginTop={20} />
            </>
          )}
          <View>
            <View style={styles.sectionEditView}>
              <Text
                style={[
                  styles.basicInfoTitle,
                  {
                    marginBottom:
                      entity.role === Verbs.entityTypeTeam ? -5 : 12,
                    marginTop: 3,
                  },
                ]}>
                {entity.role === Verbs.entityTypeTeam
                  ? strings.specifications
                  : strings.membershipTitle}
              </Text>

              {/* icon */}
            </View>
            {memberDetail.group && entity.role === Verbs.entityTypeClub && (
              <Pressable>
                <GroupMembership
                  groupData={memberDetail.group}
                  switchID={entity.uid}
                  edit={!editTeam}
                  onEditPressed={() => setShowAdminPrivillege(true)}
                />
              </Pressable>
            )}
            {memberDetail?.teams?.length > 0 && (
              <TCThinDivider
                marginTop={15}
                width={'95%'}
                backgroundColor={'#E4E4E4'}
              />
            )}

            <FlatList
              data={
                entity.role === Verbs.entityTypeClub
                  ? memberDetail?.teams
                  : [
                      {
                        ...memberDetail.group,
                        positions: memberDetail?.positions,
                        jersey_number: memberDetail?.jersey_number,
                        appearance: memberDetail?.appearance,
                        status: memberDetail?.status,
                        is_admin: memberDetail?.is_admin,
                        is_others: memberDetail?.is_others,
                        is_member: memberDetail?.is_member,
                        is_coach: memberDetail?.is_coach,
                        is_parent: memberDetail?.is_parent,
                        note: memberDetail?.note,
                        user_id: memberDetail?.user_id,
                      },
                    ]
              }
              ListEmptyComponent={listEmptyView}
              ItemSeparatorComponent={renderSeparator}
              renderItem={({item}) => (
                <Pressable
                  style={{
                    marginTop: entity.role === Verbs.entityTypeTeam ? 7 : 15,
                    marginBottom:
                      entity.role === Verbs.entityTypeTeam ? 15 : -5,
                    marginLeft: entity.role === Verbs.entityTypeTeam ? -10 : 0,
                  }}>
                  <GroupMembership
                    onlybadge={
                      entity.role === Verbs.entityTypeTeam ? true : false
                    }
                    groupData={item}
                    switchID={entity.uid}
                    edit={editTeam}
                    onEditPressed={() => {
                      if (
                        item.hasOwnProperty('status') &&
                        !Array.isArray(item?.status)
                      ) {
                        item.status = [];
                      }

                      setGroupMemberDetail(item);
                      setPositions(item?.positions ?? [{}]);
                      setVisibleRefranceModal(true);
                    }}
                  />
                </Pressable>
              )}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
          <TCThickDivider
            marginTop={entity.role === Verbs.entityTypeTeam ? 10 : 20}
          />

          <View>
            <View style={[styles.sectionEditView, {marginTop: 15}]}>
              <Text style={styles.basicInfoTitle}>
                {strings.writeNotesPlaceholder}
              </Text>

              <TouchableWithoutFeedback
                onPress={() => {
                  setMemberInfo(memberDetail);
                  setVisibleNotesModal(true);
                }}>
                <Image
                  source={images.editProfilePencil}
                  style={styles.editImage}
                />
              </TouchableWithoutFeedback>
            </View>
            <Text style={styles.describeText} numberOfLines={50}>
              {memberDetail?.note}
            </Text>
            <TCThickDivider />
            <Text
              style={styles.removeTextStyle}
              onPress={() => {
                deleteMemberValidations(switchUser.uid, memberDetail.user_id);
              }}>
              {strings.removeMemberFromGroup.toUpperCase()}
            </Text>
          </View>

          <ActionSheet
            ref={actionSheet}
            // title={'News Feed Post'}
            options={[
              strings.sendrequestForBaicInfoText,
              strings.editAdminPrivillege,
              strings.cancel,
            ]}
            cancelButtonIndex={2}
            onPress={(index) => {
              if (index === 1) {
                setShowAdminPrivillege(true);
              } else if (index === 0) {
                setShowBasicInfoRequestModal(true);
              }
            }}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  navigationRightItem: {
    height: 25,
    marginRight: 15,
    resizeMode: 'contain',
    width: 25,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
  roleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 12,
    marginRight: 15,
    alignSelf: 'center',
  },
  roleViewContainer: {
    marginTop: 29,

    justifyContent: 'space-between',
  },
  undatedTimeText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flexShrink: 1,
  },
  basicInfoTitle: {
    fontSize: 20,
    color: colors.lightBlackColor,
    textTransform: 'uppercase',
    fontFamily: fonts.RMedium,
    //  fontWeight: '500',
    lineHeight: 30,
  },
  familyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  editImage: {
    alignSelf: 'center',
    height: 15,
    resizeMode: 'contain',
    width: 12,
  },
  sectionEditView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  describeText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 13,
    textAlign: 'justify',
  },
  inviteButtonContainer: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrey,
    width: 345,
    borderRadius: 5,
    marginTop: 25,
    alignSelf: 'center',
  },
  inviteTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  removeTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color: colors.darkThemeColor,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 38,
  },
  messageButtonStyle: {
    marginTop: 0,
    height: 25,
    width: '100%',
    backgroundColor: '#F5F5F5',
    // elevation: 0,
    // shadowOffset: 0,
    // shadowRadius: 0,
  },
  buttonTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    shadowColor: colors.whiteColor,
  },

  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    marginBottom: 10,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 20,
  },
  checkBoxTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginBottom: 10,
    lineHeight: 26,
    textTransform: 'uppercase',
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },

  titlePopup: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    alignSelf: 'center',
  },
  startTime: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginTop: 13,
    marginBottom: 9,
    lineHeight: 22,
    textAlign: 'center',
  },

  closeButton: {
    height: 15,
    width: 15,
    resizeMode: 'cover',

    position: 'absolute',
    right: -60,
    top: -5,
  },
  basicInfoRequestText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 30,
    marginRight: 26,
    lineHeight: 24,
    marginTop: 15,
  },
  basicInfoSubtxt: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 30,
    marginRight: 26,
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 30,
  },

  sendbtn: {
    width: 345,
    borderRadius: 20,
    backgroundColor: colors.offwhite,
    elevation: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 25,
    shadowOffset: {width: 0, height: 1.6},
    shadowColor:
      Platform.OS === 'android' ? colors.lightGrey2 : colors.shadowColor,
    shadowOpacity: 4,
    shadowRadius: 2,
  },
  privellegtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closebtnprivillege: {
    height: 15,
    width: 15,
    resizeMode: 'cover',
    marginLeft: 30,
    marginTop: 10,
  },
  checkBoxContainerPrv: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    marginBottom: 210,
    justifyContent: 'space-between',
    marginRight: 15,
    marginTop: 35,
    paddingHorizontal: 15,
  },
  profileImageContainer: {
    height: 55,
    width: 55,
    backgroundColor: colors.whiteColor,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {height: 1.5, width: 0},
    shadowRadius: 3,
    shadowOpacity: 0.16,
    elevation: 3,
  },
  profileImg: {
    height: 60,
    width: 60,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 100,
  },

  progressBar: {
    width: '100%',
    height: 5,
    backgroundColor: colors.orangeGradientColor,
  },
});
