import React from 'react';
import { View, ScrollView } from 'react-native';
import { ShimmerView } from '../commonComponents/ShimmerCommonComponents';
import { widthPercentageToDP as wp } from '../../../utils';

const MessageChatShimmer = ({ count = 5 }) => (
  <ScrollView style={{ padding: 15, width: '100%' }}>
    {Array(count)
            .fill('')
            .map((item, index) => (
              <View key={index} style={{ width: '100%' }}>
                {/* Receiver */}
                <View style={{
 flexDirection: 'row', marginBottom: 10, justifyContent: 'flex-start', width: '100%',
                }}>
                  <ShimmerView style={{ marginRight: 15, borderRadius: 50 }} width={30} height={30} />
                  <View>
                    <ShimmerView style={{ width: wp(50) }} height={10} />
                    <ShimmerView style={{ width: '45%' }} />
                  </View>
                </View>

                {/* Sender */}
                <View style={{
                  flexDirection: 'row', marginBottom: 10, justifyContent: 'flex-end', width: '100%',
                }}>
                  <View>
                    <ShimmerView style={{ width: wp(30), alignSelf: 'flex-end' }} height={10} />
                    <ShimmerView style={{ width: 150, alignSelf: 'flex-end' }} height={150} />
                  </View>
                  <ShimmerView style={{ marginLeft: 15, borderRadius: 50 }} width={30} height={30} />
                </View>
              </View>
            ))}
  </ScrollView>
);

export default MessageChatShimmer;
