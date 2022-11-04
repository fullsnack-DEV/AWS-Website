import React, {useState, useLayoutEffect, useContext} from 'react';
import {Text, View, StyleSheet, FlatList, Alert} from 'react-native';
import {sendInvitationInGroup} from '../../../api/Users';
import TCTextField from '../../../components/TCTextField';
import TCMessageButton from '../../../components/TCMessageButton';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';

export default function InviteMembersByEmailScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  const [email, setEmail] = useState([
    {
      id: 0,
      email: '',
    },
  ]);

  const addEmail = () => {
    if (email.length < 10) {
      const obj = {
        id: email.length === 0 ? 0 : email.length,
        email: '',
      };
      setEmail([...email, obj]);
    } else {
      Alert.alert(strings.alertmessagetitle, strings.youCanNotAddMoreEmailText);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.sendButtonStyle} onPress={() => sendInvitation()}>
          {strings.send}
        </Text>
      ),
    });
  }, [navigation, email]);

  const ValidateEmail = (emailAddress) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailAddress).toLowerCase());
  };

  const sendInvitation = () => {
    setloading(true);
    const entity = authContext.entity;

    const resultEmails = email.filter((obj) => obj.email === '');
    const invalidEmails = email.filter(
      (obj) => ValidateEmail(obj.email) === 'false',
    );

    if (resultEmails.length > 0) {
      Alert.alert(strings.fillAllEmailText);
    } else if (invalidEmails.length > 0) {
      Alert.alert('', strings.validEmailMessage);
    } else {
      const emails = email.map((i) => i.email);
      const obj = {
        entity_type: entity.role,
        emailIds: emails,
        uid: entity.uid,
      };
      sendInvitationInGroup(obj, authContext)
        .then(() => {
          setEmail([
            {
              id: 0,
              email: '',
            },
          ]);
          setloading(false);

          navigation.navigate('InvitationSentScreen');
        })
        .catch((e) => {
          setloading(false);

          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const renderItemEmail = ({item, index}) => {
    console.log('item');
    return (
      <View style={{marginBottom: 15}}>
        <TCTextField
          placeholder={strings.emailPlaceHolder}
          keyboardType="email-address"
          value={item?.email}
          onChangeText={(value) => {
            const tempEmail = [...email];
            tempEmail[index].email = value;
            setEmail(tempEmail);
          }}
          style={{alignSelf: 'center', width: '85%', marginBottom: 10}}
        />
        {index !== 0 && (
          <Text
            style={styles.deleteStyle}
            onPress={() => {
              const tempEmail = [...email];
              tempEmail.splice(index, 1);
              setEmail([...tempEmail]);
            }}>
            {strings.deleteTitle}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <Text style={styles.infoTextStyle}>{strings.inviteEmailText}</Text>
      <FlatList
        data={email}
        renderItem={renderItemEmail}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flateListStyle}></FlatList>

      <TCMessageButton
        title={strings.addEmailText}
        width={85}
        alignSelf="center"
        marginTop={25}
        onPress={() => addEmail(1)}
      />
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
  deleteStyle: {
    textAlign: 'right',
    marginRight: 30,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.redColor,
  },
});
