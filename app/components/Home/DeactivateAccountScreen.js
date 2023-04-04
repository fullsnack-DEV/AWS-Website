import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import AuthContext from '../../auth/context';
import ActivityLoader from '../loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import TCGradientButton from '../TCGradientButton';
import {userActivate, userDeactivate} from '../../api/Users';
import {getGroups} from '../../api/Groups';
import {getQBAccountType, QBupdateUser} from '../../utils/QuickBlox';
import {setAuthContextData} from '../../utils';

export default function DeactivateAccountScreen({navigation, route}) {
  const [sportObj] = useState(route?.params?.sport);
  const authContext = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [showLeaveMsg, setShowLeaveMsg] = useState(false);

  const [loading, setloading] = useState(false);

  console.log('Entity SportObject: => ', sportObj);

  useEffect(() => {
    getGroups(authContext)
      .then((response) => {
        console.log('Get user groups Data Res ::--', response);
        if (
          response.payload.clubs?.length > 0 ||
          response.payload.teams?.length > 0
        ) {
          if (
            response.payload.clubs.filter(
              (obj) =>
                obj?.sport === sportObj?.sport &&
                obj?.sport_type === sportObj?.sport_type,
            )?.length > 0 ||
            response.payload.teams.filter(
              (obj) =>
                obj?.sport === sportObj?.sport &&
                obj?.sport_type === sportObj?.sport_type,
            )?.length > 0
          ) {
            setShowLeaveMsg(true);
          }
        }
      })
      .catch((error) => {
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  }, [authContext]);

  const deactivateAccount = () => {
    setloading(true);
    userDeactivate(authContext)
      .then(async (response) => {
        await setAuthContextData(response.payload, authContext);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
            navigation.pop(2);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setloading(false);
            navigation.pop(2);
          });
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

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
            navigation.pop(2);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setloading(false);
            navigation.pop(2);
          });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View style={styles.mailContainer}>
          <Text style={styles.descText}>
            • If you have a checkout (as a challenger or a challengee) within
            the past 60 days, you can’t delete your account until the 60-day
            claim period has elapsed.{'\n'}
            {'\n'}• When you delete your account, you can cancel deleting your
            account (recover your account ) up to 14 days after you delete it.
            {'\n'}
            {'\n'}• 14 days after you delete your account, your information will
            be permanently deleted, except for certain information that we are
            legally required or permitted to retain, as outlined in our Privacy
            Policy.{'\n'}
            {'\n'}• If you want to use TownsCup in the future, you’ll need to
            set up a new account.{'\n'}
            {'\n'}• If you have any future reservations, they must first be
            cancelled in accordance with the applicable host cancellation policy
            before you delete your account . Cancellation fees may apply.
            {'\n'}
            {'\n'}
          </Text>
        </View>
      </ScrollView>
      <SafeAreaView>
        <TCGradientButton
          title={
            authContext?.entity?.obj?.is_deactivate === true
              ? 'REACTIVATE MY ACCOUNT'
              : 'DEACTIVE MY ACCOUNT '
          }
          onPress={() => {
            // Alert.alert('',
            //   'Please leave all clubs, leagues and seasons before you deactivate Tennis Singles.');

            // if (showLeaveMsg) {
            //   Alert.alert(
            //     '',
            //     `Please leave all teams, clubs and leagues before you deactivate ${Utility.getSportName(
            //       sportObj,
            //       authContext,
            //     )}.`,
            //   );
            // } else {
            Alert.alert(
              `Are you sure you want to ${
                authContext?.entity?.obj?.is_deactivate === true
                  ? 'activate'
                  : 'deactivate'
              } your account?`,
              '',
              [
                {
                  text: strings.cancel,
                  style: 'cancel',
                },
                {
                  text:
                    authContext?.entity?.obj?.is_deactivate === true
                      ? 'Activate'
                      : 'Deactivate',
                  style: 'destructive',
                  onPress: () => {
                    if (authContext?.entity?.obj?.is_deactivate === true) {
                      activateAccount();
                    } else {
                      deactivateAccount();
                    }
                  },
                },
              ],
              {cancelable: false},
            );
            // }
          }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  descText: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  mailContainer: {
    flex: 1,
  },
});
