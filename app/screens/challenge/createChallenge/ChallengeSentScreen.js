import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
// import TCBorderButton from '../../../components/TCBorderButton';

export default function ChallengeSentScreen({navigation, route}) {
  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.popToTop()
  //   }, 3000);
  // })
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.entityCreatedBG} />
      {/* <TouchableOpacity onPress={() => {
        navigation.pop(1000)
      }}>
        <Image style={styles.backButtonImage} source={images.backArrow} />
      </TouchableOpacity> */}
      <View style={styles.mailContainer}>
        <Text style={styles.invitationText}>Challenge sent</Text>
        <Text style={styles.infoText}>
          When{' '}
          {route &&
            route.params &&
            route.params.groupObj &&
            (route.params.groupObj.group_name ||
              `${route.params.groupObj.first_name} ${route.params.groupObj.last_name}`)}{' '}
          accepts your match reservation request, you will be notified.
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={images.challengeSentPlane}
            style={styles.rotateImage}
          />
        </View>
      </View>
      {/* {route && route.params && route.params.groupObj && <TCBorderButton
      title={`GO TO ${(route.params.groupObj.group_name)?.toUpperCase() || `${route.params.groupObj.first_name?.toUpperCase()} ${route.params.groupObj.last_name?.toUpperCase()}`}`}
      textColor={colors.whiteColor}
      borderColor={colors.whiteColor}
      backgroundColor={'transparent'}
      height={40} shadow={true}
      marginBottom={60}
      onPress={() => {
        navigation.navigate('HomeScreen', {
          uid: route.params.groupObj.group_id ? route.params.groupObj.group_id : route.params.groupObj.user_id,
          backButtonVisible: true,
          role: route.params.groupObj.entity_type === 'player' ? 'user' : route.params.groupObj.entity_type,
          menuBtnVisible: false,
        })
      }}/>} */}
      <TouchableOpacity
        style={styles.goToProfileButton}
        onPress={() => {
          navigation.popToTop();
        }}>
        <Text style={styles.goToProfileTitle}>OK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 45,
    marginBottom: wp('15%'),
    width: '92%',
  },
  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  mailContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  invitationText: {
    fontSize: 25,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 25,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateImage: {
    height: 150,
    width: 212,
    resizeMode: 'contain',
  },
});
