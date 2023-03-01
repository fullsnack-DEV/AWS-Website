// @flow
import React from 'react';
import {View, StyleSheet, Text, FlatList, Dimensions} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import EventMapView from '../../../../components/Schedule/EventMapView';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const Venues = ({list = []}) =>
  list.length > 0 ? (
    <FlatList
      data={list}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => (
        <View style={{width: Dimensions.get('window').width}}>
          <View style={{paddingHorizontal: 17}}>
            <Text
              style={[
                styles.label,
                {fontFamily: fonts.RMedium, marginBottom: 5},
              ]}>
              {item.name}
            </Text>
            <Text style={styles.label}>{item.address}</Text>
          </View>
          <EventMapView
            coordinate={item.coordinate}
            region={item.region}
            style={{width: Dimensions.get('window').width, marginBottom: 15}}
          />
        </View>
      )}
    />
  ) : (
    <View style={{paddingHorizontal: 17}}>
      <Text style={styles.label}>{strings.noneText}</Text>
    </View>
  );

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default Venues;
