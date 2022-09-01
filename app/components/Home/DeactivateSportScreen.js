import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import AuthContext from '../../auth/context';
import ActivityLoader from '../loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import TCGradientButton from '../TCGradientButton';
import * as Utility from '../../utils';
import {sportDeactivate} from '../../api/Users';
import images from '../../Constants/ImagePath';
import {getGroups} from '../../api/Groups';

export default function DeactivateSportScreen({navigation, route}) {
  const [sportObj] = useState(route?.params?.sport);
  const authContext = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showLeaveMsg, setShowLeaveMsg] = useState(false);
  const [loading, setloading] = useState(false);

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
                obj.sport === sportObj.sport &&
                obj.sport_type === sportObj.sport_type,
            )?.length > 0 ||
            response.payload.teams.filter(
              (obj) =>
                obj.sport === sportObj.sport &&
                obj.sport_type === sportObj.sport_type,
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

  const getSpportText = () => {
    if (sportObj.type === 'referee') {
      return `${sportObj.sport} in Referee deactivated`;
    }
    if (sportObj.type === 'scorekeeper') {
      return `${sportObj.sport} in Scorekeeper deactivated`;
    }
    if (sportObj.type === 'player') {
      return `${sportObj.sport} in Playing deactivated`;
    }
    return null;
  };
  const deactivateSport = () => {
    setloading(true);

    const body = {
      sport: sportObj.sport,
      sport_type: sportObj.sport_type,
      entity_type: sportObj.type,
    };
    sportDeactivate(body, authContext)
      .then(async (response) => {
        console.log('deactivate sport ', response);
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
        Alert.alert(strings.alertmessagetitle, e.message);
      });
  };

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View style={styles.mailContainer}>
          <Text style={styles.titleText}>When you terminate the team:</Text>
          <Text style={styles.descText}>
            • You can cancel terminating the team (recover the club) up to 14
            days after you terminate it.{'\n'}
            {'\n'}• 14 days after you terminate the team, the team information
            will be permanently deleted, except for certain information that we
            are legally required or permitted to retain, as outlined in our
            Privacy Policy.{'\n'}
            {'\n'}
          </Text>
        </View>
      </ScrollView>
      <SafeAreaView>
        <TCGradientButton
          title={strings.deactivateTitle}
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
              `Are you sure you want to deactivate ${Utility.getSportName(
                sportObj,
                authContext,
              )}?`,
              '',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Deactivate',
                  style: 'destructive',
                  onPress: () => {
                    // if (type === 'referee') {
                    //   patchReferee();
                    // }
                    // if (type === 'scorekeeper') {
                    //   patchScorekeeper();
                    // }
                    // if (type === 'player') {
                    //   patchPlayerIn();
                    // }
                    deactivateSport();
                  },
                },
              ],
              {cancelable: false},
            );
            // }
          }}
        />
        <Modal
          isVisible={modalVisible}
          backdropColor="black"
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            backgroundColor: colors.blackOpacityColor,
            flex: 1,
          }}
          hasBackdrop
          onBackdropPress={() => setModalVisible(false)}
          backdropOpacity={0}>
          <View style={styles.modalContainerViewStyle}>
            <Image style={styles.background} source={images.orangeLayer} />
            <Image style={styles.background} source={images.entityCreatedBG} />
            <TouchableOpacity
              onPress={() => {
                setTimeout(() => {
                  setModalVisible(false);
                }, 10);
                navigation.goBack();
              }}
              style={{alignSelf: 'flex-end'}}>
              <Image
                source={images.cancelWhite}
                style={{
                  marginTop: 25,
                  marginRight: 25,
                  height: 15,
                  width: 15,
                  resizeMode: 'contain',
                  tintColor: colors.whiteColor,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text style={styles.foundText}>{getSpportText()}</Text>
              <Text style={styles.manageChallengeDetailTitle}>
                You can reactivated this activity anytime by adding it to your
                sports activities.
              </Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  titleText: {
    margin: 15,
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  descText: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  modalContainerViewStyle: {
    height: '94%',
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  mailContainer: {
    flex: 1,
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  foundText: {
    color: colors.whiteColor,
    fontSize: 25,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
  manageChallengeDetailTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
    margin: 15,
  },
});
