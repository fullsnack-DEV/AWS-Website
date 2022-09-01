import React, {useState, useContext, useLayoutEffect} from 'react';
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
import {groupPaused, groupUnpaused} from '../../api/Groups';
import {getQBAccountType, QBupdateUser} from '../../utils/QuickBlox';

export default function PauseGroupScreen({navigation, route}) {
  const [sportObj] = useState(route?.params?.sport);
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  console.log('Entity SportObject: => ', sportObj);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.titleScreenText}>
          Pause {authContext.entity.role === 'club' ? 'Club' : 'Team'}
        </Text>
      ),
    });
  }, [authContext.entity.role, navigation]);

  const pauseGroup = () => {
    setloading(true);
    groupPaused(authContext)
      .then((response) => {
        console.log('deactivate account ', response);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id ?? response?.payload?.group_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
            navigation.navigate('AccountScreen');
          })
          .catch((error) => {
            console.log('QB error : ', error);

            setloading(false);
            navigation.navigate('AccountScreen');
          });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const unPauseGroup = () => {
    setloading(true);
    groupUnpaused(authContext)
      .then((response) => {
        console.log('deactivate account ', response);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id ?? response?.payload?.group_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
            navigation.navigate('AccountScreen');
          })
          .catch((error) => {
            console.log('QB error : ', error);

            setloading(false);
            navigation.navigate('AccountScreen');
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
            When you Pause the team:{'\n'}
            {'\n'}• You can cancel terminating the team (recover the club) up to
            14 days after you terminate it.{'\n'}
            {'\n'}• 14 days after you terminate the team, the team information
            will be permanently deleted, except for certain information that we
            are legally required or permitted to retain, as outlined in our
            Privacy Policy.
            {'\n'}
            {'\n'}
          </Text>
        </View>
      </ScrollView>
      <SafeAreaView>
        <TCGradientButton
          title={`${
            authContext?.entity?.obj?.is_pause === true ? 'UNPAUSE' : 'PAUSE'
          } ${authContext.entity.role === 'club' ? 'CLUB' : 'TEAM'}`}
          onPress={() => {
            Alert.alert(
              `Are you sure you want to ${
                authContext?.entity?.obj?.is_pause === true
                  ? 'unpause'
                  : 'pause'
              } ${authContext.entity.obj.group_name}?`,
              '',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text:
                    authContext?.entity?.obj?.is_pause === true
                      ? 'Unpause'
                      : 'Pause',
                  style: 'destructive',
                  onPress: () => {
                    if (authContext?.entity?.obj?.is_pause === true) {
                      unPauseGroup();
                    } else {
                      pauseGroup();
                    }
                  },
                },
              ],
              {cancelable: false},
            );
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
  titleScreenText: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
