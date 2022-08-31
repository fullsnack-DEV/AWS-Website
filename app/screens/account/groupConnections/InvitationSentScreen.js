import React, {useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

import ImageSequence from 'react-native-image-sequence-2';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

export default function InvitationSentScreen({navigation}) {
  const imagesSet = [
    images.emailSent1,
    images.emailSent2,
    images.emailSent3,
    images.emailSent4,
    images.emailSent5,
  ];

  useEffect(() => {
    const timer = setInterval(() => navigation.pop(2), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <View style={styles.mailContainer}>
        <Text style={styles.invitationText}>{strings.invitationSent}</Text>
        <View style={styles.imageContainer}>
          <ImageSequence
            images={imagesSet}
            framesPerSecond={2.5}
            loop={true}
            style={styles.rotateImage}
          />
        </View>
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateImage: {
    width: 146,
    height: 146,
    resizeMode: 'contain',
  },
});
