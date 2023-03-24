import React, {
  useContext,
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
  FlatList,
  Pressable,
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
import {
  getCardBorderColor,
  getEntitySportList,
  getSportDetails,
} from '../../utils/sportsActivityUtils';
import SportActivityModal from '../../screens/home/SportActivity/SportActivityModal';

const EntityType = [
  {entity: Verbs.entityTypePlayer, label: strings.playingTitleText},
  {
    entity: Verbs.entityTypeReferee,
    label: strings.refereeingTitleText,
  },
  {entity: Verbs.entityTypeScorekeeper, label: strings.scorekeepingTitleText},
];

export default function SportActivitiesScreen({navigation, route}) {
  const actionSheet = useRef();
  const addRoleActionSheet = useRef();
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [userObject, setUserObject] = useState();
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [showSportsModal, setShowSportsModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState({});
  const [selectedEntity, setSelectedEntity] = useState(Verbs.entityTypePlayer);

  const {isAdmin, currentUserData} = route.params;
  const authContext = useContext(AuthContext);

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
    if (isFocused) {
      Utility.getStorage('appSetting').then((setting) => {
        setImageBaseUrl(setting.base_url_sporticon);
      });
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

  const sportsView = (item, entityType) => {
    const sport = getSportDetails(
      item.sport,
      item.sport_type,
      authContext.sports,
      entityType,
    );
    return (
      <Pressable
        style={styles.sportView}
        onPress={() => {
          setSelectedSport(sport);
          setSelectedEntity(entityType);
          setShowSportsModal(true);
        }}>
        <LinearGradient
          colors={getCardBorderColor(entityType)}
          style={styles.backgroundView}
        />
        <View style={styles.innerViewContainer}>
          <View style={styles.viewContainer}>
            <FastImage
              source={{
                uri: `${imageBaseUrl}${sport.sport_image}`,
              }}
              style={styles.sportIcon}
              resizeMode={'cover'}
            />
            <View>
              <Text style={styles.sportName}>{sport.sport_name}</Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      {!loading && (
        <ScrollView>
          <ActivityLoader visible={loading} />
          <FlatList
            data={EntityType}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              const list = getEntitySportList(userObject, item.entity).filter(
                (obj) => obj.is_active === true,
              );
              if (list.length > 0) {
                return (
                  <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>{item.label}</Text>
                    {list
                      .sort((a, b) => a.sport.localeCompare(b.sport))
                      .map((ele) => sportsView(ele, item.entity))}
                  </View>
                );
              }
              return null;
            }}
          />

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

      <SportActivityModal
        isVisible={showSportsModal}
        closeModal={() => {
          setShowSportsModal(false);
        }}
        isAdmin={isAdmin}
        userData={currentUserData}
        sport={selectedSport?.sport}
        sportObj={selectedSport}
        sportName={Utility.getSportName(selectedSport, authContext)}
        // onSeeAll={handleSectionClick}
        handleChallengeClick={() => {
          navigation.navigate('InviteChallengeScreen', {
            setting: selectedSport?.setting,
            sportName: selectedSport?.sport,
            sportType: selectedSport?.sport_type,
            groupObj: currentUserData,
          });
        }}
        onMessageClick={() => {
          navigation.push('MessageChat', {
            screen: 'MessageChat',
            params: {userId: currentUserData?.user_id},
          });
        }}
        entityType={selectedEntity}
        continueToChallenge={() => {
          setShowSportsModal(false);
          navigation.navigate('ChallengeScreen', {
            setting: selectedSport?.setting ?? {},
            sportName: selectedSport?.sport,
            sportType: selectedSport?.sport_type,
            groupObj: currentUserData,
          });
        }}
        bookReferee={() => {
          navigation.navigate('RefereeBookingDateAndTime', {
            settingObj: selectedSport?.setting ?? {},
            userData: currentUserData,
            showMatches: true,
            sportName: selectedSport?.sport,
          });
        }}
        bookScoreKeeper={() => {
          navigation.navigate('ScorekeeperBookingDateAndTime', {
            settingObj: selectedSport?.setting ?? {},
            userData: currentUserData,
            showMatches: true,
            sportName: selectedSport?.sport,
          });
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
