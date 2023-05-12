import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Detail, My_Auctions, New_Auction, Vitepay_confirm } from '../../../screens'
import { Header } from '../../../components'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { checking } from '../../redux/actions/user.action'
import { useEffect } from 'react'
import { ExpirationVerify } from '../../utils/functions'
import { send_notification } from '../../redux/actions/notification.action'
import { edit_enchere } from '../../redux/actions/enchere.action'

const NewAuctionStack = ({ route }) => {
    const newAucStack = createNativeStackNavigator()
    const navigation = useNavigation()

    const [screen, setScreen] = useState("")

    const { encheres } = useSelector(state => state?.enchere)
    const { host, users } = useSelector(state => state?.user)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checking());

        encheres?.forEach(enchere => {
            if (ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_status !== "closed") {
                if (enchere?.history?.length > 0) {
                    users?.forEach(user => {
                        if (user?._id === enchere?.history[enchere?.history?.length - 1]?.buyerID) {
                            console.log("Enchere title : ", enchere?.title)
                            dispatch(send_notification({ title: "Alerte", body: "Vous avez remporté une enchère, veuillez aller dans profil, puis mes enchères remportées pour voir plus", to: user?.notification_token }))
                        }

                        if (enchere?.sellerID === user?._id) {
                            dispatch(send_notification({ title: "Alerte", body: "Vous avez une enchère qui a expiré, veuillez consulter pour plus d'information ", to: user?.notification_token }))
                        }
                    })
                    dispatch(edit_enchere(enchere?._id, host?._id, null, { enchere_status: "closed" }))
                } else {
                    users?.forEach(user => {
                        if (enchere?.sellerID === user?._id) {
                            dispatch(send_notification({ title: "Alerte", body: "Vous avez une enchère qui a expiré, veuillez consulter pour plus d'information ", to: user?.notification_token }))
                        }
                    })
                }
            }
        })
    }, [dispatch, screen]);

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        setScreen(getFocusedRouteNameFromRoute(route))
        switch (routeName) {
            case "my_auctions":
            case "detail":
            case "vitepay_confirm":
                navigation.setOptions({ tabBarStyle: { display: "none" } });
                break;

            default:
                navigation.setOptions({ tabBarStyle: { display: "flex" } });
                break;
        }
    }, [navigation, route]);

    return (
        <newAucStack.Navigator screenOptions={{ header: ({ navigation }) => <Header navigation={navigation} stackHeader={true} /> }}>
            <newAucStack.Screen name="new" component={New_Auction} options={{ header: ({ navigation }) => <Header navigation={navigation} tabHeader={true} /> }} />
            <newAucStack.Screen name="my_auctions" component={My_Auctions} />
            <newAucStack.Screen name="detail" component={Detail} />
            <newAucStack.Screen name="vitepay_confirm" component={Vitepay_confirm} />
        </newAucStack.Navigator>
    )
}

export default NewAuctionStack

const styles = StyleSheet.create({})