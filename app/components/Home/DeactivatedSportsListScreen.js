/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import * as Utility from '../../utils';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getUserDetails, sportActivate} from '../../api/Users';
import strings from '../../Constants/String';
import ActivityLoader from '../loader/ActivityLoader';

let image_url = '';

export default function DeactivatedSportsListScreen({navigation}) {
  const actionSheet = useRef();
  const addRoleActionSheet = useRef();
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [userObject, setUserObject] = useState();

  const authContext = useContext(AuthContext);
  console.log('authContext', authContext.entity.obj);

  Utility.getStorage('appSetting').then((setting) => {
    console.log('APPSETTING:=', setting);
    image_url = setting.base_url_sporticon;
  });

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getUserDetails(authContext?.entity?.uid, authContext)
        .then((response) => {
          setloading(false);
          setUserObject(response.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  const activateSport = (sportObj) => {
    setloading(true);

    const body = {
      sport: sportObj.sport,
      sport_type: sportObj.sport_type,
      entity_type: sportObj.type,
    };
    sportActivate(body, authContext)
      .then(async (response) => {
        console.log('deactivate sport ', response);
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = response.payload;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
        await Utility.setStorage('authContextUser', response.payload);
        await Utility.setStorage('authContextEntity', {...entity});
        navigation.pop(2);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.alertmessagetitle, e.message);
      });
  };

  const sportsView = useCallback(({item}) => {
    console.log(
      'image_url:',
      image_url,
      Utility.getSportImage(item.sport, item.type, authContext),
    );
    return (
      <View style={styles.sportView}>
        <LinearGradient
          colors={[colors.yellowColor, colors.orangeGradientColor]}
          style={styles.backgroundView}
        ></LinearGradient>
        <View style={styles.innerViewContainer}>
          <View style={styles.viewContainer}>
            <FastImage
              source={{
                uri: `${image_url}${Utility.getSportImage(
                  item.sport,
                  item.type,
                  authContext,
                )}`,
              }}
              style={styles.sportIcon}
              resizeMode={'cover'}
            />
            <View>
              <Text style={styles.sportName}>
                {Utility.getSportName(item, authContext)}
              </Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => activateSport(item)}>
            <LinearGradient
              colors={[colors.yellowColor, colors.darkThemeColor]}
              style={styles.activateView}
            >
              <Text style={styles.activateButtonText}>ACTIVATE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, []);

  const refereeSportsView = useCallback(
    ({item}) => (
      <View style={styles.sportView}>
        <LinearGradient
          colors={[colors.darkThemeColor, colors.darkThemeColor]}
          style={styles.backgroundView}
        ></LinearGradient>
        <View style={styles.innerViewContainer}>
          <View style={styles.viewContainer}>
            <Image
              source={{
                uri: `${image_url}${Utility.getSportImage(
                  item.sport,
                  item.type,
                  authContext,
                )}`,
              }}
              style={styles.sportIcon}
            />
            <View>
              <Text style={styles.sportName}>
                {Utility.getSportName(item, authContext)}
              </Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => activateSport(item)}>
            <LinearGradient
              colors={[colors.yellowColor, colors.darkThemeColor]}
              style={styles.activateView}
            >
              <Text style={styles.activateButtonText}>ACTIVATE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [],
  );

  const scorekeeperSportsView = useCallback(
    ({item}) => (
      <View style={styles.sportView}>
        <LinearGradient
          colors={[colors.blueGradiantEnd, colors.blueGradiantStart]}
          style={styles.backgroundView}
        ></LinearGradient>
        <View style={styles.innerViewContainer}>
          <View style={styles.viewContainer}>
            <Image
              source={{
                uri: `${image_url}${Utility.getSportImage(
                  item.sport,
                  item.type,
                  authContext,
                )}`,
              }}
              style={styles.sportIcon}
            />
            <View>
              <Text style={styles.sportName}>
                {Utility.getSportName(item, authContext)}
              </Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => activateSport(item)}>
            <LinearGradient
              colors={[colors.yellowColor, colors.darkThemeColor]}
              style={styles.activateView}
            >
              <Text style={styles.activateButtonText}>ACTIVATE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [],
  );

  return (
    <ScrollView>
      <ActivityLoader visible={loading} />
      <View>
        {userObject?.registered_sports?.filter(
          (obj) => obj.type === 'player' && !obj.is_active,
        )?.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Playing</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.registered_sports
                ?.filter((obj) => obj.type === 'player' && !obj.is_active)
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={sportsView}
            />
          </View>
        )}

        {userObject?.referee_data?.filter(
          (obj) => obj.type === 'referee' && !obj.is_active,
        )?.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Refereeing</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.referee_data
                ?.filter((obj) => obj.type === 'referee' && !obj.is_active)
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={refereeSportsView}
            />
          </View>
        )}

        {userObject?.scorekeeper_data?.filter(
          (obj) => obj.type === 'scorekeeper' && !obj.is_active,
        )?.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Scorekeeping</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.scorekeeper_data
                ?.filter((obj) => obj.type === 'scorekeeper' && !obj.is_active)
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={scorekeeperSportsView}
            />
          </View>
        )}
      </View>
      <ActionSheet
        ref={actionSheet}
        options={['Sports Activity Tags Order', 'Cancel']}
        cancelButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('SportActivityTagScreen');
          }
        }}
      />

      <ActionSheet
        ref={addRoleActionSheet}
        options={[
          strings.addPlaying,
          strings.addRefereeing,
          strings.addScorekeeping,
          strings.cancel,
        ]}
        cancelButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            // Add Playing
            navigation.navigate('RegisterPlayer', {
              comeFrom: 'SportActivityScreen',
            });
          } else if (index === 1) {
            // Add Refereeing
            navigation.navigate('RegisterReferee');
          } else if (index === 2) {
            // Add Scorekeeper
            navigation.navigate('RegisterScorekeeper');
          }
        }}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  listTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
    marginBottom: 15,
  },
  listContainer: {
    margin: 15,
  },
  sportView: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 20,
  },
  backgroundView: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    height: 50,
    width: 8,
  },
  activateView: {
    borderRadius: 5,
    height: 25,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerViewContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportName: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  matchCount: {
    fontFamily: fonts.RLight,
    fontSize: 12,
    color: colors.lightBlackColor,
  },
  sportIcon: {
    height: 24,
    width: 24,
    marginLeft: 15,
    marginRight: 15,
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  activateButtonText: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.whiteColor,
  },
});
