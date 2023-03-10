import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {sendInvitationInGroup} from '../../../api/Users';
import TCTextField from '../../../components/TCTextField';
import TCMessageButton from '../../../components/TCMessageButton';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import * as Utility from '../../../utils/index';

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
      Utility.showAlert(strings.youCanNotAddMoreEmailText);
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

  const sendInvitation = () => {
    const entity = authContext.entity;

    // const invalidEmails = email.filter(
    //   (obj) => Utility.validateEmail(obj.email) === false,
    // );

    const duplicateIds = email
      .map((e) => e.email)
      .map((e, i, final) => final.indexOf(e) !== i && i)
      .filter((obj) => email[obj])
      .map((e) => email[e].email);

    if (email[0].email === '') {
      Utility.showAlert(strings.validEmailMessage);
    } else if (duplicateIds.some((e) => e === email[0].email)) {
      Utility.showAlert(strings.doNotEnterSameEmail);
    } else {
      setloading(true);
      const emails = email.map((i) => i.email);

      const array = emails.filter((item) => item);

      const obj = {
        entity_type: entity.role,
        emailIds: array,
        uid: entity.uid,
      };

      console.log(obj, 'sendobj');

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
            Utility.showAlert(e.message);
          }, 10);
        });
    }
  };

  const renderItemEmail = ({item, index}) => (
    <View>
      <TCTextField
        placeholder={strings.emailPlaceHolder}
        keyboardType="email-address"
        value={item?.email}
        clearButtonMode="always"
        onChangeText={(value) => {
          const tempEmail = [...email];
          tempEmail[index].email = value;
          setEmail(tempEmail);
        }}
        style={{alignSelf: 'center', width: '85%', marginBottom: 10}}
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <ScrollView>
        <Text style={styles.infoTextStyle}>{strings.inviteEmailText}</Text>
        <FlatList
          data={email}
          renderItem={renderItemEmail}
          keyExtractor={(item, index) => index.toString()}
          style={styles.flateListStyle}></FlatList>

        <TCMessageButton
          title={strings.addEmailText}
          width={130}
          alignSelf="center"
          marginBottom={10}
          onPress={() => addEmail(1)}
          color={colors.lightBlackColor}
          borderColor={colors.whiteColor}
          backgroundColor={colors.grayBackgroundColor}
          marginTop={25}
        />
      </ScrollView>
      <SafeAreaView />
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
    fontFamily: fonts.RMedium,
    fontSize: 20,
    color: colors.lightBlackColor,
  },

  sendButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

  flateListStyle: {
    paddingTop: 10,
    flexGrow: 0,
  },
});
