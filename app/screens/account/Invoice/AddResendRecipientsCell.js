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

const AddResendRecipientsCell = ({invoice, index, onSelecteRow = () => {}}) => (
  <View style={{height: 70}}>
    <TouchableWithoutFeedback
      style={{flex: 1}}
      onPress={() => onSelecteRow({invoice, index})}>
      <View style={{flex: 1}}>
        <View style={styles.peopleViewContainer}>
          {/* Image section */}
          <GroupIcon
            entityType={invoice.receiver_type}
            imageUrl={invoice.thumbnail}
            containerStyle={styles.profileContainer}
            groupName={invoice.full_name}
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
                {invoice.full_name}
              </Text>
            </View>
          </View>
          {/* Checkbox section */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: 42,
            }}>
            <Image
              source={
                invoice.isChecked ? images.orangeCheckBox : images.whiteUncheck
              }
              style={[
                styles.checkImage,
                {borderWidth: invoice.isChecked ? 0.3 : 1},
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
);

export default AddResendRecipientsCell;

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
  profileContainer: {
    height: 40,
    width: 40,
    borderWidth: 1,
  },
});
