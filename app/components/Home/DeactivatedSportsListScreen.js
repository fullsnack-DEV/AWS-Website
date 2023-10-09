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
  SafeAreaView,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import * as Utility from '../../utils';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getUserDetails, sportActivate} from '../../api/Users';
import {strings} from '../../../Localization/translation';
import ActivityLoader from '../loader/ActivityLoader';
import ScreenHeader from '../ScreenHeader';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';

let image_url = '';

export default function DeactivatedSportsListScreen({navigation}) {
  const actionSheet = useRef();
  const addRoleActionSheet = useRef();
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [userObject, setUserObject] = useState();

  const authContext = useContext(AuthContext);

  Utility.getStorage('appSetting').then((setting) => {
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

  const sportsView = useCallback(
    ({item}) => (
      <View style={styles.sportView}>
        <View style={styles.backgroundView} />
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
            <View style={styles.activateView}>
              <Text style={styles.activateButtonText}>
                {strings.activateText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activateSport],
  );

  const refereeSportsView = useCallback(
    ({item}) => (
      <View style={styles.sportView}>
        <View style={styles.backgroundView} />
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
            <View style={styles.activateView}>
              <Text style={styles.activateButtonText}>
                {strings.activateText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activateSport],
  );

  const scorekeeperSportsView = useCallback(
    ({item}) => (
      <View style={styles.sportView}>
        <View style={styles.backgroundView} />

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
            <View style={styles.activateView}>
              <Text style={styles.activateButtonText}>
                {strings.activateText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activateSport],
  );

  const noDataView = (text) => <Text style={styles.noDataView}>{text}</Text>;

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <ScreenHeader
          title={strings.deactivatedSportsActivities}
          leftIcon={images.backArrow}
          leftIconPress={() => navigation.goBack()}
          rightIcon1={images.chat3Dot}
        />
        <ActivityLoader visible={loading} />
        <View>
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>{strings.playingSportList}</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.registered_sports
                ?.filter(
                  (obj) =>
                    obj.type === Verbs.entityTypePlayer && !obj.is_active,
                )
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={sportsView}
              ListEmptyComponent={noDataView(strings.noSportsData)}
            />
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>{strings.refereeingSportList}</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.referee_data
                ?.filter(
                  (obj) =>
                    obj.type === Verbs.entityTypeReferee && !obj.is_active,
                )
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={refereeSportsView}
              ListEmptyComponent={noDataView(strings.noRefereeData)}
            />
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              {strings.scoreKeepingSportList}
            </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userObject?.scorekeeper_data
                ?.filter(
                  (obj) =>
                    obj.type === Verbs.entityTypeScorekeeper && !obj.is_active,
                )
                .sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={scorekeeperSportsView}
              ListEmptyComponent={noDataView(strings.noScorekeeperData)}
            />
          </View>
        </View>
        <ActionSheet
          ref={actionSheet}
          options={['Sports Activity Tags Order', strings.cancel]}
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listTitle: {
    marginBottom: 10,
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 24,
  },
  listContainer: {
    marginHorizontal: 15,
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
    marginBottom: 15,
  },
  backgroundView: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    height: 50,
    width: 5,
    backgroundColor: colors.placeHolderColor,
  },
  activateView: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themeColor,
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
    lineHeight: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  noDataView: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 27,
    marginTop: 10,
    marginBottom: 15,
  },
});
