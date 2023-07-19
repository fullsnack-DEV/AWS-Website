import React, {useState, useContext} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Alert} from 'react-native';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import ActivityLoader from '../loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import TCGradientButton from '../TCGradientButton';
import {userActivate, userDeactivate} from '../../api/Users';
import {setAuthContextData} from '../../utils';
import Verbs from '../../Constants/Verbs';
import ScreenHeader from '../ScreenHeader';
import images from '../../Constants/ImagePath';

export default function DeactivateAccountScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  const deactivateAccount = () => {
    setloading(true);
    userDeactivate(authContext)
      .then(async (response) => {
        await setAuthContextData(response.payload, authContext);
        setloading(false);
        navigation.pop(2);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const activateAccount = () => {
    setloading(true);
    userActivate(authContext)
      .then(async (response) => {
        await setAuthContextData(response.payload, authContext);
        setloading(false);
        navigation.pop(2);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const handleButtonPress = () => {
    Alert.alert(
      format(
        strings.accountAlert,
        authContext.entity.obj.is_deactivate === true
          ? Verbs.acceptVerb
          : Verbs.deactivateVerb,
      ),
      '',
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text:
            authContext.entity.obj.is_deactivate === true
              ? strings.activateText
              : strings.decativateText,
          style:
            authContext.entity.obj.is_deactivate === true
              ? 'default'
              : 'destructive',
          onPress: () => {
            if (authContext.entity.obj.is_deactivate === true) {
              activateAccount();
            } else {
              deactivateAccount();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.deactivateAccountText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />

      <View style={styles.container}>
        <Text style={styles.descText}>{strings.deactiveScreenDescription}</Text>
      </View>
      <TCGradientButton
        title={
          authContext.entity.obj.is_deactivate === true
            ? strings.reactivateMyAccount
            : strings.deactivateAccountTitle
        }
        outerContainerStyle={styles.buttonContainer}
        onPress={handleButtonPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  descText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  buttonContainer: {
    backgroundColor: colors.userPostTimeColor,
    marginHorizontal: 15,
    marginVertical: 11,
    borderRadius: 23,
  },
});
