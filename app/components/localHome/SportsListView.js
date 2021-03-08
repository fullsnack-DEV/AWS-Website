import React, {
 useCallback, memo,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import TCThinDivider from '../TCThinDivider';

const SportsListView = ({ sports, onSelect }) => {
  const renderItem = useCallback(({ item, index }) => (
    <TouchableOpacity
        style={ styles.listItem }
        onPress={() => onSelect({ item, index }) }>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 15 }}>
        <Text style={ styles.sportList }>{item.sport_name}</Text>
        <View style={ styles.checkbox }>
          {sports[index].isChecked ? (
            <FastImage resizeMode={'contain'} source={ images.orangeCheckBox } style={ styles.checkboxImg } />
        ) : (
          <FastImage resizeMode={'contain'} source={ images.uncheckWhite } style={ styles.unCheckboxImg } />
        )}
        </View>
      </View>
      <TCThinDivider/>
    </TouchableOpacity>
  ), [onSelect, sports]);
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <>
      <View style={ styles.mainContainer }>
        <FlatList
          data={ sports }
          keyExtractor={keyExtractor}
          renderItem={ renderItem }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({

  checkbox: {
    alignSelf: 'center',
    marginRight: 15,
  },
  unCheckboxImg: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
  },
  checkboxImg: {
    width: wp('5.5%'),
    height: wp('5.5%'),
  },
  listItem: {
      alignSelf: 'center',
   // marginLeft: wp('10%'),
    width: wp('90%'),
    // backgroundColor: 'red',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sportList: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    margin: wp('4%'),
    textAlignVertical: 'center',
  },

});

export default memo(SportsListView)
