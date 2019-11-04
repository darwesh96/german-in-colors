import React, { Component } from 'react';
import {
    View, ScrollView, Text, FlatList, Dimensions, StyleSheet,
    TouchableOpacity, TouchableHighlight, Alert,ToastAndroid
} from 'react-native';
import { queryAllWords, deleteWord } from "../realm/Realm";
import Modal from "react-native-modal";

var Realm = require('realm');

let realm;
export default class Dictionary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            realm: null,
            DieList: [],
            DasList: [],
            DerList: [],
            isModalVisible: false,
            translation: '',
            id:0,
            type:''

          
        }
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
    handleDelete = () => {
        deleteWord(this.state.id,this.state.type).then(
            this.loadData(),
            ToastAndroid.show('Word Deleted !', ToastAndroid.SHORT)).catch((error) => {
                alert(`Deleting word error ${error}`);
            });
    };

    itemPress(item,type) {
        this.setState({
            translation:item.translation,
            id:item.id,
            type:type
        });
        this.toggleModal();
        // Alert.alert('Word Info',
        //     `${item.translation}`);
    }


    loadData = () => {
        queryAllWords('Die').then((Die) => {
            this.setState({ DieList: Die });
        }).catch((error) => {
            this.setState({ DieList: [] });
        });
        console.log(`Die List Loaded`);

        queryAllWords('Das').then((Das) => {
            this.setState({ DasList: Das });
        }).catch((error) => {
            this.setState({ DasList: [] });
        });
        console.log(`Die List Loaded`);

        queryAllWords('Der').then((Der) => {
            this.setState({ DerList: Der });
        }).catch((error) => {
            this.setState({ DerList: [] });
        });
        console.log(`Die List Loaded`);
    }
    componentWillMount() {
        this.didBlurSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                console.debug('willFocus', payload);
                // this.getProducts();
                this.loadData()

            }
        );
    }
    componentWillUnmount() {
        this.didBlurSubscription.remove();

    }
    // IDGenerator = () => {

    //     var length = 3;
    //     var timestamp = +new Date;

    //     var _getRandomInt = function (min, max) {
    //         return Math.floor(Math.random() * (max - min + 1)) + min;
    //     }


    //     var ts = timestamp.toString();
    //     var parts = ts.split("").reverse();
    //     var id = "";

    //     for (var i = 0; i < length; ++i) {
    //         var index = _getRandomInt(0, parts.length - 1);
    //         id += parts[index];
    //     }

    //     return id;

    // }

    static navigationOptions = {
        header: null,
    }
   
    render() {
        const renderDer = ({ item, index }) => {
            return (
                <TouchableOpacity key={index}
                    onPress={() => { this.itemPress(item,'Der') }}>
                    <Text style={styles.cellDataDer} key={index}>{item.name}</Text>
                </TouchableOpacity>
            );
        }
        const renderDas = ({ item, index }) => {
            return (
                <TouchableOpacity key={index}
                    onPress={() => { this.itemPress(item,'Das') }}>
                    <Text style={styles.cellDataDas} key={index}>{item.name}</Text>
                </TouchableOpacity>
            );
        }
        const renderDie = ({ item, index }) => {
            return (
                <TouchableOpacity key={index}
                    onPress={() => { this.itemPress(item,'Die') }}>
                    <Text style={styles.cellDataDie}>{item.name}</Text>
                </TouchableOpacity>
            );
        }
        return (
            <View style={styles.mainContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.cellTitleDer}>Der</Text>
                    <Text style={styles.cellTitleDas}>Das</Text>
                    <Text style={styles.cellTitleDie}>Die</Text>

                </View>
                <ScrollView contentContainerStyle={styles.container}>

                    <View style={styles.cellHeaderDer}>
                        <FlatList
                            contentContainerStyle={styles.list}
                            numColumns={1}
                            data={this.state.DerList}
                            renderItem={renderDer}
                            keyExtractor={item => item.id.toString()}

                        />
                    </View>

                    <View style={styles.cellHeaderDas}>
                        <FlatList
                            contentContainerStyle={styles.list}
                            numColumns={1}
                            data={this.state.DasList}
                            renderItem={renderDas}
                            keyExtractor={item => item.id.toString()}

                        />
                    </View>

                    <View style={styles.cellHeaderDie}>
                        <FlatList
                            contentContainerStyle={styles.list}
                            numColumns={1}
                            data={this.state.DieList}
                            renderItem={renderDie}
                            keyExtractor={item => item.id.toString()}

                        />
                    </View>
                </ScrollView>
                <Modal isVisible={this.state.isModalVisible}
                    key={'111'}
                    animationIn='zoomInUp'
                    animationInTiming={500}
                    animationOut='zoomOutDown'
                    animationOutTiming={500}
                    deviceHeight={height * 1.5}
                    onBackButtonPress={() => {
                        this.toggleModal()
                    }}
                    onBackdropPress={() => {
                        this.toggleModal()
                    }}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'white' }}>

                        <View style={[styles.cardTitleContainer, { alignItems: 'center' }]}>
                            <Text style={styles.cardTitle}>Word Info</Text>
                        </View>
                        <View style={styles.row}>
                        <View style={styles.rowTitleContainer}>
                            <Text style={styles.rowTitleText}> Translation </Text>
                        </View>
                        <View style={styles.cellLine}></View>
                        <View style={styles.rowDataContainer}>
                            <Text style={styles.rowDataText}> {this.state.translation} </Text>
                        </View>
                    </View>       
                        <TouchableHighlight
                            style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: 30, borderRadius: 5, backgroundColor: '#001D63' }}
                            onPress={() => {
                                this.toggleModal();
                                Alert.alert(
                                    'Delete',
                                    'Are You sure you want to delete this word ?',
                                    [
                                      {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                      {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                      },
                                      {text: 'delete', onPress: () => this.handleDelete()},
                                    ],
                                    
                                  );
                            }}>
                            <Text style={{ color: 'white' }}>Delete</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>
            </View>


        );

    }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'flex-start',
        alignContent: 'center',
    },
    container: {
        justifyContent: 'flex-start',
        alignContent: 'center',
        width,
        flexDirection: 'row',
        flexGrow: 1,
        marginBottom: 50,
        paddingBottom: 50
    },
    titleContainer: {
        width,
        flexDirection: 'row',
    },
    cellTitle: {


    },
    cellTitleDer: {
        padding: 20,
        width: width / 3,
        elevation: 1,
        borderRadius: 2,
        backgroundColor: '#393fd4',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        height: height * 0.11
    },
    cellTitleDas: {
        padding: 20,
        width: width / 3,
        elevation: 1,
        borderRadius: 2,
        backgroundColor: '#2d2c33',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        height: height * 0.11

    },
    cellTitleDie: {
        padding: 20,
        width: width / 3,
        elevation: 1,
        borderRadius: 2,
        backgroundColor: '#bd2624',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        height: height * 0.11

    },
    cellHeaderDer: {
        width: width / 3,
        justifyContent: 'flex-start',
        alignContent: 'center',
        borderRightWidth: 3,
        marginLeft: 1,
        borderRightColor: '#d6d6d6',
        height: height * 0.79
    },
    cellHeaderDas: {
        width: width / 3,
        justifyContent: 'flex-start',
        alignContent: 'center',
        borderRightWidth: 2,
        borderRightColor: '#d6d6d6',
        height: height * 0.79

    },
    cellHeaderDie: {
        width: width / 3,
        justifyContent: 'flex-start',
        alignContent: 'center',
        height: height * 0.79


    },

    list: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'center',
        paddingTop: 5
    },
    cellDataDer: {
        padding: 10,
        marginBottom: 10,
        color: '#0400f2',
        fontSize: 17

    },
    cellDataDas: {
        padding: 10,
        marginBottom: 10,
        color: '#0f0f0f',
        fontSize: 17



    },
    cellDataDie: {
        padding: 10,
        marginBottom: 10,
        color: '#ff0000',
        fontSize: 17


    },
    cardTitle: {
        color: '#001D63',
        fontFamily: 'ISF kut',
        fontSize: 19,
        borderBottomWidth: 1,
        borderBottomColor: '#707070',
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5,
    },
    cardRowContainer: {
        alignSelf: 'flex-end',
        padding: 10
    },
    rowText: {
        color: '#32BCAD',
        fontFamily: 'ISF kut',
        fontSize: 14,
        marginRight: 10
    },
    rowData: {
        color: '#B7B7B7',
        fontFamily: 'ISF kut',
        fontSize: 13,
        marginRight: 25

    },
    row: {
        flexDirection: 'row',
        padding:50,
        justifyContent:"flex-start"
    },
    rowTitleContainer: {
        width: 100,
        marginBottom: 5,
        marginTop: 5,
        marginRight: 5,
        alignItems: 'center'
    },
    rowTitleText: {
        color: '#7E8998',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'ISF kut'
    },
    rowDataContainer: {
        marginBottom: 10,
        marginLeft: 15,
        marginTop: 5,
        marginRight: 5,
        width: '70%',
        alignItems: 'flex-start'
    
    },
    rowDataText: {
        color: '#14254D'
    },
    
    rowLine: {
        height: 1,
        width: 180,
        borderBottomWidth: 1,
        marginRight: 20,
        borderColor: '#70707058',
        alignSelf: 'flex-end'
    
    },
    cellLine: {
        borderRightWidth: 1,
        borderColor: '#70707058'
    
    },
});
