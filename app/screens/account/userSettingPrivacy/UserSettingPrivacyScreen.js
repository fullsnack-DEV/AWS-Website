import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

export default function UserSettingPrivacyScreen({ navigation }) {
  const authContext = useContext(AuthContext);

  const userSettingMenu = [
    { key: 'Account', id: 1 },
    { key: 'Change Password', id: 2 },
    { key: 'Currency', id: 3 },
    // {key: 'Privacy Setting',id:3}
  ];
  const handleOpetions = async (opetions) => {
    if (opetions === 'Account') {
      navigation.navigate('PersonalInformationScreen');
    } else if (opetions === 'Change Password') {
      navigation.navigate('ChangePasswordScreen');
    } else if (opetions === 'Currency') {
      navigation.navigate('CurrencySettingScreen');
    } else if (opetions === 'Privacy Setting') {
      // groupOpetionActionSheet.show();
    }
  };
  const renderMenu = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.listItems}>{item.key}</Text>
        {item.key === 'Currency' && authContext?.entity?.obj?.currency_type && (
          <Text style={styles.currencyTypeStyle}>
            {authContext?.entity?.obj?.currency_type}
          </Text>
        )}
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <ScrollView style={styles.mainContainer}>
      <FlatList
        data={userSettingMenu}
        keyExtractor={(index) => index.toString()}
        renderItem={renderMenu}
        ItemSeparatorComponent={() => (
          <View style={styles.separatorLine}></View>
        )}
      />
      <View style={styles.separatorLine}></View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  currencyTypeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
});
