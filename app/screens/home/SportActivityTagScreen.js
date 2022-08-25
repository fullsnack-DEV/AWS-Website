/* eslint-disable no-unsafe-optional-chaining */
import React, {
  useContext,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
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
import * as Utility from '../../utils';
import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import TCThinDivider from '../../components/TCThinDivider';
import UserInfoAddRole from '../../components/Home/User/UserInfoAddRole';
import {patchPlayer} from '../../api/Users';

let image_url = '';

export default function SportActivityTagScreen({navigation}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  const [selectedRadio, setSelectedRadio] = useState(
    authContext.entity.obj.sport_setting?.selectedOpetion || 0,
  );
  const [selectedCheck, setSelectedCheck] = useState(
    authContext.entity.obj?.sport_setting?.isChecked || false,
  );
  // eslint-disable-next-line no-unused-vars
  const [entitySource, setEntitySource] = useState(
    authContext?.entity?.obj?.sport_setting?.entity_order || [
      'Player',
      'Referee',
      'Scorekeeper',
    ],
  );
  console.log('authContext?.entity?.obj', authContext?.entity?.obj);
  const [activityList, setActivityList] = useState(
    authContext?.entity?.obj?.sport_setting?.activity_order || [
      ...(authContext?.entity?.obj?.registered_sports?.filter(
        (obj) => obj.is_active,
      ) || []),
      ...(authContext?.entity?.obj?.referee_data?.filter(
        (obj) => obj.is_active,
      ) || []),
      ...(authContext?.entity?.obj?.scorekeeper_data?.filter(
        (obj) => obj.is_active,
      ) || []),
    ],
  );
  Utility.getStorage('appSetting').then((setting) => {
    console.log('APPSETTING:=', setting);
    image_url = setting.base_url_sporticon;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          onPress={() => onSavePress()}
          style={{
            fontSize: 16,
            fontFamily: fonts.RLight,
            color: colors.lightBlackColor,
            marginRight: 15,
          }}>
          Save
        </Text>
      ),
    });
  }, [navigation, selectedCheck, selectedRadio, activityList, entitySource]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const onSavePress = () => {
    setloading(true);
    const userObj = {
      ...authContext?.entity?.obj,
      sport_setting: {
        entity_order: entitySource,
        selectedOpetion: selectedRadio,
        isChecked: selectedCheck,
        activity_order: activityList,
      },
    };

    console.log('userObj::::=>', userObj);
    patchPlayer(userObj, authContext)
      .then(async (res) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({...entity});
        await Utility.setStorage('authContextUser', res.payload);
        await Utility.setStorage('authContextEntity', {...entity});
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };
  const renderSportsView = useCallback(
    ({item, drag}) =>
      item.sport !== 'All' && (
        <View style={styles.sportsBackgroundView}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={
                (item === 'Player' && images.playerIcon) ||
                (item === 'Scorekeeper' && images.scorekeeperIcon) ||
                (item === 'Referee' && images.refereeIcon)
              }
              style={styles.sportsIcon}
            />
            <Text style={styles.sportNameTitle}>{item}</Text>
          </View>
          <TouchableOpacity onLongPress={drag} style={{alignSelf: 'center'}}>
            <Image source={images.moveIcon} style={styles.moveIconStyle} />
          </TouchableOpacity>
        </View>
      ),
    [],
  );

  const renderSportsActivityView = useCallback(
    ({item, drag}) =>
      item.sport !== 'All' && (
        <View style={styles.sportsBackgroundView}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{
                uri: `${image_url}${Utility.getSportImage(
                  item.sport,
                  item.type,
                  authContext,
                )}`,
              }}
              style={styles.sportsIcon}
            />
            <Text style={styles.sportNameTitle}>{`${Utility.getSportName(
              item,
              authContext,
            )} (${
              item?.type?.charAt(0).toUpperCase() + item?.type?.slice(1)
            })`}</Text>
          </View>
          <TouchableOpacity onLongPress={drag} style={{alignSelf: 'center'}}>
            <Image source={images.moveIcon} style={styles.moveIconStyle} />
          </TouchableOpacity>
        </View>
      ),
    [],
  );
  return (
    <SafeAreaView>
      <ScrollView scrollEnabled={false}>
        <ActivityLoader visible={loading} />

        <Text style={styles.listTitle}>Preview</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={activityList?.filter((obj) => obj?.is_active)}
          keyExtractor={keyExtractor}
          renderItem={({item}) => (
            <UserInfoAddRole
              title={Utility.getSportName(item, authContext)}
              thumbURL={
                item?.type
                  ? {
                      uri: `${image_url}${Utility.getSportImage(
                        item.sport,
                        item.type,
                        authContext,
                      )}`,
                    }
                  : images.addRole
              }
            />
          )}
          style={{margin: 15}}
        />
        <TCThinDivider width={'100%'} marginBottom={15} />

        <TouchableOpacity
          style={styles.radioView}
          onPress={() => {
            setSelectedRadio(0);
          }}>
          <Text style={styles.radioTitle}>
            Display the later-done sports activity first
          </Text>
          <Image
            source={
              selectedRadio === 0
                ? images.radioSelectYellow
                : images.radioUnselect
            }
            style={styles.radioImage}
          />
        </TouchableOpacity>

        {selectedRadio === 0 && (
          <View>
            <TouchableOpacity
              style={styles.checkView}
              onPress={() => {
                setSelectedCheck(!selectedCheck);
              }}>
              <Image
                source={
                  selectedCheck ? images.orangeCheckBox : images.uncheckBox
                }
                style={styles.checkImage}
              />
              <Text style={styles.radioTitle}>
                Classfy sports activites by categoires and display the
                categories in the order below.
              </Text>
            </TouchableOpacity>

            <View
              pointerEvents={selectedCheck ? 'auto' : 'none'}
              style={{
                opacity: selectedCheck ? 1 : 0.4,
              }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={entitySource}
                keyExtractor={keyExtractor}
                renderItem={renderSportsView}
                style={{
                  width: '100%',
                  alignContent: 'center',
                  marginBottom: 15,
                  paddingVertical: 15,
                  opacity: selectedCheck ? 1 : 0.4,
                }}
                onMoveEnd={(data) => {
                  let list = [];
                  setEntitySource(data);
                  data.forEach((element) => {
                    if (element === 'Player') {
                      list = [
                        ...list,
                        ...(authContext?.entity?.obj?.registered_sports ?? []),
                      ];
                      console.log('PLAYER LIST:=', list);
                    }
                    if (element === 'Referee') {
                      list = [
                        ...list,
                        ...(authContext?.entity?.obj?.referee_data ?? []),
                      ];
                      console.log('REFEREE LIST:=', list);
                    }
                    if (element === 'Scorekeeper') {
                      list = [
                        ...list,
                        ...(authContext?.entity?.obj?.scorekeeper_data ?? []),
                      ];
                      console.log('SCOREKEEPER LIST:=', list);
                    }
                  });
                  setActivityList([...list]);

                  console.log('DATATATATATA:=', [...list]);
                }}
              />
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.radioView}
          onPress={() => {
            setSelectedRadio(1);
          }}>
          <Text style={styles.radioTitle}>Display in the fixed order</Text>
          <Image
            source={
              selectedRadio === 1
                ? images.radioSelectYellow
                : images.radioUnselect
            }
            style={styles.radioImage}
          />
        </TouchableOpacity>
        {selectedRadio === 1 && (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={activityList.filter(
              (obj) => obj?.type && obj?.is_active === true,
            )}
            keyExtractor={keyExtractor}
            renderItem={renderSportsActivityView}
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
              setActivityList([...data]);
              console.log('DATATATATATA:=', data);
            }}
          />
        )}

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
  listTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
    marginTop: 15,
    marginLeft: 15,
  },
  radioTitle: {
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },

  radioImage: {
    marginLeft: 15,
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkImage: {
    marginRight: 15,
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  radioView: {
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkView: {
    flex: 1,
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },

  sportsIcon: {
    resizeMode: 'cover',
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
});
