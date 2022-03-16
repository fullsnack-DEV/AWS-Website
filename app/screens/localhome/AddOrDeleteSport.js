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
  TextInput,
  Alert,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';
import { useIsFocused } from '@react-navigation/native';
import * as Utility from '../../utils';

import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import TCThinDivider from '../../components/TCThinDivider';
import fonts from '../../Constants/Fonts';
import SportsListView from '../../components/localHome/SportsListView';
import strings from '../../Constants/String';
import ActivityLoader from '../../components/loader/ActivityLoader';
import { widthPercentageToDP } from '../../utils';

let selectedSports = [];

export default function AddOrDeleteSport({ navigation, route }) {

  const [defaultSports] = useState(route?.params?.defaultSports);

  // const [loading, setloading] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [systemSports, setSystemSports] = useState([]);
  const [searchData, setSearchData] = useState();
  const [defaultSportsList, setDefaultSportsList] = useState();
  const [sportsSource, setSportsSource] = useState(defaultSports);
  const authContext = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => onPressApply()}>
          Apply
        </Text>
      ),
    });
  }, [navigation, sportsSource, systemSports, defaultSportsList]);

  useEffect(() => {
    selectedSports = systemSports.filter((e) => e.isChecked);
    console.log('selectedSports::1::=>', selectedSports);

    Utility.getStorage('sportSetting')
      .then((setting) => {
        console.log('Setting::1::=>', setting);
        if (setting === null) {
          const arr = [];

          const refereeSport = authContext?.entity?.auth?.user?.referee_data || [];
          const scorekeeperSport = authContext?.entity?.auth?.user?.scorekeeper_data || [];
          const playerSport = authContext?.entity?.auth?.user?.registered_sports || [];

          const allSports = [
            ...arr,
            ...refereeSport,
            ...scorekeeperSport,
            ...playerSport,
          ];
          const uniqSports = {};
          const uniqueSports = allSports.filter(
            (obj) => !uniqSports[obj.sport]
              && (uniqSports[obj.sport] = true),
          );

          const result = uniqueSports.map((obj) => ({
            sport: obj.sport,
          }));
          setDefaultSportsList(result);
          console.log('Unique sport:=>', result);
        } else {
          console.log('Unique sport:=>', setting);

          setDefaultSportsList([...setting]);
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((e) => {
        Alert.alert('Can not fetch local sport setting.');
      });
  }, [authContext, isFocused]);

  useEffect(() => {
    if (isFocused) {
      if (authContext.sports) {
        const arr = [];
        for (const tempData of authContext.sports) {
          const isFound = sportsSource.filter(
            (obj) => obj.sport
                === tempData.sport
              && tempData.sport !== 'All',
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
        setSearchData(arr);

        console.log('All system sports:=>', arr);
        setTimeout(() => setloading(false), 1000);
      }
    }
  }, [authContext, isFocused]);

  const onPressApply = () => {
    setSportsSource([...selectedSports]);

    setTimeout(() => {
      navigation.navigate('SportSettingScreen', {
        sports: selectedSports,
      });
    }, 10);
    console.log('DONE::', selectedSports);
  };

  const isIconCheckedOrNot = useCallback(
    ({ item, index }) => {
      systemSports[index].isChecked = !item.isChecked;

      setSystemSports([...systemSports]);
      selectedSports = systemSports.filter((e) => e.isChecked);
      console.log('Slected sports', selectedSports);
    },
    [systemSports],
  );
  const searchSportsFunction = (text) => {
    const result = systemSports.filter(
      (x) => x.sport.includes(text)
        || x.sport.includes(text),
    );
    if (text.length > 0) {
      setSystemSports(result);
    } else {
      setSystemSports(searchData);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ActivityLoader visible={loading} />
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
          <TextInput
            placeholder={strings.searchText}
            style={styles.searchTxt}
            onChangeText={(text) => {
              searchSportsFunction(text);
            }}
            // value={search}
          />
        </View>
      </View>
      <View style={{ height: '80%' }}>
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
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 15,
  },
  searchView: {
    backgroundColor: colors.grayBackgroundColor,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: widthPercentageToDP('92%'),
    borderRadius: 20,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    backgroundColor: colors.offwhite,
  },
  searchTxt: {
    marginLeft: 15,
    fontSize: widthPercentageToDP('3.8%'),
    width: widthPercentageToDP('75%'),
  },
});
