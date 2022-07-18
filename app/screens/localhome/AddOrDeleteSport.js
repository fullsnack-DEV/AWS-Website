/* eslint-disable no-return-assign */
import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';
import {useIsFocused} from '@react-navigation/native';
import * as Utility from '../../utils';

import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import TCThinDivider from '../../components/TCThinDivider';
import fonts from '../../Constants/Fonts';
import SportsListView from '../../components/localHome/SportsListView';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';

let selectedSports = [];

export default function AddOrDeleteSport({navigation, route}) {
  // const [loading, setloading] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [systemSports, setSystemSports] = useState([]);
  const [defaultSportsList, setDefaultSportsList] = useState();
  const [sportsSource] = useState(route?.params?.sports);
  const authContext = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.navTitle}>{'Add or Delete Sports'}</Text>
      ),
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            route.params.pressBack();
            onPressApply();
          }}
        >
          Save
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            route.params.pressBack();
            navigation.popToTop();
          }}
        >
          <Image source={images.backArrow} style={styles.backStyle} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, sportsSource, systemSports, defaultSportsList, route.params]);

  useEffect(() => {
    // selectedSports = systemSports.filter((e) => e.isChecked);
    console.log('selectedSports::1::=>', selectedSports);

    const arr = [];

    const refereeSport = authContext?.entity?.auth?.user?.referee_data || [];
    const scorekeeperSport =
      authContext?.entity?.auth?.user?.scorekeeper_data || [];
    const playerSport =
      authContext?.entity?.auth?.user?.registered_sports || [];

    const allSports = [
      ...arr,
      ...refereeSport,
      ...scorekeeperSport,
      ...playerSport,
    ];
    console.log('allSports :=>', allSports);
    const uniqSports = {};
    const uniqueSports = allSports.filter(
      (obj) => !uniqSports[obj.sport] && (uniqSports[obj.sport] = true),
    );
    console.log('Unique sport:=>', uniqSports);

    const result = uniqueSports.map((obj) => ({
      sport: obj.sport,
    }));
    setDefaultSportsList(result);
    console.log('Unique sport results:=>', result);
  }, [authContext, systemSports]);

  useEffect(() => {
    if (isFocused) {
      if (authContext.sports) {
        const arr = [];
        for (const tempData of authContext.sports) {
          const isFound = sportsSource.filter(
            (obj) => obj.sport === tempData.sport && tempData.sport !== 'All',
          );
          if (isFound.length > 0) {
            tempData.isChecked = true;
            arr.push(tempData);
          } else {
            tempData.isChecked = false;
            arr.push(tempData);
          }
        }
        setSystemSports(arr);

        console.log('All system sports:=>', arr);
        setTimeout(() => setloading(false), 1000);
      }
    }
  }, [authContext, isFocused, sportsSource]);

  const onPressApply = () => {
    Utility.setStorage('sportSetting', selectedSports).then(() => {
      navigation.pop();
      route.params.pressBack();
    });
    console.log('DONE::', selectedSports);
  };

  const isIconCheckedOrNot = useCallback(
    ({item, index}) => {
      systemSports[index].isChecked = !item.isChecked;
      const obj = systemSports[index];
      setSystemSports([...systemSports]);
      selectedSports = systemSports.filter((e) => e.isChecked && e !== obj);
      if (obj.isChecked) {
        selectedSports.push(obj);
      }

      console.log('Slected sports', selectedSports);
    },
    [systemSports],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <View style={{height: '100%'}}>
        <TCThinDivider width={'100%'} marginBottom={15} />
        <SportsListView
          sports={systemSports}
          onSelect={isIconCheckedOrNot}
          defaultSport={defaultSportsList}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 15,
  },
  backStyle: {
    height: 20,
    width: 15,
    resizeMode: 'contain',
    marginLeft: 15,
    // tintColor: colors.whiteColor,
  },
  navTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
