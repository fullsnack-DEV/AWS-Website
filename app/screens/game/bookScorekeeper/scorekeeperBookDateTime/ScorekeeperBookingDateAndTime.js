import React, {
  useEffect, useContext,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView, Alert,
} from 'react-native';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import AuthContext from '../../../../auth/context';
import Header from '../../../../components/Home/Header';
import EventMapView from '../../../../components/Schedule/EventMapView';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import TCStep from '../../../../components/TCStep';
import TCGradientButton from '../../../../components/TCGradientButton';
import TCProfileView from '../../../../components/TCProfileView';
import TCGameCard from '../../../../components/TCGameCard';
import TCInfoField from '../../../../components/TCInfoField';
import { getGameFromToDateDiff } from '../../../../utils/gameUtils';
// import { getFeesEstimation } from '../../../../api/Challenge';
import { createUserReservation } from '../../../../api/Reservations';

const ScorekeeperBookingDateAndTime = ({ navigation, route }) => {
  const userData = route?.params?.userData;
  const gameData = route?.params?.gameData;
  const authContext = useContext(AuthContext);

  // const getFeeEstimation = () => {
  //   if (gameData?.challenge_scorekeeper?.[0]?.responsible_team_id !== 'none') {
  //     const body = {};
  //     body.start_datetime = gameData?.start_datetime / 1000;
  //     body.end_datetime = gameData?.end_datetime / 1000;
  //     body.manual_fee = false;
  //     getFeesEstimation(gameData?.challenge_scorekeeper?.[0]?.responsible_team_id, body, authContext)
  //       .then((response) => {
  //         setChallengeObject(response?.payload);
  //       });
  //   }
  // }
  useEffect(() => {
    // getFeeEstimation();
  }, [])
  const Title = ({ text, required }) => (
    <Text style={styles.titleText}>
      {text}
      {required && <Text style={{ color: colors.redDelColor }}> * </Text>}
    </Text>
  )

  const Seperator = ({ height = 7 }) => <View style={{
    width: '100%', height, marginVertical: 2, backgroundColor: colors.grayBackgroundColor,
  }}/>

  const getDateDuration = (fromData, toDate) => {
    const startDate = moment(fromData * 1000).format('hh:mm a');
    const endDate = moment(toDate * 1000).format('hh:mm a');
    const duration = getGameFromToDateDiff(fromData, toDate);
    return `${startDate} - ${endDate} (${duration})`
  }

  const handleOnNext = () => {
    const bodyParams = {
      scorekeeper_id: userData?.user_id,
      game_id: gameData?.game_id,
    }
    createUserReservation('scorekeepers', bodyParams, authContext).then(() => {
      const navigationName = `${_.startCase(gameData?.sport)}Home`;
      navigation.navigate('BookScorekeeperSuccess', { navigationScreenName: navigationName })
    }).catch((error) => {
      Alert.alert('Towns Cup', error?.message)
    })
    return true;
  }
  return (
    <KeyboardAvoidingView style={styles.mainContainerStyle} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <Header
                leftComponent={
                  <TouchableOpacity onPress={() => navigation.goBack() }>
                    <Image source={images.backArrow} style={styles.backImageStyle} />
                  </TouchableOpacity>
                }
                centerComponent={
                  <Text style={styles.eventTextStyle}>Choose Date & time</Text>
                }
            />
      <View style={ styles.sperateLine } />
      <ScrollView bounces={false}>
        <SafeAreaView>
          {/*  Steps */}
          <TCStep totalStep={3} currentStep={2} style={{
            margin: 0, padding: 0, paddingTop: 15, paddingRight: 15,
          }}/>

          {/* Name and country */}
          <View style={styles.contentContainer}>
            <Title text={'Scorekeeper'} />
            <View style={{ marginVertical: 10 }}>
              <TCProfileView
                  name={userData?.full_name}
                  location={`${userData?.city} , ${userData?.country}`}
                  image={userData?.full_image ? { uri: userData?.full_image } : images.profilePlaceHolder}
              />
            </View>
          </View>
          <Seperator/>

          {/* Choose Match */}
          <View style={styles.contentContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Title text={'Choose a Match'} required={true} />
              {!gameData && (
                <FastImage
                  source={images.arrowGraterthan}
                  style={{ width: 12, height: 12 }}
              />
              )}
            </View>
            {gameData && <TCGameCard data={gameData} />}
          </View>

          {/* Date & Time */}
          {gameData && (
            <View>
              <View style={styles.contentContainer}>
                <Title text={'Date & Time'} />
                <TCInfoField
                    title={'Date'}
                    value={gameData?.timestamp && moment(gameData?.timestamp * 1000).format('MMM DD, YYYY')}
                    titleStyle={{ alignSelf: 'flex-start', fontFamily: fonts.RRegular }}
                />
                <Seperator height={2}/>
                <TCInfoField
                      title={'Time'}
                      value={(gameData?.start_datetime && gameData?.end_datetime)
                        ? getDateDuration(gameData?.start_datetime, gameData?.end_datetime)
                        : ''
                      }
                      titleStyle={{ alignSelf: 'flex-start', fontFamily: fonts.RRegular }}
                  />
                <Seperator height={2}/>
              </View>

              {/* Venue */}
              <View style={styles.contentContainer}>
                <Title text={'Venue'} />
                <TCInfoField
                      title={'Venue'}
                      value={gameData?.venue?.title}
                      titleStyle={{ alignSelf: 'flex-start', fontFamily: fonts.RRegular }}
                  />
                <TCInfoField
                      title={'Address'}
                      value={gameData?.venue?.address}
                      titleStyle={{ alignSelf: 'flex-start', fontFamily: fonts.RRegular }}
                  />
                <EventMapView
                      region={{
                        latitude: gameData?.venue?.lat ?? 0.0,
                        longitude: gameData?.venue?.lng ?? 0.0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                      coordinate={{
                        latitude: gameData?.venue?.lat ?? 0.0,
                        longitude: gameData?.venue?.lng ?? 0.0,
                      }}
                  />
              </View>
            </View>
          )}
          <Seperator/>

          {/* Next Button */}
          <TCGradientButton
              title={'Next'}
              onPress={handleOnNext}
          />

        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  contentContainer: {
    padding: 15,
  },
  titleText: {
    color: colors.lightBlackColor,
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },
});

export default ScorekeeperBookingDateAndTime;
