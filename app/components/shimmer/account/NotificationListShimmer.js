import React from 'react';
import { View, ScrollView } from 'react-native';
import { ShimmerSeperator, ShimmerView } from '../commonComponents/ShimmerCommonComponents';

const NotificationListShimmer = ({ count = 15 }) => (
  <ScrollView style={{ padding: 15, flex: 1, width: '100%' }}>
    {Array(count)
                .fill('')
                .map((item, index) => (
                  <View key={index} style={{ marginBottom: 10 }}>
                    {(index === 0 || index % 5 === 0)
                      ? (
                        <View>
                          <ShimmerView style={{ width: '60%' }} height={30}/>
                          <ShimmerSeperator />
                        </View>
                        )
                        : null}
                    <View style={{ flexDirection: 'row' }}>
                      <ShimmerView style={{ marginRight: 15, borderRadius: 50 }} width={50} height={50} />
                      <View style={{ flex: 1 }}>
                        <ShimmerView style={{ width: '50%' }} />
                        <ShimmerView style={{ width: '100%' }} height={10}/>
                        <ShimmerView style={{ width: '100%' }} height={10}/>
                        <ShimmerView style={{ width: '100%' }} height={10}/>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 15 }}>
                          <ShimmerView style={{ width: '48%' }} height={30}/>
                          <ShimmerView style={{ width: '48%' }} height={30}/>
                        </View>
                      </View>
                    </View>
                    <ShimmerSeperator />
                  </View>
                ))}
  </ScrollView>
    );

export default NotificationListShimmer;
