import React, { useCallback } from 'react';
import {
View, StyleSheet, FlatList, Image,
} from 'react-native';
// import ActivityLoader from '../../components/loader/ActivityLoader';
// import AuthContext from '../../auth/context';
import { gameData } from '../../utils/constant';
import { widthPercentageToDP } from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import TCHiringPlayersCard from '../../components/TCHiringPlayersCard';

export default function HiringPlayerScreen() {
  // const [loading, setloading] = useState(false);

  // const authContext = useContext(AuthContext);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderRecentMatchItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCHiringPlayersCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={styles.searchView}>
        <View
          style={styles.searchViewContainer}>
          <Image
          source={images.arrowDown}
          style={styles.arrowStyle}
        />
        </View>
        <Image
          source={images.homeSetting}
          style={styles.settingImage}
        />
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
        keyExtractor={keyExtractor}
        renderItem={renderRecentMatchItems}
        style={styles.listViewStyle}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  listViewStyle: {
    width: '100%',
    height: 50,
    alignContent: 'center',
  },
  arrowStyle: {
    height: 26,
    width: 14,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginTop: 8,
    marginRight: 15,
  },
  searchViewContainer: {
    height: 40,
    width: widthPercentageToDP('86%'),
    borderRadius: 20,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    backgroundColor: colors.offwhite,
  },
  settingImage: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
});
