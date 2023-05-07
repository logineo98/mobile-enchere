import React, { useState } from 'react'
import { ScrollView, ImageBackground, TextInput, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { Container, InputHandleError } from '../../../components'
import { Colors, _clear_errors, _clear_message, css, handleChange, images, isEmpty, reset_forgot_password, toastConfig } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message';
import { useEffect } from 'react'
import Spinner from 'react-native-loading-spinner-overlay'

const Reset_Password = ({ navigation, route }) => {
    const routes = route?.params;
    const datas = { password: "", confirm: "" }
    const [inputs, setInputs] = useState(datas)
    const dispatch = useDispatch();
    const { errors, message, reset_succeed, loading } = useSelector(state => state?.user);

    //notification
    useEffect(() => {
        if (!isEmpty(routes?.message) && routes?.message !== undefined) {
            Toast.show({ type: 'info', text1: 'Infos', text2: routes?.message });
            routes.message = ""
        }
    }, [routes])

    //verify if errors
    useEffect(() => {
        if ((!isEmpty(errors) || errors !== null) && errors !== undefined) {
            Toast.show({ type: 'danger', text1: 'Erreur', text2: errors });
            dispatch({ type: "_clear_errors" })
        }
    }, [errors])


    //redirection, si reussi
    useEffect(() => {
        if (!isEmpty(reset_succeed) && reset_succeed && message !== null)
            navigation.navigate('login', { message, phone: reset_succeed?.phone });
    }, [reset_succeed])

    //soumission de la requette
    const handleSubmit = (e) => {
        e.preventDefault()
        inputs.phone = routes?.phone
        dispatch(reset_forgot_password(inputs))
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
                            <Text style={css.auth.auth_title}>Réinitialiser le mot de passe</Text>

                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Mot de passe <Text style={css.auth.require}>*</Text></Text>
                                <TextInput secureTextEntry={true} style={css.auth.input}
                                    value={inputs.password} onChangeText={text => handleChange('password', text, setInputs)}
                                />
                                <InputHandleError message="" />
                            </View>

                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Confirmer le mot de passe <Text style={css.auth.require}>*</Text></Text>
                                <TextInput style={css.auth.input} secureTextEntry={true}
                                    value={inputs.confirm} onChangeText={text => handleChange('confirm', text, setInputs)}
                                />
                                <InputHandleError message="" />
                            </View>

                            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.7} style={css.auth.auth_submit_btn}>
                                <Text style={css.auth.auth_submit_btn_text}>Réinitialiser</Text>
                            </TouchableOpacity>

                            <View style={css.auth.separator} />

                            <View style={css.auth.auth_bottom_container}>
                                <Text style={css.auth.auth_bottom_label}>Je possède déjà un compte.</Text>
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

export default Reset_Password




