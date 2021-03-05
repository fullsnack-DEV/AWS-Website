import React, { useCallback, useState, useContext } from 'react';
import {
 View, StyleSheet, FlatList, TextInput, Text, Dimensions, TouchableOpacity,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';
import { searchCityState } from '../../api/External';
import AuthContext from '../../auth/context';
import { widthPercentageToDP } from '../../utils';
import colors from '../../Constants/Colors';
import TCThinDivider from '../../components/TCThinDivider';
import strings from '../../Constants/String';
import fonts from '../../Constants/Fonts';

export default function SearchCityScreen() {
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
  // const getTeamsData = async (item) => {
  //   searchLocationPlaceDetail(
  //     item.place_id,
  //     authContext,
  //   ).then((response) => {});
  // };
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => console.log('ITEM::=>', item)}>
      <Text style={styles.cityList}>{cityData[index]?.structured_formatting?.main_text}</Text>

      <TCThinDivider />
    </TouchableOpacity>
  );
  return (
    <View
    style={[
      styles.bottomPopupContainer,
      { height: Dimensions.get('window').height - 60 },
    ]}>

      <TextInput
      style={styles.sectionStyle}
      placeholder={strings.searchTitle}
      placeholderTextColor={colors.userPostTimeColor}
      clearButtonMode="always"
      onChangeText={(text) => getLocationData(text)}
      // value={value}
    />
      <FlatList
      data={cityData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={{
        marginLeft: 25,
        marginRight: 25,
        marginTop: 20,
      }}
    />
    </View>
  );
}
const styles = StyleSheet.create({
    sectionStyle: {
        alignItems: 'center',
        fontSize: 15,
        fontFamily: fonts.RRegular,
        backgroundColor: colors.offwhite,
        borderRadius: 25,
        flexDirection: 'row',
        height: 45,
        paddingLeft: 17,
        paddingRight: 5,
        width: widthPercentageToDP('86%'),
        shadowColor: colors.grayColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        alignSelf: 'center',
        elevation: 2,
        marginTop: 15,
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
