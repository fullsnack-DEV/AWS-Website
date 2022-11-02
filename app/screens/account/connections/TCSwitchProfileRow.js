/* eslint-disable no-nested-ternary */
import React, {memo} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

const TCSwitchProfileRow = ({item, onPress}) => (
  <TouchableWithoutFeedback
    style={styles.switchProfileListContainer}
    onPress={onPress}>
    <View>
      {
        <View style={styles.placeholderView}>
          <Image
            source={
              item.thumbnail
                ? {uri: item.thumbnail}
                : item.entity_type === Verbs.entityTypePlayer
                ? images.profilePlaceHolder
                : item.entity_type === Verbs.entityTypeClub
                ? images.clubPlaceholder
                : images.teamPlaceholder
            }
            style={item.thumbnail ? styles.entityProfileImg : styles.entityImg}
          />
          {item.thumbnail ? null : (
            <Text style={styles.oneCharacterText}>
              {item.group_name?.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
      }
      {item.unread > 0 && (
        <View
          style={
            item.thumbnail
              ? [styles.badgeView, {right: 10, top: 15}]
              : [
                  styles.badgeView,
                  {
                    right: 10,
                    top: 10,
                  },
                ]
          }>
          <Text
            style={{
              ...styles.badgeCounter,
              ...(item.unread > 9 ? {paddingHorizontal: 5} : {width: 15}),
            }}>
            {item.unread > 9 ? strings.ninePlus : item.unread}
          </Text>
        </View>
      )}
    </View>

    <View style={styles.textContainer}>
      {
        <Text style={styles.entityNameText}>
          {item.entity_type === Verbs.entityTypePlayer
            ? item.full_name
            : item.group_name}
        </Text>
      }
      <Text style={styles.entityLocationText}>
        {item.city},{item.state_abbr}
      </Text>
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  oneCharacterText: {
    // alignSelf:'center',
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 5,
  },
  placeholderView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    height: 40,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    margin: 15,
    width: 40,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1.5,
  },
  textContainer: {
    height: 80,
    justifyContent: 'center',
  },
  switchProfileListContainer: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'row',
  },
  badgeCounter: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  badgeView: {
    backgroundColor: colors.darkThemeColor,
    borderRadius: 10,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 3,
  },
  entityImg: {
    alignSelf: 'center',
    borderRadius: 25,
    height: 50,
    margin: 15,
    resizeMode: 'cover',
    width: 50,
  },
  entityProfileImg: {
    alignSelf: 'center',
    borderRadius: 25,
    height: 36,
    margin: 15,
    resizeMode: 'cover',
    width: 36,
  },
  entityLocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
    marginTop: 5,
  },
  entityNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
});
export default memo(TCSwitchProfileRow);
