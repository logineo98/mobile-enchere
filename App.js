import { Alert, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import RootNavigation from './src/libs/navigations/RootNavigation'
import { Provider } from 'react-redux'
import { Store } from './src/libs'
import messaging from '@react-native-firebase/messaging'

const App = () => {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    })

    return unsubscribe;
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={Store}><RootNavigation /></Provider>
  )
}

export default App

const styles = StyleSheet.create({})