import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';

import colors from '../Constants/Colors';
import countryCodeList from '../utils/countryCode.json';
import {getHitSlop, widthPercentageToDP} from '../utils';
import images from '../Constants/ImagePath';
import TCThinDivider from './TCThinDivider';
import {strings} from '../../Localization/translation';
import fonts from '../Constants/Fonts';

const TCCountryCodeModal = ({
  countryCodeVisible,
  onCloseModal,
  countryCodeObj,
}) => {
  const [countryList, setCountryList] = useState(countryCodeList);
  const renderCountryCode = ({item}) => (
    <Pressable onPress={() => countryCodeObj(item)}>
      <View>
        <Text
          style={
            styles.cityList
          }>{`${item.country} (${item.iso} +${item.code})`}</Text>
        <TCThinDivider
          width={'100%'}
          backgroundColor={colors.grayBackgroundColor}
        />
      </View>
    </Pressable>
  );

  const searchCode = (text) => {
    if (text.length > 0) {
      const results = countryCodeList.filter(
        (x) =>
          x.country.includes(text) ||
          x.iso.includes(text) ||
          x.code.includes(text),
      );
      setCountryList(results);
    } else {
      setCountryList(countryCodeList);
    }
  };

  return (
    <Modal
      onBackdropPress={onCloseModal}
      isVisible={countryCodeVisible}
      animationInTiming={300}
      animationOutTiming={800}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={800}
      style={{
        margin: 0,
      }}>
      <View
        style={[
          styles.bottomPopupContainer,
          {height: Dimensions.get('window').height - 50},
        ]}>
        <View style={styles.topHeaderContainer}>
          <TouchableOpacity
            hitSlop={getHitSlop(15)}
            style={styles.closeButton}
            onPress={onCloseModal}>
            <Image source={images.crossImage} style={styles.closeButton} />
          </TouchableOpacity>
          <Text style={styles.moreText}>Select Code</Text>
        </View>
        <TCThinDivider
          width={'100%'}
          marginBottom={15}
          backgroundColor={colors.thinDividerColor}
        />
        <View style={styles.sectionStyle}>
          <TextInput
            autoCorrect={false}
            spellCheck={false}
            style={styles.textInput}
            placeholder={strings.searchCountryCode}
            clearButtonMode="always"
            placeholderTextColor={colors.userPostTimeColor}
            onChangeText={(text) => searchCode(text)}
          />
        </View>

        <FlatList
          data={countryList}
          renderItem={renderCountryCode}
          keyExtractor={(index) => index.toString()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  topHeaderContainer: {
    height: 60,
    // justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
  closeButton: {
    alignSelf: 'center',
    width: 25,
    height: 25,
    resizeMode: 'contain',
    left: 5,
  },

  moreText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: widthPercentageToDP('36%'),
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: widthPercentageToDP('4%'),
    paddingLeft: 17,
    paddingRight: 5,
  },

  cityList: {
    color: colors.lightBlackColor,
    fontSize: widthPercentageToDP('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    // paddingLeft: wp('1%'),
    width: widthPercentageToDP('70%'),
    // margin: wp('4%'),
    marginBottom: widthPercentageToDP('4%'),
    marginRight: widthPercentageToDP('4%'),
    marginTop: widthPercentageToDP('4%'),
    marginLeft: 30,
    textAlignVertical: 'center',
  },

  textInput: {
    color: colors.userPostTimeColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4.5%'),
    paddingLeft: 10,
  },
});
export default TCCountryCodeModal;
