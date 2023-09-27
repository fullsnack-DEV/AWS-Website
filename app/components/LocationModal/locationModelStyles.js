const {StyleSheet, Platform, Dimensions} = require('react-native');
const {default: colors} = require('../../Constants/Colors');
const {default: fonts} = require('../../Constants/Fonts');

const locationModelStyles = StyleSheet.create({
  mainView: {
    width: '100%',
    flex: 1,
    height: Dimensions.get('window').height - 50,
    backgroundColor: 'white',
    marginTop: 50,
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    height: 50,
  },
  headerText: {
    alignSelf: 'center',
    paddingTop: 18,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  closeButton: {
    alignSelf: 'center',
    width: 15,
    height: 15,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  separatorLine: {
    // alignSelf: 'center',
    backgroundColor: colors.thinDividerColor,
    height: 1,
    width: '100%',
  },
  searchSectionStyle: {
    backgroundColor: colors.textFieldBackground,
    marginTop: 25,
    marginHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 10,
  },
  searchTextInput: {
    color: colors.lightBlackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 15,
  },
  noDataText: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    marginLeft: 30,
    marginTop: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    // backgroundColor:'#ADF234',
    // justifyContent:'center',
    paddingHorizontal: 6,
    alignItems: 'center',
    height: 54,
  },
  listItemCurrentLocation: {
    flexDirection: 'column',
    marginLeft: 25,
    marginRight: 25,
    // backgroundColor:'#ADF234',
    // justifyContent:'center',
    paddingHorizontal: 6,
    alignItems: 'baseline',
    height: 52,
  },
  cityText: {
    color: colors.lightBlackColor,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    textAlignVertical: 'center',
  },
  itemSeprater: {
    backgroundColor: colors.grayBackgroundColor,
    height: 1,
    marginLeft: 25,
    marginRight: 25,
  },
  currentLocationTextStyle: {
    color: colors.lightBlackColor,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    textAlignVertical: 'center',
    marginBottom: 14,
    marginTop: 40,
    marginLeft: 35,
    marginRight: 35,
  },
  curruentLocationText: {
    color: colors.userPostTimeColor,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
  },
  nearbycitiesflatlist: {
    ...Platform.select({
      ios: {
        height: Dimensions.get('window').height - 225,
      },
    }),
  },
});

module.exports = locationModelStyles;
