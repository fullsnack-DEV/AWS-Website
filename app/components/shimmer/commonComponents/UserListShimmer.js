import React from 'react';
import { View, ScrollView } from 'react-native';
import { ShimmerView } from './ShimmerCommonComponents';

const UserListShimmer = ({ count = 10 }) => (
  <ScrollView style={{ padding: 15, flex: 1, width: '100%' }}>
    {Array(count)
                .fill('')
                .map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <ShimmerView style={{ marginRight: 15, borderRadius: 50 }} width={50} height={50} />
                    <View style={{ flex: 1 }}>
                      <ShimmerView style={{ width: '80%' }} />
                      <ShimmerView style={{ width: '45%' }} />
                    </View>
                  </View>
                ))}
  </ScrollView>
    );

export default UserListShimmer;
