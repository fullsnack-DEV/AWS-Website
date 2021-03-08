import React from 'react';
import { View, ScrollView } from 'react-native';
import { ShimmerView } from '../commonComponents/ShimmerCommonComponents';

const NewsFeedShimmer = () => (
  <ScrollView style={{ padding: 15, width: '100%' }}>
    {Array(5)
            .fill('')
            .map((item, index) => (
              <View key={index}>
                <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <ShimmerView style={{ marginRight: 15, borderRadius: 50 }} width={30} height={30} />
                  <View style={{ flex: 1 }}>
                    <ShimmerView style={{ width: '60%', height: 10 }} />
                    <ShimmerView style={{ width: '40%', height: 10 }} />
                  </View>
                </View>
                <View key={index} style={{ marginBottom: 10 }}>
                  <ShimmerView style={{ width: '100%' }} height={200} />
                </View>

                <View key={index} style={{ marginBottom: 10 }}>
                  <ShimmerView style={{ width: '100%' }} height={15} />
                  <ShimmerView style={{ width: '100%' }} height={15} />
                  <ShimmerView style={{ width: '100%' }} height={5} />
                </View>

              </View>
            ))}
  </ScrollView>
);

export default NewsFeedShimmer;
