/* eslint-disable no-nested-ternary */
import React, {
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import FlatList from 'react-native-drag-flatlist';
import * as Utility from '../../../utils/index';
import {getUserSettings, saveUserSettings} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {getGroups} from '../../../api/Groups';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

export default function ChangeOtherListScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [addedGroups, setAddedGroups] = useState([]);
  const [removedGroups, setremovedGroups] = useState([]);
  const [userSetting, setUserSetting] = useState();

  const onDonePress = useCallback(() => {
    setLoading(true);
    if (addedGroups.length > 0) {
      const params = {
        ...userSetting,
        schedule_group_filter: addedGroups,
      };
      saveUserSettings(params, authContext)
        .then(async (response) => {
          console.log('After save setting', response);
          await Utility.setStorage(
            'schedule_group_filter',
            response.payload.schedule_group_filter,
          );
          navigation.goBack();
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert('', e.messages);
        });
    } else {
      setLoading(false);
      Alert.alert('Please select any of the group.');
    }
  }, [addedGroups, authContext, navigation]);

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
        <Text style={styles.doneButtonStyle} onPress={() => onDonePress()}>
          Save
        </Text>
      ),
    });
  }, [navigation, onDonePress, route?.params]);

  useEffect(() => {
    setLoading(true);
    getGroups(authContext)
      .then((response) => {
        const {teams, clubs} = response.payload;
        getUserSettings(authContext).then((setting) => {
          console.log('Settings:=>', setting);
          setUserSetting(setting.payload.user);
          if (
            setting?.payload?.user?.schedule_group_filter &&
            setting?.payload?.user?.schedule_group_filter?.length > 0
          ) {
            setAddedGroups([...setting?.payload?.user?.schedule_group_filter]);
            setremovedGroups([
              ...[...teams, ...clubs].filter(
                (e) =>
                  !setting?.payload?.user?.schedule_group_filter.some(
                    (item) => item.group_id === e.group_id,
                  ),
              ),
            ]);
          } else {
            const groups = [...teams, ...clubs].map((obj) => ({
              ...obj,
              isSelected: false,
            }));
            setAddedGroups([...groups.filter((obj) => obj.isSelected)]);
            setremovedGroups([...groups.filter((obj) => !obj.isSelected)]);
          }
          setLoading(false);
        });
      })
      .catch((e) => {
        setLoading(false);
        Alert.alert('', e.messages);
      });
  }, [authContext]);

  const renderCheckedOrganizers = useCallback(
    ({item, drag}) =>
      item.sport !== Verbs.allStatus && (
        <View style={styles.sportsBackgroundView}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                const findIndex = addedGroups.findIndex(
                  (a) => a.group_id === item.group_id,
                );
                if (findIndex !== -1) {
                  addedGroups.splice(findIndex, 1);
                }
                const temp = {...item, isSelected: !item.isSelected};

                setAddedGroups([...addedGroups]);
                removedGroups.push(temp);
                setremovedGroups([...removedGroups]);
              }}
              style={{alignSelf: 'center'}}>
              <Image
                source={images.removeSportList}
                style={styles.addIconStyle}
              />
            </TouchableOpacity>

            <Text style={styles.sportNameTitle}>{item.group_name}</Text>
          </View>
          <TouchableOpacity onLongPress={drag} style={{alignSelf: 'center'}}>
            <Image source={images.moveIcon} style={styles.moveIconStyle} />
          </TouchableOpacity>
        </View>
      ),
    [addedGroups, removedGroups],
  );

  const renderUnCheckedOrganizers = useCallback(
    ({item}) =>
      item.sport !== Verbs.allStatus && (
        <View style={styles.sportsBackgroundView}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                if (addedGroups.length < 10) {
                  const findIndex = removedGroups.findIndex(
                    (a) => a.group_id === item.group_id,
                  );
                  const temp = {...item, isSelected: !item.isSelected};

                  if (findIndex !== -1) {
                    removedGroups.splice(findIndex, 1);
                  }
                  setremovedGroups([...removedGroups]);
                  addedGroups.push(temp);
                  setAddedGroups([...addedGroups]);
                } else {
                  Alert.alert(strings.addUpTo10Organizers);
                }
              }}
              style={{alignSelf: 'center'}}>
              <Image source={images.addSportList} style={styles.addIconStyle} />
            </TouchableOpacity>
            {/* <FastImage
              source={{
                uri: `${image_url}${Utility.getSportImage(
                  item.sport,
                  item.type,
                  authContext,
                )}`,
              }}
              style={styles.sportsIcon}
              resizeMode={'contain'}
            /> */}
            <Text style={styles.sportNameTitle}>{item.group_name}</Text>
          </View>
        </View>
      ),
    [addedGroups, removedGroups],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <Text style={styles.mainTextStyle}>
        {strings.organizerDisplayInFilterBartext}
      </Text>
      <Text style={styles.subTitle}>{strings.upTo10OrganizerText}</Text>

      {addedGroups.length > 0 ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={addedGroups}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCheckedOrganizers}
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
            setAddedGroups([...data]);
          }}
        />
      ) : (
        <View style={{marginTop: 15}}>
          <Text style={styles.noEventText}>{strings.noOrganizers}</Text>
        </View>
      )}
      <Text style={styles.otherTitle}>{strings.otherOrganizers}</Text>

      {removedGroups.length > 0 ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={removedGroups}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderUnCheckedOrganizers}
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
          <Text style={styles.noEventText}>{strings.noOrganizers}</Text>
        </View>
      )}

      <Text style={styles.headerTextStyle}>
        {strings.someOrganizerJoinEventText}
      </Text>
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
  doneButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
    color: colors.lightBlackColor,
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

  backImageStyle: {
    height: 20,
    width: 15,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
    marginLeft: 15,
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
    width: Utility.widthPercentageToDP('86%'),
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  noEventText: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
});
