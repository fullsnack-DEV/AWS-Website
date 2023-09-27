import { ScrollView, StyleSheet,View } from 'react-native'
import React from 'react'
import { ShimmerView } from '../commonComponents/ShimmerCommonComponents'

const ChatShimmer = () => (
    <ScrollView style={{padding: 15, flex: 1}}>
    {Array(15)
      .fill('')
      .map((item, index) => (
        <View key={index} style={styles.parent}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '60%'}}>
            <ShimmerView
              style={{marginRight: 15, borderRadius: 20}}
              width={40}
              height={40}
            />
            <View style={{flex: 1}}>
            <View  style={{flexDirection:'row'}}>
              <ShimmerView style={{width: '140%'}} />
               <ShimmerView style={{width: '4%',margin:7}}/>
             </View>
              <ShimmerView style={{width: '130%'}} />
            </View>
          </View>  
           <View style={{justifyContent:'flex-end',alignItems:'flex-end',}}>
          <ShimmerView style={{width: '40%'}} />
          <ShimmerView
              style={{borderRadius: 20}}
              width={20}
              height={20}
            />
        </View>
      </View>
      ))}
  </ScrollView>
  );
const styles = StyleSheet.create({
     parent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
})
export default ChatShimmer;