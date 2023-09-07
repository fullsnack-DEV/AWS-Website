/* eslint-disable import/no-unresolved */
import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import {createUser} from '../../api/Users';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import TCProfileImage from '../../components/TCProfileImage';
import {uploadImageOnPreSignedUrls} from '../../utils/imageAction';
import apiCall from '../../utils/apiCall';

const windowHeight = Dimensions.get('window').height;

export default function FollowTeams({route, navigation}) {
  const [teams, setTeams] = useState(['1']);

  const [followed, setFollowed] = useState([]);
  const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);
  const [signUpData] = useState(route?.params?.sportInfo);

  const followedTeam = [];
  const dummyAuthContext = {...authContext};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          testID="followteam-nav-button"
          style={styles.nextButtonStyle}
          onPress={signUpLastStep}>
          {strings.next}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 20,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    const setFollowData = () => {
      const arr = [];
      for (const tempData of signUpData.teamData) {
        tempData.follow = false;

        arr.push(tempData);
      }

      setTeams(arr);
    };
    setFollowData();
  }, []);

  const followUnfollowClicked = ({item, index}) => {
    teams[index].follow = !item.follow;
    setTeams([...teams]);
    for (const temp of teams) {
      if (temp.follow) {
        const obj = {
          group_id: temp.group_id,
          entity_type: temp.entity_type,
        };
        followedTeam.push(obj);
      }
    }
    setFollowed(followedTeam);
  };

  const renderItem = ({item, index}) => (
    <>
      <View style={styles.listItemContainer}>
        <View style={{flexDirection: 'row'}}>
          <TCProfileImage
            entityType={teams[index].entity_type}
            source={{uri: teams[index].thumbnail}}
            containerStyle={styles.imageContainer}
            intialChar={teams[index].group_name?.charAt(0)?.toUpperCase()}
          />
          <View
            style={{
              width: 180,
              marginHorizontal: 13,
              paddingHorizontal: 0,
            }}>
            <Text style={styles.teamNameText} numberOfLines={1}>
              {teams[index].group_name ?? teams[index].full_name}
            </Text>
            <Text style={styles.cityText} numberOfLines={1}>
              {teams[index].city}, {teams[index].state_abbr},{' '}
              {teams[index].country}
            </Text>
          </View>
        </View>

        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              followUnfollowClicked({item, index});
            }}>
            {teams[index].follow ? (
              <View style={styles.followBtn}>
                <Text style={styles.followText}>{strings.following}</Text>
              </View>
            ) : (
              <View style={styles.followingBtn}>
                <Text style={styles.followingText}>{strings.follow}</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Separator />
    </>
  );

  const signUpLastStep = async () => {
    setloading(true);
    const tokenData = authContext?.tokenData;
    const authToken = tokenData.token;
    const userData = {};
    const uploadImageConfig = {
      method: 'get',
      url: `${Config.BASE_URL}/pre-signed-url?count=2`,
      headers: {Authorization: `Bearer ${authToken}`},
    };

    if (signUpData?.profilePic) {
      const apiResponse = await apiCall(uploadImageConfig);
      const preSignedUrls = apiResponse?.payload?.preSignedUrls ?? [];
      Promise.all([
        uploadImageOnPreSignedUrls({
          url: preSignedUrls?.[0],
          uri: signUpData?.profilePic.path,
          type: signUpData?.profilePic.path.split('.')[1] || 'jpeg',
        }),
        uploadImageOnPreSignedUrls({
          url: preSignedUrls?.[1],
          uri: signUpData?.profilePic?.path,
          type: signUpData?.profilePic?.path.split('.')[1] || 'jpeg',
        }),
      ])
        .then(async ([fullImage, thumbnail]) => {
          const uploadedProfilePic = {full_image: fullImage, thumbnail};
          userData.uploadedProfilePic = uploadedProfilePic;
          signUpToTownsCup(userData);
        })
        .catch(async () => {
          signUpToTownsCup(userData);
        });
    } else {
      signUpToTownsCup(userData);
    }
  };
  const setDummyAuthContext = (key, value) => {
    dummyAuthContext[key] = value;
  };

  const validate = (data) => {
    let returnValue = true;
    if (data.first_name === '') {
      Alert.alert(strings.appName, strings.firstnamevalidation);
      returnValue = false;
    } else if (Utility.validatedName(data.first_name) === false) {
      Alert.alert(strings.appName, strings.fNameCanNotBlank);
      returnValue = false;
    } else if (data.last_name === '') {
      Alert.alert(strings.appName, strings.lastnamevalidation);
      returnValue = false;
    } else if (Utility.validatedName(data.last_name) === false) {
      Alert.alert(strings.appName, strings.lNameCanNotBlank);
      returnValue = false;
    } else if (!data.city || !data.country) {
      Alert.alert(strings.appName, strings.homeCityNotOptional);
      returnValue = false;
    }

    return returnValue;
  };

  // Signup to Towncup
  const signUpToTownsCup = async (param) => {
    setloading(true);
    const data = {
      first_name: signUpData.first_name,
      last_name: signUpData.last_name,
      email: signUpData.emailAddress,
      birthday: signUpData.birthday,
      gender: signUpData.gender,
      city: signUpData.city,
      country: signUpData.country,
      state: signUpData.state,
      state_abbr: signUpData.state_abbr,
      sports: signUpData.sports,
    };

    if (validate(data)) {
      if (signUpData?.profilePicData?.thumbnail) {
        data.thumbnail = signUpData.profilePicData?.thumbnail;
        data.full_image = signUpData.profilePicData?.full_image;
      } else if (param?.uploadedProfilePic) {
        data.thumbnail = param.uploadedProfilePic?.thumbnail;
        data.full_image = param.uploadedProfilePic?.full_image;
      }
      if (followed && followed.length > 0) {
        data.group_ids = followed;
      }

      // Update firebase token here
      await messaging().registerDeviceForRemoteMessages();
      // Get the token
      const token = await messaging().getToken();
      if (token) {
        data.fcm_id = token;
      }

      await createUser(data, authContext)
        .then((createdUser) => {
          const authEntity = {...dummyAuthContext.entity};
          authEntity.obj = createdUser?.payload;
          authEntity.auth.user = createdUser?.payload;
          authEntity.role = 'user';
          setDummyAuthContext('entity', authEntity);
          setDummyAuthContext('user', createdUser?.payload);
          wholeSignUpProcessComplete(createdUser?.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };
  const wholeSignUpProcessComplete = async (userData) => {
    const entity = dummyAuthContext?.entity;
    const tokenData = dummyAuthContext?.tokenData;
    entity.auth.user = {...userData};
    entity.obj = {...userData};
    entity.uid = userData?.user_id;
    entity.isLoggedIn = true;
    await Utility.setStorage('loggedInEntity', {...entity});
    await Utility.setStorage('authContextEntity', {...entity});
    await Utility.setStorage('authContextUser', {...userData});
    await authContext.setTokenData(tokenData);
    await authContext.setUser({...userData});
    await authContext.setEntity({...entity});
    setloading(false);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage
        resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />

      <Text testID="followteam-signup-text" style={styles.sportText}>
        {strings.followSportTeam}
      </Text>
      <FlatList
        style={{
          width: Dimensions.get('window').width - 60,
          marginTop: -15,
          alignSelf: 'center',
        }}
        data={teams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: windowHeight,
    resizeMode: 'cover',
  },
  cityText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    textAlign: 'left',
    textAlignVertical: 'center',
  },

  followBtn: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  followText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: 12,
  },
  followingBtn: {
    alignItems: 'center',
    height: 25,
    backgroundColor: colors.whiteColor,
    borderColor: colors.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  followingText: {
    color: colors.themeColor,
    fontFamily: fonts.RBlack,
    fontSize: 12,
  },

  listItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: colors.reservationAmountColor,
  },

  sportText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginTop: 60,
    paddingHorizontal: 25,

    marginBottom: 25,
  },
  teamNameText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: 16,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },

  imageContainer: {
    backgroundColor: colors.whiteColor,
  },
});
