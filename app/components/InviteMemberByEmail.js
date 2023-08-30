import {Text, View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import React, {useState, useContext} from 'react';
import {format} from 'react-string-format';

import CustomModalWrapper from './CustomModalWrapper';
import {ModalTypes} from '../Constants/GeneralConstants';
import {strings} from '../../Localization/translation';
import {sendInvitationInGroup} from '../api/Users';
import TCMessageButton from './TCMessageButton';
import TCTextField from './TCTextField';
import ActivityLoader from './loader/ActivityLoader';
import AuthContext from '../auth/context';
import * as Utility from '../utils/index';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function InviteMemberbyEmailModal({
  isVisible,
  closeModal = () => {},
}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  const [email, setEmail] = useState([
    {
      id: 0,
      email: '',
    },
  ]);

  const onCloseModal = () => {
    setEmail([
      {
        id: 0,
        email: '',
      },
    ]);
    closeModal();
  };

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

  const ValidateEmail = (emailAddress) => {
    const emailWithoutEmptymails = emailAddress.filter((e) => e.email !== '');

    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const Validates = emailWithoutEmptymails.map((e) =>
      re.test(String(e.email).toLowerCase()),
    );

    const allTrue = !Validates.some((el) => el === false);

    return allTrue;
  };

  const duplicateIds = email
    .map((e) => e.email)
    .map((e, i, final) => final.indexOf(e) !== i && i)
    .filter((obj) => email[obj])
    .map((e) => email[e].email);

  const findDuplicates = (emails) => {
    const emailWithoutEmptymails = emails.filter((e) => e.email !== '');

    let isDuplicate = emailWithoutEmptymails.map((val) =>
      duplicateIds.some((e) => e === val.email),
    );

    const allTrue = !isDuplicate.some((el) => el === true);

    isDuplicate = [];

    return allTrue;
  };

  const sendInvitation = () => {
    const entity = authContext.entity;

    // const invalidEmails = email.filter(
    //   (obj) => Utility.validateEmail(obj.email) === false,
    // );

    if (email[0].email === '') {
      Utility.showAlert(strings.validEmailMessage);
    } else if (findDuplicates(email) === false) {
      Utility.showAlert(strings.doNotEnterSameEmail);
    } else if (ValidateEmail(email) === false) {
      Utility.showAlertWithoutTitle(strings.validEmailMessage);
    } else {
      setloading(true);
      const emails = email.map((i) => i.email);

      const array = emails.filter((item) => item);

      const obj = {
        entity_type: entity.role,
        emailIds: array,
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

          Utility.showAlert(
            format(
              obj?.emailIds > 1
                ? strings.multiEmailInvitationWereSent
                : strings.oneemailInvitationWasSent,
              obj?.emailIds,
            ),
            () => {
              onCloseModal();
            },
          );

          // onCloseModal();

          //   navigation.navigate('InvitationSentScreen');
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
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={onCloseModal}
      modalType={ModalTypes.style1}
      headerRightButtonText={strings.send}
      onRightButtonPress={() => sendInvitation()}
      title={strings.inviteByEmail}
      containerStyle={{padding: 0, flex: 1}}>
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
          width={130}
          alignSelf="center"
          marginBottom={10}
          onPress={() => addEmail(1)}
          color={colors.lightBlackColor}
          borderColor={colors.whiteColor}
          backgroundColor={colors.grayBackgroundColor}
          marginTop={25}
        />

        <SafeAreaView />
      </View>
    </CustomModalWrapper>
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

  flateListStyle: {
    paddingTop: 10,
    flexGrow: 0,
  },
});
