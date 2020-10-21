import React, {
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Image,

} from 'react-native';

import TCScrollableTabs from '../../../components/reservations/TCScrollableTabs';
import TCSearchBox from '../../../components/reservations/TCSearchBox';

import images from '../../../Constants/ImagePath'

export default function GroupMembers() {
  const [searchText, setSearchText] = useState('');
  return (
      <View style={styles.mainContainer}>

          <TCScrollableTabs>
              <View tabLabel='Members' style={{ flex: 1 }}>
                  <View style={styles.searchBarView}>
                      <TCSearchBox value={searchText} onChangeText={(text) => setSearchText(text)}/>
                      <Image source={ images.filterIcon } style={ styles.filterImage } />
                  </View>
              </View>
              <View tabLabel='Followers' style={{ flex: 1 }}></View>
          </TCScrollableTabs>
      </View>
  );
}
const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  filterImage: {
    marginLeft: 10,
    alignSelf: 'center',
    height: 25,
    resizeMode: 'contain',
    width: 25,
  },
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20,
  },
});
