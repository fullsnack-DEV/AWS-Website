import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
const {colors, fonts} = constants;
import ActivityLoader from '../../components/loader/ActivityLoader';
import { createReaction, getPostDetails, getReactions } from '../../api/NewsFeedapi';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import AsyncStorage from '@react-native-community/async-storage';

export default function NewsFeedList({navigation, postData, userID}) {
  const [loading, setloading] = useState(false);
  const [pullRefresh, setPullRefresh] = useState(false);
  const [data, setData] = useState(postData);

  return (
    <View>
      <ActivityLoader visible={loading} />
      <FlatList
        data={data.length > 0 ? data : postData}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginTop: 10,
              height: 8,
              backgroundColor: colors.postSeprator,
            }}
          />
        )}
        ListFooterComponent={() => (
          <View
            style={{
              height: 20,
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        renderItem={({item, key}) => {
          return (
            <NewsFeedPostItems 
              key={key}
              item={item}
              currentUserID={userID}
              navigation={navigation}
              onLikePress={() => {
                setloading(true);
                let bodyParams = {
                    "reaction_type": "clap",
                    "activity_id": item.id,
                }
                createReaction(bodyParams).then((res) => {
                    if (res.status == true) {
                    getPostDetails().then((response) => {
                        if (response.status == true) {
                        setData(response.payload.results);
                        } else {
                        alert(response.messages);
                        }
                        setloading(false);
                    });
                    } else {
                    setloading(false);
                    alert(res.messages);
                    }
                }, (error) => setloading(false))
                }}
            />
          );
        }}
        refreshing={pullRefresh}
        onRefresh={() => {
          setPullRefresh(true);
          getPostDetails().then((response) => {
            if (response.status == true) {
              setData(response.payload.results);
            } else {
              alert(response.messages);
            }
            setPullRefresh(false)
          }, (error) => setPullRefresh(false));
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    margin: wp('3%'),
    marginHorizontal: wp('4%'),
  },
  background: {
    height: hp('5%'),
    width: hp('5%'),
    borderRadius: hp('2.5%'),
  },
  dotImageTouchStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotImageStyle: {
    height: hp('2%'),
    width: hp('2%'),
    tintColor: colors.googleColor,
    margin: wp('1.5%'),
  },
  userNameView: {
    flexDirection: 'column',
    width: wp('70%'),
    marginLeft: wp('4%'),
  },
  userNameTxt: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  activeTimeAgoTxt: {
    color: colors.userPostTimeColor,
    top: 2,
    fontSize: 14,
    fontFamily: fonts.RRegular,
  },
  margin: {
    marginLeft: 10,
  },
  commentShareLikeView: {
    marginHorizontal: '4%',
    marginVertical: '2%',
    flexDirection: 'row',
  },
  imageTouchStyle: {
    height: hp('3%'),
    width: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentImage: {
    height: hp('2.5%'),
    width: hp('2.5%'),
    tintColor: colors.reactionCountColor,
  },
  commentlengthStyle: {
    fontSize: 14,
    marginHorizontal: 5,
    alignSelf: 'center',
    color: colors.reactionCountColor,
    fontFamily: fonts.RMedium,
  },
});
