// @flow
import React, {useContext} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {InvoiceRowType} from '../../../Constants/GeneralConstants';
import AuthContext from '../../../auth/context';
import Verbs from '../../../Constants/Verbs';
import {getSportName} from '../../../utils';

const RecipientCell = ({
  item,
  index,
  onSelectCancel = () => {},
  onSelecteRow = () => {},
  isChecked = false,
  selectAllTitle = '',
  rowType = InvoiceRowType.Recipient,
}) => {
  let imagePlacholder = images.clubBcgPlaceholder;
  if (item.entity_type === Verbs.entityTypeTeam) {
    imagePlacholder = images.teamBcgPlaceholder;
  }

  const authContext = useContext(AuthContext);

  return (
    <View style={{height: 70}}>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => onSelecteRow({item, index})}>
        <View style={{flex: 1}}>
          <View style={styles.peopleViewContainer}>
            {/* Image section */}
            {item.user_id && (
              <View style={styles.placeholderView}>
                <Image
                  source={
                    item.thumbnail
                      ? {uri: item.thumbnail}
                      : images.profilePlaceHolder
                  }
                  style={styles.profileImage}
                />
              </View>
            )}

            {!item.user_id && (
              <View style={styles.placeholderView}>
                <Image
                  source={
                    item.thumbnail ? {uri: item.thumbnail} : imagePlacholder
                  }
                  style={[
                    styles.placeHolderImg,
                    item.thumbnail
                      ? styles.profileImage
                      : styles.placeHolderImg,
                  ]}
                />

                {item.thumbnail ? null : (
                  <Text style={styles.oneCharacterText}>
                    {item.group_name?.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
            )}
            {item.group_name && (
              <Image
                source={
                  item.entity_type === Verbs.entityTypeClub
                    ? images.newClubIcon
                    : images.newTeamIcon
                }
                style={styles.teamIconStyle}
                resizeMode={'contain'}
              />
            )}

            {/* Name section */}
            <View style={{flex: 1, marginLeft: 10}}>
              {rowType === InvoiceRowType.SelectAll &&  <Text style={styles.nameStyle} numberOfLines={1}>
                    {selectAllTitle}
                  </Text>}
                  {rowType !== InvoiceRowType.SelectAll &&  <View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.nameStyle} numberOfLines={1}>
                    {item.group_name}
                    {item.first_name} {item.last_name}
                  </Text>
                  {item.user_id && !item.connected && (
                    <Image
                      source={images.unlinked}
                      style={styles.unlinedImage}
                    />
                  )}
                </View>
                {item.group_name && (
                  <Text
                    style={{
                      fontFamily: fonts.RRegular,
                      fontSize: 14,
                      lineHeight: 21,
                      color: colors.lightBlackColor,
                    }}>{`${item.city} · ${getSportName(
                    item,
                    authContext,
                  )}`}</Text>
                )}
              </View>}
            </View>
            {/* Checkbox section */}
            {rowType !== InvoiceRowType.CancelRecipient &&  <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                width: 42,
              }}>
              <Image
                source={
                  (item.isChecked || isChecked) ? images.orangeCheckBox : images.whiteUncheck
                }
                style={[
                  styles.checkImage,
                  {borderWidth: (item.isChecked || isChecked) ? 0.3 : 1},
                ]}
              />
            </View>}

            
          {rowType === InvoiceRowType.CancelRecipient &&  <TouchableWithoutFeedback
          onPress={() => onSelectCancel({item, index})}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: 44,
            }}>
            <Image source={images.closeRound} style={styles.cancelImage} />
          </View>
        </TouchableWithoutFeedback>}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default RecipientCell;

const styles = StyleSheet.create({
  peopleViewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'cover',
    width: 40,
    borderRadius: 20,
  },
  placeholderView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 41,
    width: 41,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.thinDividerColor,
  },
  nameStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    lineHeight: 19,
  },
  checkImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.veryLightGray,
    borderRadius: 7,
  },
  unlinedImage: {
    marginLeft: 7,
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  placeHolderImg: {
    marginTop: 4,
    height: 32,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  oneCharacterText: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 2,
    justifyContent: 'center',
  },
  teamIconStyle: {
    height: 15,
    width: 15,
    marginTop: 24.75,
    marginLeft: -11,
  },
  cancelImage: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
