import React from 'react';
import {View, ScrollView} from 'react-native';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';

import NewsFeedShimmer from '../newsFeed/NewsFeedShimmer';

const ProfileScreenShimmer = () => (
  <ScrollView style={{width: '100%'}}>
    <View style={{marginHorizontal: 10}}>
      {/*  Post Section */}
      <View style={{marginBottom: 15}}>
        <ShimmerView style={{width: '100%'}} height={150} borderRadius={20} />
        <ShimmerView
          style={{
            borderRadius: 30,
            width: 60,
            height: 60,
            position: 'absolute',
            bottom: -25,
            left: 10,
          }}
        />
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
        <ShimmerView width={100} style={{marginRight: 15}} />
        <ShimmerView width={100} />
      </View>
      <View style={{marginTop: 15}}>
        <ShimmerView style={{width: '40%'}} />
        <ShimmerView style={{width: '20%'}} />
      </View>
      <View style={{marginTop: 15}}>
        <ShimmerView style={{width: '100%'}} />
        <ShimmerView style={{width: '100%'}} />
        <ShimmerView style={{width: '80%'}} />
      </View>
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <ShimmerView
          style={{
            borderRadius: 60,
            width: 40,
            height: 40,
          }}
        />
        <ShimmerView
          style={{
            borderRadius: 60,
            width: 40,
            height: 40,
          }}
        />
        <ShimmerView
          style={{
            borderRadius: 60,
            width: 40,
            height: 40,
          }}
        />
        <ShimmerView
          style={{
            borderRadius: 60,
            width: 40,
            height: 40,
          }}
        />
        <ShimmerView
          style={{
            borderRadius: 60,
            width: 40,
            height: 40,
          }}
        />
        <ShimmerView
          style={{
            borderRadius: 60,
            width: 40,
            height: 40,
          }}
        />
      </View>
      <View style={{marginTop: 19, marginBottom: 15}}>
        <ShimmerView height={27} style={{width: '100%'}} />
      </View>
      <ShimmerView width={80} height={24} />
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <ShimmerView width={45} height={25} />
        <ShimmerView width={78} height={25} />
        <ShimmerView width={78} height={25} />
        <ShimmerView width={78} height={25} />
      </View>
      <ShimmerView height={2} style={{width: '100%', marginBottom: 15}} />
      <NewsFeedShimmer />
    </View>
  </ScrollView>
);

export default ProfileScreenShimmer;
