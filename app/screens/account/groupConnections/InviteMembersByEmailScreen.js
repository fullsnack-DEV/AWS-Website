import React, {
  useState, useLayoutEffect,
} from 'react';
import {
  Text, View, StyleSheet, FlatList, Alert,
} from 'react-native';
import { sendInvitationInGroup } from '../../../api/Accountapi';
import * as Utility from '../../../utils/index';
import TCTextField from '../../../components/TCTextField';
import TCMessageButton from '../../../components/TCMessageButton';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';

export default function InviteMembersByEmailScreen({ navigation }) {
  const [email, setEmail] = useState([{
    id: 0,
    email: '',
  }]);

  const addEmail = () => {
    const obj = {
      id: email.length === 0 ? 0 : email.length,
      email: '',
    }
    setEmail([...email, obj]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.sendButtonStyle} onPress={() => sendInvitation()}>Send</Text>
      ),
    });
  }, [navigation, email]);

  const sendInvitation = async () => {
    const entity = await Utility.getStorage('loggedInEntity');

    const emails = email.map((i) => i.email);
    console.log('Emails :', emails);
    const obj = {
      entity_type: entity.role,
      emailIds: emails,
      uid: entity.uid,
    }
    console.log('body params:', obj);
    sendInvitationInGroup(obj).then(() => {
      setEmail([{
        id: 0,
        email: '',
      }]);
      navigation.navigate('InvitationSentScreen');
    })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }

  const renderItemEmail = ({ item, index }) => (
    <TCTextField
    placeholder="E-mail Address"
    keyboardType="email-address"
    value={item.email}
    onChangeText={ (value) => {
      const tempEmail = [...email];
      tempEmail[index].email = value;
      setEmail(tempEmail);
      console.log('Emails :', email);
    } }
    style={{ alignSelf: 'center', width: ('85%'), marginBottom: 10 }}/>
  );

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.infoTextStyle}>
        {strings.inviteEmailText}
      </Text>
      <FlatList
                data={email}
                renderItem={renderItemEmail}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state}
                style={styles.flateListStyle}
                >
      </FlatList>

      <TCMessageButton title={strings.addEmailText} width={85} alignSelf = 'center' marginTop={25} onPress={() => addEmail(1)}/>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  infoTextStyle: {
    margin: 15,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },

  sendButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

  flateListStyle: {
    paddingTop: 10,
    flexGrow: 0,
  },
})
