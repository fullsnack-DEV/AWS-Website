/* eslint-disable no-unsafe-optional-chaining */
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
  SafeAreaView,
} from 'react-native';

import FlatList from 'react-native-drag-flatlist';
import ActionSheet from 'react-native-actionsheet';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {getUserSettings, saveUserSettings} from '../../../api/Users';

let image_url = '';

export default function ChangeSportsOrderScreen({navigation, route}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [addedSport, setAddedSport] = useState([]);
  const [removedSport, setRemovedSport] = useState([]);
  const [userSetting, setUserSetting] = useState();

  Utility.getStorage('appSetting').then((setting) => {
    console.log('APPSETTING:=', setting);
    image_url = setting.base_url_sporticon;
  });

  useEffect(() => {
    const sportsList = [
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

    const res = sportsList.map((obj) => ({
        sport: obj.sport,
      }));
    const data = Utility.uniqueArray(res, 'sport');
    console.log('resresres', data);

    getUserSettings(authContext)
      .then((setting) => {
        console.log('Settings:=>', setting);
        setUserSetting(setting.payload.user);
        if (
          setting?.payload?.user !== {} &&
          setting?.payload?.user?.schedule_sport_filter &&
          setting?.payload?.user?.schedule_sport_filter?.length > 0
        ) {
          setAddedSport([...setting?.payload?.user?.schedule_sport_filter]);
          setRemovedSport(
            data.filter((e) => !setting?.payload?.user?.schedule_sport_filter?.some(
                (item) => item.sport === e.sport,
              )),
          );
        } else {
          setAddedSport([]);
          setRemovedSport([...data]);
        }
        setloading(false);
      })
      .catch((e) => {
        Alert.alert(e.message);
      });
  }, [
    authContext,
    authContext?.entity?.obj?.referee_data,
    authContext?.entity?.obj?.registered_sports,
    authContext?.entity?.obj?.scorekeeper_data,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            route?.params?.onBackClick(true);
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backImageStyle} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Text
          onPress={() => onSavePress()}
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 16,
            marginRight: 10,
            color: colors.lightBlackColor,
          }}>
          Save
        </Text>
      ),
    });
  }, [navigation, addedSport, route?.params]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const onSavePress = () => {
    setloading(true);
    if (addedSport.length > 0) {
      const params = {
        ...userSetting,
        schedule_sport_filter: addedSport,
      };
      saveUserSettings(params, authContext)
        .then((response) => {
          console.log('After save setting', response);

          navigation.goBack();
          setloading(false);
        })
        .catch((e) => {
          setloading(false);
          Alert.alert('', e.messages);
        });
    } else {
      setloading(false);
      Alert.alert('Please select any of the group.');
    }
  };

  const renderRemoveSportsActivity = useCallback(
    ({item, drag}) => (
      <View style={styles.sportsBackgroundView}>
        <View style={{flexDirection: 'row'}}>
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
          <FastImage
            source={{
              uri: `${image_url}${Utility.getSportImage(
                item.sport,
                item.type,
                authContext,
              )}`,
            }}
            style={styles.sportsIcon}
            resizeMode={'contain'}
          />
          <Text style={styles.sportNameTitle}>
            {item?.sport?.[0].toUpperCase() + item?.sport?.slice(1)}
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
                Alert.alert('You can add up to 10 sports to the filter bar.');
              }
            }}
            style={{alignSelf: 'center'}}>
            <Image source={images.addSportList} style={styles.addIconStyle} />
          </TouchableOpacity>
          <FastImage
            source={{
              uri: `${image_url}${Utility.getSportImage(
                item.sport,
                item.type,
                authContext,
              )}`,
            }}
            style={styles.sportsIcon}
            resizeMode={'contain'}
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
    <SafeAreaView>
      <ScrollView scrollEnabled={false}>
        <ActivityLoader visible={loading} />
        <Text style={styles.mainTitle}>Sports displayed in filter bar</Text>
        <Text style={styles.subTitle}>
          Upto 10 sports will be displayed in the filter bar.
        </Text>

        {addedSport.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={addedSport}
            keyExtractor={keyExtractor}
            renderItem={renderRemoveSportsActivity}
            ListEmptyComponent={
              <View style={{marginTop: 15}}>
                <Text style={styles.noEventText}>No Sports</Text>
                <Text style={styles.dataNotFoundText}>
                  New events will appear here.
                </Text>
              </View>
            }
            style={{
              flex: 1,
              width: '100%',
              alignContent: 'center',
              marginBottom: 15,
              paddingVertical: 15,
            }}
            dragHitSlop={{
              top: 15,
              bottom: 15,
              left: 15,
              right: 15,
            }}
            onMoveEnd={(data) => {
              console.log('DATATATATATA:=', data);
              addedSport([...data]);
            }}
          />
        ) : (
          <View style={{marginTop: 15}}>
            <Text style={styles.noEventText}>No Sports</Text>
          </View>
        )}
        <Text style={styles.otherTitle}>Other sports</Text>
        {removedSport.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={removedSport}
            keyExtractor={keyExtractor}
            renderItem={renderAddSportsActivity}
            style={{
              flex: 1,
              width: '100%',
              alignContent: 'center',
              marginBottom: 15,
              paddingVertical: 15,
            }}
          />
        ) : (
          <View style={{marginTop: 15}}>
            <Text style={styles.noEventText}>No Sports</Text>
          </View>
        )}
        <Text style={styles.staticText}>
          Some sports of events you are going to join or joined are not visible
          here.
        </Text>
        <ActionSheet
          ref={actionSheet}
          options={[
            'Add New Sports Activity',
            'sports Activity Tags Order',
            'List / Unlist',
            'Cancel',
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
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainTitle: {
    flex: 1,
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
    marginBottom: 0,
  },
  staticText: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    margin: 15,
  },
  otherTitle: {
    flex: 1,
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
    marginBottom: 15,
  },
  subTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    margin: 15,
    marginTop: 5,
  },

  sportsIcon: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
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
  },
  sportNameTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },

  sportsBackgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 40,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('86%'),
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backImageStyle: {
    height: 20,
    width: 15,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  noEventText: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
});
