/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {
  useContext,
  useCallback,
  useLayoutEffect,
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
import images from '../../Constants/ImagePath';
import {getUserDetails} from '../../api/Users';
import strings from '../../Constants/String';
import ActivityLoader from '../loader/ActivityLoader';

let image_url = '';

export default function SportActivitiesScreen({navigation}) {
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => actionSheet.current.show()}
          hitSlop={Utility.getHitSlop(15)}>
          <Image
            source={images.vertical3Dot}
            style={styles.navigationRightItem}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

  const sportsView = useCallback(({item}) => {
    console.log(
      'image_url:',
      image_url,
      Utility.getSportImage(item.sport, item.type, authContext),
    );
    return (
      <View style={styles.sportView}>
        <LinearGradient
          colors={
            (item?.type === 'player' && [
              colors.yellowColor,
              colors.orangeGradientColor,
            ]) ||
            (item?.type === 'referee' && [
              colors.yellowColor,
              colors.darkThemeColor,
            ]) ||
            (item?.type === 'scorekeeper' && [
              colors.blueGradiantEnd,
              colors.blueGradiantStart,
            ])
          }
          style={styles.backgroundView}></LinearGradient>
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
        </View>
      </View>
    );
  }, []);

  const refereeSportsView = useCallback(
    ({item}) => (
      <View style={styles.sportView}>
        <LinearGradient
          colors={[colors.darkThemeColor, colors.darkThemeColor]}
          style={styles.backgroundView}></LinearGradient>
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
          style={styles.backgroundView}></LinearGradient>
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
          (obj) => obj.type === 'player' && obj.is_active === true,
        )?.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Playing</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.registered_sports
                ?.filter(
                  (obj) => obj.type === 'player' && obj.is_active === true,
                )
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={sportsView}
            />
          </View>
        )}

        {userObject?.referee_data?.filter(
          (obj) => obj.type === 'referee' && obj.is_active === true,
        )?.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Refereeing</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.referee_data
                ?.filter(
                  (obj) => obj.type === 'referee' && obj.is_active === true,
                )
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={refereeSportsView}
            />
          </View>
        )}

        {userObject?.scorekeeper_data?.filter(
          (obj) => obj.type === 'scorekeeper' && obj.is_active === true,
        )?.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Scorekeeping</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.scorekeeper_data
                ?.filter(
                  (obj) => obj.type === 'scorekeeper' && obj.is_active === true,
                )
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={scorekeeperSportsView}
            />
          </View>
        )}
      </View>
      <ActionSheet
        ref={actionSheet}
        options={['Order', 'Hide & Unhide', 'Cancel']}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('SportActivityTagScreen');
          }
          if (index === 1) {
            navigation.navigate('SportHideUnhideScreen');
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

  navigationRightItem: {
    height: 15,
    marginRight: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
});
