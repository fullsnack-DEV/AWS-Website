import {
  StyleSheet,
} from 'react-native';

import constants from '../../../config/constants';

const { colors, fonts } = constants;
const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  checkEmailText: {

    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 28,
    textAlign: 'left',

  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'center',

  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
export default styles
