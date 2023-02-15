import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
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
    paddingVertical: 13,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    marginTop: 34,
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
    marginTop: 5,
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
    paddingVertical: 25,
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
  },
  addVenueButton: {
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 32,
    borderRadius: 5,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.16,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    elevation: 4,
  },
  addVenueButtonText: {
    fontSize: 12,
    lineHeight: 21,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
});

export default styles;
