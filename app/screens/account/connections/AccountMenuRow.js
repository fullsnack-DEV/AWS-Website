/* eslint-disable no-nested-ternary */
import React, {memo} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';

const AccountMenuRow = ({
  item,
  isAccountDeactivated,
  onPress,
  onPressCancelRequest,
}) => (
  <View>
    {!isAccountDeactivated && (
      <TouchableWithoutFeedback style={styles.listContainer} onPress={onPress}>
        <View style={{marginVertical: 5}}>
          <Image source={item?.icon} style={{...styles.subMenuItem}} />
        </View>
        <Text style={styles.listItems}>
          {item?.option?.group_name ?? item.option}
        </Text>
        <Image source={item?.iconRight} style={styles.nextArrow} />
      </TouchableWithoutFeedback>
    )}
    {item?.option?.request_id && (
      <TouchableWithoutFeedback onPress={onPressCancelRequest}>
        <View style={styles.buttonView}>
          <Text style={styles.textStyle} numberOfLines={1}>
            {strings.cancelRequestTitle}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )}
  </View>
);

const styles = StyleSheet.create({
  subMenuItem: {
    alignSelf: 'center',
    height: 40,
    marginLeft: 45,
    resizeMode: 'contain',
    width: 40,
  },
  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 25,
    width: '30%',
    marginBottom: 5,
    marginLeft: 80,
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textStyle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightBlackColor,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  nextArrow: {
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    height: 15,
    width: 15,
    marginRight: 15,
    resizeMode: 'contain',
  },
});
export default memo(AccountMenuRow);
