import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import QB from 'quickblox-react-native-sdk';

import ActionSheet from 'react-native-actionsheet';
import styles from './style';

import {
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import AuthContext from '../../../auth/context';

import {getJoinedTeams} from '../../../api/Accountapi';

import * as Utility from '../../../utility/index';
import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';

export default function JoinedClubsScreen({navigation, route}) {
  const [clubList, setClubList] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    getJoinedTeams().then((response) => {
      if (response.status == true) {
        console.log('RESPONSE OF TEAM LIST::', response.payload);
        setClubList(response.payload.clubs);
      } else {
        alert(response.messages);
      }
    });
  }, []);

  return (
    <ScrollView style={styles.mainContainer}>
      <FlatList
        data={clubList}
        renderItem={({item, index}) => (
          <TouchableWithoutFeedback
            style={styles.listContainer}
            onPress={() => {
              console.log('Pressed club..');
            }}>
            <View>
              {item.full_image ? (
                <Image
                  source={{uri: item.full_image}}
                  style={styles.entityImg}
                />
              ) : (
                <Image source={PATH.club_ph} style={styles.entityImg} />
              )}
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.entityNameText}>{item.group_name}</Text>

              <Text style={styles.entityLocationText}>
                {item.city}, {item.state_abbr}, {item.country}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        // ItemSeparatorComponent={() => (
        //   <View style={styles.separatorLine}></View>
        // )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}
