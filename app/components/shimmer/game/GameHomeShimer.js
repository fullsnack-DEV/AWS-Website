import React from 'react';
import {View, ScrollView, TouchableOpacity, Image} from 'react-native';
import {
  ShimmerSeperator,
  ShimmerView,
} from '../commonComponents/ShimmerCommonComponents';
import colors from '../../../Constants/Colors';
import NewsFeedShimmer from '../newsFeed/NewsFeedShimmer';
import images from '../../../Constants/ImagePath';
import Header from '../../Home/Header';

const GameHomeShimer = ({navigation}) => (
  <ScrollView style={{width: '100%'}}>
    <Header
      barStyle={'light-content'}
      safeAreaStyle={{position: 'absolute', zIndex: 10}}
      leftComponent={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={images.backArrow}
            style={{height: 22, width: 16, tintColor: colors.lightBlackColor}}
          />
        </TouchableOpacity>
      }
    />
    <View>
      {/* Top Background And Profile */}
      <View>
        <ShimmerView
          style={{width: '100%'}}
          height={200}
          marginVertical={0}
          borderRadius={0}
        />
      </View>

      {/*  Tabs */}
      {/*    Name and Extra Details */}
      <View
        style={{
          marginTop: 0,
          paddingHorizontal: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{marginTop: 15, width: '100%'}}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {new Array(5).fill('').map((childItem, childIndex) => (
              <View key={`child${childIndex}`}>
                <ShimmerView
                  width={150}
                  height={40}
                  style={{alignSelf: 'flex-start', marginRight: 15}}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <ShimmerSeperator />
      </View>
      <View style={{padding: 15}}>
        <ShimmerView
          width={150}
          height={30}
          style={{alignSelf: 'flex-start'}}
        />
        <ShimmerView width={300} style={{alignSelf: 'flex-start'}} />
        <ShimmerView width={300} style={{alignSelf: 'flex-start'}} />
      </View>

      <View style={{padding: 15}}>
        <ShimmerView
          width={150}
          height={30}
          style={{alignSelf: 'flex-start'}}
        />
        <ShimmerView width={300} style={{alignSelf: 'flex-start'}} />
        <ShimmerView width={300} style={{alignSelf: 'flex-start'}} />
      </View>
      <ShimmerSeperator />
      {/*  Post Section */}
      <NewsFeedShimmer />
    </View>
  </ScrollView>
);

export default GameHomeShimer;
