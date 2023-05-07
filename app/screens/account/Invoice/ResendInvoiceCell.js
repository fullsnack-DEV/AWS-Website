// @flow
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import GroupIcon from '../../../components/GroupIcon';

const ResendInvoiceCell = ({invoice}) => (
  <View style={{height: 70}}>
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
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.nameStyle} numberOfLines={2}>
                {invoice.full_name || invoice.receiver_name}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
);

export default ResendInvoiceCell;

const styles = StyleSheet.create({
  peopleViewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  nameStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    lineHeight: 19,
  },
  profileContainer: {
    height: 40,
    width: 40,
    borderWidth: 1,
  },
});
