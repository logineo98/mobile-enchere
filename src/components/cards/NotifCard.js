import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../libs'
import moment from 'moment'

const NotifCard = ({ notifs }) => {

    return (
        <TouchableOpacity style={styles.container}>
            <View style={{ padding: 10 }}>
                <Text style={{ lineHeight: 22, fontWeight: 100 }}>{notifs?.body}</Text>
                <Text style={{ fontSize: 10, fontStyle: "italic", textAlign: "right" }}>{moment(notifs?.date).fromNow()}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NotifCard

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderColor: Colors.input_border_color, paddingHorizontal: 20, borderRadius: 5, marginVertical: 10,
        backgroundColor: "lightblue"
    }
})