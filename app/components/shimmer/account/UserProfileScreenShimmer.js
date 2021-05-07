import React from 'react';
import { View, ScrollView } from 'react-native';
import { ShimmerView } from '../commonComponents/ShimmerCommonComponents';
import colors from '../../../Constants/Colors';
import NewsFeedShimmer from '../newsFeed/NewsFeedShimmer';

const UserProfileScreenShimmer = () => (
  <ScrollView style={{ width: '100%' }}>
    <View>
      {/* Top Background And Profile */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: 15,
          marginTop: 50,
        }}>
        <ShimmerView
          style={{
            marginLeft: 15,
            shadowColor: colors.googleColor,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 6,
            elevation: 13,
            // alignSelf: 'center',
            borderRadius: 50,
          }}
          width={75}
          height={75}
        />
        <ShimmerView style={{ width: 130, height: 30 }} />
      </View>

      {/*    Name and Extra Details */}
      <View
        style={{
          marginTop: 0,
          padding: 15,
        }}>
        <ShimmerView style={{ width: '70%' }} />
        <ShimmerView style={{ width: '80%' }} height={10} />

        {/*    Play In */}
        {new Array(1).fill('').map((item, index) => (
          <View key={`parent${index}`} style={{ marginTop: 15, width: '100%' }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {new Array(5).fill('').map((childItem, childIndex) => (
                <View key={`child${childIndex}`}>
                  <ShimmerView
                    width={90}
                    height={90}
                    style={{ alignSelf: 'flex-start', marginRight: 15 }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </View>

      {/*  Post Section */}
      <NewsFeedShimmer />
    </View>
  </ScrollView>
);

export default UserProfileScreenShimmer;
