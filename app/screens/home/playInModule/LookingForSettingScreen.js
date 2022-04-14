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
import strings from '../../../Constants/String';
import images from '../../../Constants/ImagePath';

export default function LookingForSettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [lookingFor, setLookingFor] = useState(false);
  const [sportObj] = useState(route?.params?.sport);
  const lookingOpetions = [
    {key: 'Yes', id: 1},
    {key: 'No', id: 2},
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.titleTextStyle}>
          {sportObj.sport.toLowerCase() === 'tennis'
            ? 'Looking for Club'
            : 'Looking for Team'}
        </Text>
      ),
      headerRight: () => (
        <Text style={styles.doneButtonStyle} onPress={() => updateProfile()}>
          Save
        </Text>
      ),
    });
  }, [navigation, lookingFor, sportObj.sport]);

  useEffect(() => {
    const selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) =>
        obj?.sport === sportObj?.sport &&
        obj?.sport_type === sportObj?.sport_type,
    )[0];
    setLookingFor(selectedSport?.lookingForTeamClub);
  }, [
    authContext?.entity?.obj?.registered_sports,
    sportObj?.sport,
    sportObj?.sport_type,
  ]);
  const updateProfile = () => {
    setloading(true);
    const registerdPlayerData = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) =>
        obj?.sport === sportObj?.sport &&
        obj?.sport_type === sportObj?.sport_type,
    );

    console.log('registerdPlayerData:', registerdPlayerData);
    let selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) =>
        obj?.sport === sportObj?.sport &&
        obj?.sport_type === sportObj?.sport_type,
    )[0];

    selectedSport = {...selectedSport, lookingForTeamClub: lookingFor};
    console.log('selectedSport:', selectedSport);

    registerdPlayerData.push(selectedSport);
    console.log('Final data:', registerdPlayerData);

    const body = {
      ...authContext?.entity?.obj,
      registered_sports: registerdPlayerData,
    };
    console.log('Body::::--->', body);

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          console.log('Register player response IS:: ', response.payload);
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
        console.log('RESPONSE IS:: ', response);
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
          {item?.key === (lookingFor ? 'Yes' : 'No') ? (
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
      <Text style={styles.screenTitle}>
        Are you Looking for a new team? Your profile may be displayed on Local
        Home if you choose “Yes”.
      </Text>
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
