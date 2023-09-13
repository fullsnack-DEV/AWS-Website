import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    lineHeight: 20,
  },
  radioContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  greyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.googleColor,
  },
  greyContainer: {
    paddingHorizontal: 10,
    marginVertical: 35,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    paddingVertical: 12,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  smallText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  linkButton: {
    alignSelf: 'flex-end',
    marginTop: -30,
   
  },
  linkButtonText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    textDecorationLine: 'underline',
    
  },
  buttonContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  countModalCard: {
    backgroundColor: colors.whiteColor,
    maxHeight: Dimensions.get('window').height - 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
    paddingVertical: 25,
    marginHorizontal: 30,
    marginBottom: 55,
    borderRadius: 10,
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
  },
  inputContainer: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    marginTop: 5,
    padding: 2,
  },
  input: {
    fontSize: 16,
    color: colors.lightBlackColor,
    padding: 10,
    lineHeight: 24,
  },
  addVenueButton: {
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 32,
    borderRadius: 5,
    backgroundColor: colors.lightGrey,
  },
  addVenueButtonText: {
    fontSize: 12,
    lineHeight: 21,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  dropDownInput: {
    flex: 1,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    marginLeft: 15,
    paddingHorizontal: 10,
  },
  dropDownIcon: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchHostTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    lineHeight: 24,
    color: colors.googleColor,
  },
  matchfeeTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
    color: colors.googleColor,
    marginTop: 5,
  },
  rowContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  bulletContainerView: {
    height: 5,
    width: 5,
    backgroundColor: colors.googleColor,
    borderRadius: 50,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
    color: colors.googleColor,
  },
  
  matchFeeModalInfoText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
    color: colors.blackColor,
    marginBottom: 25,
  },
});

export default styles;
