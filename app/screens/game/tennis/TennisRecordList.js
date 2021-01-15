import React, {
  useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import TennisMatchRecordsList from './TennisMatchRecordsList';

export default function TennisRecordList({ route, navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => alert('This is a 3 dot button!') }>
          <Image source={ images.vertical3Dot } style={ styles.headerRightImg } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  return (
    <TennisMatchRecordsList matchData={route?.params?.gameData}/>
  );
}

const styles = StyleSheet.create({
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
});
