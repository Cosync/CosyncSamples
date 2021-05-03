import React, { useState} from 'react'; 
import {  View,  StyleSheet,  Text } from 'react-native';
import uuid from 'react-native-uuid';
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "react-native-vector-icons/FontAwesome";

const EnumList = props => {

    const { item, index, hideIcon, ...attributes } = props; 

    let options = [];
    item.enumValues.map(value => (
      options.push( { label: value, value: value})
    )) 

    return(  

        <View style={styles.sectionStyle} key={ uuid.v4() + Math.random() }>  
             
            <RNPickerSelect style={pickerSelectStyles} 
              placeholder={{ label: "Select your "+ item.display, value: null }}
              onValueChange={(value) => console.log(value)}
              items={options}
              Icon={() => {
                return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} style={styles.sortedStyle} />;
              }}
            /> 
          {index > 0 && !hideIcon ? 
            <Ionicons  name={"minus-circle"} color='#bf360c'  size={20} onPress={() => props.deletedItem(item)} style={styles.deletedStyle}/> 
          : null} 
        </View>
    )
}



const pickerSelectStyles = StyleSheet.create({
    inputIOS: {  
      fontSize: 14,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#2196f3',  
      borderRadius: 30,
      color: '#2196f3',
      paddingRight: 30, // to ensure the text is never behind the icon
  
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    sortedStyle : {
      marginTop: 8,
      marginLeft: 3,
    },
    deletedStyle : {
      marginTop: 8,
      marginLeft: 3,
  }
  });

  

const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    color: '#4638ab',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#4638ab',
  },

  sectionStyle: {
    flexDirection: 'row',
    height: 40, 
    marginBottom: 20,
    marginLeft: 35,
    marginRight: 35 
  },
  sortedStyle : {
    marginTop: 8,
    marginLeft: 3,
  }

});



export default EnumList;