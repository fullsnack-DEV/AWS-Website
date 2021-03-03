import React, { useCallback } from 'react';
import {
 View, StyleSheet, FlatList, Image,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';

// import AuthContext from '../../auth/context';

import TCEntityView from '../../components/TCEntityView';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import { widthPercentageToDP } from '../../utils';

export default function RefereesListScreen() {
  // const [loading, setloading] = useState(false);

  // const authContext = useContext(AuthContext);

  const renderRefereesScorekeeperListView = useCallback(
    () => (
      <View style={[styles.separator, { flex: 1 / 4 }]}>
        <TCEntityView showStar={true}/>
      </View>

    ),
    [],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <View
      style={{
        height: 10,
      }}
    />
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
          numColumns={4}
          showsHorizontalScrollIndicator={false}
          data={[
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ]}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={keyExtractor}
          renderItem={renderRefereesScorekeeperListView}
          style={styles.listStyle}
        />

    </View>
  );
}
const styles = StyleSheet.create({
  listStyle: { marginLeft: 15 },

   separator: {
    borderRightWidth: 20,
    borderColor: colors.whiteColor,
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
