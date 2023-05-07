import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View, TextInput, ImageBackground, StatusBar } from 'react-native'
import { CheckBox } from 'react-native-elements';
import { Container } from '../../../components'
import { Colors, _clear_errors, _clear_message, auth, css, handleChange, images, isEmpty, login, toastConfig } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation, route }) => {
    let routes = route?.params;
    const [remember, setRemember] = useState(false);
    const datas = { phone: "", password: "" }
    const [inputs, setInputs] = useState(datas)
    const dispatch = useDispatch()

    const { isAuth, errors, message, loading } = useSelector(state => state?.user);

    useEffect(() => {
        if (!isEmpty(routes?.phone) && routes?.phone !== undefined)
            setInputs(old => { return { ...old, phone: routes?.phone } })
    }, [routes])

    //notifications
    useEffect(() => {
        if ((!isEmpty(routes?.message) || message !== null)) {
            Toast.show({ type: 'info', text1: 'Infos', text2: routes?.message || message });
            if (routes?.message) routes.message = null
            dispatch({ type: "_clear_message" })
        }
    }, [routes, message])

    //verify if errors
    useEffect(() => {
        if ((!isEmpty(errors) || errors !== null) && errors !== undefined) {
            Toast.show({ type: 'danger', text1: 'Erreur', text2: errors });
            dispatch({ type: "_clear_errors" })
        }
    }, [errors])

    useEffect(() => {
        if (isEmpty(errors) && isAuth && isAuth !== undefined)
            auth()
    }, [isAuth])

    useEffect(() => {
        const autoremove = async () => {
            try {
                await AsyncStorage.removeItem("login");
            } catch (error) {
                console.log(error)
            }
        }
        if (!remember) autoremove()
    }, [remember])

    //fonction pour le dispatch du login
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            dispatch(login(inputs))
            if (remember) await AsyncStorage.setItem("login", JSON.stringify(inputs));
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
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"} contentContainerStyle={css.auth.scroll_container}>
                <View style={css.auth.main_content}>

                    <Container>
                        <View style={css.auth.auth_container}>
                            <Text style={css.auth.auth_title}>Veuillez vous identifier</Text>

                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Numéro de téléphone <Text style={css.auth.require}>*</Text></Text>

                                <View style={css.auth.phone_input_container}>
                                    <TouchableOpacity activeOpacity={0.7} style={css.auth.indicatif_input}><Text >+223</Text></TouchableOpacity>
                                    <Text style={{ borderRightWidth: 1, marginVertical: 9, borderRightColor: Colors.input_border_color }}></Text>
                                    <TextInput keyboardType="number-pad" style={[css.auth.input, css.auth.phone_input]}
                                        value={inputs.phone} onChangeText={text => handleChange('phone', text, setInputs)}
                                    />
                                </View>

                                {/* <InputHandleError message="" /> */}
                            </View>

                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Mot de passe <Text style={css.auth.require}>*</Text></Text>
                                <TextInput style={css.auth.input} secureTextEntry={true}
                                    value={inputs.password} onChangeText={text => handleChange('password', text, setInputs)}
                                />
                                {/* <InputHandleError message="" /> */}
                            </View>

                            <View style={css.auth.auth_forgot_container}>
                                <View style={css.auth.auth_remember}>
                                    <CheckBox
                                        title={"Se souvenir"}
                                        checked={remember ? "checked" : ""}
                                        onPress={() => setRemember(!remember)}
                                        containerStyle={css.auth.checkboxContainer}
                                        textStyle={css.auth.checkboxText}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate("forgot_password")} activeOpacity={0.5} style={css.auth.auth_forgot}><Text>Mot de passe oublié</Text></TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.7} style={css.auth.auth_submit_btn}>
                                <Text style={css.auth.auth_submit_btn_text}>Connecter</Text>
                            </TouchableOpacity>

                            <View style={css.auth.separator} />
                            <View style={css.auth.auth_bottom_container}>
                                <Text style={css.auth.auth_bottom_label}>Vous n'avez encore un compte?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("register")} style={css.auth.auth_bottom_register_link}>
                                    <Text style={css.auth.auth_bottom_register_link_text}>Inscrivez-vous</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Container>

                </View>
            </ScrollView>
        </ImageBackground>
    )
}

export default Login
