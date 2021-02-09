import { View } from 'react-native';
import React from 'react';
import TCThickDivider from '../../../../components/TCThickDivider';
import PlaysInBio from './bio/PlaysInBio';
import PlaysInClubs from './clubs/PlaysInClubs';
import PlaysInLeagues from './leagues/PlaysInLeagues';
import PlaysInTeams from './teams/PlaysInTeams';
import PlaysInBasicInfo from './basicInfo/PlaysInBasicInfo';
import PlaysInNTRP from './ntrp/PlaysInNTRP';
import PlaysInHomePlace from './homePlace/PlaysInHomePlace';

const PlayInInfoView = ({
  currentUserData,
  isAdmin = false,
  closePlayInModal,
  sportName,
  onSave,
  navigation,
}) => (
  <View style={{ flex: 1 }}>
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
    <PlaysInNTRP
          onSave={onSave}
          sportName={sportName}
          isAdmin={isAdmin}
          currentUserData={currentUserData}
      />
    <TCThickDivider/>
    {/*  Home Place */}
    <PlaysInHomePlace
          onSave={onSave}
          sportName={sportName}
          isAdmin={isAdmin}
          currentUserData={currentUserData}
      />
    <TCThickDivider />

    {/*  Teams */}
    <PlaysInTeams
            sportName={sportName}
          closePlayInModal={closePlayInModal}
          navigation={navigation}
          isAdmin={isAdmin}
          currentUserData={currentUserData}
      />
    <TCThickDivider />

    {/* Clubs */}
    <PlaysInClubs
        sportName={sportName}
        closePlayInModal={closePlayInModal}
        navigation={navigation}
        isAdmin={isAdmin}
        currentUserData={currentUserData}
      />
    <TCThickDivider />

    {/* Leagues */}
    <PlaysInLeagues
        sportName={sportName}
          closePlayInModal={closePlayInModal}
          navigation={navigation}
          isAdmin={isAdmin}
          currentUserData={currentUserData}
      />
    <TCThickDivider />
  </View>
)

export default PlayInInfoView;
