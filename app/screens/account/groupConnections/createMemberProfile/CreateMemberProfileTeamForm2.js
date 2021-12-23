import React, {
  useState, useLayoutEffect, useEffect, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,

} from 'react-native';

import { createMemberProfile } from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context'
import TCMessageButton from '../../../../components/TCMessageButton';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
import TCKeyboardView from '../../../../components/TCKeyboardView';

let entity = {};
export default function CreateMemberProfileTeamForm2({ navigation, route }) {
  const authContext = useContext(AuthContext)
  const [loading, setloading] = useState(false);
  const [playerStatus, setPlayerStatus] = useState([]);
  const [role, setRole] = useState('');
  const [switchUser, setSwitchUser] = useState({})

  const [groups, setGroups] = useState({
    createdAt: 0.0,
    homefield_address_latitude: 0.0,
    follower_count: 0,
    am_i_admin: false,
    homefield_address_longitude: 0.0,
    privacy_profile: 'members',
    allclubmemberautomatically_sync: false,
    allclubmembermannually_sync: false,
    member_count: 0,
    privacy_events: 'everyone',
    privacy_members: 'everyone',
    office_address_latitude: 0.0,
    office_address_longitude: 0.0,
    approval_required: false,
    is_following: false,
    should_hide: false,
    entity_type: '',
    privacy_followers: 'everyone',
    join_type: 'anyone',
    is_joined: false,
  })
  const [groupMemberDetail, setGroupMemberDetail] = useState({

  });
  const [positions, setPositions] = useState([{
    id: 0,
    position: '',
  }]);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity
      setSwitchUser(entity)
      setGroups({ ...groups, entity_type: entity.role })
      setRole(entity.role);
    }
    getAuthEntity()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => createMember()}>Done</Text>
      ),
    });
  }, [navigation, groupMemberDetail, positions, role, groups]);

  const addPosition = () => {
    const obj = {
      id: positions.length === 0 ? 0 : positions.length,
      code: '',
      number: '',
    }
    setPositions([...positions, obj]);
  };
  const createMember = () => {
    setloading(true)
    let bodyParams = {};
    if (route.params.form1.full_image) {
      const imageArray = []

      imageArray.push({ path: route.params.form1.full_image });
      uploadImages(imageArray, authContext).then((responses) => {
        const attachments = responses.map((item) => ({
          type: 'image',
          url: item.fullImage,
          thumbnail: item.thumbnail,
        }))

        bodyParams = {
          ...route.params.form1, full_image: attachments[0].url, thumbnail: attachments[0].thumbnail, group: groups,
        }
        bodyParams.group_member_detail = { ...groupMemberDetail, group_id: entity.uid };
        console.log('BODY PARAMS:', bodyParams);
        createProfile(bodyParams)
      })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      bodyParams = {
        ...route.params.form1, group: groups,
      }
      bodyParams.group_member_detail = { ...groupMemberDetail, group_id: entity.uid };
      console.log('BODY PARAMS:', bodyParams);
      createProfile(bodyParams)
    }
  }
  const createProfile = (params) => {
    createMemberProfile(entity.uid, params, authContext).then((response) => {
      setloading(false);
      console.log('Response create member :', response.payload);

      if (response.payload.group_member_detail.canConnect === true && response.payload.group_member_detail.connected === false) {
        const title = strings.connectMemberProfile
        navigation.navigate('MemberProfileCreatedScreen', { memberObj: response.payload, buttonTitle: title })
      } else {
        const title = strings.sendInvite
        navigation.navigate('MemberProfileCreatedScreen', { memberObj: response.payload, buttonTitle: title })
      }
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  }
  const renderPosition = ({ item, index }) => (
    <TCTextField
    value={item.position}
    onChangeText={(text) => {
      const tempPosition = [...positions];
      tempPosition[index].position = text;
      setPositions(tempPosition);
      const filteredPosition = positions.filter((obj) => ![null, undefined, ''].includes(obj))
      setGroupMemberDetail({ ...groupMemberDetail, positions: filteredPosition.map((e) => e.position) })
    }}
    placeholder={strings.positionPlaceholder}
     keyboardType={'default'}
     style={{ marginBottom: 10 }}/>
  );
  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
      </View>

      {switchUser.obj && <View style={{
        flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginRight: 15,
      }}>
        <View style={styles.profileView}>
          <Image source={switchUser.obj.thumbnail ? { uri: switchUser.obj.thumbnail } : images.teamPlaceholder } style={ styles.profileImage } />
        </View>
        <TCGroupNameBadge name={switchUser.obj.group_name} groupType={switchUser.role}/>
      </View>}
      <View style={styles.mainCheckBoxContainer}>
        <Text style={styles.checkBoxTitle}>Admin Authority And Role</Text>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity onPress={() => { setGroupMemberDetail({ ...groupMemberDetail, is_admin: !groupMemberDetail.is_admin }) }}>
            <Image source={groupMemberDetail.is_admin ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Admin</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity onPress={() => { setGroupMemberDetail({ ...groupMemberDetail, is_coach: !groupMemberDetail.is_coach }) }}>
            <Image source={groupMemberDetail.is_coach ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Coach</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity onPress={() => { setGroupMemberDetail({ ...groupMemberDetail, is_player: !groupMemberDetail.is_player }) }}>
            <Image source={groupMemberDetail.is_player ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Player</Text>
        </View>
      </View>
      <View>
        <TCLable title={'Position'}/>
        <FlatList
                data={positions}
                renderItem={renderPosition}
                keyExtractor={(item, index) => index.toString()}
                // style={styles.flateListStyle}
                >
        </FlatList>
      </View>
      <TCMessageButton title={strings.addPosition} width={95} alignSelf = 'center' marginTop={15} onPress={() => addPosition()}/>
      <View>
        <TCLable title={'Jersey Number'}/>
        <TCTextField value={groupMemberDetail.jersey_number} onChangeText={(text) => setGroupMemberDetail({ ...groupMemberDetail, jersey_number: text })} placeholder={strings.jerseyNumberPlaceholder} keyboardType={'number-pad'}/>
      </View>
      <View>
        <TCLable title={'Appearance'}/>
        <TCTextField value={groupMemberDetail.appearance} onChangeText={(text) => setGroupMemberDetail({ ...groupMemberDetail, appearance: text })} placeholder={strings.AppearancePlaceholder} keyboardType={'default'}/>
      </View>
      <View style={styles.mainCheckBoxContainer}>
        <Text style={styles.checkBoxTitle}>Status</Text>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
          onPress={() => {
            if (playerStatus.indexOf('Injured') !== -1) {
              const i = playerStatus.indexOf('Injured')
              playerStatus.splice(i, 1);
            } else {
              playerStatus.push('Injured')
            }
            setPlayerStatus(playerStatus)
            setGroupMemberDetail({ ...groupMemberDetail, status: playerStatus })
          }}>
            <Image source={playerStatus.indexOf('Injured') !== -1 ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Injured</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity onPress={() => {
            if (playerStatus.indexOf('Long-term Away') !== -1) {
              const i = playerStatus.indexOf('Long-term Away')
              playerStatus.splice(i, 1);
            } else {
              playerStatus.push('Long-term Away')
            }
            setPlayerStatus(playerStatus)
            setGroupMemberDetail({ ...groupMemberDetail, status: playerStatus })
          }}>
            <Image source={playerStatus.some((el) => el === 'Long-term Away') ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Long-term Away</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
          onPress={() => {
            if (playerStatus.indexOf('Suspended') !== -1) {
              const i = playerStatus.indexOf('Suspended')
              playerStatus.splice(i, 1);
            } else {
              playerStatus.push('Suspended')
            }
            setPlayerStatus(playerStatus)
            setGroupMemberDetail({ ...groupMemberDetail, status: playerStatus })
          }}>
            <Image source={playerStatus.some((el) => el === 'Suspended') ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Suspended</Text>
        </View>
      </View>
      <View>
        <TCLable title={'Note'}/>
        <TCTextField value={groupMemberDetail.note} height={100} multiline={true} onChangeText={(text) => setGroupMemberDetail({ ...groupMemberDetail, note: text })} placeholder={strings.writeNotesPlaceholder} keyboardType={'default'}/>
      </View>
      <View style={{ marginBottom: 20 }}/>
    </TCKeyboardView>

  );
}
const styles = StyleSheet.create({

  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },

  profileView: {
    backgroundColor: colors.whiteColor,
    height: 26,
    width: 26,
    borderRadius: 54,
    marginRight: 5,

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
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
    flexDirection: 'row', alignItems: 'center', height: 25, marginBottom: 10,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 20,
  },
  checkBoxTitle: {
    fontFamily: fonts.RRegular, fontSize: 20, color: colors.lightBlackColor, marginBottom: 10,
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 10,
  },
});
