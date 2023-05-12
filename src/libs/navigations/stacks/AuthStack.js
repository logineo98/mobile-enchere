import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Active_compte, Forgot_Password, Login, Register, Reset_Password, Verification_Code_De_Confirmation } from '../../../screens'
import { Colors } from '../../constants/Typography'

const AuthStack = () => {
    const autStack = createNativeStackNavigator()

    return (
        <autStack.Navigator>
            <autStack.Screen name="login" component={Login} options={{ headerShown: false }} />
            <autStack.Screen name="register" component={Register} options={{ headerShown: false }} />
            <autStack.Screen name="forgot_password" component={Forgot_Password} options={{ title: "Mot de passe oublié", headerTintColor: Colors.white, headerStyle: { backgroundColor: Colors.main }, }} />
            <autStack.Screen name="verification_code_de_confirmation" component={Verification_Code_De_Confirmation} options={{ title: "Code de confirmation", headerTintColor: Colors.white, headerStyle: { backgroundColor: Colors.main }, }} />
            <autStack.Screen name="reset_password" component={Reset_Password} options={{ headerTitle: 'Réinitialiser le mot passe', headerTintColor: Colors.white, headerStyle: { backgroundColor: Colors.main }, }} />
            <autStack.Screen name="activate_compte" component={Active_compte} options={{ headerTitle: 'Activation du compte', headerTintColor: Colors.white, headerStyle: { backgroundColor: Colors.main }, }} />
        </autStack.Navigator>

    )
}

export default AuthStack