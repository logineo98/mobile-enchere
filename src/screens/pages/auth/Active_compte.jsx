import { ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors, auth, css, images, isEmpty, signup, toastConfig } from '../../../libs'
import Toast from 'react-native-toast-message'
import { Container } from '../../../components'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Active_compte = ({ navigation, route }) => {
    const [code, setCode] = useState()
    const { login_succeed, errors, message, loading } = useSelector(state => state?.user);
    const dispatch = useDispatch();

    //notifications
    useEffect(() => {
        if (message) {
            Toast.show({ type: 'info', text1: 'Infos', text2: message });
            dispatch({ type: "_clear_message" })
        }
    }, [message])

    //verify if errors
    useEffect(() => {
        if ((!isEmpty(errors) || errors !== null) && errors !== undefined) {
            Toast.show({ type: 'danger', text1: 'Erreur', text2: errors });
            dispatch({ type: "_clear_errors" })
        }
    }, [errors])


    //auth is compte is active
    useEffect(() => {
        if (login_succeed && login_succeed !== undefined)
            dispatch(auth())
    }, [login_succeed, dispatch])




    //handle active compte
    const handleActivate = async (e) => {

        try {
            const codeData = await AsyncStorage.getItem("activation_code")
            const _code = JSON.parse(codeData)
            const inputsData = await AsyncStorage.getItem("inputs")
            const inputs = JSON.parse(inputsData)

            inputs.code = code
            inputs.activation_code = _code?.code;

            dispatch(signup(inputs))
        } catch (error) {
            console.log(error)
        }
    }

    if (loading)
        return <Spinner
            visible={loading}
            textContent={'Patienter...'}
            textStyle={{ color: Colors.white }}
            animation={'fade'}
            overlayColor={'rgba(0, 0, 0, 0.5)'}
        />

    return (
        <ImageBackground resizeMode="cover" source={images.background} style={css.auth.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.main} />
            <View style={{ position: "absolute", zIndex: 100, top: -30, left: "50%" }}>
                <Toast config={toastConfig} />
            </View>
            <ScrollView keyboardShouldPersistTaps={"handled"} showsVerticalScrollIndicator={false} contentContainerStyle={css.auth.scroll_container}>
                <View style={css.auth.main_content}>

                    <Container>
                        <View style={css.auth.auth_container}>
                            <Text style={css.auth.auth_title}>Activer votre compte</Text>

                            <Text style={css.auth.info_text}>Nous vous invitons à activer votre compte en inserant et en soumettant le code d'activation que vous avez reçu.</Text>

                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Code d'activation<Text style={css.auth.require}>*</Text></Text>
                                <TextInput style={css.auth.input} keyboardType='number-pad'
                                    value={code} onChangeText={text => setCode(text)}
                                />
                            </View>

                            <TouchableOpacity onPress={handleActivate} activeOpacity={0.7} style={css.auth.auth_submit_btn}>
                                <Text style={css.auth.auth_submit_btn_text}>Vérification</Text>
                            </TouchableOpacity>



                            <View style={css.auth.separator} />
                            <View style={css.auth.auth_bottom_container}>
                                <Text style={css.auth.auth_bottom_label}>Je possède déjà un compte</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("login")} style={css.auth.auth_bottom_register_link}>
                                    <Text style={css.auth.auth_bottom_register_link_text}>Connectez-vous</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Container>

                </View>
            </ScrollView>
        </ImageBackground>
    )
}

export default Active_compte

const styles = StyleSheet.create({})