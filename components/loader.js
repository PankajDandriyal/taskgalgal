import React from "react";
import { ActivityIndicator, View, Dimensions } from 'react-native';
import { COLORS } from "../utils/theme";
const { width, height } = Dimensions.get("window")
const ShowLoader = (props) => {
    return (
        <View style={{ height: height, width: width, position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 200 }} >
            <ActivityIndicator size={'large'} color={COLORS.blueviolet} />
        </View>
    )
}
export default ShowLoader
