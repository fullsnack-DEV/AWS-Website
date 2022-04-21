import React, {useState, useContext} from 'react';
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
import strings from '../../Constants/String';
import TCGradientButton from '../TCGradientButton';
import * as Utility from '../../utils';
import {groupPaused} from '../../api/Groups';

export default function PauseTeamScreen({navigation, route}) {
  const [sportObj] = useState(route?.params?.sport);
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  console.log('Entity SportObject: => ', sportObj);

  const pauseGroup = () => {
    setloading(true);
    groupPaused(authContext)
      .then(async (response) => {
        console.log('deactivate account ', response);
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = response.payload;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
        await Utility.setStorage('authContextUser', response.payload);
        await Utility.setStorage('authContextEntity', {...entity});
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
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View style={styles.mailContainer}>
          <Text style={styles.descText}>
            When you Pause the team:{'\n'}{'\n'}
            • You can cancel terminating the team (recover 
            the club) up to 14 days after you terminate it.{'\n'}
            {'\n'}• 14 days after you terminate the team, the 
            team information will be permanently deleted, 
            except for certain information that we are 
            legally required or permitted to retain, as 
            outlined in our Privacy Policy.     
            {'\n'}
            {'\n'}
          </Text>
        </View>
      </ScrollView>
      <SafeAreaView>
        <TCGradientButton
          title={strings.pauseTeam}
          onPress={() => {
            Alert.alert(
              `Are you sure you want to pause ${authContext.entity.obj.group_name}?`,
              '',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Pause',
                  style: 'destructive',
                  onPress: () => {
                    pauseGroup();
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
});
