import {View} from 'react-native';
import React, {memo} from 'react';
import TCThickDivider from '../../../../components/TCThickDivider';
import PlaysInBio from './bio/PlaysInBio';
import PlaysInClubs from './clubs/PlaysInClubs';
import PlaysInLeagues from './leagues/PlaysInLeagues';
import PlaysInTeams from './teams/PlaysInTeams';
import PlaysInBasicInfo from './basicInfo/PlaysInBasicInfo';
import PlaysInNTRP from './ntrp/PlaysInNTRP';
import PlaysInHomePlace from './homePlace/PlaysInHomePlace';
import {heightPercentageToDP as hp} from '../../../../utils';

const PlayInInfoView = ({
  currentUserData,
  isAdmin = false,
  closePlayInModal,
  sportName,
  sportType,
  onSave,
  navigation,
  openPlayInModal,
}) => (
  <View style={{flex: 1, paddingBottom: hp(10)}}>
    {/*  Bio */}
    <PlaysInBio
      onSave={onSave}
      sportName={sportName}
      isAdmin={isAdmin}
      currentUserData={currentUserData}
    />
    <TCThickDivider />

    {/* Basic Info */}
    <PlaysInBasicInfo
      onSave={onSave}
      isAdmin={isAdmin}
      currentUserData={currentUserData}
    />
    <TCThickDivider />

    {/*  NTRP */}
    {sportName === 'tennis' &&
    (sportType === 'double' || sportType === 'single') ? (
      <>
        <PlaysInNTRP
          onSave={onSave}
          sportName={sportName}
          sportType={sportType}
          isAdmin={isAdmin}
          currentUserData={currentUserData}
        />
        <TCThickDivider />
      </>
    ) : null}

    {/*  Home Place */}
    {sportName === 'tennis' ? (
      <>
        <PlaysInHomePlace
          onSave={onSave}
          sportName={sportName}
          sportType={sportType}
          isAdmin={isAdmin}
          currentUserData={currentUserData}
        />
        <TCThickDivider />
      </>
    ) : null}

    {/*  Teams */}
    <PlaysInTeams
      openPlayInModal={openPlayInModal}
      sportName={sportName}
      closePlayInModal={closePlayInModal}
      navigation={navigation}
      isAdmin={isAdmin}
      currentUserData={currentUserData}
    />
    <TCThickDivider />

    {/* Clubs */}
    <PlaysInClubs
      openPlayInModal={openPlayInModal}
      sportName={sportName}
      closePlayInModal={closePlayInModal}
      navigation={navigation}
      isAdmin={isAdmin}
      currentUserData={currentUserData}
    />
    <TCThickDivider />

    {/* Leagues */}
    <PlaysInLeagues
      openPlayInModal={openPlayInModal}
      sportName={sportName}
      closePlayInModal={closePlayInModal}
      navigation={navigation}
      isAdmin={isAdmin}
      currentUserData={currentUserData}
    />
    <TCThickDivider />
  </View>
);

export default memo(PlayInInfoView);
