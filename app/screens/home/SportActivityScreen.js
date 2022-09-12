/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useContext, useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import * as Utility from '../../utils';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

import TCThinDivider from '../../components/TCThinDivider';
import {getUserDetails} from '../../api/Users';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {strings} from '../../../Localization/translation';

export default function SportActivityScreen({navigation}) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [userObject, setUserObject] = useState();

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getUserDetails(authContext?.entity?.uid, authContext)
        .then((response) => {
          setloading(false);
          setUserObject(response.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSports = ({item}) => (
    <View>
      <TouchableWithoutFeedback
        style={styles.listContainer}
        onPress={() => {
          navigation.navigate('ActivitySettingScreen', {sport: item});
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.listItems}>
            {Utility.getSportName(item, authContext)}
          </Text>
          <Image source={images.nextArrow} style={styles.nextArrow} />
        </View>
      </TouchableWithoutFeedback>
      <TCThinDivider width="95%" />
    </View>
  );

  return (
    <ScrollView>
      <ActivityLoader visible={loading} />
      {userObject?.registered_sports?.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Playing</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={userObject?.registered_sports
              ?.filter((obj) => obj.is_active)
              .sort((a, b) => a.sport.localeCompare(b.sport))}
            keyExtractor={keyExtractor}
            renderItem={renderSports}
          />
        </View>
      )}

      {userObject?.referee_data?.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Refereeing</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={userObject?.referee_data
              ?.filter((obj) => obj.is_active)
              .sort((a, b) => a.sport.localeCompare(b.sport))}
            keyExtractor={keyExtractor}
            renderItem={renderSports}
          />
        </View>
      )}

      {userObject?.scorekeeper_data?.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Scorekeepering</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={userObject?.scorekeeper_data
              ?.filter((obj) => obj.is_active)
              .sort((a, b) => a.sport.localeCompare(b.sport))}
            keyExtractor={keyExtractor}
            renderItem={renderSports}
          />
        </View>
      )}

      <View style={styles.listDeactivateContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('DeactivatedSportsListScreen');
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.listItemsTitle}>
              {strings.deactivatedSportsActivities}
            </Text>
            <Image source={images.nextArrow} style={styles.nextArrow} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  listTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.blackColor,
    marginBottom: 15,
  },
  listContainer: {
    margin: 15,
  },
  listDeactivateContainer: {
    marginRight: 15,
  },

  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  listItemsTitle: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.blackColor,
    alignSelf: 'center',
  },

  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
  },
});
