import React, {useState, useContext, useLayoutEffect, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';

import {patchPlayer} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import * as Utility from '../../../utils';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';

export default function LookingForSettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [lookingFor, setLookingFor] = useState(true);
  const [sportObj] = useState(route?.params?.sport);
  const [type] = useState(route?.params?.type);
  const lookingOpetions = [
    {key: strings.yes, id: 1},
    {key: strings.no, id: 0},
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.titleTextStyle}>
          {sportObj?.sport_type === Verbs.singleSport
            ? strings.lookingForClubText
            : strings.lookingForTeamText}
        </Text>
      ),
      headerRight: () => (
        <Text style={styles.doneButtonStyle} onPress={() => updateProfile()}>
          {strings.save}
        </Text>
      ),
    });
  }, [navigation, lookingFor, sportObj.sport]);

  useEffect(() => {
    let selectedSport;
    if (type === Verbs.entityTypeReferee) {
      selectedSport = authContext?.entity?.obj?.referee_data?.filter(
        (obj) => obj?.sport === sportObj?.sport,
      )[0];
    } else if (type === Verbs.entityTypeScorekeeper) {
      selectedSport = authContext?.entity?.obj?.scorekeeper_data?.filter(
        (obj) => obj?.sport === sportObj?.sport,
      )[0];
    } else {
      selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
        (obj) =>
          obj?.sport === sportObj?.sport &&
          obj?.sport_type === sportObj?.sport_type,
      )[0];
    }

    setLookingFor(selectedSport?.lookingForTeamClub);
  }, [
    authContext?.entity?.obj?.referee_data,
    authContext?.entity?.obj?.registered_sports,
    authContext?.entity?.obj?.scorekeeper_data,
    sportObj?.sport,
    sportObj?.sport_type,
    type,
  ]);
  const updateProfile = () => {
    setloading(true);
    let registerdData, refereeData, scorekeeperData, selectedSport;
    if (type === Verbs.entityTypeReferee) {
      refereeData = authContext?.entity?.obj?.referee_data?.filter(
        (obj) => obj?.sport !== sportObj?.sport,
      );
      selectedSport = authContext?.entity?.obj?.referee_data?.filter(
        (obj) => obj?.sport === sportObj?.sport,
      )[0];
    } else if (type === Verbs.entityTypeScorekeeper) {
      scorekeeperData = authContext?.entity?.obj?.scorekeeper_data?.filter(
        (obj) => obj?.sport !== sportObj?.sport,
      );
      selectedSport = authContext?.entity?.obj?.scorekeeper_data?.filter(
        (obj) => obj?.sport === sportObj?.sport,
      )[0];
    } else {
      registerdData = authContext?.entity?.obj?.registered_sports?.filter(
        (obj) =>
          obj?.sport !== sportObj?.sport &&
          obj?.sport_type !== sportObj?.sport_type,
      );
      selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
        (obj) =>
          obj?.sport === sportObj?.sport &&
          obj?.sport_type === sportObj?.sport_type,
      )[0];
    }

    selectedSport.lookingForTeamClub = lookingFor;

    let body = {};
    if (type === Verbs.entityTypeReferee) {
      refereeData.push(selectedSport);

      body = {
        ...authContext?.entity?.obj,
        referee_data: refereeData,
      };
    } else if (type === Verbs.entityTypeScorekeeper) {
      scorekeeperData.push(selectedSport);

      body = {
        ...authContext?.entity?.obj,
        scorekeeper_data: scorekeeperData,
      };
    } else {
      registerdData.push(selectedSport);

      body = {
        ...authContext?.entity?.obj,
        registered_sports: registerdData,
      };
    }

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', {...entity});
          navigation.goBack();
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const renderLookingTypes = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setLookingFor(!lookingFor);
      }}>
      <View style={styles.radioItem}>
        <Text style={styles.languageList}>{item.key}</Text>
        <View style={styles.checkbox}>
          {item?.key === (lookingFor ? strings.yes : strings.no) ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      {sportObj?.sport_type === 'single' ? (
        <Text style={styles.screenTitle}>{strings.lookingNewClub}</Text>
      ) : (
        <Text style={styles.screenTitle}>{strings.lookingNewTeam}</Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: 15,
        }}>
        <FlatList
          // ItemSeparatorComponent={() => <TCThinDivider />}
          data={lookingOpetions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderLookingTypes}
        />
      </View>
      <View style={{flex: 1}} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  doneButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  screenTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    margin: 15,
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkbox: {},
  radioItem: {
    paddingLeft: 25,
    paddingTop: 15,
    paddingRight: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
