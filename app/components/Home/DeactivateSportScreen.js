import React, {useState, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import ActivityLoader from '../loader/ActivityLoader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import TCGradientButton from '../TCGradientButton';
import * as Utility from '../../utils';
import {sportDeactivate} from '../../api/Users';
import ScreenHeader from '../ScreenHeader';
import images from '../../Constants/ImagePath';

const DeactivateSportScreen = ({navigation, route}) => {
  const [sportObj] = useState(route.params?.sportObj);
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const deactivateSport = () => {
    setloading(true);
    const body = {
      sport: sportObj.sport,
      sport_type: sportObj.sport_type,
      entity_type: sportObj.type,
    };
    sportDeactivate(body, authContext)
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

  const handleButtonPress = () => {
    Alert.alert(
      format(
        strings.areYouSureWantToDeactivate,
        Utility.getSportName(sportObj, authContext),
      ),
      '',
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text: strings.deactivateText,
          style: 'destructive',
          onPress: () => {
            deactivateSport();
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.deactivateActivity}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flex: 1}}>
        <View style={styles.container}>
          <Text style={[styles.descText, {marginBottom: 15}]}>
            {strings.terminateAccountDescription1}
          </Text>
          <Text style={styles.descText}>
            {strings.deactiveScreenDescription}
          </Text>
        </View>
        <TCGradientButton
          title={strings.deactivateTitle}
          onPress={handleButtonPress}
          outerContainerStyle={styles.buttonContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 26,
    paddingHorizontal: 15,
  },
  descText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  buttonContainer: {
    backgroundColor: colors.userPostTimeColor,
    marginHorizontal: 15,
    marginVertical: 11,
    borderRadius: 23,
  },
});

export default DeactivateSportScreen;
