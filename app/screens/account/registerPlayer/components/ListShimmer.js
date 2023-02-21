// @flow
import React from 'react';
import {View} from 'react-native';
import {
  ShimmerView,
  ShimmerSeperator,
} from '../../../../components/shimmer/commonComponents/ShimmerCommonComponents';
import colors from '../../../../Constants/Colors';

const ListShimmer = ({count = 4}) =>
  Array(count)
    .fill('')
    .map((item, index) => (
      <>
        <View style={{flexDirection: 'row', alignItems: 'center'}} key={index}>
          <ShimmerView width={40} height={40} style={{borderRadius: 20}} />

          <View style={{marginLeft: 10}}>
            <ShimmerView
              style={{marginVertical: 0}}
              height={17}
              borderRadius={5}
            />
            <ShimmerView
              style={{marginVertical: 0, marginTop: 2}}
              height={17}
              borderRadius={17}
            />
          </View>

          <ShimmerView
            style={{marginVertical: 0, marginLeft: 6}}
            height={25}
            borderRadius={5}
            width={74}
          />
        </View>
        <ShimmerSeperator
          height={1}
          style={{marginVertical: 17}}
          color={colors.grayBackgroundColor}
        />
      </>
    ));

export default ListShimmer;
