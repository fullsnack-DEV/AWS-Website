/* eslint-disable react/jsx-key */
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
import {strings} from '../../../Localization/translation';
import ActivityLoader from '../loader/ActivityLoader';
import TCProfileButton from '../TCProfileButton';
import Verbs from '../../Constants/Verbs';

let image_url = '';

export default function SportActivitiesScreen({navigation}) {
  const actionSheet = useRef();
  const addRoleActionSheet = useRef();
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [userObject, setUserObject] = useState();

  const authContext = useContext(AuthContext);
  console.log('authContext', authContext.entity.obj);

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

  useEffect(() => {
    image_url = global.sport_icon_baseurl;
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
            (item?.type === Verbs.entityTypePlayer && [
              colors.yellowColor,
              colors.orangeGradientColor,
            ]) ||
            (item?.type === Verbs.entityTypeReferee && [
              colors.yellowColor,
              colors.darkThemeColor,
            ]) ||
            (item?.type === Verbs.entityTypeScorekeeper && [
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
    <>
      {!loading && (
        <ScrollView>
          <ActivityLoader visible={loading} />
          <View>
            {userObject?.registered_sports?.filter(
              (obj) =>
                obj.type === Verbs.entityTypePlayer && obj.is_active === true,
            )?.length > 0 && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Playing</Text>
                {userObject?.registered_sports
                  ?.filter(
                    (obj) =>
                      obj.type === Verbs.entityTypePlayer &&
                      obj.is_active === true,
                  )
                  .sort((a, b) => a.sport.localeCompare(b.sport))
                  .map((item) => sportsView({item}))}
              </View>
            )}

            {userObject?.referee_data?.filter(
              (obj) =>
                obj.type === Verbs.entityTypeReferee && obj.is_active === true,
            )?.length > 0 && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Refereeing</Text>
                {userObject?.referee_data
                  ?.filter(
                    (obj) =>
                      obj.type === Verbs.entityTypeReferee &&
                      obj.is_active === true,
                  )
                  .sort((a, b) => a.sport.localeCompare(b.sport))
                  .map((item) => refereeSportsView({item}))}
              </View>
            )}

            {userObject?.scorekeeper_data?.filter(
              (obj) =>
                obj.type === Verbs.entityTypeScorekeeper &&
                obj.is_active === true,
            )?.length > 0 && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Scorekeeping</Text>
                {userObject?.scorekeeper_data
                  ?.filter(
                    (obj) =>
                      obj.type === Verbs.entityTypeScorekeeper &&
                      obj.is_active === true,
                  )
                  .sort((a, b) => a.sport.localeCompare(b.sport))
                  .map((item) => scorekeeperSportsView({item}))}
              </View>
            )}
          </View>

          <TCProfileButton
            title={strings.addSportsActivity}
            onPressProfile={() => {
              addRoleActionSheet.current.show();
            }}
            showArrow={false}
            style={{marginBottom: 50, width: 180, alignSelf: 'center'}}
          />
        </ScrollView>
      )}

      <ActionSheet
        ref={actionSheet}
        options={[strings.editOrder, strings.hideUnhide, strings.cancel]}
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
    </>
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
