 
//
//  ProfileScreen.js
//  CosyncJunctionSample
//
//  Licensed to the Apache Software Foundation (ASF) under one
//  or more contributor license agreements.  See the NOTICE file
//  distributed with this work for additional information
//  regarding copyright ownership.  The ASF licenses this file
//  to you under the Apache License, Version 2.0 (the
//  "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the License is distributed on an
//  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  KIND, either express or implied.  See the License for the
//  specific language governing permissions and limitations
//  under the License.
//
//  Created by Tola Voeung.
//  Copyright © 2020 cosync. All rights reserved.
//

import React, { useState, useRef , useEffect} from 'react'; 
import {
  StyleSheet,
  TextInput,
  View, 
  Text,
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Modal,
  Pressable
} from 'react-native'; 
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "react-native-vector-icons/FontAwesome";
import Loader from '../components/Loader'; 
import Configure from '../config/Config'; 
import * as RealmLib from '../managers/RealmManager';  
import { Button, ThemeProvider, Input } from 'react-native-elements';
 

const ProfileScreen = props => {
  const [formFields, setFormField] = useState([]);
  const [childFormField, setChildFormField] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [page, setPage] = useState('main'); 
  const [breadcrumb, setBreadcrumb] = useState([]); 
  const [formArrayDic, setFormArrayDic] = useState({}); 
  const _foo = useRef({});
  let formObject = {};

  global.appId = Configure.Realm.appId; 
  AsyncStorage.setItem('appId', global.appId);  

  useEffect(() => {

   
    setBreadcrumb(prevItems => { 
      return [];
    });

    

    setFormField(prevItems => { 
      return [];
    });

    setChildFormField(prevItems => { 
      return [];
    });

    setLoading(true);
    openRealm();

    async function openRealm(){ 
      
      await RealmLib.openRealm();   
      let results = await global.realm.objects("UserSchema"); 
      let form ;
      setLoading(false);

      results.forEach(element => { 

        element.userProfile.forEach(field => {  

            if(field.fieldType == 'object' || field.fieldType == 'array' ){ 
              console.log( ' userProfile field.arrayFieldType = ', field.arrayFieldType);
              if(field.fieldType == 'array'){

                let fieldId = field._id.toString();
                formObject[fieldId] = [field]; 
                console.log( ' userProfile field.fieldType = ', field.fieldType);
                console.log( ' userProfile field.display = ', field.display);


                let line = <View  key={ Math.random().toString(36).substr(2, 9) }
                  style={styles.lineStyle}
                />;

                setFormField(prevItems => { 
                  return [...prevItems, line];
                });

                
                form =  <View style={styles.SectionStyle} key={field._id.toString()} >
                          <TouchableOpacity onPress={() => handleAddMoreField(field)}  activeOpacity={0.5}>
                            <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) } >
                              {field.display}: (+Add)
                            </Text>
                          </TouchableOpacity>
                        </View>;

                setFormField(prevItems => { 
                  return [...prevItems, form];
                }); 

               
                if(field.arrayFieldType == 'object') getFieldDefChildren(field); 
                else{ 

                  let form = <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 9) }>
                      <TextInput key={ Math.random().toString(36).substr(2, 9) }
                        style={styles.inputStyle} 
                        placeholder={field.display}
                        autoCapitalize="none" 
                        returnKeyType="next"  
                        blurOnSubmit={false} 
                      />
                    </View>;

                  if(field.fieldType == "enum"){

                    let options = [];
                    field.enumValues.map(value => (
                      options.push( { label: value, value: value})
                    ));

                    form = <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 9) }> 

                            <Text>{field.display}: </Text>
                                        
                            <RNPickerSelect
                              placeholder={{ label: "Select your "+ field.display, value: null }}
                              onValueChange={(value) => console.log(value)}
                              items={options}
                              Icon={() => {
                                return <Ionicons name={"unsorted"} color='#2196f3'  size={20} />;
                              }}
                          />

                        </View>;
                  }

                  setFormField(prevItems => { 
                    return [...prevItems, form];
                  });       
                } 
              }
              else{
                form =  <View style={styles.headerSectionStyle} key={ Math.random().toString(36).substr(2, 9) } >
                      <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                        {field.display}:
                      </Text>
                    </View>;

                setFormField(prevItems => { 
                  return [...prevItems, form];

                });

                getFieldDefChildren(field); 

              } 

            }
            else{

              form =  <View style={styles.headerSectionStyle} key={ Math.random().toString(36).substr(2, 9) } >
                  <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                    {field.display}:
                  </Text>
                </View>;

              setFormField(prevItems => { 
                return [...prevItems, form];

              });
            
              let form = <View style={styles.SectionStyle} key={field._id.toString()}>
                          <TextInput key={ Math.random().toString(36).substr(2, 9) }
                            style={styles.inputStyle} 
                            placeholder={field.display}
                            autoCapitalize="none" 
                            returnKeyType="next"  
                            blurOnSubmit={false} 
                          />
                        </View>;

              if(field.fieldType == "enum"){

                let options = [];
                field.enumValues.map(value => (
                  options.push( { label: value, value: value})
                ));
                

                form = <View style={styles.SectionStyle} key={field._id.toString()}> 

                        <Text>{field.display}: </Text>
                                    
                        <RNPickerSelect
                          placeholder={{ label: "Select your "+ field.display, value: null }}
                          onValueChange={(value) => console.log(value)}
                          items={options}
                          Icon={() => {
                            return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} />;
                          }}
                      />

                    </View>;
              }

              setFormField(prevItems => {
                return [...prevItems, form];
              });

            }

            
        });

      });


    }

    
 

  
  async function getFieldDefChildren(fieldDef, isChild){

    
    fieldDef.properties.forEach(child => {

    
      if(child.fieldType == 'object' || child.fieldType == 'array' ){

        let form;
        let line = <View  key={ Math.random().toString(36).substr(2, 9) }
          style={styles.lineStyle}
        />;

        if(isChild){
          setChildFormField(prevItems => { 
            return [...prevItems, line];
          });
        }
        else{
          setFormField(prevItems => { 
            return [...prevItems, line];
          });
        }
        

        
        if(child.fieldType == 'array' && child.arrayFieldType != 'object'){
        

          let fieldId = child._id.toString();
          formObject[fieldId] = [child]; 
          //console.log( ' getFieldDefChildren formObject = ', formObject);
          
          form =  <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) } >
                    <TouchableOpacity onPress={() => handleAddMoreField(child)}  activeOpacity={0.5}>
                      <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) } >
                        {child.display}: (+Add)
                      </Text>
                    </TouchableOpacity>
                  </View>;

          if(isChild){
            setChildFormField(prevItems => { 
              return [...prevItems, form];
            });
          }
          else{
            setFormField(prevItems => { 
              return [...prevItems, form];
            });
          }

          if(child.fieldType == "enum"){

            let options = [];
            child.enumValues.map(value => (
              options.push( { label: value, value: value})
            ))

            form = <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>  

                    <RNPickerSelect style={pickerSelectStyles} 
                      placeholder={{ label: "Select your "+ child.display, value: null }}
                      onValueChange={(value) => console.log(value)}
                      items={options}
                      Icon={() => {
                        return <Ionicons name={"unsorted"} color='#2196f3' size={20} />;
                      }}
                    />

                </View>;

          } 
          else {
            
            form =  <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }> 
                <TextInput key={ Math.random().toString(36).substr(2, 9) }
                  style={styles.inputChildStyle} 
                  placeholder={child.display}
                  autoCapitalize="none" 
                  returnKeyType="next"  
                  blurOnSubmit={false} 
                />
              </View>;
          }

          if(isChild){
            setChildFormField(prevItems => { 
              return [...prevItems, form];
            });
          }
          else{
            setFormField(prevItems => { 
              return [...prevItems, form];
            });
          }



        } 
        else{
          form =  <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) } >
                    <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                    {child.display}:
                    </Text>
                  </View>;

          if(isChild){
            setChildFormField(prevItems => { 
              return [...prevItems, form];
            });
          }
          else{
            setFormField(prevItems => { 
              return [...prevItems, form];
            });
          }

          getFieldDefChildren(child, isChild); 

        }
      } 
      else {
        let form =  <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>
                <TextInput key={ Math.random().toString(36).substr(2, 9) }
                  style={styles.inputChildStyle} 
                  placeholder={child.display}
                  autoCapitalize="none" 
                  returnKeyType="next"  
                  blurOnSubmit={false} 
                />
              </View>;

        if(child.fieldType == "enum"){  

          let options = [];
            child.enumValues.map(value => (
              options.push( { label: value, value: value})
            )) 
          

          form = <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>  

                  <RNPickerSelect style={pickerSelectStyles} 
                    placeholder={{ label: "Select your "+ child.display, value: null }}
                    onValueChange={(value) => console.log(value)}
                    items={options}
                    Icon={() => {
                      return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} />;
                    }}
                  />

              </View>; 

        } 

        if(isChild){
          setChildFormField(prevItems => { 
            return [...prevItems, form];
          });
        }
        else{
          setFormField(prevItems => { 
            return [...prevItems, form];
          });
        }
        
      }
    });

    return;

  }

  const handleAddMoreChildField = (field) => { 

    let fieldId = field._id.toString();  

    console.log( ' handleAddMoreChildField fieldId = ', fieldId);  

    if(formObject[fieldId]) formObject[fieldId].push(field); 
    else formObject[fieldId] = [field];  

    //console.log("handleAddMoreChildField  formObject ",  formObject);

    let form = <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 11) }>
      <TextInput key={ Math.random().toString(36).substr(2, 9) }
        style={styles.inputStyle} 
        placeholder={field.display}
        autoCapitalize="none" 
        returnKeyType="next"  
        blurOnSubmit={false} 
      />
    </View>;

    if(field.fieldType == "enum"){ 

      let options = [];
      field.enumValues.map(value => (
        options.push( { label: value, value: value})
      )) 
      

      form = <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>  

              <RNPickerSelect style={pickerSelectStyles} 
                placeholder={{ label: "Select your "+ field.display, value: null }}
                onValueChange={(value) => console.log(value)}
                items={options}
                Icon={() => {
                  return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} />;
                }}
              />

          </View>; 

        setChildFormField(prevItems => {
          return [...prevItems, form];
        });
    }
    else if(field.fieldType == "object"){  
      form =  <View style={styles.headerSectionStyle} key={ Math.random().toString(36).substr(2, 9) } >
            <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
              {field.display}:
            </Text>
          </View>;

      setChildFormField(prevItems => { 
        return [...prevItems, form];

      });

      getFieldDefChildren(field, true); 
    }
    else if(field.fieldType == "array"){  
      let form = <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 11) }>
      <TextInput key={ Math.random().toString(36).substr(2, 9) }
        style={styles.inputStyle} 
        placeholder={field.display}
        autoCapitalize="none" 
        returnKeyType="next"  
        blurOnSubmit={false} 
      />
    </View>;

      if(field.arrayFieldType == "enum"){

          let options = [];
          field.enumValues.map(value => (
            options.push( { label: value, value: value})
          )) 
          

          form = <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>  

                  <RNPickerSelect style={pickerSelectStyles} 
                    placeholder={{ label: "Select your "+ field.display, value: null }}
                    onValueChange={(value) => console.log(value)}
                    items={options}
                    Icon={() => {
                      return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} />;
                    }}
                  /> 
              </View>; 

          setChildFormField(prevItems => {
            return [...prevItems, form];
          });

          
      }
      else if(field.arrayFieldType == "object"){  


        form =  <View style={styles.headerSectionStyle} key={ Math.random().toString(36).substr(2, 9) } >
              <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                {field.display}:
              </Text>
            </View>;

        setChildFormField(prevItems => { 
          return [...prevItems, form]; 
        }); 

        getFieldDefChildren(field, true); 

        let line = <View  key={ Math.random().toString(36).substr(2, 9) }style={styles.lineStyle} />;
        setChildFormField(prevItems => { 
          return [...prevItems, line];
        });

      }
      else{
        setChildFormField(prevItems => {
          return [...prevItems, form];
        });
      }
    }
    else{
      setChildFormField(prevItems => {
        return [...prevItems, form];
      });
    }

   

  }
 


  const handleAddMoreField = (field) => {  
    
    setBreadcrumb(prevItems => { 
      return [...prevItems, 'Home'];
    });  
   
    let fieldId = field._id.toString(); 

    if(formObject[fieldId]) formObject[fieldId].push(field); 
    else formObject[fieldId] = [field];  

    let title =  <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 9) + fieldId} >
                <TouchableOpacity onPress={() => handleAddMoreChildField(field)}  activeOpacity={0.5}>
                  <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) } >
                    {field.display}: (+Add)
                  </Text>
                </TouchableOpacity>
              </View>;

    setChildFormField(prevItems => {
      return [...prevItems, title];
    });

    console.log("handleAddMoreField  field ",  field);
    //console.log(" handleAddMoreField  forms[fieldId] ",  formObject[fieldId].length);

    formObject[fieldId].forEach(element => { 

      console.log("handleAddMoreField  element ",  element);

          let form = <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 11) }>
                      <TextInput key={ Math.random().toString(36).substr(2, 9) }
                        style={styles.inputStyle} 
                        placeholder={element.display}
                        autoCapitalize="none" 
                        returnKeyType="next"  
                        blurOnSubmit={false} 
                      />
                    </View>;

            if(element.fieldType == "enum"){

              let options = [];
              element.enumValues.map(value => (
                options.push( { label: value, value: value})
              )) 
              

              form = <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>  

                      <RNPickerSelect style={pickerSelectStyles} 
                        placeholder={{ label: "Select your "+ element.display, value: null }}
                        onValueChange={(value) => console.log(value)}
                        items={options}
                        Icon={() => {
                          return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} />;
                        }}
                      />

                  </View>; 
              setChildFormField(prevItems => {
                return [...prevItems, form];
              });
            }
            else if(element.fieldType == "object"){  

              form =  <View style={styles.headerSectionStyle} key={ Math.random().toString(36).substr(2, 9) } >
                    <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                      {field.display}:
                    </Text>
                  </View>;

             
              setChildFormField(prevItems => { 
                return [...prevItems, form];
        
              });
        
              getFieldDefChildren(field, true); 

            }
            else if(element.fieldType == "array"){  
              
              let form = <View style={styles.SectionStyle} key={ Math.random().toString(36).substr(2, 11) }>
                <TextInput key={ Math.random().toString(36).substr(2, 9) }
                  style={styles.inputStyle} 
                  placeholder={element.display}
                  autoCapitalize="none" 
                  returnKeyType="next"  
                  blurOnSubmit={false} 
                />
              </View>;

              if(element.arrayFieldType == "enum"){

                  let options = [];
                  element.enumValues.map(value => (
                    options.push( { label: value, value: value})
                  )) 
                  

                  form = <View style={styles.SectionChildStyle} key={ Math.random().toString(36).substr(2, 9) }>  

                          <RNPickerSelect style={pickerSelectStyles} 
                            placeholder={{ label: "Select your "+ element.display, value: null }}
                            onValueChange={(value) => console.log(value)}
                            items={options}
                            Icon={() => {
                              return <Ionicons  name={"unsorted"} color='#2196f3'  size={20} />;
                            }}
                          /> 
                      </View>; 

                  setChildFormField(prevItems => {
                    return [...prevItems, form];
                  });
        
                  
              }
              else if(element.arrayFieldType == "object"){  


                form =  <View style={styles.headerSectionStyle} key={ Math.random().toString(36).substr(2, 9) } >
                      <Text style={styles.titleText} key={ Math.random().toString(36).substr(2, 9) }>
                        {field.display}:
                      </Text>
                    </View>;

                setChildFormField(prevItems => { 
                  return [...prevItems, form]; 
                }); 
          
                getFieldDefChildren(element, true); 

                let line = <View  key={ Math.random().toString(36).substr(2, 9) }style={styles.lineStyle} />;
                setChildFormField(prevItems => { 
                  return [...prevItems, line];
                });

              }
              else{
                setChildFormField(prevItems => {
                  return [...prevItems, form];
                });
              }

            }
            else{
              setChildFormField(prevItems => {
                return [...prevItems, form];
              });
            }

            
         
       
    });
    
     
     
    setPage('child');
    
  }

  return function cleanup() {
    console.log('clean up!!!!!!!') 

    setFormField(prevItems => { 
      return [];
    });
 
   

  };


}, [])

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} /> 

      <ScrollView keyboardShouldPersistTaps="handled">

        <View style={{ marginTop: 100 }}>
          <KeyboardAvoidingView enabled>
           
          <Text style={styles.headerTextStyle}>
            Update your profile
          </Text>
           { 
            breadcrumb.map(el => (
              <Text style={styles.breadCrumbTextStyle} key={Math.random().toString(36).substr(2, 9)}> {el} / </Text>
            )) 
           }
          
          
          
            {  
              page == 'main'  ? formFields : childFormField
            } 
       
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {

                setPage('main')

                setBreadcrumb(prevItems => { 
                  return [];
                }); 

                setChildFormField(prevItems => { 
                  return [];
                });
              }
            
            }
               >
              <Text style={styles.buttonTextStyle}>SAVE</Text>
            </TouchableOpacity>

            

          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default ProfileScreen;

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
});

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  headerSectionStyle: {
    flexDirection: 'row', 
    marginBottom: 20,
    marginLeft: 20,
    
  },


  SectionChildStyle: {
    flexDirection: 'row',
    height: 40, 
    marginBottom: 20,
    marginLeft: 45,
    marginRight: 45 
  },

  SectionStyle: {
    flexDirection: 'row',
    height: 40, 
    marginBottom: 20,
    marginLeft: 35,
    marginRight: 35 
  },

  lineStyle:{
    borderWidth: 0.5,
    borderColor: '#4638ab',
    margin: 10 
  },
  buttonStyle: {
    backgroundColor: '#4638ab',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: 'white',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#4638ab',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#4638ab',
  },
  inputChildStyle: {
    flex: 1,
    color: '#2196f3',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#2196f3',
  },
  breadCrumbTextStyle: {
    color: '#4638ab',
    
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 20,
  },
  headerTextStyle: {
    color: '#4638ab',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 20,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});