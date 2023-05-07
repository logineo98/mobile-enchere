


import React, { useRef, useState } from 'react'
import { ImageBackground, StatusBar, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Container, InputHandleError } from '../../../components'
import { Colors, _clear_errors, _clear_message, css, forgot, images, isEmpty, toastConfig, verify_confirm_code } from '../../../libs'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay'
import OtpInputs from 'react-native-otp-textinput';

const Verification_Code_De_Confirmation = ({ navigation, route }) => {
    const routes = route?.params
    const [code, setCode] = useState('');
    const dispatch = useDispatch();
    const { errors, phone, code_is_correct, message, loading } = useSelector(state => state?.user);



    useEffect(() => {
        if (!isEmpty(routes?.message) && !isEmpty(phone) && phone !== undefined) {
            Toast.show({ type: 'info', text1: 'Infos', text2: routes?.message });
            routes.message = ""
        }
    }, [phone, routes])

    //verify if errors
    useEffect(() => {
        if ((!isEmpty(errors) || errors !== null) && errors !== undefined) {
            Toast.show({ type: 'danger', text1: 'Erreur', text2: errors });
            dispatch({ type: "_clear_errors" })
        }
    }, [errors])

    //rediriger vers reset password si code est correct
    useEffect(() => {
        if (code_is_correct && phone !== null && message !== null)
            navigation.navigate('reset_password', { message, phone });
    }, [code_is_correct, message])


    //confirm le code
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(verify_confirm_code({ code, phone }))
    }

    //renvoi de code
    const handleResend = (e) => {
        dispatch(forgot({ plateforme: "android", phone }))
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
                            <Text style={css.auth.auth_title}>Confirmer le numéro de téléphone</Text>

                            <Text style={css.auth.info_text}>Un code vous sera envoyé par sms sur le numéro <Text style={{ color: Colors.info, fontSize: 14 }}>79364153.</Text></Text>

                            <Text style={{ marginVertical: 5, fontSize: 17, fontWeight: 200 }}>Veuillez inscrire le code</Text>
                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Code de confirmation <Text style={css.auth.require}>*</Text></Text>
                                <OtpInputs autoFocus={true} handleTextChange={otp => setCode(otp)} inputCount={4} tintColor={Colors.main} offTintColor={Colors.secondary} textInputStyle={css.auth.code_item} />
                            </View>
                            <InputHandleError message={""} />

                            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.7} style={css.auth.auth_submit_btn}>
                                <Text style={css.auth.auth_submit_btn_text}>Confirmer</Text>
                            </TouchableOpacity>

                            <View style={{ width: "100%", height: 1, backgroundColor: Colors.main, marginTop: 30 }} />

                            <TouchableOpacity style={css.auth.auth_bottom_container} onPress={handleResend}>
                                <Text>Vous n'avez pas réçu de code? Veuillez verifier et <Text style={css.auth.auth_bottom_register_link_text}>réessayer</Text></Text>
                            </TouchableOpacity>
                        </View>
                    </Container>
                </View>
            </ScrollView>
        </ImageBackground>

    )
}

export default Verification_Code_De_Confirmation






