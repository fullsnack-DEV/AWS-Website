import React, {useState, useContext, useLayoutEffect} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Alert} from 'react-native';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import ActivityLoader from '../loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import TCGradientButton from '../TCGradientButton';
import {groupPaused, groupUnpaused} from '../../api/Groups';
import {setAuthContextData} from '../../utils';
import ScreenHeader from '../ScreenHeader';
import Verbs from '../../Constants/Verbs';
import {getUnreadNotificationCount} from '../../utils/accountUtils';

export default function PauseGroupScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const pauseGroup = () => {
    setloading(true);
    groupPaused(authContext)
      .then(async (response) => {
        getUnreadNotificationCount(authContext);
        await setAuthContextData(response.payload, authContext);
        setloading(false);
        navigation.navigate('App', {screen: 'Account'});
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
      .then(async (response) => {
        await setAuthContextData(response.payload, authContext);
        setloading(false);
        navigation.navigate('App', {screen: 'Account'});
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
        strings.areYouSureTo,
        authContext?.entity?.obj?.is_pause === true
          ? Verbs.unpauseVerb
          : Verbs.pauseVerb,
        authContext.entity.obj.group_name,
      ),
      '',
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text:
            authContext.entity.obj?.is_pause === true
              ? strings.unpause
              : strings.pause,
          style: 'destructive',
          onPress: () => {
            if (authContext.entity.obj?.is_pause === true) {
              unPauseGroup();
            } else {
              pauseGroup();
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
        title={strings.pauseTeamTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />

      <View style={{marginTop: 18, marginHorizontal: 12}}>
        <Text style={styles.descText}> {strings.whenyouTerminateAccount} </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.descText}>{strings.deactiveScreenDescription}</Text>
      </View>
      <TCGradientButton
        title={
          authContext.entity.obj.is_pause === true
            ? strings.unpause
            : strings.pause
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
    paddingTop: 26,
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
