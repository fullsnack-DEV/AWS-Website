import React, {useContext} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AuthContext from '../../auth/context';

import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import StatsContentScreen from './SportActivity/contentScreens/StatsContentScreen';

const EntityStatScreen = ({route, navigation}) => {
  const {entityData} = route.params;
  const authContext = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.containerStyle}>
      <ScreenHeader
        title={strings.stats}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        rightIcon2={images.chat3Dot}
      />
      <StatsContentScreen
        sportType={entityData?.sport_type}
        sport={entityData?.sport}
        authContext={authContext}
        userId={entityData?.group_id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
});

export default EntityStatScreen;
