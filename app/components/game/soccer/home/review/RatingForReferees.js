import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import TCUserRating from '../../../../TCUserRating';
import {widthPercentageToDP as wp} from '../../../../../utils';

const RatingForReferees = ({refreeData}) => (
  <View style={styles.mainContainer}>
    <Text style={styles.titleText}>Ratings for Referees</Text>
    <View style={{paddingVertical: 10}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEnabled={false}
        keyExtractor={(item) => item?.user_id?.toString()}
        data={refreeData}
        renderItem={({item}) => (
          <TCUserRating
            name={item?.full_name}
            rating={item?.avg_review?.total_avg ?? 0}
          />
        )}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.notAvailableTextStyle}>No refree yet</Text>
          </View>
        )}
      />
    </View>
    <TouchableOpacity>
      <Text style={styles.detailText}>Detail info about ratings</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },
  detailText: {
    marginVertical: 5,
    marginRight: 5,
    color: colors.lightBlackColor,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: fonts.RLight,
    textDecorationLine: 'underline',
  },
  notAvailableTextStyle: {
    marginLeft: wp(5),
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
});
export default RatingForReferees;
