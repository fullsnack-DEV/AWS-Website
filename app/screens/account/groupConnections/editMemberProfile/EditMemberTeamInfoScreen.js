import React, {
  useState, useLayoutEffect, useEffect, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,

} from 'react-native';

import { patchMember } from '../../../../api/Groups';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context'
import TCMessageButton from '../../../../components/TCMessageButton';
import TCNavigationHeader from '../../../../components/TCNavigationHeader';
import TCKeyboardView from '../../../../components/TCKeyboardView';

let entity = {};
export default function EditMemberTeamInfoScreen({ navigation, route }) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext)
  const [playerStatus, setPlayerStatus] = useState([]);
  const [role, setRole] = useState('');
  const [switchUser, setSwitchUser] = useState({})

  const [groupMemberDetail, setGroupMemberDetail] = useState({

  });
  const [positions, setPositions] = useState([{}]);

  useEffect(() => {
    setGroupMemberDetail(route.params.groupMemberDetail)
    setPlayerStatus(route.params.groupMemberDetail.status)
    setPositions(route.params.groupMemberDetail.positions || [{}])

    console.log('MEMBER DETAIL ::', groupMemberDetail);
    const getAuthEntity = async () => {
      entity = authContext.entity
      setSwitchUser(entity)
      setRole(entity.role);
    }
    getAuthEntity()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (switchUser.obj && <TCNavigationHeader image ={switchUser.obj.thumbnail && switchUser.obj.thumbnail} name={switchUser.obj.group_name} groupType={switchUser.role} {...props}/>),
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => editTeamProfile()}>Done</Text>
      ),
    });
  }, [navigation, groupMemberDetail, positions, role, playerStatus]);

  const addPosition = () => {
    const obj = {}
    setPositions([...positions, obj]);
  };

  const editTeamProfile = () => {
    setloading(true)
    const bodyParams = {};
    if (groupMemberDetail.jersey_number && groupMemberDetail.jersey_number !== '') {
      bodyParams.jersey_number = groupMemberDetail.jersey_number;
    }
    if (groupMemberDetail.appearance && groupMemberDetail.appearance !== '') {
      bodyParams.appearance = groupMemberDetail.appearance;
    }
    if (groupMemberDetail.note && groupMemberDetail.note !== '') {
      bodyParams.note = groupMemberDetail.note;
    }
    if (groupMemberDetail.positions) {
      bodyParams.positions = groupMemberDetail.positions;
    }
    if (groupMemberDetail.status) {
      bodyParams.status = groupMemberDetail.status;
    }
    bodyParams.is_admin = groupMemberDetail.is_admin;
    bodyParams.is_coach = groupMemberDetail.is_coach;
    bodyParams.is_player = groupMemberDetail.is_player;

    const body = {
      group_member_detail: bodyParams,
    }

    patchMember(groupMemberDetail.group_id, groupMemberDetail.user_id, body, authContext).then(() => {
      setloading(false);
      navigation.goBack()
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 0.7);
    });
  }
  const renderPosition = ({ item, index }) => (
    <TCTextField
    value={item}
    onChangeText={(text) => {
      const tempPosition = [...positions];
      tempPosition[index] = text;
      setPositions(tempPosition);
      setGroupMemberDetail({ ...groupMemberDetail, positions })
    }}
    placeholder={strings.positionPlaceholder}
     keyboardType={'default'}
     style={{ marginBottom: 10 }}/>
  );

  return (

    <TCKeyboardView>
      <ActivityLoader visible={loading} />

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
