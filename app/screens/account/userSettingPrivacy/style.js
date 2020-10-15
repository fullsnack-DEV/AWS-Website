import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';
const {colors, fonts, urls, PATH} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    
  },
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
    alignSelf:'center',
    
  },
  nextArrow: {
    flex: 0.1,
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    alignSelf: 'center',
    tintColor: colors.grayColor,

    marginRight: 10,
  },
  separatorLine: {
    backgroundColor: colors.lightgrayColor,
    width: wp('90%'),
    height: 0.5,
    alignSelf: 'center',
  },
});

export default styles;