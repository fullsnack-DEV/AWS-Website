import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import API from 'apisauce';

import constants from '../../../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

import TCButton from '../../../components/TCButton';
import Separator from '../../../components/Separator';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import listing from '../../../api/listing';
import apiClient from '../../../api/client';
import useApi from '../../../hooks/useApi';
import Loader from '../../../components/loader/Loader';
import styles from "./style"
import * as Service from '../../../api/services'
import * as Url from '../../../api/Url'
function ChooseSportsScreen({navigation, route}) {
  const getSportsList = useApi(listing.getListing);

  const [sports, setSports] = useState([]);
  const [sportList, setListSport] = useState([]);
  var selectedSports = [];
  useEffect(() => {
    getSportsList.request().then(() => {
      loadSportsList1();
   getList()

    });
  }, []);
  getList=async()=>{
    let response=await Service.get(Url.GET_SPORT_URL)
 console.log("response",response.payload)
 setListSport(response.payload);


  }
  
  // loadSportsList1 = () => {
  //   var arr = [];
  //   for (var tempData of getSportsList.data.payload) {
  //     tempData['isChecked'] = false;
  //     arr.push(tempData);
  //   }
  //   setSports(arr);
  // };

  isIconCheckedOrNot = ({item, index}) => {
    console.log('SELECTED:::', index);

    sports[index].isChecked = !item.isChecked;

    setSports((sports) => [...sports]);

    for (let temp of sports) {
      if (temp.isChecked) {
        selectedSports.push(temp.sport_name);
      }
    }

    console.log('sports Checked ?:::', selectedSports);
  };

  renderItem = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        style={styles.listItem}
        onPress={() => {
          this.isIconCheckedOrNot({item, index});
        }}>
        {item.sport_name == 'Soccer' && (
          <Image source={PATH.footballSport} style={styles.sportImg} />
        )}
        {item.sport_name == 'Tennis' && (
          <Image source={PATH.bandySport} style={styles.sportImg} />
        )}
        {item.sport_name == 'Football' && (
          <Image source={PATH.footballSport} style={styles.sportImg} />
        )}
        {item.sport_name == 'Baseball' && (
          <Image source={PATH.baseballSport} style={styles.sportImg} />
        )}
        {item.sport_name == 'Volleyball' && (
          <Image source={PATH.archerySport} style={styles.sportImg} />
        )}

        <Text style={styles.sportList}>{item.sport_name}</Text>
        <View style={styles.checkbox}>
          {sports[index].isChecked ? (
            <Image source={PATH.checkWhite} style={styles.checkboxImg} />
          ) : (
            <Image source={PATH.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
        <Separator />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <Loader visible={getSportsList.loading} />
        <Image style={styles.background} source={PATH.orangeLayer} />
        <Image style={styles.background} source={PATH.bgImage} />

        <Text style={styles.sportText}>{strings.sportText}</Text>
        {/* <ActivityIndicator animating={loading} size="large" /> */}
        <FlatList
          data={sportList}
          keyExtractor={(sportList) => sportList.sport_name}
          renderItem={this.renderItem}
        />

        <TCButton
          title={strings.applyTitle}
          extraStyle={{position: 'absolute', bottom: hp('7%')}}
          onPress={() =>
            navigation.navigate('FollowTeams', {
              teamData: route.params.teamData,
              city: route.params.city,
              state: route.params.state,
              country: route.params.country,
              sports: selectedSports,
            })
          }
        />
      </View>
    </>
  );
}



export default ChooseSportsScreen;
