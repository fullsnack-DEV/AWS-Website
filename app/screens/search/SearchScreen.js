/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import TCSearchBox from '../../components/TCSearchBox';
import AllInOneGallery from '../home/AllInOneGallery';
import AuthContext from '../../auth/context';
import {getSportsList} from '../../api/Games';

const SearchScreen = ({navigation, route}) => {
  console.log('route value --->');
  console.log(route.params);
  const authContext = useContext(AuthContext);

  const [isAdmin] = useState(route?.params?.isAdmin);
  const [galleryRef] = useState(route?.params?.galleryRef);
  const [entityType] = useState(route?.params?.entityType);
  const [entityID] = useState(route?.params?.entityID);

  


  const [sports, setSports] = useState([]);

  useEffect(() => {
    getSportsList(authContext).then((res) => {
      const sport = [];
      res.payload.map((item) =>
        sport.push({
          label: item?.sport_name,
          value: item?.sport_name.toLowerCase(),
        }),
      );
      setSports([...sport]);
    });

    // if (isFocused) {
    //   setloading(true);
    //   getSportsList(authContext)
    //     .then((res) => {
    //       setloading(false);
    //       if (res.payload) {
    //         const arr = [
    //           {
    //             isChecked: true,
    //             sport_name: 'All',
    //           },
    //         ];
    //         for (const tempData of res.payload) {
    //           tempData.isChecked = false;
    //           arr.push(tempData);
    //         }
    //         setSports(arr);
    //         setTimeout(() => setloading(false), 1000);
    //       }
    //     })
    //     .catch((e) => {
    //       console.log('catch -> sports list api');
    //       setloading(false);
    //       setTimeout(() => {
    //         Alert.alert(strings.alertmessagetitle, e.message);
    //       }, 10);
    //     });
    // }
  }, [authContext]);

  const onPressSearchScreen = () => {
    navigation.navigate('EntitySearchScreen', {
      sportsList: sports,
    });
  };

  return (
    // <View>
    //   <TouchableOpacity onPress={onPressSearchScreen}>
    //     <View>
    //       <TCSearchBox
    //         alignSelf={'center'}
    //         marginTop={13}
    //         marginBottom={15}
    //         editable={false}
    //       />
    //     </View>
    //   </TouchableOpacity>
    <ScrollView style={styles.mainContainer}>
      <TouchableOpacity onPress={onPressSearchScreen}>
        <View>
          <TCSearchBox
            alignSelf={'center'}
            marginTop={13}
            marginBottom={15}
            editable={false}
          />
        </View>
      </TouchableOpacity>
      <AllInOneGallery
        isAdmin={isAdmin}
        ref={galleryRef}
        entity_type={
          ['user', 'player'].includes(entityType) ? 'player' : entityType
        }
        entity_id={entityID}
        showSubTabs={false}
      />
    </ScrollView>
    // </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
export default SearchScreen;
