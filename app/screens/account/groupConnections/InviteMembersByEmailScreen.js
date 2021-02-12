import React, {
  useState, useLayoutEffect, useContext,
} from 'react';
import {
  Text, View, StyleSheet, FlatList, Alert,
} from 'react-native';
import { sendInvitationInGroup } from '../../../api/Users';
import TCTextField from '../../../components/TCTextField';
import TCMessageButton from '../../../components/TCMessageButton';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context'

export default function InviteMembersByEmailScreen({ navigation }) {
  const authContext = useContext(AuthContext)
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

  const sendInvitation = () => {
    const entity = authContext.entity

    const emails = email.map((i) => i.email);
    const obj = {
      entity_type: entity.role,
      emailIds: emails,
      uid: entity.uid,
    }
    console.log('body params:', obj);
    sendInvitationInGroup(obj, authContext).then(() => {
      setEmail([{
        id: 0,
        email: '',
      }]);
      navigation.navigate('InvitationSentScreen');
    })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
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
