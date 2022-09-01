import React, {useState, useContext} from 'react';
import {Text, View, StyleSheet, Image, SafeAreaView, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import TCProfileView from '../../../components/TCProfileView';
import TCBorderButton from '../../../components/TCBorderButton';
import {connectProfile} from '../../../api/Groups';

export default function UserFoundScreen({navigation, route}) {
  const {signUpObj, memberObj, groupID} = route?.params;
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const entity = authContext?.entity?.obj;

  const getLocation = (entityType) => {
    let locationString = '';

    if (entityType === 'team') {
      locationString = entity?.city;
      if (entity?.state_abbr) {
        locationString = `${locationString}, ${entity?.state_abbr}`;
      }
      if (entity?.country) {
        locationString = `${locationString}, ${entity?.country}`;
      }
    } else {
      locationString = signUpObj?.city;
      if (signUpObj?.state_abbr) {
        locationString = `${locationString}, ${signUpObj?.state_abbr}`;
      }
      if (signUpObj?.country) {
        locationString = `${locationString}, ${signUpObj?.country}`;
      }
    }
    return locationString;
  };
  console.log('signup:=>', signUpObj);
  console.log('member:=>', memberObj);

  const connectMemberProfile = () => {
    setloading(true);
    connectProfile(groupID, memberObj?.user_id, authContext)
      .then((response) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, response.messages);
        }, 10);

        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.entityCreatedBG} />
      <ActivityLoader visible={loading} />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              marginTop: 100,
            }}>
            <View style={styles.topContainer}>
              <Text style={styles.foundUserText}>
                We found a user whose e-mail account is
              </Text>

              {/* <Image source={ memberObj.thumbnail ? { uri: memberObj.thumbnail } : images.profilePlaceHolder } style={ styles.profileImage } /> */}
              <TCProfileView
                image={
                  signUpObj?.thumbnail
                    ? {uri: signUpObj?.thumbnail}
                    : images.profilePlaceHolder
                }
                style={styles.profileImage}
                name={`${signUpObj?.first_name} ${signUpObj?.last_name}`}
                location={getLocation('user')}
                color={colors.whiteColor}
              />
              <Text style={styles.emailText}>{memberObj.email}</Text>
            </View>
            <View style={styles.deviderView}></View>
            <View style={styles.topContainer}>
              <Text style={styles.connectProfileText}>
                Would you like to connect this user’s account to{' '}
                {`${signUpObj.first_name}'s`} profile in your team?
              </Text>
              <TCProfileView
                image={
                  entity?.thumbnail ? {uri: entity?.thumbnail} : images.teamPH
                }
                style={styles.profileImage}
                name={`${entity?.group_name}`}
                location={getLocation('team')}
                color={colors.whiteColor}
              />

              <Image source={images.chain} style={styles.fileButton}></Image>

              <TCProfileView
                image={
                  memberObj?.thumbnail
                    ? {uri: memberObj.thumbnail}
                    : images.profilePlaceHolder
                }
                style={styles.profileImage}
                name={`${memberObj?.first_name} ${memberObj?.last_name}`}
                location={getLocation('user')}
                color={colors.whiteColor}
              />

              {/* <Text style={styles.userEmail}>{memberObj.email}</Text> */}
            </View>
            <View style={{marginBottom: 100}} />
            <TCBorderButton
              title={strings.connectProfile}
              borderColor={colors.whiteColor}
              marginTop={20}
              onPress={() => connectMemberProfile()}
              fontSize={16}
            />
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
});
