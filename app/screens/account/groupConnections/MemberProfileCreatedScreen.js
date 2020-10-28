import React, {

} from 'react';
import {
  Text, View, StyleSheet, Image,
} from 'react-native';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import strings from '../../../Constants/String';
import TCBorderButton from '../../../components/TCBorderButton';

export default function MemberProfileCreatedScreen({ navigation }) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.signUpBg1} />

      <View style={styles.topContainer}>
        <Text style={styles.notFoundUserText}>Neymar’s profile has been created in your club.</Text>
        <Image style={styles.userImage} source={images.profilePlaceHolder}></Image>
        <Text style={styles.emailText}>neymar@hotmail.com</Text>

        <TCBorderButton title={strings.sendInvite} borderColor={colors.whiteColor} marginTop={20} onPress={() => navigation.navigate('MemberProfileCreatedScreen')} fontSize={16}/>
        <TCBorderButton title={strings.createOtherProfile} textColor={colors.whiteColor} borderColor={colors.whiteColor} marginTop={20} onPress={() => navigation.navigate('MemberProfileCreatedScreen')} fontSize={16} backgroundColor={'transparent'}/>

      </View>
      <TCBorderButton title={strings.goToMemberProfile} borderColor={colors.whiteColor} marginTop={20} onPress={() => navigation.navigate('MemberProfileCreatedScreen')} fontSize={16} marginBottom={15}/>
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
    marginLeft: 30,
    marginRight: 30,
    flex: 1,
    justifyContent: 'center',
  },
  notFoundUserText: {
    color: colors.whiteColor,
    fontSize: 25,
    fontFamily: fonts.RBold,
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
    alignSelf: 'center',
  },

})
