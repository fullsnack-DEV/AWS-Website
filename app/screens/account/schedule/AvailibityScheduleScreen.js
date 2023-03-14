import React, {useEffect, useState, useContext} from 'react';
import {
    Text, 
    View, 
    Image, 
    ScrollView, 
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import images from '../../../Constants/ImagePath';
import WeeklyCalender from './CustomWeeklyCalender';
import AuthContext from '../../../auth/context';
import {editSlots , deleteEvent} from '../../../api/Schedule';
import Verbs from '../../../Constants/Verbs';
import colors from '../../../Constants/Colors';
import ChallengeAvailability from './ChallengeAvailability';
import * as Utility from '../../../utils/index';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';



export default function AvailibilityScheduleScreen({
    allSlots,
    onDayPress,
    userData = {}
}){
    const [weeklyCalender, setWeeklyCalender] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState(allSlots);
    const [slots, setSlots] = useState([]);
    const [slotList, setSlotList] = useState([]);
    const [blockedDaySlots , setBlockedDaySlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editableSlots, setEditableSlots] = useState([]);
    const [editableSlotsType, setEditableSlotsType] = useState(true);
    const [visibleAvailabilityModal, setVisibleAvailabilityModal] = useState(false);
    
    const authContext = useContext(AuthContext);
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole = entity.role === Verbs.entityTypeUser ? 'users' : 'groups';   

    useEffect(() => {
        setAllData(allSlots)
    },[]);
    
    
    useEffect(() => {
        
        prepareSlotArray(selectedDate)

        const blocked = []
        allSlots.forEach((obj) => {
            if (obj.allDay) {
                blocked.push(moment.unix(obj.start_datetime).format('YYYY-MM-DD'));
            }
        });
        setBlockedDaySlots(blocked);
    }, [allData, selectedDate]);


    useEffect(() => {
        setSlotList(slots);
        const tempAvailableSlots = [];
        const tempBlockedSlots = [];
        slots.forEach((item) => {
            if(!item.blocked) {
                tempAvailableSlots.push(item)
            }else{
                tempBlockedSlots.push(item);
            }
        });
        if(tempAvailableSlots.length === 0) {
            setEditableSlotsType(false);
            setEditableSlots(tempBlockedSlots);
        }else{
            setEditableSlotsType(true);
            setEditableSlots(tempAvailableSlots);
        }
    }, [slots]);




    const prepareSlotArray = (dateObj = {}, newItem = {}) => {
        
        const start = new Date(dateObj);
        start.setHours(0, 0, 0, 0);
        const temp = [];
        const tempSlot = [...allData];
      
        if(Object.entries(newItem).length > 0 ){
            tempSlot.push(newItem)
        }

        for (const blockedSlot of tempSlot) {
            const eventDate = Utility.getJSDate(blockedSlot.start_datetime);
            eventDate.setHours(0, 0, 0, 0);
            if (
            eventDate.getTime() === start.getTime() &&
            blockedSlot.blocked === true
            ) {
            temp.push(blockedSlot);
            }
        }

        let timeSlots = [];
        let availableSlots = [];

        if (temp?.[0]?.allDay === true && temp?.[0]?.blocked === true) {
            setSlots(temp);
        } else {
            timeSlots = createCalenderTimeSlots(Utility.getTCDate(start), 24, temp);
            setSlots(timeSlots);
            availableSlots = getAvailableSlots(timeSlots , dateObj);
        }

        setAvailableSlots(availableSlots);
    }




    const getAvailableSlots = (timeSlots , dateObj) => {
        let availableSlots = [];
        timeSlots.forEach((item) => {
            if(!item.blocked) {
                availableSlots.push(item);
            }
        });

        let formattedAvailableSLots = [];
        const start = new Date(dateObj);
        start.setHours(0, 0, 0, 0);
        availableSlots.forEach((item,index) => {
            let tempSlot = {};
            let minutes = Math.ceil((item.end_datetime - item.start_datetime)/60);
            let minutePercent = Math.ceil((minutes / 1440) * 100);
            
            let gap = Math.ceil((item.start_datetime - (start.getTime() / 1000))/60);
            let gapPercent = Math.ceil((gap / 1440) * 100);

            tempSlot['width'] = minutePercent;
            tempSlot['marginLeft'] = gapPercent;

            formattedAvailableSLots.push(tempSlot)
        });

        return formattedAvailableSLots;
    }



    const addToSlotData = (data) => {
        const tempData = [...allData];
        data.forEach((item1) => {
            let matched = false;
            allData.forEach((item2, key) => {
                if(item1.start_datetime <= item2.end_datetime && item1.end_datetime > item2.end_datetime) {
                    tempData[key].end_datetime = item1.end_datetime;
                    matched = true;
                }else if(item1.end_datetime >= item2.start_datetime && item1.start_datetime < item2.end_datetime) {
                    tempData[key].start_datetime = item1.start_datetime;
                    matched = true;
                }
            })
            if(!matched) {
                tempData.push(item1);  
            }
        });
        setAllData(tempData);
    }



    const deleteFromSlotData = (data) => {
        const tempData = [...allData];
        data.forEach((item1) => {
            allData.forEach((item2, key) => {
                if(item1.start_datetime > item2.start_datetime && item1.start_datetime < item2.end_datetime) {
                    tempData[key].end_datetime = item1.start_datetime;
                }else if(item1.end_datetime > item2.start_datetime && item1.end_datetime < item2.end_datetime) {
                    tempData[key].start_datetime = item1.end_datetime;
                }else if(item1.start_datetime <= item2.start_datetime && item1.end_datetime >= item2.end_datetime) {
                    tempData.splice(key, 1);
                }
            });
        });
        setAllData(tempData);
    }


    const createCalenderTimeSlots = (startTime, hours, mslots) => {
        const tSlots = [];
        let startSlotTime = startTime;
        const lastSlotTime = startTime + hours * 60 * 60;
        let last_blocked_index = 0;
        const blockedSlots = mslots.sort((a,b) => (
          new Date(a.start_datetime) - new Date(b.start_datetime)
        ));

    
        blockedSlots.forEach((blockedSlot) =>  {
          if (lastSlotTime > blockedSlot?.start_datetime) {
            if(startTime === blockedSlot?.start_datetime) {
              tSlots.push({
                start_datetime: blockedSlot.start_datetime,
                end_datetime: blockedSlot.end_datetime,
                blocked: true,
                cal_id: blockedSlot?.cal_id,
                owner_id : blockedSlot?.owner_id
              });
              startSlotTime = blockedSlot.end_datetime;
              return;
            }
    
            if(startSlotTime !== blockedSlot?.start_datetime) {
              tSlots.push({
                start_datetime: startSlotTime,
                end_datetime: blockedSlot?.start_datetime,
                blocked: false,
                cal_id: blockedSlot?.cal_id,
                owner_id : blockedSlot?.owner_id
              });
    
              tSlots.push({
                start_datetime: blockedSlot.start_datetime,
                end_datetime: blockedSlot.end_datetime,
                blocked: true,
                cal_id: blockedSlot?.cal_id,
                owner_id : blockedSlot?.owner_id
              });
              
              startSlotTime = blockedSlot.end_datetime;
              return;
            }
            
            last_blocked_index = tSlots.length  - 1;
            tSlots[last_blocked_index].end_datetime = blockedSlot.end_datetime;
            startSlotTime = blockedSlot.end_datetime;
          }
        })
    
        if(startSlotTime !== lastSlotTime) {
          tSlots.push({
            start_datetime: startSlotTime,
            end_datetime: lastSlotTime,
            blocked: false,
          });
        }
    
        if(tSlots.length === 0 ) {
          tSlots[0].allDay = true;
        }
    
        return tSlots;
    };



    const deleteSlot = async(obj) => {
        setLoading(true);
        const cal_id = obj.cal_id
        await deleteFromSlotList(cal_id);
        deleteEvent(entityRole, uid, cal_id, authContext)
        .then(() => {
          setTimeout(() => {
            setLoading(false);
            onDayPress(selectedDate);
          }, 5000);
        })
        .catch((error) => {
          setLoading(false);
          console.log('Error ::--', error);
        });
    }


    const  deleteFromSlotList = (cal_id) => {
        const tempSlot = [...allSlots]
        const index = tempSlot.findIndex((item) => (
          item.cal_id === cal_id
        ));
        allSlots.splice(index,1);
        setAllData([...allSlots]);
    }

    
    const createSlot = async(obj) => {
        console.log('UID', uid)
        setLoading(true);
        const tempObj = {...obj}
        tempObj.blocked = true;
        const newObj = tempObj
        const filterData = [newObj]
        editSlots(entityRole, uid, filterData, authContext)
        .then(async(result) => {
            prepareSlotArray(selectedDate , result.payload[0]);
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        })
        .catch((error) => {
          setLoading(false);
          console.log('Error ::--', error);
        });
    }



    const datesBlacklistFunc = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];
    
        while (start <= end) {
          dates.push(new Date(start));
          start.setDate(start.getDate() + 1);
        }
    
        return dates;
    };
    


    const LeftArrow = () => (
        <>
            <View style={{
                width : 25, 
                height: 25,
                backgroundColor: '#f5f5f5',
                borderRadius: 5
            }}>
                <Image 
                source={images.leftArrow}
                style={{width : 8, height: 15, marginLeft: 7, marginTop: 5}}
                />
            </View>
        </>
    )
    

    const RightArrow = () => (
        <>
            <View style={{
                width : 25, 
                height: 25,
                backgroundColor: '#f5f5f5',
                borderRadius: 5
            }}>
                <Image 
                source={images.rightArrow}
                style={{width : 8, height: 15, marginLeft: 10, marginTop: 5}}
                />
            </View>
        </>
    )


    const today = moment();
    const day = today.clone().startOf('month');
    const customDatesStyles = []
    while(day.isSame(today, 'year')) {

        let backgroundColorWrapper;
        let background_color;
        let text_color;

        if(moment(selectedDate).format('YYYY-MM-DD') === moment(new Date(day.clone())).format('YYYY-MM-DD')) {
            backgroundColorWrapper = colors.themeColor;
            background_color = colors.themeColor;
            text_color = colors.whiteColor;
        }else if(blockedDaySlots.includes(moment(day.clone()).format('YYYY-MM-DD'))) {
            backgroundColorWrapper = colors.lightGrey;
            background_color = colors.lightGrey;
            text_color = colors.whiteColor;
        }else if(moment(new Date()).format('YYYY-MM-DD') === moment(new Date(day.clone())).format('YYYY-MM-DD')) {
            if(moment(new Date()).format('YYYY-MM-DD') !== moment(selectedDate).format('YYYY-MM-DD')) {
                backgroundColorWrapper = colors.whiteColor;
            }else{
                backgroundColorWrapper = colors.themeColor;
            }
            background_color = colors.whiteColor;
            text_color = colors.themeColor;
        }
        else{
            background_color = colors.whiteColor;
            text_color = 'green';
        }

        customDatesStyles.push({
            date: day.clone(),
            containerStyle : {
                borderRadius: 5,
                padding: 0 , 
                width: 35,
                height: 35,
                backgroundColor : backgroundColorWrapper,
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 8,
                marginRight: 8
            },
            style:{
                backgroundColor : background_color,
                borderRadius: 5,
            },
            textStyle: {
                color: text_color
            }
        })

        day.add(1, 'day');
    }

    return (
        <>
        <ScrollView style={{backgroundColor: '#fff'}}>
            <ActivityLoader visible={loading} />
            <View
            style={{
                marginBottom: 10,
            }}>
                <View 
                style={{
                    marginTop: 10, 
                    paddingTop: 10,
                    position: 'relative'
                }}>
                    <View 
                    style={{
                        width : 75, 
                        height: 30,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 5,
                        position: 'absolute',
                        right: 10,
                        top: 12,
                        zIndex: 9999
                    }}>
                        <TouchableOpacity onPress={()  => setWeeklyCalender(!weeklyCalender)}>
                            <Image 
                            source={images.toggleCal}
                            style={{width : 65, height: 30, marginLeft: 5}}
                            />
                        </TouchableOpacity>
                    </View>
                    {
                        weeklyCalender ? (
                            <WeeklyCalender 
                                blockedDaySlots={blockedDaySlots}
                                colors={colors} 
                                onDayPress={onDayPress}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                        ):(
                            <CalendarPicker
                                headerWrapperStyle={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    paddingLeft : 15
                                }}
                                monthYearHeaderWrapperStyle={{
                                    backgroundColor: '#fff',
                                }}
                                previousComponent={<LeftArrow/>}
                                nextComponent={<RightArrow/>}
                                dayShape='square'
                                dayLabelsWrapper={{
                                    borderTopColor: colors.whiteColor,
                                    borderBottomColor : colors.whiteColor,
                                    shadowOpacity  : 0 ,
                                    color: colors.whiteColor
                                }}
                                onDateChange={(date) => {
                                    setSelectedDate(date)
                                    onDayPress(date)
                                }}
                                disabledDates={datesBlacklistFunc(
                                    new Date().setFullYear(new Date().getFullYear() - 25),
                                    new Date().setDate(new Date().getDate() - 1),
                                    )}
                                selectedDayStyle={{
                                   backgroundColor: colors.themeColor,
                                   color: '#fff'
                                }}
                                initialDate={new Date(selectedDate)}
                                customDatesStyles={customDatesStyles}
                                todayTextStyle={{
                                    color: moment(new Date()).format('YYYY-MM-DD') === moment(new Date(selectedDate)).format('YYYY-MM-DD') ? 
                                    colors.whiteColor : colors.themeColor,
                                }}
                                selectedDayTextColor="white"
                            />
                        )
                    }
                </View>
            </View>

            <View
            style={{
                borderBottomColor: '#eee',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}
            />

            {/* Availibility bottom view */}
            <View>
                <Text
                    style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    color: colors.lightBlackColor,
                    margin: 15,
                    }}>
                    {strings.availableTimeForChallenge}
                </Text>
                <View style={{position: 'relative', width:'100%', paddingHorizontal: '8%'}}>
                    <View style={{justifyContent:'space-between', flexDirection: 'row'}}>
                        <Text>0</Text>
                        <Text style={{marginLeft: 5}}>6</Text>
                        <Text style={{marginLeft: 5}}>12</Text>
                        <Text style={{marginLeft: 5}}>18</Text>
                        <Text>24</Text>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            height: 20,
                            marginVertical: 10,
                            borderRadius: 2,
                            borderColor: '#f5f5f5',
                            borderWidth: 1,
                            backgroundColor: '#f5f5f5',
                        }}
                    />
                    {
                    availableSlots.map((item) => (
                    <>
                        <View
                            style={{
                                width: `${item.width}%`,
                                height: 20,
                                marginVertical: 10,
                                borderRadius: 2,
                                backgroundColor: '#70D486',
                                position: 'absolute',
                                left: `${item.marginLeft + 9.5}%`,
                                top:17
                            }}
                        />
                    </>
                    ))}
                </View>
                <ScrollView >
                    {
                        slotList.map((item , key) => (
                            <BlockSlotView
                                key={key}
                                item={item}
                                startDate={item.start_datetime}
                                endDate={item.end_datetime}
                                allDay={item.allDay === true}
                                index={key}
                                slots={slotList}
                                strings={strings}
                                deleteSlot={deleteSlot}
                                createSlot={createSlot}
                                userData={userData}
                                uid={uid}
                            />
                        ))
                    }
                </ScrollView>
            </View>

            {
            (Object.entries(userData).length > 0 && userData.user_id === uid) || 
            Object.entries(userData).length === 0 ? (
                <View 
                style={{
                    flexDirection : 'row', 
                    justifyContent: 'center',
                    marginTop: 10,
                    marginBottom: 40
                }}>
                    <TouchableOpacity 
                        onPress={() => 
                        setVisibleAvailabilityModal(true)
                    }
                    >
                        <Text 
                        style={{
                            textDecorationLine: 'underline',
                            textDecorationStyle: 'solid',
                            textDecorationColor: '#000'
                        }}>Edit Availability</Text>
                    </TouchableOpacity>
                </View>
            ): null}
        </ScrollView>
        

        {/*  Availability modal */}
        <Modal
           isVisible={visibleAvailabilityModal}
           backdropColor="black"
           style={{margin: 0, justifyContent: 'flex-end'}}
           hasBackdrop
            onBackdropPress={() => { 
                setVisibleAvailabilityModal(false);
            }}
            backdropOpacity={0}>
            <SafeAreaView style={styles.modalMainViewStyle}>
                <ChallengeAvailability 
                    setVisibleAvailabilityModal={setVisibleAvailabilityModal}
                    slots = {editableSlots}
                    slotType = {editableSlotsType}
                    setEditableSlotsType = {setEditableSlotsType}
                    addToSlotData={addToSlotData}
                    deleteFromSlotData={deleteFromSlotData}
                />
            </SafeAreaView>
        </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    modalMainViewStyle: {
        shadowOpacity: 0.15,
        shadowOffset: {
          height: -10,
          width: 0,
        },
        backgroundColor: colors.whiteColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: Dimensions.get('window').height - 50,

    }
});