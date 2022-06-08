/* eslint-disable consistent-return */
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
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';

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
import ToggleView from '../../components/Schedule/ToggleView';

let image_url = '';

export default function SportHideUnhideScreen({navigation}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [authObject, setAuthObject] = useState(authContext?.entity?.obj);
  // eslint-disable-next-line no-unused-vars
  const [entitySource, setEntitySource] = useState(
    authObject?.sport_setting?.entity_order || [
      'Player',
      'Referee',
      'Scorekeeper',
    ],
  );
  console.log('authContext?.entity?.obj', authContext?.entity?.obj);

  const [activityList, setActivityList] = useState(
    authObject?.sport_setting?.activity_order || [
      ...(authObject?.registered_sports || []),
      ...(authObject?.referee_data || []),
      ...(authObject?.scorekeeper_data || []),
    ],
  );
  const [activityOrder, setActivityOrder] = useState(
    authObject?.sport_setting?.activity_order || [
      ...(authObject?.registered_sports || []),
      ...(authObject?.referee_data || []),
      ...(authObject?.scorekeeper_data || []),
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
  }, [navigation, activityList, entitySource, authObject, activityOrder]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const onSavePress = () => {
    setloading(true);
    const body = {
      ...authObject,
     
    };

    console.log('userObj::::=>', body);
    patchPlayer(body, authContext)
      .then(async (res) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({...entity});
        authContext.setUser(res.payload);
        await Utility.setStorage('authContextUser', res.payload);
        await Utility.setStorage('authContextEntity', {...entity});
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  const renderSportsActivityView = ({item, index}) => {
    console.log('index----', index);
    if (item?.is_active === true) {
      return (
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
            )}`}</Text>
          </View>
          <View style={{marginRight: 10, justifyContent: 'center'}}>
            <ToggleView
              isOn={!!(item?.is_hide && item?.is_hide === true)}
              onToggle={() => {
                console.log('ITTTm??', item);
                let finalObject = []
                if (
                  authObject?.sport_setting?.activity_order &&
                  authObject?.sport_setting?.activity_order?.length > 0
                ) {
                  if(item?.type === 'player'){
                     finalObject =
                    authObject?.sport_setting?.activity_order.map((obj) => {
                      if (obj.sport === item.sport && obj.sport_type === item.sport_type && obj.type === item.type) {
                        return {
                          ...obj,
                          is_hide: !obj?.is_hide,
                        };
                      }
                      return obj;
                    });
                  }else{
                     finalObject =
                    authObject?.sport_setting?.activity_order.map((obj) => {
                      if (obj.sport === item.sport && obj.type === item.type) {
                        return {
                          ...obj,
                          is_hide: !obj?.is_hide,
                        };
                      }
                      return obj;
                    });
                  }
                  console.log('final object::', finalObject);
                  const tempOrder = {...authObject};
                  tempOrder.sport_setting.activity_order = finalObject;
                  tempOrder.registered_sports = finalObject.filter(
                    (obj) => obj.type === 'player',
                  );
                  tempOrder.referee_data = finalObject.filter(
                    (obj) => obj.type === 'referee',
                  );
                  tempOrder.scorekeeper_data = finalObject.filter(
                    (obj) => obj.type === 'scorekeeper',
                  );
                  setAuthObject({...tempOrder});
                  setActivityList(finalObject);
                  setActivityOrder(finalObject);
                } else {
                  console.log('else block');
                  if (item.type === 'player') {
                    const temp = authObject?.registered_sports?.filter(
                      (obj) =>
                        obj.type === 'player' &&
                        (!('is_active' in obj) || obj.is_active !== false),
                    );
                    temp[index].is_hide = !temp[index].is_hide;
                    const tempOrder = {...authObject};
                    tempOrder.registered_sports = temp;
                    setAuthObject({...tempOrder});
                    setActivityList(
                      [...temp,
                      ...authObject?.referee_data,
                      ...authObject?.scorekeeper_data,]
                    );
                    setActivityOrder(
                     [ ...temp,
                      ...authObject?.referee_data,
                      ...authObject?.scorekeeper_data],
                    );
                  } else if (item.type === 'referee') {
                    const temp = authObject?.referee_data?.filter(
                      (obj) =>
                        obj.type === 'referee' &&
                        (!('is_active' in obj) || obj.is_active !== false),
                    );
                    temp[index].is_hide = !temp[index].is_hide;
                    const tempOrder = {...authObject};
                    tempOrder.referee_data = temp;
                    setAuthObject({...tempOrder});

                    setActivityList(
                      [...authObject?.registered_sports,
                      ...temp,
                      ...authObject?.scorekeeper_data,]
                    );
                    setActivityOrder(
                     [ ...authObject?.registered_sports,
                      ...temp,
                      ...authObject?.scorekeeper_data,]
                    );
                  } else {
                    const temp = authObject?.scorekeeper_data?.filter(
                      (obj) =>
                        obj.type === 'scorekeeper' &&
                        (!('is_active' in obj) || obj.is_active !== false),
                    );
                    temp[index].is_hide = !temp[index].is_hide;
                    const tempOrder = {...authObject};
                    tempOrder.scorekeeper_data = temp;
                    setAuthObject({...tempOrder});
                    setActivityList(
                     [ ...authObject?.registered_sports,
                      ...authObject?.referee_data,
                      ...temp,]
                    );
                    setActivityOrder(
                     [ ...authObject?.registered_sports,
                      ...authObject?.referee_data,
                      ...temp,]
                    );
                  }
                }
              }}
              onColor={colors.themeColor}
              offColor={colors.grayBackgroundColor}
            />
          </View>
        </View>
      );
    }
    return <></>;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />

      <View>
        <Text style={styles.listTitle}>Preview</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={activityOrder}
          keyExtractor={keyExtractor}
          renderItem={({item}) => {
            if (item.is_active && item?.is_active === true) {
              return (
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
                  isOpacity={item.is_hide}
                />
              );
            }
            return <></>;
          }}
          style={{margin: 15}}
        />
        <TCThinDivider width={'100%'} />
      </View>
      <ScrollView style={{flex: 1}}>
        {authObject?.registered_sports?.filter(
          (obj) =>
            obj.type === 'player' && obj.is_active === true
        )?.length > 0 && (
          <View>
            <Text style={styles.listTitle}>Playing</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={authObject?.registered_sports?.filter(
                (obj) => obj.type === 'player',
              ).sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={renderSportsActivityView}
            />
          </View>
        )}
        {authObject?.referee_data?.filter(
          (obj) =>
            obj.type === 'referee'
            && obj.is_active === true
        )?.length > 0 && (
          <View>
            <Text style={styles.listTitle}>Refereeing</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={authObject?.referee_data?.filter(
                (obj) => obj.type === 'referee',
              ).sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={renderSportsActivityView}
            />
          </View>
        )}
        {authObject?.scorekeeper_data?.filter(
          (obj) =>
            obj.type === 'scorekeeper' &&
            obj.is_active === true
        )?.length > 0 && (
          <View>
            <Text style={styles.listTitle}>Scorekeeper</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={authObject?.scorekeeper_data?.filter(
                (obj) => obj.type === 'scorekeeper',
              ).sort((a, b) => a.sport.localeCompare(b.sport))}
              keyExtractor={keyExtractor}
              renderItem={renderSportsActivityView}
            />
          </View>
        )}
      </ScrollView>

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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 15,
  },

  sportsIcon: {
    resizeMode: 'cover',
    height: 40,
    width: 40,
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
    width: widthPercentageToDP('86%'),
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
