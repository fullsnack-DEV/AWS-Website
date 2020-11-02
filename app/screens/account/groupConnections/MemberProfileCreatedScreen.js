import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Image, Alert, Linking,
} from 'react-native';

import * as Utility from '../../../utils/index';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import { connectProfile } from '../../../api/Groups';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import strings from '../../../Constants/String';
import TCBorderButton from '../../../components/TCBorderButton';

let entity = {};
export default function MemberProfileCreatedScreen({ navigation, route }) {
  const [loading, setloading] = useState(false);
  const [switchUser, setSwitchUser] = useState({})

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
      setSwitchUser(entity)
    }
    getAuthEntity()
  }, [])
  const connectMemberProfile = () => {
    setloading(true)
    connectProfile(switchUser.uid, route.params.memberObj.user_id).then((response) => {
      if (response.status) {
        setloading(false)
        Alert.alert('Towns Cup', response.messages)
        console.log('RESPONSE::::::');
        navigation.navigate('ConnectionReqSentScreen', { memberObj: route.params.memberObj });
      }
    })
      .catch((e) => {
        setloading(false)
        Alert.alert('Towns Cup', e.messages)
      });
  }
  return (

    <View style={styles.mainContainer}>

      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.signUpBg1} />
      <ActivityLoader visible={loading} />

      {route.params.memberObj && <View style={styles.topContainer}>
        <Text style={styles.notFoundUserText}>{route.params.memberObj.first_name}’s profile has been created in your {switchUser.role}.</Text>
        <Image style={styles.userImage} source={route.params.memberObj.thumbnail ? { uri: route.params.memberObj.thumbnail } : images.profilePlaceHolder}></Image>
        <Text style={styles.emailText}>{route.params.memberObj.email}</Text>

        <TCBorderButton title={route.params.buttonTitle} borderColor={colors.whiteColor} marginTop={20} onPress={() => {
          if (route.params.buttonTitle === 'Connect this member profile') {
            connectMemberProfile()
          } else {
            Linking.openURL(`mailto:${route.params.memberObj.email}`)
          }
        }} fontSize={16}/>
        <TCBorderButton title={strings.createOtherProfile} textColor={colors.whiteColor} borderColor={colors.whiteColor} marginTop={20} onPress={() => navigation.navigate('MemberProfileCreatedScreen')} fontSize={16} backgroundColor={'transparent'}/>

      </View>}

      <TCBorderButton title={strings.goToMemberProfile} borderColor={colors.whiteColor} marginTop={20} onPress={() => navigation.navigate('MemberProfileCreatedScreen')} fontSize={16} marginBottom={50}/>

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
