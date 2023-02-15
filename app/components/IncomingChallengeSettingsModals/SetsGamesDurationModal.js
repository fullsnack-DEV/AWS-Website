// @flow
import React, {useRef} from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import CustomDropDown from './CustomDropDown';
import styles from './ModalStyles';

const SetsGamesDurationModal = ({gameDuration = {}, onChange = () => {}}) => {
  const inputRef = useRef();

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{strings.noOfSets}</Text>
      <CustomDropDown
        selectedValue={gameDuration?.total_sets}
        maxCount={19}
        parentStyle={{marginLeft: 0, marginBottom: 35}}
        listItemType={Verbs.countTypeSets}
        onSelect={(count) => {
          onChange({
            ...gameDuration,
            total_sets: count,
          });
        }}
      />
      <Text style={styles.title}>{strings.noOfGamesInSet}</Text>
      <CustomDropDown
        selectedValue={gameDuration?.total_available_games_in_set}
        maxCount={19}
        parentStyle={{marginLeft: 0, marginBottom: 35}}
        listItemType={Verbs.countTypeSets}
        onSelect={(count) => {
          onChange({
            ...gameDuration,
            total_available_games_in_set: count,
            game_count_to_win_set: (count + 1) / 2,
          });
        }}
      />

      <View style={{marginBottom: 35}}>
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: 10,
              marginBottom: 13,
              justifyContent: 'flex-start',
            },
          ]}>
          <TouchableOpacity
            style={[styles.radioContainer, {marginRight: 10}]}
            onPress={() => {
              onChange({
                ...gameDuration,
                win_set_by_two_games: !gameDuration?.win_set_by_two_games,
              });
            }}>
            {!gameDuration?.win_set_by_two_games ? (
              <Image source={images.radioCheckYellow} style={styles.image} />
            ) : (
              <Image source={images.radioUnselect} style={styles.image} />
            )}
          </TouchableOpacity>

          <Text style={styles.label}>{strings.winsSetByOneGame}</Text>
        </View>

        <View
          style={[
            styles.row,
            {
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
            },
          ]}>
          <TouchableOpacity
            style={[styles.radioContainer, {marginRight: 10}]}
            onPress={() => {
              onChange({
                ...gameDuration,
                win_set_by_two_games: !gameDuration?.win_set_by_two_games,
              });
            }}>
            {gameDuration?.win_set_by_two_games ? (
              <Image source={images.radioCheckYellow} style={styles.image} />
            ) : (
              <Image source={images.radioUnselect} style={styles.image} />
            )}
          </TouchableOpacity>

          <Text style={styles.label}>{strings.winsSetByTwoGames}</Text>
        </View>
        <View style={[styles.row, {justifyContent: 'flex-start'}]}>
          <View style={[styles.radioContainer, {marginRight: 10}]} />
          {gameDuration?.win_set_by_two_games ? (
            <View
              style={[
                styles.row,
                {
                  marginTop: 15,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.radioContainer,
                  {marginRight: 10, justifyContent: 'flex-start'},
                ]}
                onPress={() => {
                  onChange({
                    ...gameDuration,
                    apply_tiebreaker_in_game:
                      !gameDuration?.apply_tiebreaker_in_game,
                  });
                }}>
                {gameDuration?.apply_tiebreaker_in_game ? (
                  <Image source={images.orangeCheckBox} style={styles.image} />
                ) : (
                  <Image source={images.uncheckBox} style={styles.image} />
                )}
              </TouchableOpacity>
              <Text style={styles.label}>{strings.applyTimebreaker}</Text>
            </View>
          ) : null}
        </View>

        {gameDuration?.apply_tiebreaker_in_game ? (
          <View style={{marginLeft: 64, marginTop: 15}}>
            <Text style={[styles.label, {marginBottom: 10}]}>
              {strings.tieBreakerAppliedAt}
            </Text>
            <CustomDropDown
              selectedValue={gameDuration?.tiebreaker_apply_at}
              maxCount={29}
              parentStyle={{marginLeft: 0, marginBottom: 35}}
              listItemType={Verbs.countTypeRatio}
              onSelect={(count) => {
                onChange({
                  ...gameDuration,
                  tiebreaker_apply_at: count,
                });
              }}
            />

            <Text style={[styles.label, {marginBottom: 10}]}>
              {strings.winTieBreakerSetAt}
            </Text>
            <CustomDropDown
              selectedValue={gameDuration?.winning_point_in_tiebreaker}
              maxCount={99}
              prefix={strings.pointText}
              parentStyle={{marginLeft: 0, marginBottom: 35}}
              onSelect={(count) => {
                onChange({
                  ...gameDuration,
                  winning_point_in_tiebreaker: count,
                });
              }}
            />

            <View
              style={[
                styles.row,
                {
                  paddingHorizontal: 10,
                  marginBottom: 13,
                  justifyContent: 'flex-start',
                },
              ]}>
              <TouchableOpacity
                style={[styles.radioContainer, {marginRight: 10}]}
                onPress={() => {
                  onChange({
                    ...gameDuration,
                    win_two_points_in_tiebreaker:
                      !gameDuration?.win_two_points_in_tiebreaker,
                  });
                }}>
                {!gameDuration?.win_two_points_in_tiebreaker ? (
                  <Image
                    source={images.radioCheckYellow}
                    style={styles.image}
                  />
                ) : (
                  <Image source={images.radioUnselect} style={styles.image} />
                )}
              </TouchableOpacity>

              <Text style={styles.label}>
                {strings.winSetByOneInTieBreaker}
              </Text>
            </View>

            <View
              style={[
                styles.row,
                {
                  paddingHorizontal: 10,
                  justifyContent: 'flex-start',
                },
              ]}>
              <TouchableOpacity
                style={[styles.radioContainer, {marginRight: 10}]}
                onPress={() => {
                  onChange({
                    ...gameDuration,
                    win_two_points_in_tiebreaker:
                      !gameDuration?.win_two_points_in_tiebreaker,
                  });
                }}>
                {gameDuration?.win_two_points_in_tiebreaker ? (
                  <Image
                    source={images.radioCheckYellow}
                    style={styles.image}
                  />
                ) : (
                  <Image source={images.radioUnselect} style={styles.image} />
                )}
              </TouchableOpacity>

              <Text style={styles.label}>
                {strings.winSetByTwoInTieBreaker}
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{strings.maxMatchDuration}</Text>
      <CustomDropDown
        selectedValue={gameDuration?.match_duration}
        maxCount={99}
        parentStyle={{marginLeft: 0, marginBottom: 35}}
        listItemType={Verbs.countTypeTime}
        onSelect={(duration) => {
          onChange({
            ...gameDuration,
            match_duration: duration,
          });
        }}
      />

      <Text style={styles.inputLabel}>{strings.detailText}</Text>
      <Pressable
        style={[styles.inputContainer, {minHeight: 100, marginBottom: 10}]}
        onPress={() => {
          inputRef.current?.focus();
        }}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={strings.durationDetails}
          multiline
          onChangeText={(text) => {
            onChange({
              ...gameDuration,
              details: text,
            });
          }}
          value={gameDuration?.details}
          maxLength={50}
        />
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

export default SetsGamesDurationModal;
