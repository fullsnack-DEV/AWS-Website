import React from 'react';
import {
  View, StyleSheet, Image, Text,
  TouchableOpacity,
} from 'react-native';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import TCBorderButton from '../../../components/TCBorderButton';

export default function ChallengeSentScreen({ navigation, route }) {
  return (
    <View style={styles.mainContainer}>

      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <TouchableOpacity onPress={() => {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'HomeScreen',
            params: {
              uid: route.params.groupObj.group_id ? route.params.groupObj.group_id : route.params.groupObj.user_id,
              backButtonVisible: true,
              role: route.params.groupObj.entity_type === 'player' ? 'user' : route.params.groupObj.entity_type,
            },
          }],
        });
      }}>
        <Image style={styles.backButtonImage} source={images.backArrow} />
      </TouchableOpacity>
      <View style={styles.mailContainer}>
        <Text style={styles.invitationText}>Challenge sent</Text>
        <View style={styles.imageContainer}>
          <Image source={images.emailSent1} style={styles.rotateImage}/>
        </View>
        <Text style={styles.infoText}>When {route && route.params && route.params.groupObj && (route.params.groupObj.group_name || `${route.params.groupObj.first_name} ${route.params.groupObj.last_name}`)} accepts your
          match reservation request, you will be notified.</Text>
      </View>
      {route && route.params && route.params.groupObj && <TCBorderButton
      title={`GO TO ${(route.params.groupObj.group_name)?.toUpperCase() || `${route.params.groupObj.first_name?.toUpperCase()} ${route.params.groupObj.last_name?.toUpperCase()}`}`}
      textColor={colors.whiteColor}
      borderColor={colors.whiteColor}
      backgroundColor={'transparent'}
      height={40} shadow={true}
      marginBottom={60}
      onPress={() => {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'HomeScreen',
            params: {
              uid: route.params.groupObj.group_id ? route.params.groupObj.group_id : route.params.groupObj.user_id,
              backButtonVisible: false,
              role: route.params.groupObj.entity_type === 'player' ? 'user' : route.params.groupObj.entity_type,
            },
          }],
        });
      }}/>}

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
  backButtonImage: {
    marginTop: 55,
    marginLeft: 15,
    height: 15,
    width: 15,
    tintColor: colors.whiteColor,
    resizeMode: 'cover',
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
    shadowColor: colors.blackColor,
    shadowOpacity: 0.29,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowRadius: 3,
    marginBottom: 35,
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 35,
    textAlign: 'center',
    lineHeight: 25,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateImage: {
    width: 146,
    height: 146,
    resizeMode: 'contain',
  },
})
