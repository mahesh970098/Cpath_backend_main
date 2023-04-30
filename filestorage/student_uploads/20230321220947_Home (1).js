import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Profile from './BottomScreen/Profile';
import Otp from '../login/Otp';
import Play from './BottomScreen/Play';
import Wallet from './BottomScreen/Wallet';
const Tab = createBottomTabNavigator();

const Home = () => {
const[color,setColor] = useState('');

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 75,
          position: 'absolute',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: iconColor => {
            return (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../../assets/Images/Profile_Icon.png')}
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: iconColor.focused ? '#006C8E' : '#7E7E7E',
                  }}
                />

                <View 
                  style={{
                    
                    backgroundColor: '#006C8E',
                    height: 27,
                    width: 72,
                    marginTop: 10,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  
                  <Text style={{color: 'white'}}>Profile</Text>
                </View>
              </View>
            );
          },
        }}
        name="Profile"
        component={Profile}
      />

      <Tab.Screen
        options={{
          tabBarIcon: iconColor => {
            return (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../../assets/Images/Monkey1.png')}
                  style={{
                    height: 25,
                    width: 36,
                   
                  }}
                />

                <View
                  style={{
                    backgroundColor: '#006C8E',
                    height: 27,
                    width: 72,
                    marginTop: 10,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'white'}}>Play</Text>
                </View>
              </View>
            );
          },
        }}
        name="Play"
        component={Play}
      />


<Tab.Screen
        options={{
          tabBarIcon: iconColor => {
            return (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../../assets/Images/Wallet_Icon.png')}
                  style={{
                    height: 25,
                    width: 25,
                    tintColor : iconColor.focused?'#006C8E':'#7E7E7E'
                    
                  }}
                />

                <View
                  style={{
                    backgroundColor: '#006C8E',
                    height: 27,
                    width: 72,
                    marginTop: 10,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'white'}}>Wallet</Text>
                </View>
              </View>
            );
          },
        }}
        name="Wallet"
        component={Wallet}
      />







    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    backgroundColor: 'pink',
  },
});

export default Home;
