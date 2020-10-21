import { StyleSheet } from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  tabContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    marginBottom: 5,
  },
  upcomingTab: {
    flex: 0.5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingText: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  selectedLine: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: -15,
    height: 2,
    width: '100%',
    backgroundColor: colors.themeColor,
  },
  pastTab: {
    flex: 0.5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastText: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  noDataPlaceholderView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noDataPlaceholder: {
    alignSelf: 'center',
    color: colors.veryLightGray,
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },
});

export default styles;
