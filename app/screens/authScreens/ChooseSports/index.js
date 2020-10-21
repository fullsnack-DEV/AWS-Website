import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
} from 'react-native';

import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { getSportsList, createUser, getuserDetail } from '../../../api/Authapi';

import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import TCButton from '../../../components/TCButton';
import Separator from '../../../components/Separator';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import * as Utility from '../../../utils/index';
import styles from './style';

function ChooseSportsScreen({ navigation, route }) {
  const [sports, setSports] = useState([]);
  const [selected, setSelected] = useState([]);
  // For activity indigator
  const [loading, setloading] = useState(true);

  const authContext = useContext(AuthContext);
  const selectedSports = [];

  useEffect(() => {
    getSportsList().then((response) => {
      setloading(true);
      if (response.status === true) {
        console.log('response', response.payload);

        const arr = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const tempData of response.payload) {
          tempData.isChecked = false;
          arr.push(tempData);
        }
        setSports(arr);
      } else {
        Alert.alert(response.messages);
      }
      setloading(false);
    });
  }, []);

  const isIconCheckedOrNot = ({ item, index }) => {
    console.log('SELECTED:::', index);

    sports[index].isChecked = !item.isChecked;

    setSports([...sports]);

    // eslint-disable-next-line no-restricted-syntax
    for (const temp of sports) {
      if (temp.isChecked) {
        selectedSports.push(temp.sport_name);
      }
    }

    setSelected(selectedSports);
  };

  const signUpWithTC = async () => {
    const user = await Utility.getStorage('userInfo');

    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      thumbnail: '',
      full_image: '',
      sports: selected,
      city: route.params.city,
      state_abbr: route.params.state,
      country: route.params.country,
    };

    createUser(data).then((response) => {
      setloading(true);
      if (response.status === true) {
        console.log('PAYLOAD::', JSON.stringify(response));
        getUserInfo();
      } else {
        alert(response.messages);
      }
      setloading(false);
    });
  };
  const getUserInfo = async () => {
    setloading(true);
    const uid = await Utility.getStorage('UID');
    getuserDetail(uid).then(async (response) => {
      if (response.status === true) {
        await Utility.setStorage('user', response.payload);
        authContext.setUser(response.payload);
      } else {
        console.log(response);
        alert('Something went wrong..!!');
      }
      setloading(false);
    });
  };

  renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => {
          isIconCheckedOrNot({ item, index });
        } }>
      {item.sport_name === 'Soccer' && (
        <Image source={ images.footballSport } style={ styles.sportImg } />
      )}
      {item.sport_name === 'Tennis' && (
        <Image source={ images.bandySport } style={ styles.sportImg } />
      )}
      {item.sport_name === 'Football' && (
        <Image source={ images.footballSport } style={ styles.sportImg } />
      )}
      {item.sport_name === 'Baseball' && (
        <Image source={ images.baseballSport } style={ styles.sportImg } />
      )}
      {item.sport_name === 'Volleyball' && (
        <Image source={ images.archerySport } style={ styles.sportImg } />
      )}

      <Text style={ styles.sportList }>{item.sport_name}</Text>
      <View style={ styles.checkbox }>
        {sports[index].isChecked ? (
          <Image source={ images.checkWhite } style={ styles.checkboxImg } />
        ) : (
          <Image source={ images.uncheckWhite } style={ styles.checkboxImg } />
        )}
      </View>
      <Separator />
    </TouchableWithoutFeedback>
  );

  return (
    <>
      <View style={ styles.mainContainer }>
        <ActivityLoader visible={ loading } />
        {/* <Loader visible={getSportsList.loading} /> */}
        <Image style={ styles.background } source={ images.orangeLayer } />
        <Image style={ styles.background } source={ images.bgImage } />

        <Text style={ styles.sportText }>{strings.sportText}</Text>
        {/* <ActivityIndicator animating={loading} size="large" /> */}
        <FlatList
          data={ sports }
          keyExtractor={ (item) => item.sport_name }
          renderItem={ this.renderItem }
        />

        <TCButton
          title={ strings.applyTitle }
          extraStyle={ { position: 'absolute', bottom: hp('7%') } }
          onPress={ () => {
            if (route.params && route.params.teamData) {
              navigation.navigate('FollowTeams', {
                teamData: route.params.teamData,
                city: route.params.city,
                state: route.params.state,
                country: route.params.country,
                sports: selected,
              });
            } else {
              signUpWithTC();
            }
          } }
        />
      </View>
    </>
  );
}

export default ChooseSportsScreen;
