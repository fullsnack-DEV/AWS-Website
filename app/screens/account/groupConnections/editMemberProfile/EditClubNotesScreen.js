import React, {
  useState, useEffect, useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,

} from 'react-native';

import ActivityLoader from '../../../../components/loader/ActivityLoader';
import { patchMember } from '../../../../api/Groups';
import * as Utility from '../../../../utils/index';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import TCTextField from '../../../../components/TCTextField';
import TCNavigationHeader from '../../../../components/TCNavigationHeader';
import TCLabel from '../../../../components/TCLabel';

let entity = {};

export default function EditClubNotesScreen({ navigation, route }) {
  const [switchUser, setSwitchUser] = useState({})
  const [loading, setloading] = useState(false);
  const [memberInfo, setMemberInfo] = useState({});
  useEffect(() => {
    setMemberInfo(route.params.memberInfo)
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
      setSwitchUser(entity)
    }
    getAuthEntity()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (switchUser.obj && <TCNavigationHeader image ={switchUser.obj.thumbnail && switchUser.obj.thumbnail} name={switchUser.obj.group_name} groupType={switchUser.role} {...props}/>),
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => editNote()}>Done</Text>
      ),
    });
  }, [navigation, switchUser, memberInfo]);

  const editNote = () => {
    setloading(true)
    const bodyParams = {};
    if (!memberInfo.note && memberInfo.note !== '') {
      bodyParams.note = memberInfo.note;
      bodyParams.is_admin = false;
    }
    const body = {
      group_member_detail: bodyParams,
    }
    console.log('BODY PARAMS:', body);
    patchMember(memberInfo.group_id, memberInfo.user_id, bodyParams).then((response) => {
      if (response.status) {
        console.log('EDIT INFO RESPONSE::', response);
        setloading(false)
        navigation.goBack()
      }
    })
      .catch((e) => {
        setloading(false)
        Alert.alert('', e.messages)
      });
  }

  return (

    <ScrollView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <View>
        <TCLabel title={'Note'}/>
        <TCTextField value={memberInfo.note} height={100} multiline={true} onChangeText={(text) => setMemberInfo({ ...memberInfo, note: text })} placeholder={strings.writeNotesPlaceholder} keyboardType={'default'}/>
      </View>

    </ScrollView>

  );
}
const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});
