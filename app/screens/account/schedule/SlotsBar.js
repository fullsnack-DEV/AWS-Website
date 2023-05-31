// @flow
import React from 'react';
import {View, Text} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const SlotsBar = ({availableSlots = []}) => (
  <>
    <Text
      style={{
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        fontFamily: fonts.RMedium,
        color: colors.lightBlackColor,
        margin: 15,
      }}>
      {strings.availableTimeForChallenge}
    </Text>

    <View
      style={{
        // position: 'relative',
        width: '100%',
        alignSelf: 'center',
      }}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Text style={{color: colors.darkGrey}}>0</Text>
        <Text style={{marginLeft: 5, color: colors.darkGrey}}>6</Text>
        <Text style={{marginLeft: 5, color: colors.darkGrey}}>12</Text>
        <Text style={{marginLeft: 5, color: colors.darkGrey}}>18</Text>
        <Text style={{color: colors.darkGrey}}>24</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          left: '24%',
          top: 27,
          zIndex: 999999,
          height: 20,
          borderWidth: 1,
          borderColor: colors.whiteColor,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: '49%',
          top: 27,
          zIndex: 999999,
          height: 20,
          borderWidth: 1,
          borderColor: colors.whiteColor,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: '74%',
          top: 27,
          zIndex: 999999,
          height: 20,
          borderWidth: 1,
          borderColor: colors.whiteColor,
        }}
      />
      <View
        style={{
          height: 15,
          marginTop: 10,
          marginBottom: 30,
          borderRadius: 2,
          borderColor: colors.lightGrey,
          borderWidth: 1,
          backgroundColor: colors.lightGrey,
        }}
      />
      {availableSlots.map((item) => (
        <>
          <View
            style={{
              width: `${item.width}%`,
              height: 15,
              marginTop: 10,
              marginBottom: 30,
              borderRadius: 2,
              backgroundColor: colors.availabilityBarColor,
              position: 'absolute',
              left: `${item.marginLeft + 0}%`,
              top: 17,
            }}
          />
        </>
      ))}
    </View>
  </>
);

export default SlotsBar;
