import {StyleSheet, Platform, View, FlatList} from 'react-native';
import React from 'react';
import colors from '../../Constants/Colors';
import {ShimmerView} from '../../components/shimmer/commonComponents/ShimmerCommonComponents';

const ShimmerCard = () => (
  <View style={styles.cardContainer}>
    <ShimmerView style={styles.sporttextContainer} isReversed={true} />
    <ShimmerView
      style={styles.imageContainer}
      isReversed={true}
      shimmerStyle={{borderRadius: 100}}
    />
    <View style={styles.bottomContainer}>
      <ShimmerView style={styles.textContainer} isReversed={true} />
      <ShimmerView style={styles.text2} isReversed={true} />
    </View>
  </View>
);

function PlayerShimmerCard({data}) {
  return (
    <FlatList
      data={data}
      horizontal
      extraData={data}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      style={{
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 6,
      }}
      renderItem={() => <ShimmerCard />}
    />
  );
}
export default React.memo(PlayerShimmerCard);

const styles = StyleSheet.create({
  cardContainer: {
    height: 178,
    width: 125,
    backgroundColor: '#FCFCFC',
    borderRadius: 5,
    marginLeft: 15,

    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 7,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  imageContainer: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 100,
    marginBottom: 10,
    marginTop: 15,
  },
  bottomContainer: {
    justifyContent: 'space-between',
  },
  textContainer: {
    width: '90%',
    height: 16,
    alignSelf: 'center',
    marginTop: 15,
  },
  sporttextContainer: {
    width: '70%',
    height: 16,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 15,
  },
  text2: {
    width: '90%',
    height: 16,
    marginBottom: 10,
    alignSelf: 'center',
  },
});
