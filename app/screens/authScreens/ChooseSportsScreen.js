/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import QB from 'quickblox-react-native-sdk';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import {createUser} from '../../api/Users';
import {getSportsList} from '../../api/Games';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getGroupIndex} from '../../api/elasticSearch';
import {uploadImageOnPreSignedUrls} from '../../utils/imageAction';
import apiCall from '../../utils/apiCall';

import {
  QBconnectAndSubscribe,
  QBcreateUser,
  QBlogin,
  QB_ACCOUNT_TYPE,
} from '../../utils/QuickBlox';

export default function ChooseSportsScreen({navigation, route}) {
  const [sports, setSports] = useState([]);
  const [selected, setSelected] = useState([]);
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [image_base_url, setImageBaseUrl] = useState();
  const authContext = useContext(AuthContext);
  const dummyAuthContext = {...authContext};
  const selectedSports = [];

  useLayoutEffect(() => {
    navigation.setOptions({
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
      headerRight: () => (
        <Text
          testID="next-signupSport-button"
          style={styles.nextButtonStyle}
          onPress={() => {
            if (selected.length > 0) {
              getTeamsData();
            } else {
              Alert.alert(strings.appName, strings.chooseOneSportText);
              return false;
            }
          }}>
          {strings.next}
        </Text>
      ),
    });
  });
  useEffect(() => {
    getSportsList(authContext)
      .then((response) => {
        const arrData = [];
        for (const outer of response.payload) {
          for (const inner of outer.format) {
            const temp = {
              ...inner,
              player_image: outer.player_image,
            };
            arrData.push(temp);
          }
        }

        Utility.getStorage('appSetting').then((setting) => {
          setImageBaseUrl(setting.base_url_sporticon);
        });

        const arr = [];
        for (const tempData of arrData) {
          tempData.isChecked = false;
          arr.push(tempData);
        }
        setSports(arr);
        setTimeout(() => setloading(false), 1000);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, []);

  const isIconCheckedOrNot = ({item, index}) => {
    sports[index].isChecked = !item.isChecked;

    setSports([...sports]);

    for (const temp of sports) {
      if (temp.isChecked) {
        selectedSports.push(temp);
      }
    }

    setSelected(selectedSports);
  };

  const navigateToFollowScreen = (response) => {
    if (response.length > 0) {
      console.log('Location data :=>', {
        ...route?.params?.locationInfo,
        teamData: response,
        sports: selected,
      });
      navigation.navigate('FollowTeams', {
        sportInfo: {
          ...route?.params?.locationInfo,
          teamData: response,
          sports: selected,
        },
      });
    } else {
      finalStepSignUp();
    }
  };
  const getTeamsData = async () => {
    setloading(true);
    const queryParams = {
      size: 100,
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [],
              },
            },
            {
              bool: {
                should: [],
              },
            },
          ],
        },
      },
    };
    for (const selectedSport of selected) {
      queryParams.query.bool.must[0].bool.should.push({
        multi_match: {
          query: `${selectedSport.sport_name}`,
          fields: ['sport', 'sports.sport'],
        },
      });
    }

    if (route.params.locationInfo.city !== '') {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          city: {query: route.params.locationInfo.city, boost: 4},
        },
      });
    }
    if (route.params.locationInfo.state_abbr !== '') {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          state_abbr: {
            query: route.params.locationInfo.state_abbr,
            boost: 3,
          },
        },
      });
    }
    if (route.params.locationInfo.country !== '') {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          country: {
            query: route.params.locationInfo.country,
            boost: 2,
          },
        },
      });
    }
    queryParams.query.bool.must[1].bool.should.push({
      match: {
        entity_type: {
          query: 'team',
          boost: 0,
        },
      },
    });
    queryParams.query.bool.must[1].bool.should.push({
      match: {
        entity_type: {
          query: 'club',
          boost: 0,
        },
      },
    });
    getGroupIndex(queryParams)
      .then((response) => {
        setloading(false);

        navigateToFollowScreen(response);
      })
      .catch((e) => {
        finalStepSignUp();
        console.log(e);
      });
  };

  const renderItem = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}>
      <FastImage
        resizeMode={'contain'}
        source={{uri: `${image_base_url}${item.player_image}`}}
        style={styles.sportImg}
      />
      <Text style={styles.sportList}>{item.sport_name}</Text>
      <View style={styles.checkbox}>
        {sports?.[index]?.isChecked ? (
          <FastImage
            source={images.checkWhite}
            resizeMode={'contain'}
            style={styles.checkboxImg}
          />
        ) : (
          <FastImage
            resizeMode={'contain'}
            source={images.unCheckWhiteBorder}
            style={styles.unCheckboxImg}
          />
        )}
      </View>
      <Separator />
    </TouchableWithoutFeedback>
  );
  const setDummyAuthContext = (key, value) => {
    dummyAuthContext[key] = value;
  };
  const finalStepSignUp = async () => {
    setloading(true);
    const tokenData = authContext?.tokenData;
    const authToken = tokenData.token;
    const userData = {};
    const uploadImageConfig = {
      method: 'get',
      url: `${Config.BASE_URL}/pre-signed-url?count=2`,
      headers: {Authorization: `Bearer ${authToken}`},
    };

    if (route.params.locationInfo.profilePic) {
      const apiResponse = await apiCall(uploadImageConfig);
      const preSignedUrls = apiResponse?.payload?.preSignedUrls ?? [];
      Promise.all([
        uploadImageOnPreSignedUrls({
          url: preSignedUrls?.[0],
          uri: route.params.locationInfo.profilePic.path,
          type:
            route.params.locationInfo.profilePic.path.split('.')[1] ||
            'jpeg',
        }),
        uploadImageOnPreSignedUrls({
          url: preSignedUrls?.[1],
          uri: route.params.locationInfo.profilePic?.path,
          type:
            route.params.locationInfo.profilePic?.path.split('.')[1] ||
            'jpeg',
        }),
      ])
        .then(async ([fullImage, thumbnail]) => {
          const uploadedProfilePic = {full_image: fullImage, thumbnail};
          userData.uploadedProfilePic = uploadedProfilePic;

          setloading(false);
          signUpToTownsCup(userData);
        })
        .catch(async () => {
          signUpToTownsCup(userData);
        });
    } else {
      signUpToTownsCup(userData);
    }
  };

  const validate = (data) => {
    let returnValue = true;
    if (data.first_name === '') {
      Alert.alert(strings.appName, strings.firstnamevalidation);
      returnValue = false;
    }
    else if (Utility.validatedName(data.first_name) === false) {
      Alert.alert(strings.appName, strings.fNameCanNotBlank);
      returnValue = false;
    }
    else if (data.last_name === '') {
      Alert.alert(strings.appName, strings.lastnamevalidation);
      returnValue = false;
    }
    else if (Utility.validatedName(data.last_name) === false) {
      Alert.alert(strings.appName, strings.lNameCanNotBlank);
      returnValue = false;
    }
    else if(!data.city || !data.country){
      Alert.alert(strings.appName, strings.homeCityNotOptional);
      returnValue = false;
    }

    return returnValue;
  };

  // Signup to Towncup
  const signUpToTownsCup = async (param) => {
    const data = {
      first_name: route.params.locationInfo.first_name,
      last_name: route.params.locationInfo.last_name,
      email: route.params.locationInfo.emailAddress,
      birthday: route.params.locationInfo.birthday,
      gender: route.params.locationInfo.gender,
      city: route.params.locationInfo.city,
      country: route.params.locationInfo.country,
      state_abbr: route.params.locationInfo.state_abbr,
      sports: selected,
    };

    if(validate(data)){
      if (route.params.locationInfo.profilePicData?.thumbnail) {
        data.thumbnail = route?.params?.sportInfo?.profilePicData.thumbnail;
        data.full_image = route?.params?.sportInfo?.profilePicData.full_image;
      } else if (param?.uploadedProfilePic) {
        data.thumbnail = param.uploadedProfilePic.thumbnail;
        data.full_image = param.uploadedProfilePic.full_image;
      }
      // Update firebase token here
      await messaging().registerDeviceForRemoteMessages();
      // Get the token
      const token = await messaging().getToken();
      if(token){
        data.fcm_id = token
      }
      
      await createUser(data, authContext)
        .then((createdUser) => {
          const authEntity = {...dummyAuthContext.entity};
          authEntity.obj = createdUser?.payload;
          authEntity.auth.user = createdUser?.payload;
          authEntity.role = 'user';
          setDummyAuthContext('entity', authEntity);
          setDummyAuthContext('user', createdUser?.payload);
          signUpWithQB(createdUser?.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };
  const signUpWithQB = async (response) => {
    let qbEntity = {...dummyAuthContext.entity};

    const setting = await Utility.getStorage('appSetting');

    authContext.setQBCredential(setting);
    QB.settings.enableAutoReconnect({enable: true});
    QBlogin(qbEntity.uid, response)
      .then(async (res) => {
        qbEntity = {
          ...qbEntity,
          QB: {...res.user, connected: true, token: res?.session?.token},
        };
        QBconnectAndSubscribe(qbEntity);
        setDummyAuthContext('entity', qbEntity);
        await wholeSignUpProcessComplete(response);
      })
      .catch(async (error) => {
        console.log('QB Login Error : ', error.message);
        qbEntity = {...qbEntity, QB: {connected: false}};
        setDummyAuthContext('entity', qbEntity);
        QBcreateUser(qbEntity.uid, response, QB_ACCOUNT_TYPE.USER)
          .then(() => {
            QBlogin(qbEntity.uid).then((loginRes) => {
              console.log('QB loginRes', loginRes);
            });
          })
          .catch((e) => {
            console.log('QB error', e);
          });
        await wholeSignUpProcessComplete(response);
      });
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
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage
        resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.sportText}>{strings.sportText}</Text>
        {/* <ActivityIndicator animating={loading} size="large" /> */}

        <FlatList
          data={sports}
          style={{top: 0, marginBottom: 35}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </SafeAreaView>
      {/* <TCButton
        title={'CONTINUE'}
        extraStyle={{position: 'absolute', bottom: hp('7%')}}
        onPress={() => {
          if (selected.length > 0) {
            getTeamsData();
          } else {
            Alert.alert(strings.appName, 'Please choose at least one sport.');
            return false;
          }
        }}
      /> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  checkbox: {},
  unCheckboxImg: {
    width: 22,
    height: 22,
    tintColor: colors.whiteColor,
  },
  checkboxImg: {
    width: 22,
    height: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  sportImg: {
    width: 25,
    height: 25,
    alignSelf: 'center',
  },
  sportList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  sportText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginBottom: hp('4%'),
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
    width: wp('70%'),
  },
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
  container: {
    flex: 1,
  },
});
