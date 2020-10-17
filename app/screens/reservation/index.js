import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';
import constants from '../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../Constants/ImagePath';
import strings from '../../Constants/String';

import storage from '../../auth/storage';
import MatchReservation from '../../components/reservations/MatchReservation';
import { color } from 'react-native-reanimated';


export default function ReservationScreen({navigation, route}) {
const [selectedTab, setSelectedTab] = useState(0);

  return (
    <View style={styles.mainContainer}>
        <View style={styles.tabContainer}>
            <TouchableWithoutFeedback style={styles.upcomingTab} onPress={()=>{
                setSelectedTab(0);
            }}><View style={styles.upcomingTab}>
                {selectedTab === 0 ? <View><Text style={[styles.upcomingText,{color:colors.themeColor}]}>Upcoming</Text>
                    <View style={styles.selectedLine}/></View> : <View><Text style={styles.upcomingText}>Upcoming</Text>
                </View>} 
            </View>
               
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback style={styles.pastTab} onPress={()=>{
                setSelectedTab(1);
            }}>
                <View style={styles.pastTab}>
                {selectedTab === 1 ? <View>
                <Text style={[styles.pastText,{color:colors.themeColor}]}>Past</Text>
                <View style={styles.selectedLine}/>
                </View> : <View>
                <Text style={styles.pastText}>Past</Text>
                </View>}
                </View>
                
            </TouchableWithoutFeedback>
        </View>
        <ScrollView>
        {/* <Loader visible={true} /> */} 
        <MatchReservation/>
        <MatchReservation/>
        <MatchReservation/>
        <MatchReservation/>
        <MatchReservation/>
        <MatchReservation/>
      </ScrollView>
    </View>
  );
}