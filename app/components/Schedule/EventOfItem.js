import React from 'react';
import {FlatList, StyleSheet, View, Text, Image} from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function EventOfItem({eventOfText, refereeList}) {
  return (
    <View style={styles.containerStyle}>
      <View
        style={{
          backgroundColor: colors.whiteColor,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={styles.eventOfTextStyle}>{eventOfText}</Text>
        <FlatList
          data={refereeList}
          scrollEnabled={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.eventImageViewStyle}>
              <Image
                source={
                  item?.thumbnail
                    ? {uri: item?.thumbnail}
                    : images.profilePlaceHolder
                }
                style={styles.eventImageStyle}
                resizeMode={'cover'}
              />
            </View>
          )}
          style={{backgroundColor: colors.whiteColor}}
          keyExtractor={(itemValue, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.whiteColor,
    marginTop: 3,
    flexDirection: 'row-reverse',
  },
  eventOfTextStyle: {
    marginRight: 8,
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  eventImageViewStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    shadowOpacity: 0.4,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 5,
    shadowColor: colors.lightgrayColor,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 1,
  },
  eventImageStyle: {
    width: 26,
    height: 26,
    borderRadius: 20,
  },
});

export default EventOfItem;
