import { Alert, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import RootNavigation from './src/libs/navigations/RootNavigation'
import { Provider } from 'react-redux'
import { Store, toastConfig } from './src/libs'
import messaging from '@react-native-firebase/messaging'
// import Toast from 'react-native-toast-message'
// import { toastConfig2 } from './src/libs/constants/Typography'

const App = () => {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      const notif = remoteMessage.notification
      const data = remoteMessage.data
      // Toast.show({ type: data.type === "success" ? "success" : 'info', text1: "Notifications", text2: notif?.body, visibilityTime: 8000, })
      Alert.alert("Notifications", notif?.body, [{ text: "D'accord" }])
    })

    return unsubscribe
  }, [])


  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => { })
  }, [])

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <>
      {/* <View style={{ position: "absolute", zIndex: 100, top: 0, left: "50%" }}>
        <Toast config={toastConfig2} />
      </View> */}
      <Provider store={Store}><RootNavigation /></Provider>
    </>
  )
}

export default App

const styles = StyleSheet.create({})