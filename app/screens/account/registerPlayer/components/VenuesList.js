// @flow
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import EventMapView from '../../../../components/Schedule/EventMapView';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const VenuesList = ({list = []}) =>
  list.map((item, index) => (
    <View style={styles.parent} key={index}>
      <View style={{marginBottom: 25}}>
        <Text style={styles.label}>Venue Name</Text>
        <Text style={styles.value}>{item.name}</Text>
      </View>
      <View style={{marginBottom: 25}}>
        <Text style={styles.label}>{strings.address}</Text>
        <Text style={styles.value}>{item.address}</Text>
      </View>

      <EventMapView
        coordinate={item.coordinate}
        region={item.region}
        style={{marginBottom: 25}}
      />

      {item.details ? (
        <View>
          <Text style={styles.label}>{strings.detailText}</Text>
          <Text style={styles.value}>{item.details}</Text>
        </View>
      ) : null}
    </View>
  ));

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 13,
    paddingTop: 13,
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  value: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
  },
});

export default VenuesList;
