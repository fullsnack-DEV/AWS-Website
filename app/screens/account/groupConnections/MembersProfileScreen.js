/* eslint-disable no-nested-ternary */
import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  useContext,
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
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import ActionSheet from 'react-native-actionsheet';
import {getGroupMembersInfo, deleteMember} from '../../../api/Groups';

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
import {getUserIndex} from '../../../api/elasticSearch';

let entity = {};
export default function MembersProfileScreen({navigation, route}) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);

  console.log('authcontext', authContext);

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
  const [groupID] = useState(route?.params?.groupID);
  const [memberID] = useState(route?.params?.memberID);
  const [whoSeeID] = useState(route?.params?.whoSeeID);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        whoSeeID === entity.uid &&
        !loading && (
          <TouchableWithoutFeedback
            onPress={() => actionSheet?.current?.show()}>
            <Image
              source={images.horizontal3Dot}
              style={styles.navigationRightItem}
            />
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
  ]);

  useEffect(() => {
    if (isFocused) {
      console.log('--useEffect called--');
      getMemberInformation();
    }
  }, [isFocused]);

  // useEffect(() => {
  //   if(route?.params?.modifiedMemberDetail){
  //     setMemberDetail({...memberDetail,...route?.params?.modifiedMemberDetail})
  //   }
  // }, [memberDetail, route?.params?.modifiedMemberDetail]);

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
  const getMemberInformation = () => {
    if (!firstTimeLoad) setloading(true);
    entity = authContext.entity;
    setSwitchUser(entity);

    // Setting of Edit option

    getGroupMembersInfo(groupID, memberID, authContext)
      .then((response) => {
        console.log('PROFILE RESPONSE11::', response.payload);
        setMemberDetail(response?.payload);

        if (entity.role === 'team') {
          setEditProfile(true);
          setEditBasicInfo(true);
          setEditTeam(true);
          setEditMembership(true);
        } else if (entity.role === 'club') {
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
  const deleteMemberProfile = (groupId, memberId) => {
    setloading(true);
    deleteMember(groupId, memberId, authContext)
      .then((response) => {
        setloading(false);
        console.log('PROFILE RESPONSE::', response.payload);
        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const getMemberPhoneNumber = () => {
    let numbersString;
    console.log('memberDetail', memberDetail);
    if (memberDetail?.phone_numbers) {
      console.log('PHONE NUMBER ARRAY::', memberDetail?.phone_numbers);
      const numbers = memberDetail?.phone_numbers.map(
        (e) => `${e.country_code} ${e.phone_number}`,
      );
      numbersString = numbers.join('\n');
    } else {
      numbersString = 'N/A';
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
        No Joined Teams Available
      </Text>
    </View>
  );

  const renderSeparator = () => <TCThinDivider marginTop={20} width={'100%'} />;

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

  return (
    <SafeAreaView>
      <ActivityLoader visible={loading} />
      <TCInnerLoader visible={firstTimeLoad} size={50} />
      {memberDetail && !firstTimeLoad && (
        <ScrollView>
          <View style={styles.roleViewContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <TCMemberProfile
                image={
                  memberDetail?.thumbnail
                    ? {uri: memberDetail?.thumbnail}
                    : images.profilePlaceHolder
                }
                name={
                  `${memberDetail?.first_name} ${memberDetail?.last_name}` ?? ''
                }
                location={getLocation()}
              />
              {editProfile && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate('EditMemberInfoScreen', {
                      memberInfo: memberDetail,
                    });
                  }}>
                  <Image source={images.editSection} style={styles.editImage} />
                </TouchableWithoutFeedback>
              )}
            </View>
            {memberDetail?.group?.updatedBy && (
              <Text style={styles.undatedTimeText} numberOfLines={2}>
                Joined club on{' '}
                {
                  monthNames[
                    new Date(memberDetail.group.joined_date).getMonth()
                  ]
                }{' '}
                {new Date(memberDetail.group.joined_date).getDate()} ,
                {new Date(memberDetail.group.joined_date).getFullYear()}
                {'\n'}Last updated by {memberDetail.group.updatedBy.first_name}{' '}
                {memberDetail.group.updatedBy.last_name} on{' '}
                {
                  monthNames[
                    new Date(memberDetail.group.updated_date).getMonth()
                  ]
                }{' '}
                {new Date(memberDetail.group.updated_date).getDate()} ,
                {new Date(memberDetail.group.updated_date).getFullYear()}
              </Text>
            )}
            {!memberDetail.connected && (
              <TouchableOpacity
                onPress={() => {
                  setloading(true);

                  const getUserByEmailQuery = {
                    query: {
                      bool: {
                        must: [
                          {
                            term: {
                              'email.keyword': {
                                value: memberDetail.email,
                              },
                            },
                          },
                        ],
                      },
                    },
                  };

                  getUserIndex(getUserByEmailQuery).then((players) => {
                    console.log('getUserByEmailQuery', players);
                    setloading(false);
                    if (players?.length > 0) {
                      // const signUpUser = players.filter((e) => e.signedup_user)
                      navigation.navigate('UserFoundScreen', {
                        signUpObj: players[0],
                        memberObj: memberDetail,
                        groupID,
                      });
                    } else {
                      navigation.navigate('UserNotFoundScreen', {
                        memberObj: memberDetail,
                        groupID,
                      });
                    }
                  });
                }}>
                <View style={styles.inviteButtonContainer}>
                  <Text style={styles.inviteTextStyle}>
                    Invite or Connect to an Account
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <TCThickDivider marginTop={20} />
          <View>
            <View style={styles.sectionEditView}>
              <Text style={styles.basicInfoTitle}>Basic Info</Text>
              {editBasicInfo && (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('EditMemberBasicInfoScreen', {
                      memberInfo: memberDetail,
                    })
                  }>
                  <Image source={images.editSection} style={styles.editImage} />
                </TouchableWithoutFeedback>
              )}
            </View>
            <TCInfoField
              title={'E-mail'}
              value={memberDetail.email ? memberDetail.email : 'N/A'}
            />
            <TCInfoField title={'Phone'} value={getMemberPhoneNumber()} />
            <TCInfoField
              title={'Address'}
              value={
                memberDetail.street_address
                  ? `${memberDetail?.street_address}, ${memberDetail?.city}, ${memberDetail?.state_abbr}, ${memberDetail?.country}`
                  : memberDetail?.city &&
                    memberDetail?.state_abbr &&
                    memberDetail?.country
                  ? `${memberDetail?.city}, ${memberDetail?.state_abbr}, ${memberDetail?.country}`
                  : 'N/A'
              }
            />
            <TCInfoField
              title={'Age'}
              value={
                memberDetail?.birthday
                  ? getAge(new Date(memberDetail?.birthday))
                  : 'N/A'
              }
            />
            <TCInfoField
              title={'Birthday'}
              value={
                memberDetail.birthday
                  ? `${
                      monthNames[new Date(memberDetail?.birthday).getMonth()]
                    } ${new Date(memberDetail?.birthday).getDate()} ,${new Date(
                      memberDetail?.birthday,
                    ).getFullYear()}`
                  : 'N/A'
              }
            />
            <TCInfoField
              title={strings.gender}
              value={memberDetail?.gender ? memberDetail?.gender : 'N/A'}
            />
          </View>
          <TCThickDivider marginTop={20} />
          {memberDetail.family && (
            <>
              <View>
                <View style={styles.sectionEditView}>
                  <Text style={styles.basicInfoTitle}>Family</Text>
                  <TouchableWithoutFeedback>
                    <Image
                      source={images.editSection}
                      style={styles.editImage}
                    />
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.familyView}>
                  <TCProfileView type={'medium'} />
                  <TCMessageButton title={'Email'} color={colors.googleColor} />
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
            {/* <View style={styles.sectionEditView}>
            <Text style={styles.basicInfoTitle}>Membership</Text>
          </View> */}

            <View style={styles.sectionEditView}>
              <Text style={styles.basicInfoTitle}>
                {entity.role === 'team' ? 'Roles & Status' : 'Membership'}
              </Text>
              {/* {editMembership && (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('EditClubNotesScreen', {
                      memberInfo: memberDetail.group,
                    })
                  }>
                  <Image source={images.editSection} style={styles.editImage} />
                </TouchableWithoutFeedback>
              )} */}
            </View>
            {memberDetail.group && entity.role === 'club' && (
              <GroupMembership
                groupData={memberDetail.group}
                switchID={entity.uid}
                edit={!editTeam}
                onEditPressed={() =>
                  navigation.navigate('EditMemberAuthInfoScreen', {
                    groupMemberDetail: {
                      ...memberDetail.group,
                      positions: memberDetail?.positions,
                      jersey_number: memberDetail?.jersey_number,
                      appearance: memberDetail?.appearance,
                      status: memberDetail?.status,
                      is_admin: memberDetail?.is_admin,
                      is_others: memberDetail?.is_others,
                      is_member: memberDetail?.is_member,
                      is_coach: memberDetail?.is_coach,
                      note: memberDetail?.note,
                      user_id: memberDetail?.user_id,
                    },
                  })
                }
              />
            )}
            {memberDetail?.teams?.length > 0 && (
              <TCThinDivider marginTop={20} width={'100%'} />
            )}
            <FlatList
              data={
                entity.role === 'club'
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
                        note: memberDetail?.note,
                        user_id: memberDetail?.user_id,
                      },
                    ]
              }
              ListEmptyComponent={listEmptyView}
              ItemSeparatorComponent={renderSeparator}
              renderItem={({item}) => (
                <GroupMembership
                  groupData={item}
                  switchID={entity.uid}
                  edit={editTeam}
                  onEditPressed={() => {
                    console.log(item);
                    navigation.navigate('EditMemberTeamInfoScreen', {
                      groupMemberDetail: item,
                    });
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
          <TCThickDivider marginTop={20} />
          <View>
            <View style={styles.sectionEditView}>
              <Text style={styles.basicInfoTitle}>Note</Text>
              {editMembership && (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('EditClubNotesScreen', {
                      memberInfo: memberDetail,
                    })
                  }>
                  <Image source={images.editSection} style={styles.editImage} />
                </TouchableWithoutFeedback>
              )}
            </View>
            <Text style={styles.describeText} numberOfLines={50}>
              {memberDetail?.note}
            </Text>
          </View>
          <ActionSheet
            ref={actionSheet}
            // title={'News Feed Post'}
            options={
              switchUser.role === 'team'
                ? [
                    'Membership & Admin Authority',
                    'Delete Member from Team',
                    'Cancel',
                  ]
                : [
                    'Membership & Admin Authority',
                    'Delete Member from Club',
                    'Cancel',
                  ]
            }
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('EditMemberAuthInfoScreen', {
                  groupMemberDetail: memberDetail,
                });
              }
              // else if (index === 1) {
              //   Alert.alert(
              //     'The basic info in this profile will be updated with the info in the member’s account.',
              //     '',
              //     [
              //       {
              //         text: 'Yes',
              //         onPress: async () => {
              //           getMemberInformation();
              //         },
              //       },
              //       {
              //         text: 'Cancel',
              //         style: 'cancel',
              //       },
              //     ],
              //     {cancelable: false},
              //   );
              // }
              else if (index === 1) {
                // Alert.alert('ok')
                Alert.alert(
                  strings.alertmessagetitle,
                  `Do you want to remove ${memberDetail.first_name} ${memberDetail.last_name} from ${switchUser.obj.group_name}?`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel cancel'),
                      style: 'cancel',
                    },
                    {
                      text: 'Ok',
                      onPress: () =>
                        deleteMemberProfile(
                          switchUser.uid,
                          memberDetail.user_id,
                        ),
                    },
                  ],
                  {cancelable: false},
                );
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
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  roleViewContainer: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
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
    fontFamily: fonts.RRegular,
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
    height: 18,
    resizeMode: 'contain',
    width: 18,
  },
  sectionEditView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 15,
    marginRight: 20,
  },
  describeText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
  inviteButtonContainer: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    shadowOpacity: 0.5,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    marginTop: 20,
  },
  inviteTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
});
