import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {Button} from 'react-native-elements'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import {Provider} from 'react-redux';
import {store} from './redux/store'; 
import Auth from './components/auth.component'
import {decode, encode} from 'base-64'
// import {auth} from './firebase/firebase.utils';
import auth from '@react-native-firebase/auth';
import {navigationRef, isMountedRef, navigate} from './RootNAvigation'
import SplashScreen from 'react-native-splash-screen';

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }


const Stack = createStackNavigator();




const   App = () => {

    const [initialRoute, setInitialRoute] = useState('Login')
    
    useEffect(()=> {
      SplashScreen.hide();
    })


    useEffect(()=>{
      isMountedRef.current=true;

      return () => (isMountedRef.current =false)

    },[]);

    return (
      <Provider store={store}>
        
        <Auth/>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen name='Login' component={LoginScreen}/>
            <Stack.Screen 
            name='ChatList' 
            component={ChatListScreen} 
            options={({navigation}) => ({headerRight:()=>(
              <Button titleStyle={{color:'black'}} type='clear' onPress={()=>{
                auth().signOut()
                navigation.navigate('Login')
              }} title='Sign Out'/>
            )})}/>
            <Stack.Screen name='Chat' component={ChatScreen}  options={({navigation})=>({headerRight:()=>(
              <Button titleStyle={{color:'black'}} type='clear' onPress={()=>{
                auth().signOut()
                navigation.navigate('Login')
              }} title='Sign Out'/>
            )})}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
  )
}


export default App;
