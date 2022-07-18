import React from 'react';
import {Text, View, StyleSheet, Image, Linking, Alert} from 'react-native';
import {} from 'react-native-gesture-handler';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import strings from '../../../Constants/String';
import TCBorderButton from '../../../components/TCBorderButton';

export default function UserNotFoundScreen({route}) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.entityCreatedBG} />

      <View style={styles.topContainer}>
        <Text style={styles.notFoundUserText}>
          {strings.userNotFoundByEmail}
        </Text>

        <Image
          style={styles.userImage}
          source={
            route.params.memberObj.thumbnail
              ? {uri: route.params.memberObj.thumbnail}
              : images.profilePlaceHolder
          }
        ></Image>
        <Text style={styles.emailText}>{route.params.memberObj.email}</Text>

        <TCBorderButton
          title={strings.sendInvite}
          borderColor={colors.whiteColor}
          marginTop={20}
          onPress={() => {
            Linking.canOpenURL('mailto:')
              // eslint-disable-next-line consistent-return
              .then((supported) => {
                if (!supported) {
                  // Linking.openURL(`mailto:${data.email}`)
                  Alert.alert(
                    strings.appName,
                    'Please configure email in your device',
                  );
                } else {
                  return Linking.openURL(
                    `mailto:${route.params.memberObj.email}`,
                  );
                }
              })
              .catch((err) => {
                console.error('An error occurred', err);
              });
          }}
          fontSize={16}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  topContainer: {
    flexDirection: 'column',
    margin: 50,
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  notFoundUserText: {
    color: colors.whiteColor,
    fontSize: 25,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
    marginBottom: 28,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.29,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowRadius: 3,
  },
  emailText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    shadowColor: colors.blackColor,
    marginBottom: 40,
    shadowOpacity: 0.29,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowRadius: 3,
  },
  userImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    borderColor: colors.whiteColor,
    borderWidth: 2,
    marginBottom: 12,
  },
});
