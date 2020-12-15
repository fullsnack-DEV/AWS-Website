import React, {
  useState, useContext,
} from 'react';
import {
  Text, View, StyleSheet, Image, SafeAreaView, Alert,
} from 'react-native';
import {
  ScrollView,
} from 'react-native-gesture-handler';
import AuthContext from '../../../auth/context'
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import strings from '../../../Constants/String';
import TCProfileView from '../../../components/TCProfileView';
import TCBorderButton from '../../../components/TCBorderButton';
import { connectProfile } from '../../../api/Groups';

export default function UserFoundScreen({ navigation, route }) {
  const authContext = useContext(AuthContext)
  const [loading, setloading] = useState(false);

  const connectMemberProfile = () => {
    setloading(true)
    connectProfile(route.params.groupID, route.params.memberObj.user_id, authContext).then((response) => {
      setloading(false)
      Alert.alert('Towns Cup', response.messages)
      navigation.goBack();
    })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  }
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.signUpBg1} />
      <ActivityLoader visible={loading} />
      <SafeAreaView>
        <ScrollView >
          <View style={{
            marginTop: 100,
          }}>
            <View style={styles.topContainer}>
              <Text style={styles.foundUserText}>We found a user whose e-mail account is</Text>

              <Image source={ route.params.memberObj.thumbnail ? { uri: route.params.memberObj.thumbnail } : images.profilePlaceHolder } style={ styles.profileImage } />

              <Text style={styles.emailText}>{route.params.memberObj.email}</Text>
            </View>
            <View style={styles.deviderView}></View>
            <View style={styles.topContainer}>
              <Text style={styles.connectProfileText}>Would you like to connect {`${route.params.memberObj.first_name}'s`} profile to the user’s account?</Text>
              <TCProfileView image={route.params.memberObj.thumbnail ? { uri: route.params.memberObj.thumbnail } : images.profilePlaceHolder } style={ styles.profileImage} name={`${route.params.memberObj.first_name} ${route.params.memberObj.last_name}`} location={`${route.params.memberObj.city}, ${route.params.memberObj.state_abbr}, ${route.params.memberObj.country}`} color={colors.whiteColor}/>

              <Image source={images.chain} style={styles.fileButton}></Image>
              <Text style={styles.userEmail}>{route.params.memberObj.email}</Text>

            </View>
            <TCBorderButton title={strings.connectProfile} borderColor={colors.whiteColor} marginTop={20} onPress={() => connectMemberProfile()} fontSize={16}/>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    margin: 20,
    alignSelf: 'center',
    alignItems: 'center',

  },
  foundUserText: {
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
    marginBottom: 15,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.29,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowRadius: 3,
  },

  deviderView: {
    backgroundColor: colors.whiteColor,
    height: 7,
    opacity: 0.4,
  },
  connectProfileText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
    marginTop: 35,
    marginBottom: 35,
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderColor: colors.whiteColor,
    borderWidth: 2,
    marginBottom: 12,
    marginRight: 12,
  },

  fileButton: {
    marginTop: 15,
    height: 14,
    width: 27,
    marginBottom: 15,
    alignSelf: 'center',
  },
  userEmail: {
    color: colors.whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 41,
  },

})
