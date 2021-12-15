import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,

} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import Separator from '../Separator';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { searchLocationPlaceDetail, searchLocations } from '../../api/External'
import { getHitSlop } from '../../utils';

export default function ModalLocationSearch({ visible, onSelect, onClose }) {
  const authContext = useContext(AuthContext)
  const [cityData, setCityData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);

  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length >= 3) {
      searchLocations(searchLocationText, authContext).then((response) => {
        setNoData(false);
        setCityData(response.predictions);
      });
    } else {
      setNoData(true);
      setCityData([]);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
            style={ styles.listItem }
            onPress={ () => {
              searchLocationPlaceDetail(item?.place_id, authContext).then((response) => {
                const data = {
                  ...item,
                  longitude: response?.result?.geometry?.location?.lng,
                  latitude: response?.result?.geometry?.location?.lat,
                }
                onClose();
                onSelect(data);
              }).catch(onClose)
            } }>
      <Text style={ styles.cityList }>{cityData[index].description}</Text>

      <Separator />
    </TouchableOpacity>
  );
  return (
    <Modal
        transparent={true}
        isVisible={visible}
        backdropColor="transparent"
        style={{
          height: hp(100),
          width: wp(100),
          margin: 0,
          justifyContent: 'flex-end',
          backgroundColor: colors.yellowColor,
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
        }}
        hasBackdrop
        onBackdropPress={onClose}
        backdropOpacity={0}
    >
      <FastImage style={ styles.background } resizeMode={'stretch'} source={ images.orangeLayer } />
      <FastImage style={ styles.background } resizeMode={'stretch'} source={ images.bgImage } />
      <TouchableOpacity 
       hitSlop={getHitSlop(15)}
      onPress={onClose} style={{
        position: 'absolute', right: wp(5), top: hp(8),
      }}>
        <FastImage source={images.cancelImage} resizeMode={'contain'} tintColor={colors.whiteColor} style={styles.closeButton}/>
      </TouchableOpacity>
      <Text style={ styles.LocationText }>{strings.locationText}</Text>

      <View style={ styles.sectionStyle }>
        <FastImage source={ images.searchLocation } resizeMode={'contain'} style={ styles.searchImg } />
        <TextInput
                    style={ styles.textInput }
                    placeholder={ strings.locationPlaceholderText }
                    clearButtonMode="always"
                    placeholderTextColor={ colors.themeColor }
                    onChangeText={ (text) => setSearchText(text) }
                />
      </View>
      {noData && (
        <Text style={ styles.noDataText }>
          Please enter atleast 3 characters to see city
        </Text>
      )}
      <FlatList
                data={ cityData }
                renderItem={ renderItem }
                keyExtractor={(item, index) => index.toString()}
            />
    </Modal>
  );
}
const styles = StyleSheet.create({
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
  background: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  cityList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  closeButton: {
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  noDataText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginTop: hp('1%'),

    textAlign: 'center',
    width: wp('55%'),
  },
  searchImg: {
    alignSelf: 'center',
    height: hp('4%'),
    width: wp('4%'),
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: wp('8%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('4.5%'),
    paddingLeft: 10,
  },
});
