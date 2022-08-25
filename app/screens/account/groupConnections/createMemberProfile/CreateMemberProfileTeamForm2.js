import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';

import {createMemberProfile} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCFormProgress from '../../../../components/TCFormProgress';

let entity = {};
export default function CreateMemberProfileTeamForm2({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const [loading, setloading] = useState(false);
  const [playerStatus, setPlayerStatus] = useState([]);
  const [setting, setSetting] = useState({
    is_member: true,
    is_admin: true,
  });
  // const [groups, setGroups] = useState({
  //   createdAt: 0.0,
  //   homefield_address_latitude: 0.0,
  //   follower_count: 0,
  //   am_i_admin: false,
  //   homefield_address_longitude: 0.0,
  //   privacy_profile: 'members',
  //   allclubmemberautomatically_sync: true,
  //   member_count: 0,
  //   privacy_events: 'everyone',
  //   privacy_members: 'everyone',
  //   office_address_latitude: 0.0,
  //   office_address_longitude: 0.0,
  //   approval_required: false,
  //   is_following: false,
  //   should_hide: false,
  //   entity_type: '',
  //   privacy_followers: 'everyone',
  //   join_type: 'anyone',
  //   is_joined: false,
  // });
  const [groupMemberDetail, setGroupMemberDetail] = useState({});
  const [positions, setPositions] = useState([
    {
      id: 0,
      position: '',
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => createMember()}>
          Done
        </Text>
      ),
    });
  }, [navigation, groupMemberDetail, positions]);

  const addPosition = () => {
    const obj = {
      id: positions.length === 0 ? 0 : positions.length,
      code: '',
      number: '',
    };
    setPositions([...positions, obj]);
  };
  const createMember = () => {
    setloading(true);
    let bodyParams = {};
    if (route.params.form1.full_image) {
      const imageArray = [];

      imageArray.push({path: route.params.form1.full_image});
      uploadImages(imageArray, authContext)
        .then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }));

          bodyParams = {
            ...route.params.form1,
            full_image: attachments[0].url,
            thumbnail: attachments[0].thumbnail,
            // group: groups,
          };
          // bodyParams.group_member_detail = {
          //   ...groupMemberDetail,
          //   group_id: entity.uid,
          // };
          bodyParams = {
            ...bodyParams,
            ...setting,
            ...groupMemberDetail,
            // group_id: entity.uid,
          };
          console.log('BODY PARAMS:', bodyParams);
          createProfile(bodyParams);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      bodyParams = {
        ...route.params.form1,
        // group: groups,
      };
      // bodyParams.group_member_detail = {
      //   ...groupMemberDetail,
      //   group_id: entity.uid,
      // };
      bodyParams = {
        ...bodyParams,
        ...setting,
        ...groupMemberDetail,
        // group_id: entity.uid,
      };
      console.log('BODY PARAMS:', bodyParams);
      createProfile(bodyParams);
    }
  };
  const createProfile = (params) => {
    createMemberProfile(entity.uid, params, authContext)
      .then((response) => {
        setloading(false);
        console.log('Response create member :', response.payload);

        if (
          response.payload?.canConnect === true &&
          response.payload?.connected === false
        ) {
          const title = strings.connectMemberProfile;
          navigation.navigate('MemberProfileCreatedScreen', {
            memberObj: response.payload,
            buttonTitle: title,
          });
        } else {
          const title = strings.sendInvite;
          navigation.navigate('MemberProfileCreatedScreen', {
            memberObj: response.payload,
            buttonTitle: title,
          });
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const renderPosition = ({item, index}) => (
    <TCTextField
      value={item.position}
      onChangeText={(text) => {
        const tempPosition = [...positions];
        tempPosition[index].position = text;
        setPositions(tempPosition);
        const filteredPosition = positions.filter(
          (obj) => ![null, undefined, ''].includes(obj),
        );
        setGroupMemberDetail({
          ...groupMemberDetail,
          positions: filteredPosition.map((e) => e.position),
        });
      }}
      placeholder={strings.positionPlaceholder}
      keyboardType={'default'}
      style={{marginBottom: 10}}
    />
  );
  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <TCFormProgress totalSteps={2} curruentStep={2} />

      <Text
        style={[
          styles.checkBoxTitle,
          {marginTop: 15, marginBottom: 0, marginLeft: 15},
        ]}>
        Membership {'&'} Admin Authority
      </Text>
      <View style={styles.mainCheckBoxContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',

            marginRight: 15,
          }}>
          <View style={styles.profileView}>
            <Image
              source={
                entity?.obj?.thumbnail
                  ? {uri: entity?.obj?.thumbnail}
                  : images.teamPlaceholder
              }
              style={styles.profileImage}
            />
          </View>
          <TCGroupNameBadge
            name={entity.obj.group_name}
            groupType={entity.role}
          />
        </View>

        <View style={styles.mainCheckBoxContainer}>
          <View style={[styles.checkBoxContainer, {opacity: 0.5}]}>
            <Text style={[styles.checkBoxItemText, {marginLeft: 0}]}>
              Member
            </Text>
            <TouchableOpacity
              disabled={true}
              onPress={() => {
                const member_setting = !setting.is_member;
                setSetting({
                  ...setting,
                  is_member: member_setting,
                });
              }}>
              <Image
                source={
                  // item.join_membership_acceptedadmin === false
                  setting.is_member
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={[styles.checkBoxItemText, {marginLeft: 0}]}>{`${
              entity.role.charAt(0).toUpperCase() + entity.role.slice(1)
            } Admin`}</Text>
            <TouchableOpacity
              onPress={() => {
                const admin_setting = !setting.is_admin;
                setSetting({
                  ...setting,
                  is_admin: admin_setting,
                });
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
      </View>

      <View style={styles.mainCheckBoxContainer}>
        <Text style={styles.checkBoxTitle}>Roles</Text>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxItemText}>Player</Text>
          <TouchableOpacity
            onPress={() => {
              setGroupMemberDetail({
                ...groupMemberDetail,
                is_player: !groupMemberDetail.is_player,
              });
            }}>
            <Image
              source={
                groupMemberDetail.is_player
                  ? images.orangeCheckBox
                  : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxItemText}>Coach</Text>
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
          <Text style={styles.checkBoxItemText}>Others</Text>
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
      <View>
        <TCLable title={'Position'} />
        <FlatList
          data={positions}
          renderItem={renderPosition}
          keyExtractor={(item, index) => index.toString()}
          // style={styles.flateListStyle}
        ></FlatList>
      </View>
      <TCMessageButton
        title={strings.addPosition}
        width={95}
        alignSelf="center"
        marginTop={15}
        onPress={() => addPosition()}
      />
      <View>
        <TCLable title={'Jersey Number'} />
        <TCTextField
          value={groupMemberDetail.jersey_number}
          onChangeText={(text) =>
            setGroupMemberDetail({...groupMemberDetail, jersey_number: text})
          }
          placeholder={strings.jerseyNumberPlaceholder}
          keyboardType={'number-pad'}
        />
      </View>
      <View>
        <TCLable title={'Appearance'} />
        <TCTextField
          value={groupMemberDetail.appearance}
          onChangeText={(text) =>
            setGroupMemberDetail({...groupMemberDetail, appearance: text})
          }
          placeholder={strings.AppearancePlaceholder}
          keyboardType={'default'}
        />
      </View>
      <View style={styles.mainCheckBoxContainer}>
        <Text style={styles.checkBoxTitle}>Status</Text>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxItemText}>Injured</Text>
          <TouchableOpacity
            onPress={() => {
              if (playerStatus.indexOf('Injured') !== -1) {
                const i = playerStatus.indexOf('Injured');
                playerStatus.splice(i, 1);
              } else {
                playerStatus.push('Injured');
              }
              setPlayerStatus(playerStatus);
              setGroupMemberDetail({
                ...groupMemberDetail,
                status: playerStatus,
              });
            }}>
            <Image
              source={
                playerStatus.indexOf('Injured') !== -1
                  ? images.orangeCheckBox
                  : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxItemText}>Long-term Away</Text>
          <TouchableOpacity
            onPress={() => {
              if (playerStatus.indexOf('Long-term Away') !== -1) {
                const i = playerStatus.indexOf('Long-term Away');
                playerStatus.splice(i, 1);
              } else {
                playerStatus.push('Long-term Away');
              }
              setPlayerStatus(playerStatus);
              setGroupMemberDetail({
                ...groupMemberDetail,
                status: playerStatus,
              });
            }}>
            <Image
              source={
                playerStatus.some((el) => el === 'Long-term Away')
                  ? images.orangeCheckBox
                  : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxItemText}>Suspended</Text>
          <TouchableOpacity
            onPress={() => {
              if (playerStatus.indexOf('Suspended') !== -1) {
                const i = playerStatus.indexOf('Suspended');
                playerStatus.splice(i, 1);
              } else {
                playerStatus.push('Suspended');
              }
              setPlayerStatus(playerStatus);
              setGroupMemberDetail({
                ...groupMemberDetail,
                status: playerStatus,
              });
            }}>
            <Image
              source={
                playerStatus.some((el) => el === 'Suspended')
                  ? images.orangeCheckBox
                  : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <TCLable title={'Note'} />
        <TCTextField
          value={groupMemberDetail.note}
          height={100}
          multiline={true}
          onChangeText={(text) =>
            setGroupMemberDetail({...groupMemberDetail, note: text})
          }
          placeholder={strings.writeNotesPlaceholder}
          keyboardType={'default'}
        />
      </View>
      <View style={{marginBottom: 30}} />
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 26,
    width: 26,
    borderRadius: 54,
    marginRight: 5,

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    alignSelf: 'center',
    height: 25,
    resizeMode: 'cover',
    width: 25,
    borderRadius: 50,
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 25,
    marginBottom: 10,
    marginRight: 15,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 20,
  },
  checkBoxTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
});
