// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../../../../Localization/translation';
import TeamCard from '../../../../components/TeamCard';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import StatsGraph from '../components/StatsGraph';

const StatsContentScreen = ({sportType = ''}) => (
  <ScrollView style={styles.parent}>
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>
            {sportType === Verbs.singleSport
              ? strings.totalMatches.toUpperCase()
              : strings.matchesTitleText.toUpperCase()}{' '}
            0
          </Text>
        </View>
        <TouchableOpacity style={styles.dropDownContainer}>
          <Text style={styles.dropDownLabel}>{strings.past6Months}</Text>
          <Image
            source={images.dropDownArrow}
            style={{width: 10, height: 10, marginLeft: 5}}
          />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 20}}>
        {sportType === Verbs.singleSport ? (
          <Text style={styles.label}>{strings.total} 0</Text>
        ) : (
          <Text style={styles.label}>{format(strings.playedMatches, 0)}</Text>
        )}

        <StatsGraph
          total={0}
          wins={0}
          losses={0}
          draws={0}
          showTotalMatches={false}
          containerStyle={{alignItems: 'center'}}
        />
      </View>
    </View>
    {sportType === Verbs.singleSport ? (
      <>
        <View style={styles.dividor} />
        {/* TC Level & Points */}
        <View style={[styles.container, {paddingTop: 0}]}>
          <Text style={[styles.title, {marginBottom: 15}]}>
            {strings.tcLevelPointsText}
          </Text>
          <View style={[styles.row, {marginBottom: 15}]}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>
                {strings.tcLevel}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                0
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>
                {strings.tcpoint}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                0
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.dividor} />

        {/* TC Ranking */}
        <View style={[styles.container, {paddingTop: 0}]}>
          <Text style={[styles.title, {marginBottom: 15}]}>
            {strings.tcranking}
          </Text>
          <View style={[styles.row, {marginBottom: 15}]}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>Vancouver</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                7th
              </Text>
            </View>
          </View>
          <View style={[styles.row, {marginBottom: 15}]}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>BC</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                24th
              </Text>
            </View>
          </View>
          <View style={[styles.row, {marginBottom: 15}]}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>Canada</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                100th
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>
                {strings.world}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                -
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.dividor} />

        {/* DM Rate */}
        <View style={[styles.container, {paddingTop: 0}]}>
          <View style={[styles.row, {marginBottom: 15}]}>
            <View style={[styles.row, {justifyContent: 'center'}]}>
              <Text style={styles.title}>{strings.dmRate}</Text>
              <TouchableOpacity style={styles.infoIcon}>
                <Image source={images.infoIcon} style={styles.image} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.dropDownContainer}>
              <Text style={styles.dropDownLabel}>{strings.past6Months}</Text>
              <Image
                source={images.dropDownArrow}
                style={{width: 10, height: 10, marginLeft: 5}}
              />
            </TouchableOpacity>
          </View>

          <View style={{alignItems: 'center', marginBottom: 15}}>
            <Text style={[styles.label, {marginBottom: 10}]}>
              {strings.dmsText}/{strings.dtsText}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBar,
                  {width: '10%', backgroundColor: colors.googleColor},
                ]}
              />
            </View>
            <Text style={[styles.label, {marginTop: 10, marginBottom: 0}]}>
              4%
            </Text>
          </View>

          <View style={[styles.row, {marginBottom: 15}]}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>
                {strings.totalMatches}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                -
              </Text>
            </View>
          </View>
          <View style={[styles.row, {marginBottom: 15}]}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>
                {strings.dmsText}{' '}
                <Text style={styles.lightText}>
                  ({strings.disputedMatches})
                </Text>
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                -
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor: colors.grayBackgroundColor,
              marginBottom: 15,
            }}
          />
          <View style={styles.row}>
            <View>
              <Text style={(styles.label, {marginBottom: 0})}>
                {strings.dtsText}{' '}
                <Text style={styles.lightText}>
                  ({strings.dmsText} + {strings.totalMatches})
                </Text>
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                -
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.dividor} />
      </>
    ) : (
      <View style={styles.teamList}>
        <Text style={[styles.label, {fontFamily: fonts.RBold}]}>
          {format(strings.playedInTeams, 1)}
        </Text>

        <TeamCard
          item={{
            group_name: 'Volleyball Whitecaps FC',
            city: 'Bangkok, Thailand ',
          }}
          iconStyle={{backgroundColor: colors.whiteColor}}
          locationTextStyle={{fontFamily: fonts.RBold, lineHeight: 24}}
        />
      </View>
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  parent: {
    // flex: 1,
  },
  container: {
    // flex: 1,
    paddingHorizontal: 15,
    paddingTop: 22,
  },
  teamList: {
    marginTop: 25,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: colors.lightGrayBackground,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  dropDownContainer: {
    padding: 5,
    borderRadius: 25,
    backgroundColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.googleColor,
    marginBottom: 15,
  },
  dividor: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoIcon: {
    width: 15,
    height: 15,
    borderRadius: 8,
    marginLeft: 5,
  },
  lightText: {
    fontSize: 12,
    lineHeight: 24,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RMedium,
  },
  progressBar: {
    width: '100%',
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.grayBackgroundColor,
  },
});
export default StatsContentScreen;
