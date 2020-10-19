import {
  StyleSheet,
} from 'react-native';

import constants from '../../config/constants';

const { colors, fonts } = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  pastTab: {
    alignItems: 'center', flex: 0.5, height: 50, justifyContent: 'center',
  },
  pastText: {
    alignSelf: 'center', color: colors.lightBlackColor, fontFamily: fonts.RBold, fontSize: 16,
  },
  selectedLine: {
    alignSelf: 'center', backgroundColor: colors.themeColor, bottom: -15, height: 2, position: 'absolute', width: '100%',
  },
  tabContainer: { flexDirection: 'row', height: 50, width: '100%' },
  upcomingTab: {
    alignItems: 'center', flex: 0.5, height: 50, justifyContent: 'center',
  },
  upcomingText: {
    alignSelf: 'center', color: colors.lightBlackColor, fontFamily: fonts.RBold, fontSize: 16,
  },

});

export default styles;
