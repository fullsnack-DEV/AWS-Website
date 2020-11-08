import React, {
  useEffect, useState,
} from 'react';
import {
  View, Text, Image, TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { getJoinedGroups } from '../../api/Groups';

import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts'
import colors from '../../Constants/Colors'

export default function JoinedClubsScreen() {
  const [clubList, setClubList] = useState([]);

  useEffect(() => {
    getJoinedGroups().then((response) => {
      setClubList(response.payload.clubs);
    }).catch((error) => {
      Alert.alert(error)
    })
  }, []);

  return (
    <ScrollView style={ styles.mainContainer }>
      <FlatList
        data={ clubList }
        renderItem={ ({ item }) => (
          <TouchableWithoutFeedback
            style={ styles.listContainer }
            onPress={ () => {
              console.log('Pressed club..');
            } }>
            <View>
              {item.full_image ? (
                <Image
                  source={ { uri: item.full_image } }
                  style={ styles.entityImg }
                />
              ) : (
                <Image source={ images.club_ph } style={ styles.entityImg } />
              )}
            </View>

            <View style={ styles.textContainer }>
              <Text style={ styles.entityNameText }>{item.group_name}</Text>

              <Text style={ styles.entityLocationText }>
                {item.city}, {item.state_abbr}, {item.country}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ) }
        // ItemSeparatorComponent={() => (
        //   <View style={styles.separatorLine}></View>
        // )}
        scrollEnabled={ false }
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({

  entityImg: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 10,

    borderWidth: 1,
    height: 60,
    margin: 15,
    resizeMode: 'cover',
    width: 60,
  },
  entityLocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: wp('3.8%'),
    marginTop: 5,
  },
  entityNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },

  textContainer: {
    height: 80,
    justifyContent: 'center',
  },
});
