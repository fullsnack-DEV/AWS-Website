/* eslint-disable no-nested-ternary */
import React, {memo, useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import GroupIcon from '../../../components/GroupIcon';
import Verbs from '../../../Constants/Verbs';
import {getSportsLabel} from '../../../utils/accountUtils';
import AuthContext from '../../../auth/context';

const AccountMenuRow = ({
  item,
  isAccountDeactivated,
  onPressSetting,
  onPressSport,
  onPressCancelRequest,
}) => {
  const [groupSportName, setGroupSportName] = useState('');
  const authContext = useContext(AuthContext);
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    if (item.option?.entity_type) {
      setGroupSportName(
        getSportsLabel({
          entityData: item.option,
          sportList: authContext.sports,
          maxSports: 2,
        }),
      );
    }
  }, [item, authContext]);

  return !isAccountDeactivated && item.option ? (
    <View style={{backgroundColor: colors.creamColor}}>
      <View
        style={[
          styles.row,
          {paddingLeft: 50},
          item.option?.request_id ? {opacity: 0.3} : {},
        ]}
        pointerEvents={item.option?.request_id ? 'none' : 'auto'}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.row,
            {marginVertical: 5},
            {
              backgroundColor: isPressed
                ? colors.buttonClickBgEffect
                : 'transparent',
            },
          ]}
          onPress={onPressSport}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}>
          <GroupIcon
            imageUrl={item.icon}
            entityType={item.option.entity_type ?? Verbs.entityTypePlayer}
            groupName={item.option.group_name ?? ''}
            showPlaceholder={false}
            containerStyle={[
              styles.iconContainer,
              item.option.group_name ? {borderWidth: 2} : {borderWidth: 0},
              item.icon ? {} : {padding: 4},
            ]}
            textstyle={{fontSize: 10}}
          />
          <View style={styles.row}>
            <View style={groupSportName ? {maxWidth: '65%'} : {}}>
              <Text style={styles.listItems} numberOfLines={1}>
                {item.option?.group_name ?? item.option}
              </Text>
            </View>
            {groupSportName ? (
              <Text
                style={[
                  styles.game,
                  item.option.entity_type === Verbs.entityTypeClub
                    ? {color: colors.greeColor}
                    : {},
                ]}>
                {groupSportName}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <Pressable onPress={onPressSetting}>
          <Image source={item?.iconRight} style={styles.nextArrow} />
        </Pressable>
      </View>
      {item.option?.request_id && (
        <TouchableOpacity
          style={styles.buttonView}
          onPress={onPressCancelRequest}>
          <Text style={styles.textStyle}>
            {strings.teamCreationRequestSend}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  listItems: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
  },
  nextArrow: {
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    height: 15,
    width: 15,
    marginRight: 15,
    resizeMode: 'contain',
  },
  buttonView: {
    padding: 6,
    marginLeft: 80,
    marginRight: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textFieldBackground,
  },
  textStyle: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  game: {
    fontSize: 12,
    // lineHeight: 24,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    marginLeft: 3,
  },
});
export default memo(AccountMenuRow);
