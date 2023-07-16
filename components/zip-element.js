import React, { memo } from "react";
import { TouchableOpacity,Text } from "react-native";

const ZipCodeElement = (props) =>{
    const handleSelectZIP = (item) => {
        props?.setZip(props?.item?.zipcode);
        props?.setCity(props?.item?.city);
        props?.setState(props?.item?.state);
        props?.setSuggestedZIPs([]);
      };
    
    return(
        <TouchableOpacity
        key={props?.index}
        onPress={() => handleSelectZIP(props?.item)}
      >
        <Text>{props?.item?.zipcode}</Text>
      </TouchableOpacity>
    )
}

export default memo(ZipCodeElement) 