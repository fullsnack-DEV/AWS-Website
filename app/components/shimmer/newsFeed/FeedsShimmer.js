import React from 'react';
import {View, ScrollView} from 'react-native';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';
import colors from '../../../Constants/Colors';

const FeedsShimmer = () => (
  <ScrollView style={{padding:15, width: '100%'}}>
    {Array(5)
      .fill('')
      .map((item, index) => (
        <View key={index}>
          <View style={{flexDirection: 'row',alignItems:'center', marginBottom: 10}}>
            <ShimmerView
              style={{marginRight: 15, borderRadius: 50}}
              width={35}
              height={35}
            />
            <View style={{flex: 1}}>
              <ShimmerView style={{width: '85%', height: 14}} />
              <ShimmerView style={{width: '85%', height: 14}} />
            </View>
              <ShimmerView style={{width:15,height:15}}/>
          </View>
          <View style={{marginBottom: 10,backgroundColor:colors.cardBgColor,borderRadius:15}}>
            <View style={{width: '100%',borderRadius:20}} height={300} >
               <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:12,}}>
                  <ShimmerView style={{width: '10%', height: 14}} />
              <ShimmerView style={{width: '10%', height: 14}} />
               </View>
          </View>
          </View>
          <View style={{marginBottom: 10}}>
            <ShimmerView style={{width: '100%'}} height={14} />
            <ShimmerView style={{width: '100%'}} height={14} />
            <ShimmerView style={{width: '100%'}} height={14} />
          </View>
          <View style={{flexDirection:'row',alignItems:'center',marginBottom:14}}>
          <ShimmerView style={{width:15,height:15,marginRight:5}}/>
          <ShimmerView style={{width: '50%', height: 14}} />
          </View>
          <ScrollView style={{width: '100%', height: 100,borderRadius:15,padding:10,borderColor:colors.cardBgColor,borderWidth:2,marginBottom:18}}>       
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
             <ShimmerView style={{width: '45%', height: 15}} />
              <ShimmerView style={{width: '45%', height: 15}} />
              </View>
              <View style={{flexDirection:'row',justifyContent:'center'}}>
                <ShimmerView
              style={{borderRadius: 50}}
              width={45}
              height={45}
            /> 
            <View style={{}}>
             <ShimmerView style={{width: '90%', height: 15}} />
              <ShimmerView style={{width: '90%', height: 15}} />
          </View>
          <View style={{justifyContent:'center',marginRight:5}}>
              <ShimmerView style={{width:15,height:12}}/>
          </View>
          <View style={{}}>
           <ShimmerView style={{width: '90%', height: 15}} />
            <ShimmerView style={{width: '90%', height: 15}} />
            </View>
            <ShimmerView
              style={{borderRadius: 50}}
              width={45}
              height={45}
            />   
            </View>
          </ScrollView> 
        </View>
      ))}
  </ScrollView>
);

export default FeedsShimmer;
