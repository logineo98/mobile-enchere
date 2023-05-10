import React, { useEffect, useState } from 'react'
import { ImageBackground, StatusBar, Text, ScrollView, TouchableOpacity, View, TextInput } from 'react-native'
import { Colors, _clear_errors, _clear_user_registered, checking_phone, css, handleChange, images, isEmpty, register, toastConfig } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo'
import { Container, Separateur } from '../../../components'
import Spinner from 'react-native-loading-spinner-overlay';
import authen from '@react-native-firebase/auth';
import { LoginManager, AccessToken, } from 'react-native-fbsdk-next';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeModal from 'react-native-modal';
import messaging from '@react-native-firebase/messaging'

const Register = ({ navigation }) => {
    const datas = { phone: "", password: "", password_confirm: "", facebook: null }
    const { account_activation_code, errors, message, loading } = useSelector(state => state?.user)
    const [inputs, setInputs] = useState(datas)
    const dispatch = useDispatch();

    //verify if errors
    useEffect(() => {
        if ((!isEmpty(errors) || errors !== null) && errors !== undefined) {
            Toast.show({ type: 'danger', text1: 'Erreur', text2: errors });
            dispatch({ type: "_clear_errors" })
        }
    }, [errors])

    //redirect to activation form when we receive the code
    useEffect(() => {
        if (account_activation_code !== null && account_activation_code)
            navigation.navigate("activate_compte", { message: message })
    }, [account_activation_code])


    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    //login facebook
    const loginBtnFb = async () => {
        try {
            // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) throw 'User cancelled the login process';

            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) throw 'Something went wrong obtaining access token';

            // Create a Firebase credential with the AccessToken
            const facebookCredential = authen.FacebookAuthProvider.credential(data.accessToken);

            // Sign-in the user with the credential
            const ans = await authen().signInWithCredential(facebookCredential);
            const toStore = { id: ans.additionalUserInfo.profile.id, first_name: ans.additionalUserInfo.profile.first_name, last_name: ans.additionalUserInfo?.profile?.last_name, picture_url: ans.additionalUserInfo.profile.picture.data.url }

            setInputs(old => { return { ...old, facebook: toStore } })
        } catch (error) {
            console.log(error)
        }

    }

    //soumission de la requette
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            let notification_token = await messaging().getToken()
            inputs.notification_token = notification_token
            await AsyncStorage.setItem("inputs", JSON.stringify(inputs))
            dispatch(checking_phone(inputs))
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
            color={Colors.white}
        />

    return (
        <ImageBackground resizeMode="cover" source={images.background} style={css.auth.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.main} />
            <View style={{ position: "absolute", zIndex: 100, top: -30, left: "50%" }}>
                <Toast config={toastConfig} />
            </View>

            <ReactNativeModal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={{ height: "50%", backgroundColor: Colors.white }}>
                    <Text>Informations</Text>

                    <Text>ooooooooooooooooooo</Text>
                </View>
            </ReactNativeModal>

            <ScrollView keyboardShouldPersistTaps={"handled"} showsVerticalScrollIndicator={false} contentContainerStyle={css.auth.scroll_container}>
                <View style={css.auth.main_content}>

                    <Container>
                        <View style={css.auth.auth_container}>
                            <Text style={[css.auth.auth_title, { alignItems: "center" }]}>Créer votre compte
                                <TouchableOpacity onPress={toggleModal}><Entypo name="info-with-circle" style={{ paddingLeft: 10 }} size={16} color={Colors.black} /></TouchableOpacity>
                            </Text>

                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Numéro de téléphone <Text style={css.auth.require}>*</Text></Text>

                                <View style={css.auth.phone_input_container}>
                                    <TouchableOpacity activeOpacity={0.7} style={css.auth.indicatif_input}><Text >+223</Text></TouchableOpacity>
                                    <Text style={{ borderRightWidth: 1, marginVertical: 9, borderRightColor: Colors.input_border_color }}></Text>
                                    <TextInput keyboardType="number-pad" style={[css.auth.input, css.auth.phone_input]}
                                        value={inputs.phone} onChangeText={text => handleChange('phone', text, setInputs)}
                                    />
                                </View>

                                {/* <InputHandleError message={error?.phone} /> */}
                            </View>

                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Mot de passe <Text style={css.auth.require}>*</Text></Text>
                                <TextInput style={css.auth.input} secureTextEntry={true}
                                    value={inputs.password} onChangeText={text => handleChange('password', text, setInputs)}
                                />
                                {/* <InputHandleError message={error?.password || error?.password_confirm} /> */}
                            </View>

                            <View style={css.auth.input_container}>
                                <Text style={css.auth.input_label}>Confirmer le mot de passe <Text style={css.auth.require}>*</Text></Text>
                                <TextInput style={css.auth.input} secureTextEntry={true}
                                    value={inputs.password_confirm} onChangeText={text => handleChange('password_confirm', text, setInputs)}
                                />
                                {/* <InputHandleError message={error?.password_confirm} /> */}
                            </View>







                            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.7} style={[css.auth.auth_submit_btn]}>
                                <Text style={css.auth.auth_submit_btn_text}>S'inscrire</Text>
                            </TouchableOpacity>

                            <Separateur text={"Synchronisation avec"} />

                            <View style={css.auth.input_container}>
                                <TouchableOpacity onPress={() => loginBtnFb()} activeOpacity={0.5} style={[{ padding: 13, borderRadius: 5, backgroundColor: Colors.facebook, flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 10 },]}>
                                    <View style={{ height: 30, width: 30, borderRadius: 5, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center" }}>
                                        <Image source={images.facebook} style={{ height: 30, width: 30 }} />
                                    </View>
                                    <Text style={[{ color: Colors.white }]}>Facebook{(!isEmpty(inputs?.facebook) && inputs?.facebook !== undefined) && " synchronisé"}</Text>
                                </TouchableOpacity>
                            </View>

                            {(!isEmpty(inputs?.facebook) && inputs?.facebook !== undefined) &&
                                <TouchableOpacity onPress={() => setInputs(old => { return { ...old, facebook: null } })} style={{ alignItems: "center" }}>
                                    <Text>Annuler la synchronisation.</Text>
                                </TouchableOpacity>}



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

export default Register