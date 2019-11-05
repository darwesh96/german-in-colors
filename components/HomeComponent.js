import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ToastAndroid,Alert, ScrollView, Dimensions } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import { insertNewWord } from "../realm/Realm";
var Realm = require('realm');
let realm;

export default class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    label: 'Der      ',
                    value: 'Der',
                    color: 'blue',
                },
                {
                    label: 'Das      ',
                    value: 'Das',
                    color: 'black'
                },
                {
                    label: 'Die      ',
                    value: 'Die',
                    color: 'red'
                },
               
            ],
            text: '',
            translation: '',
            width: Dimensions.get('window').width, // devices width for responsive and orientation layouts
        };
    }
    static navigationOptions = {
        header: null,
    }

     /**
     * This method is fired immediately once the layout has been calculated or changed.
     * It is used here to re calculate the device width on orientation change for responsive design.
     */
    onLayout = () => {
        // sets the new device width to the component state.
        this.setState({
         width: Dimensions.get('window').width,
        })
       }

    onPress = data => this.setState({ data });

    uniqeId = () => {
        var d = new Date();
        var n = d.valueOf();
        return n;
    }


    updateInputState = (value) => {
        this.setState(prevState => {
            return {
                ...prevState,
                text: value,
            };
        });
    };

    updateTranslationState = (value) => {
        this.setState(prevState => {
            return {
                ...prevState,
                translation: value,
            };
        });
    };

    add_Word = () => {
        let newID = this.uniqeId();
        let newWord = {
            id: newID,
            name: this.state.text,
            translation: this.state.translation
        }
        let selectedButton = this.state.data.find(e => e.selected == true);
        selectedButton = selectedButton ? selectedButton.value : this.state.data[0].label;

        insertNewWord(newWord, selectedButton).then(ToastAndroid.show('Word added !', ToastAndroid.SHORT)).catch((error) => {
            alert(`Insert new word error ${error}`);
        });

    }

    handleSubmit = () => {
        if(this.state.text.trim() === ''){
            Alert.alert(''
            ,'Please Add a Word First !')
        }
        else{
            if(this.state.translation.trim() === ''){
                Alert.alert(''
            ,'Please Add translation to continue !');
                return;
            }else{
                this.add_Word();
                this.setState(prevState => {
                    return {
                        ...prevState,
                        text: '',
                        translation:''
                    };
                });
            }
        }
    }

    render() {
        let selectedButton = this.state.data.find(e => e.selected == true);
        selectedButton = selectedButton ? selectedButton.value : this.state.data[0].label;
        return (
            <ScrollView contentContainerStyle={[styles.container, {width: this.state.width}]}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={this.onLayout}
            >

                <RadioGroup radioButtons={this.state.data} onPress={this.onPress}
                    flexDirection='row' />
                <View style={[styles.inputGroup, {width: this.state.width*0.7}]}>
                <TextInput
                    style={{  height: 40, marginBottom:20, borderColor: '#841584', borderBottomWidth: 1 }}
                    value={this.state.text}
                    onChangeText={val => this.updateInputState(val)}
                    placeholder={'Add a Word'}
                />

                <TextInput
                    style={{ height: 40, borderColor: '#841584', borderBottomWidth: 1 }}
                    value={this.state.translation}
                    onChangeText={val => this.updateTranslationState(val)}
                    placeholder={'Add Translation..'}
                />
                </View>
               

                <Button
                    onPress={() => this.handleSubmit()}
                    title="Click To Add"
                    color="#841584"
                />
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff'
    },
    valueText: {
        fontSize: 18,
        marginBottom: 50,
    },
    inputGroup: {
        justifyContent:"space-between",
        height: '25%',
        marginBottom:10
    }
});