// @flow
import React from 'react';
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
import GroupIcon from '../../../components/GroupIcon';
import Verbs from '../../../Constants/Verbs';
import {strings} from '../../../../Localization/translation';

const ResendRecipientCell = ({item, index, onSelectCancel = () => {}}) => (
  <View style={{height: 70}}>
    <View style={{flex: 1}}>
      <View style={styles.peopleViewContainer}>
        {/* Image section */}
        <GroupIcon
          entityType={item.receiver_type}
          imageUrl={item.thumbnail}
          containerStyle={styles.profileContainer}
          groupName={item.full_name}
          grpImageStyle={{
            height: 32,
            width: 28,
          }}
          textstyle={{
            fontSize: 12,
          }}
        />

        {/* Name section */}
        <View style={{flex: 1, marginLeft: 10}}>
          <View>
            <Text style={styles.nameStyle} numberOfLines={1}>
              {item.full_name}
            </Text>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 14,
                lineHeight: 18,
                color:
                  item.invoice_status === Verbs.paid
                    ? colors.neonBlue
                    : colors.darkThemeColor,
              }}>
              {item.invoice_status === Verbs.paid
                ? strings.paidText
                : strings.openText}
            </Text>
          </View>
        </View>
        {/* Checkbox section */}
        <TouchableWithoutFeedback onPress={() => onSelectCancel({item, index})}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: 44,
            }}>
            <Image source={images.closeRound} style={styles.cancelImage} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  </View>
);

export default ResendRecipientCell;

const styles = StyleSheet.create({
  peopleViewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  nameStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  cancelImage: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  profileContainer: {
    height: 40,
    width: 40,
    borderWidth: 1,
  },
});
