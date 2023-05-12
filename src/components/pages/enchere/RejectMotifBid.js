import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../libs'

const RejectMotifBid = ({ theme, data }) => {

    return (
        <View style={{ padding: 10, backgroundColor: theme === "sombre" ? Colors.black : Colors.white, width: "100%" }}>

            {data?.reject_motif?.title?.message &&
                <View style={{ flexDirection: "row", gap: 10, marginTop: 15 }}>
                    <Text style={{ color: Colors.black, width: "25%" }}>Titre :</Text>
                    <Text style={{ color: Colors.home_card, width: "70%" }}> {data?.reject_motif?.title?.message} </Text>
                </View>
            }

            {data?.reject_motif?.description?.message &&
                <View style={{ flexDirection: "row", gap: 10, marginTop: 15 }}>
                    <Text style={{ color: Colors.black, width: "25%" }}>Description :</Text>
                    <Text style={{ color: Colors.home_card, width: "70%" }}> {data?.reject_motif?.description?.message} </Text>
                </View>
            }

            {data?.reject_motif?.medias?.message &&
                <View style={{ flexDirection: "row", gap: 10, marginTop: 15 }}>
                    <Text style={{ color: Colors.black, width: "25%" }}>Medias :</Text>
                    <Text style={{ color: Colors.home_card, width: "70%" }}> {data?.reject_motif?.medias?.message} </Text>
                </View>
            }

            {data?.reject_motif?.started_price?.message &&
                <View style={{ flexDirection: "row", gap: 10, marginTop: 15 }}>
                    <Text style={{ color: Colors.black, width: "25%" }}>Prix initial :</Text>
                    <Text style={{ color: Colors.home_card, width: "70%" }}> {data?.reject_motif?.started_price?.message} </Text>
                </View>
            }

            {data?.reject_motif?.reserve_price?.message &&
                <View style={{ flexDirection: "row", gap: 10, marginTop: 15 }}>
                    <Text style={{ color: Colors.black, width: "25%" }}>Prix de reserve :</Text>
                    <Text style={{ color: Colors.home_card, width: "70%" }}> {data?.reject_motif?.reserve_price?.message} </Text>
                </View>
            }

            {data?.reject_motif?.increase_price?.message &&
                <View style={{ flexDirection: "row", gap: 10, marginTop: 15 }}>
                    <Text style={{ color: Colors.black, width: "25%" }}>Prix d'incrementation :</Text>
                    <Text style={{ color: Colors.home_card, width: "70%" }}> {data?.reject_motif?.increase_price?.message} </Text>
                </View>
            }
        </View>
    )
}

export default RejectMotifBid

const styles = StyleSheet.create({})