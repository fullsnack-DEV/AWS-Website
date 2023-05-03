import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import GroupIcon from '../../../components/GroupIcon';

export default function CancelRecepintCell({
  item,
  index,
  onSelecteRow = () => {},
  isChecked = false,
  selectAllTitle,
  customImage = false,
}) {
  return (
    <View style={{height: 70}}>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => onSelecteRow({item, index})}>
        <View style={{flex: 1}}>
          <View style={styles.peopleViewContainer}>
            {/* Image section */}
            {customImage ? (
              <>
                <View style={styles.placeholderView}>
                  <Image
                    source={images.invoiceIcon}
                    style={styles.profileImage}
                  />
                </View>
              </>
            ) : (
              <>
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
              </>
            )}

            {/* Name section */}
            <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.nameStyle} numberOfLines={1}>
                  {selectAllTitle ?? item.full_name}
                </Text>
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
                  item.isChecked || isChecked
                    ? images.orangeCheckBox
                    : images.whiteUncheck
                }
                style={[
                  styles.checkImage,
                  {borderWidth: item.isChecked || isChecked ? 0.3 : 1},
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

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
  profileContainer: {
    height: 40,
    width: 40,
    borderWidth: 1,
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
});
