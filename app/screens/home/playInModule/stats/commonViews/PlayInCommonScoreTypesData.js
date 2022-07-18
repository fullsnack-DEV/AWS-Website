import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import colors from '../../../../../Constants/Colors';
import StatsGradiantView from '../../../../../components/Home/StatsGradiantView';

const PlayInCommonScoreTypesData = ({game_data}) => {
  const [gameData, setGameData] = useState(game_data);

  return (
    <View style={{marginTop: 20}}>
      <FlatList
        data={gameData}
        horizontal={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        style={{paddingVertical: 5}}
        ListHeaderComponent={() => <View style={{marginHorizontal: 10}} />}
        ListFooterComponent={() => <View style={{marginHorizontal: 10}} />}
        ItemSeparatorComponent={() => <View style={{marginHorizontal: 8}} />}
        renderItem={({item}) => (
          <StatsGradiantView
            title={item.title}
            topGradiantColor1={
              item.isSelected ? colors.orangeColor : colors.whiteColor
            }
            bottomGradiantColor1={
              item.isSelected ? colors.yellowColor : colors.lightgrayColor
            }
            topGradiantColor2={
              item.isSelected ? colors.orangeColor : colors.whiteColor
            }
            bottomGradiantColor2={
              item.isSelected ? colors.yellowColor : colors.lightgrayColor
            }
            sourceImage={item.isSelected ? item.selectImage : item.image}
            counterNumber={item.total}
            onItemPress={() => {
              // gameData.map((gameItem) => {
              //     const gameValue = gameItem;
              //     if (gameValue.id === item.id) {
              //         gameValue.isSelected = true;
              //     } else {
              //         gameValue.isSelected = false;
              //     }
              //     return null;
              // })
              setGameData([...gameData]);
            }}
            counterTextStyle={{
              color: item.isSelected ? colors.whiteColor : colors.orangeColor,
            }}
            titleTextStyle={{
              color: item.isSelected
                ? colors.whiteColor
                : colors.lightBlackColor,
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default PlayInCommonScoreTypesData;
