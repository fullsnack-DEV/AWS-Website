import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';

export default function LogDetailScreen() {
  // const [loading, setloading] = useState(false);

  // const isFocused = useIsFocused();

    return (
      <View style={styles.mainContainer}>
        {/* <ActivityLoader visible={loading} /> */}

        <View style={{ margin: 15 }}>

          <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
            Transaction no.: TR-7077071
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
          }}>{'-$20.00'}
            </Text>
          </View>

          <View style={styles.containerView}>
            <Text style={styles.titleText}>Type</Text>
            <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.lightBlackColor,
          }}>{'Refund'}
            </Text>
          </View>

          <View style={styles.containerView}>
            <Text style={styles.titleText}>Method</Text>
            <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.lightBlackColor,
          }}>{'By check'}
            </Text>
          </View>
        </View>

        <TCThinDivider marginTop={15} width={'94%'} />

        <View style={{ margin: 15 }}>
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
            Membership canceled.
          </Text>
        </View>

        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 12,
            color: colors.userPostTimeColor,
            marginLeft: 15,
          }}>
          {'Logged by Michael Jordan at May 1, 2020 11:25am'}
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
