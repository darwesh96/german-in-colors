import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ToastAndroid,Alert, ScrollView } from 'react-native';
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
                    label: 'Der',
                    value: 'Der',
                    color: 'blue'
                },
                {
                    label: 'Das',
                    value: 'Das',
                    color: 'black'
                },
                {
                    label: 'Die',
                    value: 'Die',
                    color: 'red'
                },
               
            ],
            text: '',
            translation: '',
        };
    }
    static navigationOptions = {
        header: null,
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
            <ScrollView contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            >

                <RadioGroup radioButtons={this.state.data} onPress={this.onPress}
                    flexDirection='row' />
                {/* <Text style={styles.valueText}>
                    
                    Value = {selectedButton}
                </Text> */}
                <View style={styles.inputGroup}>
                <TextInput
                    style={{ height: 40, width: 180, borderColor: 'gray', borderBottomWidth: 1 }}
                    value={this.state.text}
                    onChangeText={val => this.updateInputState(val)}
                    placeholder={'Add a Word'}
                />

                <TextInput
                    style={{ height: 40, width: 180, borderColor: 'gray', borderBottomWidth: 1 }}
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
        height: '20%'
    }
});