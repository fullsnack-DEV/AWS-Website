import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigationState} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {updateUserProfile} from '../../api/Users';
import {getSportsList} from '../../api/Games';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import TCButton from '../../components/TCButton';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getGroupIndex} from '../../api/elasticSearch';

export default function ChooseSportsScreen({navigation, route}) {
  const [sports, setSports] = useState([]);
  const [selected, setSelected] = useState([]);
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [image_base_url, setImageBaseUrl] = useState();
  const authContext = useContext(AuthContext);
  const selectedSports = [];
  const routes = useNavigationState((state) => state);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            const routeObj = routes?.routes?.[routes?.index] ?? {};
            const routeName =
              routeObj?.state?.routes?.[routeObj?.state?.index]?.name;
            if (routeName === 'ChooseLocationScreen') {
              navigation.pop(1);
            } else {
              navigation.navigate('ChooseLocationScreen');
              // navigation.navigate.push('ChooseLocationScreen');
            }
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 15,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getSportsList(authContext)
      .then((response) => {
        console.log('Sport list:::', response);

        Utility.getStorage('appSetting').then((setting) => {
          setImageBaseUrl(setting.base_url_sporticon);
          console.log('IMAGE_BASE_URL', setting.base_url_sporticon);
        });

        const arr = [];
        for (const tempData of response.payload) {
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
    console.log('SELECTED:::', index);

    sports[index].isChecked = !item.isChecked;

    setSports([...sports]);

    for (const temp of sports) {
      if (temp.isChecked) {
        selectedSports.push(temp.sport_name);
      }
    }

    setSelected(selectedSports);
  };

  const updateProfile = async (params, callback) => {
    setloading(true);
    updateUserProfile(params, authContext)
      .then(async (userResoponse) => {
        const userData = userResoponse?.payload;
        const entity = {...authContext?.entity};
        entity.auth.user = userData;
        entity.obj = userData;
        await Utility.setStorage('loggedInEntity', {...entity});
        await Utility.setStorage('authContextEntity', {...entity});
        await Utility.setStorage('authContextUser', {...userData});
        await authContext.setUser({...userData});
        await authContext.setEntity({...entity});
        setloading(false);
        callback();
      })
      .catch(() => setloading(false));
  };
  const getTeamsData = async () => {
    console.log('Call getTeamData');
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
    if (selected.length === 1) {
      queryParams.query.bool.must[0].bool.should.push({
        multi_match: {
          query: `${selected[0]}`,
          fields: ['sport', 'sports.sport'],
        },
      });
    } else if (selected.length === 2) {
      queryParams.query.bool.must[0].bool.should.push({
        multi_match: {
          query: `${selected[0]}`,
          fields: ['sport', 'sports.sport'],
        },
      });
      queryParams.query.bool.must[0].bool.should.push({
        multi_match: {
          query: `${selected[1]}`,
          fields: ['sport', 'sports.sport'],
        },
      });
    }

    if (route.params.city !== '') {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          city: {query: route?.params?.city, boost: 4},
        },
      });
    }
    if (route.params.state !== '') {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          state_abbr: {
            query: route.params.state,
            boost: 3,
          },
        },
      });
    }
    if (route.params.state !== '') {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          country: {
            query: route.params.country,
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
    console.log('query --->', JSON.stringify(queryParams));
    getGroupIndex(queryParams)
      .then((response) => {
        setloading(false);
        console.log('groupIndex:=>', response);
        updateProfile({sports: selected}, () => {
          if (response) {
            navigation.navigate('FollowTeams', {
              teamData: response,
              city: route.params.city,
              state: route.params.state,
              country: route.params.country,
              sports: selected,
            });
          } else {
            setloading(false);
            finalStepSignUp();
          }
        });
      })
      .catch((e) => {
        setloading(false);
        console.log(e);
        setTimeout(() => {
          Alert.alert(`${strings.alertmessagetitle} - 1`, e.message);
        }, 10);
      });
  };

  const renderItem = ({item, index}) => {
    console.log('Image url :=>', `${image_base_url}${item.player_image}`);
    return (
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
  };

  const finalStepSignUp = async () => {
    let dummyEntity = {...authContext?.entity};
    dummyEntity = {...dummyEntity, isLoggedIn: true};
    await Utility.setStorage('authContextEntity', {...dummyEntity});
    await authContext.setEntity({...dummyEntity});
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

      <Text style={styles.sportText}>{strings.sportText}</Text>
      {/* <ActivityIndicator animating={loading} size="large" /> */}
      <FlatList
        data={sports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />

      <TCButton
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
      />
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
    marginHorizontal: 20,
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
});
