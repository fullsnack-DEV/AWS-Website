/* eslint-disable no-unsafe-optional-chaining */
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
  Text,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';

import ActionSheet from 'react-native-actionsheet';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {getUserSettings} from '../../../api/Users';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import TCThinDivider from '../../../components/TCThinDivider';
import ScreenHeader from '../../../components/ScreenHeader';

let image_url = '';

export default function ChangeSportsOrderScreen({
  navigation,
  closeBtn,
  userSetting,
  setUserSetting,
}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [addedSport, setAddedSport] = useState([]);
  const [removedSport, setRemovedSport] = useState([]);

  Utility.getStorage('appSetting').then((setting) => {
    image_url = setting.base_url_sporticon;
  });

  useEffect(() => {
    setloading(true);
    let sportsList = [];
    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      sportsList = [...(authContext.entity.obj.sports ?? [])];
    } else {
      sportsList = [
        ...(authContext?.entity?.obj?.registered_sports?.filter(
          (obj) => obj.is_active,
        ) || []),
        ...(authContext?.entity?.obj?.referee_data?.filter(
          (obj) => obj.is_active,
        ) || []),
        ...(authContext?.entity?.obj?.scorekeeper_data?.filter(
          (obj) => obj.is_active,
        ) || []),
      ];
    }

    const res = sportsList.map((obj) => ({
      sport: obj.sport,
    }));
    const data = Utility.uniqueArray(res, 'sport');

    getUserSettings(authContext)
      .then((setting) => {
        if (
          setting?.payload?.user !== {} &&
          setting?.payload?.user?.schedule_sport_filter &&
          setting?.payload?.user?.schedule_sport_filter?.length > 0 &&
          (authContext.entity.role === Verbs.entityTypePlayer ||
            authContext.entity.role === Verbs.entityTypeUser)
        ) {
          setloading(false);
          setAddedSport([...setting?.payload?.user?.schedule_sport_filter]);

          setRemovedSport(
            data.filter(
              (e) =>
                !setting?.payload?.user?.schedule_sport_filter?.some(
                  (item) => item.sport === e.sport,
                ),
            ),
          );
        } else if (
          setting?.payload?.user?.club_schedule_sport_filter &&
          setting?.payload?.user?.club_schedule_sport_filter?.length > 0 &&
          authContext.entity.role === Verbs.entityTypeClub
        ) {
          setAddedSport([
            ...setting?.payload?.user?.club_schedule_sport_filter,
          ]);

          setRemovedSport(
            data.filter(
              (e) =>
                !setting?.payload?.user?.club_schedule_sport_filter?.some(
                  (item) => item.sport === e.sport,
                ),
            ),
          );
        } else {
          setAddedSport([]);
          setRemovedSport([...data]);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(e.message);
      });
  }, [
    authContext,
    authContext?.entity?.obj?.referee_data,
    authContext?.entity?.obj?.registered_sports,
    authContext?.entity?.obj?.scorekeeper_data,
  ]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const onSavePress = () => {
    setloading(true);
    if (addedSport.length > 0) {
      let params;
      if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
        params = {
          ...userSetting,
          club_schedule_sport_filter: addedSport,
        };
      } else {
        params = {
          ...userSetting,
          schedule_sport_filter: addedSport,
        };
      }
      setUserSetting(params);
      closeBtn(false);
      setloading(false);
    } else {
      setloading(false);
    }
  };

  const renderRemoveSportsActivity = useCallback(
    ({item, drag}) => (
      <View style={styles.sportsBackgroundView}>
        <View style={styles.removeSportActivityStyles}>
          <TouchableOpacity
            onPress={() => {
              const findIndex = addedSport.findIndex(
                (a) => a.sport === item.sport,
              );
              if (findIndex !== -1) {
                addedSport.splice(findIndex, 1);
              }

              setAddedSport([...addedSport]);
              removedSport.push(item);
              setRemovedSport([...removedSport]);
            }}
            style={{alignSelf: 'center'}}>
            <Image
              source={images.removeSportList}
              style={styles.addIconStyle}
            />
          </TouchableOpacity>
          <Image
            source={{
              uri: `${image_url}${
                Utility.getSportImage(item.sport, item.type, authContext)
                  .player_image
              }`,
            }}
            style={styles.sportsIcon}
            resizeMode={'contain'}
          />

          <Text style={styles.sportNameTitle}>
            {item?.sport?.[0].toUpperCase() + item?.sport?.slice(1)}{' '}
          </Text>
        </View>
        <TouchableOpacity onLongPress={drag} style={{alignSelf: 'center'}}>
          <Image source={images.moveIcon} style={styles.moveIconStyle} />
        </TouchableOpacity>
      </View>
    ),
    [addedSport, authContext, removedSport],
  );

  const renderAddSportsActivity = useCallback(
    ({item}) => (
      <View style={styles.sportsBackgroundView}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              if (addedSport.length < 10) {
                const findIndex = removedSport.findIndex(
                  (a) => a.sport === item.sport,
                );

                if (findIndex !== -1) {
                  removedSport.splice(findIndex, 1);
                }
                setRemovedSport([...removedSport]);
                addedSport.push(item);
                setAddedSport([...addedSport]);
              } else {
                Alert.alert(strings.sportBarAlertText);
              }
            }}
            style={{alignSelf: 'center'}}>
            <Image source={images.addSportList} style={styles.addIconStyle} />
          </TouchableOpacity>
          <Image
            source={{
              uri: `${image_url}${
                Utility.getSportImage(item.sport, item.type, authContext)
                  .player_image
              }`,
            }}
            style={styles.sportsIcon}
            // resizeMode={'contain'}
          />
          <Text style={styles.sportNameTitle}>
            {item?.sport?.[0].toUpperCase() + item?.sport?.slice(1)}
          </Text>
        </View>
      </View>
    ),
    [addedSport, authContext, removedSport],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <ActivityLoader visible={loading} />
        <ScreenHeader
          isFullTitle
          title={strings.changelistofsports}
          leftIcon={images.crossImage}
          leftIconStyle={{width: 50}}
          leftIconPress={() => {
            closeBtn(false);
          }}
          isRightIconText
          rightButtonText={strings.apply}
          onRightButtonPress={onSavePress}
        />
        <TCThinDivider width={'100%'} />
        <View style={{flex: 1, paddingBottom: 20}}>
          <Text style={styles.mainTextStyle}>
            {strings.sportsdisplayedinfilterbar}
          </Text>
          <Text style={styles.subTitle}>{strings.addUpTo10Sport}</Text>

          {addedSport.length > 0 ? (
            <DraggableFlatList
              showsHorizontalScrollIndicator={false}
              data={addedSport}
              keyExtractor={keyExtractor}
              renderItem={renderRemoveSportsActivity}
              ListEmptyComponent={
                <View style={{marginTop: 15}}>
                  <Text style={styles.noEventText}> {strings.noSports}</Text>
                  <Text style={styles.dataNotFoundText}>
                    {strings.Neweventswillappearhere}
                  </Text>
                </View>
              }
              onDragEnd={(data) => {
                setAddedSport([...data]);
              }}
            />
          ) : (
            <View style={{marginTop: 15}}>
              <Text style={styles.noEventText}>{strings.noSports}</Text>
            </View>
          )}
          <Text style={styles.otherTitle}>{strings.otherSports}</Text>
          {removedSport.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={removedSport}
              keyExtractor={keyExtractor}
              renderItem={renderAddSportsActivity}
            />
          ) : (
            <View style={{marginTop: 15}}>
              <Text style={styles.noEventText}>{strings.noSports}</Text>
            </View>
          )}
          <Text style={styles.headerTextStyle}>
            {strings.someOrganizerJoinSportText}
          </Text>
          <ActionSheet
            ref={actionSheet}
            options={[
              'Add New Sports Activity',
              'sports Activity Tags Order',
              'List / Unlist',
              strings.cancel,
            ]}
            cancelButtonIndex={3}
            onPress={(index) => {
              if (index === 0) {
                console.log('0');
              } else if (index === 1) {
                console.log('1');
              } else if (index === 2) {
                navigation.navigate('SportActivityScreen');
              } else if (index === 3) {
                console.log('3');
              }
            }}
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  otherTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
    marginBottom: 15,
  },

  headerTextStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    margin: 15,
    marginBottom: 0,
  },
  mainTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginTop: 15,
  },

  subTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    margin: 15,
    marginTop: 5,
  },

  moveIconStyle: {
    resizeMode: 'cover',
    height: 13,
    width: 15,
    alignSelf: 'center',
    marginRight: 15,
  },
  addIconStyle: {
    resizeMode: 'cover',
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  sportNameTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },

  sportsBackgroundView: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightGrey,
    borderRadius: 6,
    // elevation: 5,
    flexDirection: 'row',
    height: 35,
    width: Utility.widthPercentageToDP('92%'),
    justifyContent: 'space-between',
    marginBottom: 15,
    marginLeft: 15,
  },
  noEventText: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
  sportsIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 50,
  },

  removeSportActivityStyles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
