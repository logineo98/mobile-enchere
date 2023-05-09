import { StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Detail, Explore, Make_A_Bid, My_Auctions, Vitepay_confirm } from '../../../screens'
import { Header } from '../../../components'
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { checking } from '../../redux/actions/user.action'
import { get_all_encheres_without_loading } from '../../redux/actions/enchere.action'

const ExploreStack = ({ route }) => {
    const ExpStack = createNativeStackNavigator()
    const navigation = useNavigation()

    const [screen, setScreen] = useState("")

    const { host } = useSelector(state => state?.user)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(checking());
    }, [dispatch, screen]);

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        setScreen(getFocusedRouteNameFromRoute(route))

        switch (routeName) {
            case "my_auctions":
            case "detail":
            case "make_a_bid":
            case "my_auctions":
            case "vitepay_confirm":
                navigation.setOptions({ tabBarStyle: { display: "none" } });
                break;

            default:
                navigation.setOptions({ tabBarStyle: { display: "flex" } });
                break;
        }
    }, [navigation, route]);


    return (
        <ExpStack.Navigator screenOptions={{ header: ({ navigation }) => <Header navigation={navigation} stackHeader={true} /> }}>
            <ExpStack.Screen name="explore" listeners={() => ({ focus: () => dispatch(get_all_encheres_without_loading(host?._id)) })} component={Explore} options={{ header: ({ navigation }) => <Header navigation={navigation} tabHeader={true} /> }} />
            <ExpStack.Screen name="detail" component={Detail} />
            <ExpStack.Screen name="make_a_bid" component={Make_A_Bid} />
            <ExpStack.Screen name="my_auctions" component={My_Auctions} />
            <ExpStack.Screen name="vitepay_confirm" component={Vitepay_confirm} />
        </ExpStack.Navigator>
    )
}

export default ExploreStack

const styles = StyleSheet.create({})