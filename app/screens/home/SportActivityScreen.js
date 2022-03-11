/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
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
  FlatList,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,

} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import TCMessageButton from '../../components/TCMessageButton';
import ActivityLoader from '../../components/loader/ActivityLoader';
import * as Utility from '../../utils';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {
  patchPlayer,
  patchRegisterRefereeDetails,
  patchRegisterScorekeeperDetails,
} from '../../api/Users';
import strings from '../../Constants/String';

let image_url = '';

export default function SportActivityScreen({ navigation }) {
  const actionSheet = useRef();
  const addRoleActionSheet = useRef();

  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  console.log('authContext', authContext.entity.obj);

  Utility.getStorage('appSetting').then((setting) => {
    console.log('APPSETTING:=', setting);
    image_url = setting.base_url_sporticon;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => actionSheet.current.show()}>
          <Image
            source={images.vertical3Dot}
            style={styles.navigationRightItem}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const sportsView = useCallback(
    ({ item }) => (
      <View style={styles.sportView}>
        <LinearGradient
          colors={[colors.yellowColor, colors.orangeGradientColor]}
          style={styles.backgroundView}></LinearGradient>
        <View style={styles.innerViewContainer}>
          <View style={styles.viewContainer}>
            <Image
              source={{
                uri: `${image_url}${Utility.getSportImage(item.sport, item.type, authContext)}`,
              }}
              style={styles.sportIcon}
            />
            <View>
              <Text style={styles.sportName}>{Utility.getSportName(item, authContext)}</Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
          {/* <TouchableOpacity onPress={() => patchPlayerIn({ item })}>
            {item.is_published ? (
              <Text style={styles.unlistedText}>UNLIST</Text>
            ) : (
              <Text style={styles.listedText}>LIST</Text>
            )}
          </TouchableOpacity> */}
        </View>
      </View>
    ),
    [],
  );

  const refereeSportsView = useCallback(
    ({ item }) => (
      <View style={styles.sportView}>
        <LinearGradient
          colors={[colors.darkThemeColor, colors.darkThemeColor]}
          style={styles.backgroundView}></LinearGradient>
        <View style={styles.innerViewContainer}>
          <View style={styles.viewContainer}>
            <Image source={{
                uri: `${image_url}${Utility.getSportImage(item.sport, item.type, authContext)}`,
            }} style={styles.sportIcon} />
            <View>
              <Text style={styles.sportName}>{Utility.getSportName(item, authContext)}</Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
          {/* <TouchableOpacity onPress={() => patchReferee({ item })}>
            {item.is_published ? (
              <Text style={styles.unlistedText}>UNLIST</Text>
            ) : (
              <Text style={styles.listedText}>LIST</Text>
            )}
          </TouchableOpacity> */}
        </View>
      </View>
    ),
    [],
  );

  const scorekeeperSportsView = useCallback(
    ({ item }) => (
      <View style={styles.sportView}>
        <LinearGradient
          colors={[colors.blueGradiantEnd, colors.blueGradiantStart]}
          style={styles.backgroundView}></LinearGradient>
        <View style={styles.innerViewContainer}>
          <View style={styles.viewContainer}>
            <Image source={{
                uri: `${image_url}${Utility.getSportImage(item.sport, item.type, authContext)}`,
            }} style={styles.sportIcon} />
            <View>
              <Text style={styles.sportName}>{Utility.getSportName(item, authContext)}</Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
          {/* <TouchableOpacity onPress={() => patchScorekeeper({ item })}>
            {item.is_published ? (
              <Text style={styles.unlistedText}>UNLIST</Text>
            ) : (
              <Text style={styles.listedText}>LIST</Text>
            )}
          </TouchableOpacity> */}
        </View>
      </View>
    ),
    [],
  );

  // eslint-disable-next-line no-unused-vars
  const patchPlayerIn = ({ item }) => {
    setloading(true);

    const selectedSport = (
      authContext?.entity?.obj?.sport_setting?.activity_order
      || authContext?.entity?.obj?.registered_sports
    )?.filter((obj) => obj.sport === item.sport)[0];

    const modifiedObj = {
      ...selectedSport,
      is_published: !item.is_published,
    };
    const players = (
      authContext?.entity?.obj?.sport_setting?.activity_order
      || authContext?.entity?.obj?.registered_sports
    ).map((u) => (u.sport !== modifiedObj.sport ? u : modifiedObj));

    patchPlayer({ registered_sports: players }, authContext)
      .then(async (res) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({ ...entity });
        await Utility.setStorage('authContextUser', res.payload);
        await Utility.setStorage('authContextEntity', { ...entity });
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  // eslint-disable-next-line no-unused-vars
  const patchScorekeeper = ({ item }) => {
    setloading(true);
    const selectedScorekeeperSport = authContext?.entity?.obj?.scorekeeper_data?.filter(
      (obj) => obj.sport === item.sport,
    )[0];
    const modifiedObj = {
      ...selectedScorekeeperSport,
      is_published: !item.is_published,
    };
    const scorekeepers = authContext?.entity?.obj?.scorekeeper_data.map((u) => (u.sport !== modifiedObj.sport ? u : modifiedObj));

    patchRegisterScorekeeperDetails(
      { scorekeeper_data: scorekeepers },
      authContext,
    )
      .then(async (res) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({ ...entity });
        await Utility.setStorage('authContextUser', res.payload);
        await Utility.setStorage('authContextEntity', { ...entity });
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  // eslint-disable-next-line no-unused-vars
  const patchReferee = ({ item }) => {
    setloading(true);

    const selectedRefereeSport = authContext?.entity?.obj?.referee_data?.filter(
      (obj) => obj.sport === item.sport,
    )[0];

    const modifiedObj = {
      ...selectedRefereeSport,
      is_published: !item.is_published,
    };
    const referees = authContext?.entity?.obj?.referee_data.map((u) => (u.sport !== modifiedObj.sport ? u : modifiedObj));
    patchRegisterRefereeDetails({ referee_data: referees }, authContext)
      .then(async (res) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({ ...entity });
        await Utility.setStorage('authContextUser', res.payload);
        await Utility.setStorage('authContextEntity', { ...entity });
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  const addActivity = () => {
    addRoleActionSheet.current.show();
  };

  return (
    <ScrollView>
      <ActivityLoader visible={loading} />
      {(
        authContext?.entity?.obj?.sport_setting?.activity_order
        || authContext?.entity?.obj?.registered_sports
      )?.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Player in</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={(
              authContext?.entity?.obj?.sport_setting?.activity_order
              || authContext?.entity?.obj?.registered_sports
            )?.filter((obj) => obj.type === 'player')}
            keyExtractor={keyExtractor}
            renderItem={sportsView}
          />
        </View>
      )}

      {(
        authContext?.entity?.obj?.sport_setting?.activity_order
        || authContext?.entity?.obj?.referee_data
      )?.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Referee in</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={(
              authContext?.entity?.obj?.sport_setting?.activity_order
              || authContext?.entity?.obj?.referee_data
            )?.filter((obj) => obj.type === 'referee')}
            keyExtractor={keyExtractor}
            renderItem={refereeSportsView}
          />
        </View>
      )}

      {(
        authContext?.entity?.obj?.sport_setting?.activity_order
        || authContext?.entity?.obj?.scorekeeper_data
      )?.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Scorekeeper in</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={(
              authContext?.entity?.obj?.sport_setting?.activity_order
              || authContext?.entity?.obj?.scorekeeper_data
            )?.filter((obj) => obj.type === 'scorekeeper')}
            keyExtractor={keyExtractor}
            renderItem={scorekeeperSportsView}
          />
        </View>
      )}

      <TCMessageButton
        title={'+ Add Activity'}
        width={150}
        alignSelf={'center'}
        marginTop={15}
        marginBottom={40}
        onPress={() => addActivity()}
      />
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
    resizeMode: 'cover',
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
  // listedText: {
  //   fontFamily: fonts.RBold,
  //   fontSize: 12,
  //   color: colors.lightBlackColor,
  //   textDecorationLine: 'underline',
  // },
  // unlistedText: {
  //   fontFamily: fonts.RBold,
  //   fontSize: 12,
  //   color: colors.redColor,
  //   textDecorationLine: 'underline',
  // },
});
