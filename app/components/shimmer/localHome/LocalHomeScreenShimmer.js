import React from 'react';
import {View, ScrollView} from 'react-native';
import {
  ShimmerSeperator,
  ShimmerView,
} from '../commonComponents/ShimmerCommonComponents';
import colors from '../../../Constants/Colors';

const CommonheaderWithContent = () => (
  <View
    style={{
      paddingHorizontal: 15,
      paddingVertical: 15,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <ShimmerView width={150} height={25} style={{alignSelf: 'flex-start'}} />
    <View
      style={{
        marginTop: 10,
        height: 100,
        width: '100%',
        backgroundColor: colors.lightgrayPlayInColor,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ShimmerView width={150} height={15} />
      <ShimmerView width={250} height={15} />
      <ShimmerView width={100} height={15} />
    </View>
  </View>
);
const LocalHomeScreenShimmer = () => (
  <ScrollView
    style={{width: '100%'}}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
    <View>
      {/*  Sports List */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {new Array(5).fill('').map((childItem, childIndex) => (
          <View
            key={`child${childIndex}`}
            style={{paddingHorizontal: 15, marginVertical: 10}}>
            <ShimmerView
              width={100}
              height={15}
              style={{alignSelf: 'flex-start'}}
            />
          </View>
        ))}
      </ScrollView>
      <ShimmerSeperator
        style={{marginVertical: 0}}
        color={colors.graySeparater}
      />

      {/*  Shorts Round List */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {new Array(5).fill('').map((childItem, childIndex) => (
          <View
            key={`child${childIndex}`}
            style={{paddingHorizontal: 10, marginVertical: 10}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 70,
                width: 70,
                borderRadius: 50,
                borderWidth: 5,
                borderColor: colors.lightgrayPlayInColor,
              }}>
              <ShimmerView width={50} height={50} style={{borderRadius: 50}} />
            </View>
          </View>
        ))}
      </ScrollView>

      <CommonheaderWithContent />

      {/* Shorts */}
      <View
        style={{
          paddingVertical: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ShimmerView
          width={150}
          height={25}
          style={{marginHorizontal: 15, alignSelf: 'flex-start'}}
        />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {new Array(10).fill('').map((childItem, childIndex) => (
            <View
              key={`child${childIndex}`}
              style={{paddingHorizontal: 7.5, marginVertical: 10}}>
              <ShimmerView
                width={150}
                height={250}
                style={{borderRadius: 15}}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <CommonheaderWithContent />
      <CommonheaderWithContent />
      <CommonheaderWithContent />
      <CommonheaderWithContent />
      <CommonheaderWithContent />
      <CommonheaderWithContent />
    </View>
  </ScrollView>
);

export default LocalHomeScreenShimmer;
