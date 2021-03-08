import React from 'react';
import { View, ScrollView } from 'react-native';
import { ShimmerView } from '../commonComponents/ShimmerCommonComponents';
import colors from '../../../Constants/Colors';
import NewsFeedShimmer from '../newsFeed/NewsFeedShimmer';

const ProfileScreenShimmer = () => (
  <ScrollView style={{ width: '100%' }}>
    <View>
      {/* Top Background And Profile */}
      <View>
        <ShimmerView style={{ width: '100%' }} height={200} marginVertical={0} borderRadius={0} />
        <ShimmerView style={{
            position: 'absolute',
            bottom: -30,
            shadowColor: colors.googleColor,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 6,
            elevation: 13,
            alignSelf: 'center',
            borderRadius: 50,
        }} width={75} height={75} />
      </View>

      {/*    Name and Extra Details */}
      <View style={{
 marginTop: 40, padding: 15, alignItems: 'center', justifyContent: 'center',
      }}>
        <ShimmerView style={{ width: '70%' }} />
        <ShimmerView style={{ width: '80%' }} height={10} />
        <ShimmerView style={{ width: '50%' }} height={10} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ShimmerView style={{ flex: 1, width: '100%' }}/>
          <View style={{ marginHorizontal: 10 }}/>
          <ShimmerView style={{ flex: 1 }}/>
        </View>
        {/*  Edit Profile */}
        <ShimmerView style={{ flex: 1, width: '100%' }} height={30} marginVertical={25}/>

        {/*    Play In */}
        {new Array(3).fill('').map((item, index) => (
          <View key={`parent${index}`} style={{ marginTop: 15, width: '100%' }}>
            <ShimmerView width={150} style={{ alignSelf: 'flex-start' }}/>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
              {new Array(5).fill('').map((childItem, childIndex) => (
                <View key={`child${childIndex}`}>
                  <ShimmerView width={150} height={40} style={{ alignSelf: 'flex-start', marginRight: 15 }}/>
                </View>
              ))}
            </ScrollView>
          </View>
          ))}
      </View>

      {/*  Post Section */}
      <NewsFeedShimmer/>
    </View>
  </ScrollView>
);

export default ProfileScreenShimmer;
