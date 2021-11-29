import React, { useState, useContext } from 'react';
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
import strings from '../../Constants/String';
import TCGradientButton from '../TCGradientButton';
import * as Utility from '../../utils';
import {
  patchPlayer,
  patchRegisterRefereeDetails,
  patchRegisterScorekeeperDetails,
} from '../../api/Users';
import images from '../../Constants/ImagePath';

export default function DeactivateSportScreen({ navigation, route }) {
  const { sport_name, type } = route?.params ?? {};
  const authContext = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setloading] = useState(false);

  console.log('Entity sport_name: => ', sport_name);

  const patchPlayerIn = () => {
    setloading(true);

    const selectedSport = (
      authContext?.entity?.obj?.sport_setting?.activity_order
      || authContext?.entity?.obj?.registered_sports
    )?.filter(
      (obj) => obj.sport_name.toLowerCase() === sport_name.toLowerCase(),
    )[0];

    const modifiedObj = {
      ...selectedSport,
      is_published: false, //! item.is_published,
    };
    const players = (
      authContext?.entity?.obj?.sport_setting?.activity_order
      || authContext?.entity?.obj?.registered_sports
    ).map((u) => (u.sport_name !== modifiedObj.sport_name ? u : modifiedObj));

    patchPlayer({ registered_sports: players }, authContext)
      .then(async (res) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({ ...entity });
        await Utility.setStorage('authContextUser', res.payload);
        await Utility.setStorage('authContextEntity', { ...entity });
        setModalVisible(true)
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  const patchScorekeeper = () => {
    setloading(true);
    const selectedScorekeeperSport = authContext?.entity?.obj?.scorekeeper_data?.filter(
      (obj) => obj.sport_name.toLowerCase() === sport_name.toLowerCase(),
    )[0];
    const modifiedObj = {
      ...selectedScorekeeperSport,
      is_published: false, //! item.is_published,
    };
    const scorekeepers = authContext?.entity?.obj?.scorekeeper_data.map((u) => (u.sport_name !== modifiedObj.sport_name ? u : modifiedObj));

    patchRegisterScorekeeperDetails(
      { scorekeeper_data: scorekeepers },
      authContext,
    )
      .then(async (res) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({ ...entity });

        await Utility.setStorage('authContextUser', res.payload);
        await Utility.setStorage('authContextEntity', { ...entity });
       setModalVisible(true)
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  const patchReferee = () => {
    setloading(true);
    const selectedRefereeSport = authContext?.entity?.obj?.referee_data?.filter(
      (obj) => obj.sport_name.toLowerCase() === sport_name.toLowerCase(),
    )[0];

    const modifiedObj = {
      ...selectedRefereeSport,
      is_published: false, //! item.is_published,
    };
    const referees = authContext?.entity?.obj?.referee_data.map((u) => (u.sport_name !== modifiedObj.sport_name ? u : modifiedObj));
    patchRegisterRefereeDetails({ referee_data: referees }, authContext)
      .then(async (res) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({ ...entity });

        await Utility.setStorage('authContextUser', res.payload);
        await Utility.setStorage('authContextEntity', { ...entity });
       setModalVisible(true)
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  const getSpportText = () => {
    if (type === 'referee') {
      return `${sport_name} in Referee deactivated`;
    }
    if (type === 'scorekeeper') {
      return `${sport_name} in Scorekeeper deactivated`;
    }
    if (type === 'player') {
      return `${sport_name} in Playing deactivated`;
    }
    return null;
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
            Alert.alert(
              `Are you sure you want to deactivate ${sport_name}?`,
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
                    if (type === 'referee') {
                      patchReferee();
                    }
                    if (type === 'scorekeeper') {
                      patchScorekeeper();
                    }
                    if (type === 'player') {
                      patchPlayerIn();
                    }
                  },
                },
              ],
              { cancelable: false },
            );
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
              style={{ alignSelf: 'flex-end' }}>
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
  groupsImg: {
    height: 75,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
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
