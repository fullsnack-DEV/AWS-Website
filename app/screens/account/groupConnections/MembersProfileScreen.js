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
import TCBorderButton from '../../../components/TCBorderButton';
import TCInfoField from '../../../components/TCInfoField';
import strings from '../../../Constants/String';
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        ((route?.params?.whoSeeID === entity.uid) && !loading)  && (
          <TouchableWithoutFeedback onPress={() => actionSheet?.current?.show()}>
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
    route?.params?.whoSeeID,
  ]);

  useEffect(() => {
console.log('--useEffect called--');
    getMemberInformation();
   
  }, [isFocused]);

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
  const getMemberInformation =  () => {
    if (!firstTimeLoad) setloading(true);
    entity = authContext.entity;
    setSwitchUser(entity);

    // Setting of Edit option
    if(entity.role === 'team'){
      setEditProfile(true);
      setEditBasicInfo(true);
      setEditTeam(true);
      setEditMembership(true);
    }
    else if (entity.role === 'club') {
      setEditProfile(true);
      setEditBasicInfo(true);
      setEditTeam(true);
      setEditMembership(true);
    } else if (route.params.whoSeeID === entity.uid) {
      setEditProfile(true);
      setEditBasicInfo(true);
    }

    getGroupMembersInfo(
      route?.params?.groupID,
      route?.params?.memberID,
      authContext,
    )
      .then((response) => {
        console.log('PROFILE RESPONSE::', response.payload);
        setMemberDetail(response?.payload);
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
  const deleteMemberProfile = (groupID, memberID) => {
    setloading(true);
    deleteMember(groupID, memberID, authContext)
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
                name={`${memberDetail?.first_name} ${memberDetail?.last_name}` ?? ''}
                location={`${memberDetail?.city}, ${memberDetail?.state_abbr}, ${memberDetail?.country}` ?? ''}
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
              <TCBorderButton
                title={strings.connectAccountText}
                marginTop={20}
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
                    if (players.length > 0) {
                      // const signUpUser = players.filter((e) => e.signedup_user)
                      navigation.navigate('UserFoundScreen', {
                        signUpObj: players[0],
                        memberObj: memberDetail,
                        groupID: route?.params?.groupID,
                      });
                    } else {
                      navigation.navigate('UserNotFoundScreen', {
                        memberObj: memberDetail,
                        groupID: route?.params?.groupID,
                      });
                    }
                  });
                }}
              />
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
              title={'Gender'}
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
              <Text style={styles.basicInfoTitle}>Membership</Text>
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
            {memberDetail.group && (
              <GroupMembership
                groupData={memberDetail.group}
                switchID={entity.uid}
                edit={editTeam}
                onEditPressed={() =>
                  navigation.navigate('EditMemberClubInfoScreen', {
                    groupMemberDetail: memberDetail.group,
                  })
                }
              />
            )}
            <FlatList
              data={memberDetail.teams}
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
                ? ['Sync Info', 'Delete Member from Team', 'Cancel']
                : ['Sync Info', 'Delete Member from Club', 'Cancel']
            }
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => {
              if (index === 0) {
                Alert.alert(
                  'The basic info in this profile will be updated with the info in the member’s account.',
                  '',
                  [
                    {
                      text: 'Yes',
                      onPress: async () => {
                        getMemberInformation();
                      },
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false},
                );
              } else if (index === 1) {
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
});
