import React from 'react';
import {
  View, StyleSheet, Image, Text,
} from 'react-native';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'

export default function ConnectionReqSentScreen({ route }) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <View style={styles.mailContainer}>
        <Text style={styles.invitationText}>Connection request sent</Text>
        <View style={styles.imageContainer}>
          <Image source={images.emailSent1} style={styles.rotateImage}/>
        </View>
        <Text style={styles.infoText}>When {route.params.memberObj.first_name} {route.params.memberObj.last_name} accepts the request, the user’s account will be connected to the member’s profile created in your group.</Text>
      </View>
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
