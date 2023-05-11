import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../libs'

const RejectMotifBid = ({ theme, data }) => {
    return (
        <View style={{ padding: 10, backgroundColor: theme === "sombre" ? Colors.black : Colors.white }}>
            <Text style={{ color: theme === "sombre" ? Colors.white : Colors.black }}> {data?.reject_motif} </Text>
        </View>
    )
}

export default RejectMotifBid

const styles = StyleSheet.create({})