import { StyleSheet } from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';

const {
  colors, fonts,
} = constants;

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

export default styles;
