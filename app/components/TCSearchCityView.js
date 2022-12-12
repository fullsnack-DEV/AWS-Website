import React, {useCallback, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';
import {searchCityState} from '../api/External';
import AuthContext from '../auth/context';
import {widthPercentageToDP} from '../utils';
import colors from '../Constants/Colors';
import {strings} from '../../Localization/translation';
import fonts from '../Constants/Fonts';
import TCThinDivider from './TCThinDivider';

export default function TCSearchCityView({getCity}) {
  // const [loading, setloading] = useState(false);

  const [cityData, setCityData] = useState([]);
  const authContext = useContext(AuthContext);

  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length) {
      searchCityState(searchLocationText, authContext).then((response) => {
        setCityData(response.predictions);
      });
    } else {
      setCityData([]);
    }
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        console.log('selected ITEM:=>', item);
        // navigation.navigate(route?.params?.comeFrom, { locationText: item?.structured_formatting?.main_text })
        getCity(item?.structured_formatting?.main_text);
        // setSelected(item?.structured_formatting?.main_text)
      }}>
      <Text style={styles.cityList}>
        {item?.structured_formatting?.main_text}
      </Text>

      <TCThinDivider />
    </TouchableOpacity>
  );
  return (
    <View>
      <TextInput
        style={styles.sectionStyle}
        placeholder={strings.searchTitle}
        placeholderTextColor={colors.userPostTimeColor}
        clearButtonMode="always"
        onChangeText={(text) => getLocationData(text)}
        value={cityData}
      />
      <FlatList
        data={cityData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={{}}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  sectionStyle: {
    fontSize: 15,
    fontFamily: fonts.RRegular,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    height: 40,
    paddingLeft: 17,
    paddingRight: 5,
    width: widthPercentageToDP('75%'),
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  cityList: {
    color: colors.lightBlackColor,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    width: widthPercentageToDP('70%'),
    margin: 15,
    textAlignVertical: 'center',
  },
});
