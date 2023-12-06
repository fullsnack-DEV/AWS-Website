// @flow
import React from 'react';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import moment from 'moment';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import GroupIcon from '../../../components/GroupIcon';
import {getJSDate} from '../../../utils';

const SearchEventCard = ({
  event = {},
  eventOwner = {},
  showCloseButton = false,
  onCloseBtnPress = () => {},
  onPressEvent = () => {},
}) => (
  <>
    <Pressable style={styles.parent} onPress={onPressEvent}>
      <View style={styles.imageContainer}>
        <Image source={images.calendarIcon} style={styles.image} />
      </View>
      <View style={styles.innerContainer}>
        <View style={{flex: 1}}>
          <Text style={[styles.title, {marginBottom: 7}]} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={styles.ownerDetails}>
            <GroupIcon
              imageUrl={eventOwner.thumbnail}
              groupName={eventOwner.gorup_name}
              showPlaceholder={false}
              containerStyle={styles.iconContainer}
            />
            <View style={{flex: 1}}>
              <Text style={[styles.title, {fontFamily: fonts.RRegular}]}>
                {eventOwner.gorup_name ?? eventOwner.full_name}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.sportText}>{`${
              event.selected_sport?.sport_name
            }  |  ${moment(getJSDate(event.start_datetime)).format(
              'MMM DD YYYY',
            )}`}</Text>
          </View>
        </View>
        {showCloseButton ? (
          <Pressable style={{marginLeft: 15}} onPress={onCloseBtnPress}>
            <Image
              source={images.closeRound}
              style={{width: 16, height: 16, resizeMode: 'contain'}}
            />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  </>
);

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.greyBorderColor,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  iconContainer: {
    width: 20,
    height: 20,
    marginRight: 5,
    paddingTop: 2,
  },
  sportText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  ownerDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default SearchEventCard;
