import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';
import moment from 'moment';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';

export default function LogDetailScreen({route}) {
  const [data] = useState(route?.params?.data);
  // const [loading, setloading] = useState(false);

  // const isFocused = useIsFocused();

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <View style={{margin: 15}}>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          Transaction no.: {data?.transaction_id}
        </Text>
      </View>

      <View style={styles.containerStyle}>
        <View style={styles.containerView}>
          <Text style={styles.titleText}>Amount</Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RMedium,
              color: colors.lightBlackColor,
            }}>
            {`$${data?.amount}`}
          </Text>
        </View>

        <View style={styles.containerView}>
          <Text style={styles.titleText}>Type</Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RMedium,
              color: colors.lightBlackColor,
            }}>
            {data?.transaction_type.charAt(0).toUpperCase() +
              data?.transaction_type.slice(1)}
          </Text>
        </View>

        <View style={styles.containerView}>
          <Text style={styles.titleText}>Method</Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RMedium,
              color: colors.lightBlackColor,
            }}>
            {`By ${data?.payment_mode}`}
          </Text>
        </View>
      </View>

      <TCThinDivider marginTop={15} width={'94%'} />

      <View style={{margin: 15}}>
        <Text
          style={{
            fontFamily: fonts.RLight,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          {'Note'}
        </Text>

        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          {data?.notes}
        </Text>
      </View>

      <Text
        style={{
          fontFamily: fonts.RRegular,
          fontSize: 12,
          color: colors.userPostTimeColor,
          marginLeft: 15,
        }}>
        {`Logged by ${data?.done_by?.first_name} ${
          data?.done_by?.last_name
        } at ${moment(new Date(data?.transaction_date * 1000)).format(
          'MMM DD, YYYY hh:mma',
        )}`}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },

  containerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    marginBottom: 0,
  },
  titleText: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
});
