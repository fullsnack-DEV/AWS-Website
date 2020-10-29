import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import * as Utility from '../../../../utils/index';
import { createMemberProfile } from '../../../../api/Accountapi';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';

import TCMessageButton from '../../../../components/TCMessageButton';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';

let entity = {};
export default function CreateMemberProfileTeamForm2({ navigation, route }) {
  const [loading, setloading] = useState(false);
  const [injured, setInjured] = useState(false);
  const [longtermaway, setLongtermaway] = useState(false);
  const [suspended, setSuspended] = useState(false);

  const [groupMemberDetail, setGroupMemberDetail] = useState({
    group_member_detail: {
      group_id: entity.uid,
      is_admin: false,
      is_player: false,
      is_coach: false,
      jersey_number: '',
      note: '',
      status: ['injured', 'longtermaway', 'suspended'],
      positions: ['Forwarder', 'Keeper'],
      appearance: '',
    },
  });

  const [teamName, setTeamName] = useState('');

  useEffect(async () => {
    entity = await Utility.getStorage('loggedInEntity');
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => createMember()}>Done</Text>
      ),
    });
  }, [navigation, groupMemberDetail]);

  const createMember = () => {
    setloading(true)
    let bodyParams = {};
    if (route.params.form1.full_image !== '') {
      const imageArray = []

      imageArray.push({ path: route.params.form1.full_image });
      uploadImages(imageArray).then((responses) => {
        const attachments = responses.map((item) => ({
          type: 'image',
          url: item.fullImage,
          thumbnail: item.thumbnail,
        }))
        console.log('FULL IMAGE URL ::::::', attachments[0].url);
        console.log('THUMBNAIL IMAGE URL::::::', attachments[0].thumbnail);
        bodyParams = {
          ...route.params.form1, full_image: attachments[0].url, thumbnail: attachments[0].thumbnail, groupMemberDetail,
        }
        console.log('BODY PARAMS:', bodyParams);
        createMemberProfile(entity.uid, bodyParams).then((response) => {
          if (response.status) {
            setloading(false);
            console.log('Response :', response.payload);
            navigation.navigate('MemberProfileCreatedScreen')
          }
        })
      })
        .catch((e) => {
          Alert.alert('Towns Cup', e.messages)
          setloading(false);
        });
    }
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
      </View>

      <View style={{
        flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginRight: 15,
      }}>
        <View style={styles.profileView}>
          <Image source={ images.teamPlaceholder } style={ styles.profileImage } />
        </View>
        <TCGroupNameBadge />
      </View>
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
        <TCTextField value={teamName} onChangeText={(text) => setTeamName(text)} placeholder={strings.positionPlaceholder} keyboardType={'default'}/>
      </View>
      <TCMessageButton title={strings.addPosition} width={95} alignSelf = 'center' marginTop={15} onPress={() => console.log('Add..')}/>
      <View>
        <TCLable title={'Jersey Number'}/>
        <TCTextField value={groupMemberDetail.jersey_number} onChangeText={(text) => setGroupMemberDetail({ ...groupMemberDetail, jersey_number: text })} placeholder={strings.positionPlaceholder} keyboardType={'number-pad'}/>
      </View>
      <View>
        <TCLable title={'Appearance'}/>
        <TCTextField value={groupMemberDetail.appearance} onChangeText={(text) => setGroupMemberDetail({ ...groupMemberDetail, appearance: text })} placeholder={strings.AppearancePlaceholder} keyboardType={'default'}/>
      </View>
      <View style={styles.mainCheckBoxContainer}>
        <Text style={styles.checkBoxTitle}>Status</Text>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity onPress={() => setInjured(!injured)}>
            <Image source={injured ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Injured</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity onPress={() => setLongtermaway(!longtermaway)}>
            <Image source={longtermaway ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Long-term Away</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity onPress={() => setSuspended(!suspended)}>
            <Image source={suspended ? images.checkGreenBG : images.uncheckWhite} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Suspended</Text>
        </View>
      </View>
      <View>
        <TCLable title={'Note'}/>
        <TCTextField value={groupMemberDetail.note} height={100} multiline={true} onChangeText={(text) => setGroupMemberDetail({ ...groupMemberDetail, note: text })} placeholder={strings.writeNotesPlaceholder} keyboardType={'default'}/>
      </View>
      <View style={{ marginBottom: 20 }}/>
    </ScrollView>

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
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
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
    resizeMode: 'contain',
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
