import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Detail, Filter, Home, Make_A_Bid, My_Auctions, My_Auctions_Win, Search, Vitepay_confirm } from '../../../screens'
import { Header } from '../../../components'
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import { checking } from '../../redux/actions/user.action'
import { get_all_encheres_without_loading } from '../../redux/actions/enchere.action'

const HomeStack = ({ route }) => {
    const homStack = createNativeStackNavigator()

    const [screen, setScreen] = useState("")

    const { host } = useSelector(state => state?.user)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(checking())
    }, [dispatch, screen])

    const navigation = useNavigation()
    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route)
        setScreen(getFocusedRouteNameFromRoute(route))
        switch (routeName) {

            case "my_auctions":
            case "detail":
            case "make_a_bid":
            case "my_auctions_win":
            case "vitepay_confirm":
                navigation.setOptions({ tabBarStyle: { display: "none" } })
                break

            default:
                navigation.setOptions({ tabBarStyle: { display: "flex" } })
                break
        }
    }, [navigation, route])

    return (
        <homStack.Navigator screenOptions={{ header: ({ navigation }) => <Header navigation={navigation} stackHeader={true} />, }}>
            <homStack.Screen name="home" listeners={({ }) => ({ focus: () => dispatch(get_all_encheres_without_loading(host?._id)) })} component={Home} options={{ header: ({ navigation }) => <Header navigation={navigation} tabHeader={true} /> }} />
            <homStack.Screen name="detail" component={Detail} />
            <homStack.Screen name="make_a_bid" component={Make_A_Bid} />
            <homStack.Screen name="my_auctions" component={My_Auctions} />
            <homStack.Screen name="search" component={Search} options={{ headerShown: false }} />
            <homStack.Screen name="filter" component={Filter} />
            <homStack.Screen name="my_auctions_win" component={My_Auctions_Win} listeners={() => ({ focus: () => dispatch(get_all_encheres_without_loading(host?._id)) })} />
            <homStack.Screen name="vitepay_confirm" component={Vitepay_confirm} />
        </homStack.Navigator>
    )
}

export default HomeStack

const styles = StyleSheet.create({})