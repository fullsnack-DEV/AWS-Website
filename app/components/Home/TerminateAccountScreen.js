import React, {useState, useContext} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Alert} from 'react-native';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import ActivityLoader from '../loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import TCGradientButton from '../TCGradientButton';
import {userTerminate} from '../../api/Users';
import {groupTerminate} from '../../api/Groups';
import {setAuthContextData} from '../../utils';
import ScreenHeader from '../ScreenHeader';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';

export default function TerminateAccountScreen({navigation}) {
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [accountType] = useState(authContext.entity.role);

  const terminateUser = () => {
    setloading(true);

    userTerminate(authContext)
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

  const terminateGroup = () => {
    setloading(true);
    groupTerminate(authContext)
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

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.terminateAccountText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />
      <View style={styles.container}>
        <Text style={styles.descText}>
          {strings.terminateAccountDescription1}
        </Text>
        <View style={styles.row}>
          <Text style={[styles.descText, {marginRight: 10}]}>•</Text>
          <Text style={styles.descText}>
            {strings.terminateAccountDescription2}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.descText, {marginRight: 10}]}>•</Text>
          <Text style={styles.descText}>
            {strings.terminateAccountDescription3}
          </Text>
        </View>
      </View>

      <TCGradientButton
        title={
          authContext.entity.obj.under_terminate === true
            ? strings.reactivateAccount
            : strings.terminateAccount
        }
        onPress={() => {
          Alert.alert(
            format(
              strings.areYouSureToTerminate,
              authContext.entity.obj.under_terminate === true
                ? Verbs.reactivateVerb
                : Verbs.terminate,
            ),
            '',
            [
              {
                text: strings.cancel,
                style: 'cancel',
              },
              {
                text:
                  authContext.entity.obj.under_terminate === true
                    ? strings.reactivate
                    : strings.terminate,
                style: 'destructive',
                onPress: () => {
                  if (
                    accountType === Verbs.entityTypeTeam ||
                    accountType === Verbs.entityTypeClub
                  ) {
                    terminateGroup();
                  }
                  if (
                    accountType === Verbs.entityTypeUser ||
                    accountType === Verbs.entityTypePlayer
                  ) {
                    terminateUser();
                  }
                },
              },
            ],
            {cancelable: false},
          );
        }}
        outerContainerStyle={styles.buttonContainer}
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
    paddingTop: 25,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  descText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginBottom: 15,
  },
  buttonContainer: {
    backgroundColor: colors.userPostTimeColor,
    marginHorizontal: 15,
    marginVertical: 11,
    borderRadius: 23,
  },
});
