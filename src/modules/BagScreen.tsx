import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Fab, Icon, MinusIcon, Text, AddIcon, } from "native-base";
import React, { useEffect, useState } from "react"
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native"
import { connect } from "react-redux";
import colors from "../constants/colors";
import icons from "../constants/icons";
import { changeItem } from '../redux/action/cartAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IBagScreenProps {
    cart: any,
    changeItem: any,
}

const BagScreen = (props: IBagScreenProps) => {
    // const [items, setItems] = useState([]);
    useEffect(() => {
        const getData = async () => {
            try {
                const myCart = await AsyncStorage.getItem('@MySuperStore:key');
                if (myCart !== null) {

                    changeItem(JSON.parse(myCart));
                    // setItems(myCart)
                    console.log(JSON.parse(myCart));
                }
            } catch (error) {
                // Error retrieving data
                console.log(error);
            }
        }
        // const a = getData();
        getData()
    }, [])
    const { cart, changeItem } = props;
    const { items } = cart;
    const navigation: NavigationProp<any> = useNavigation();

    const storeData = async (cart: any) => {
        try {
            await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(cart));
        } catch (e) {
            // saving error
        }
    }
    const removeItem = (data: any) => {
        let arr: any = [];
        items.forEach((e: any) => {
            if (e.id !== data.id) arr.push(e);
        });
        const updateItem = { ...cart, items: arr };
        changeItem(updateItem);
        storeData(updateItem);
        console.log('xx', updateItem)
    }

    //@ts-ignore
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.itemView}
                //@ts-ignore
                onPress={() => navigation.navigate('Item Detail', { item: item })
                }
            >
                <Image source={item.uri[0]} style={{ width: 120, height: 120, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }} />
                <View style={{ paddingHorizontal: 15, marginLeft: 10 }}>
                    <Text fontSize='md'>{item.title}</Text>
                    <View style={{ flexDirection: 'row', padding: 3 }}>
                        <Text>Color: </Text>
                        <Text>Size: </Text>
                    </View>
                    <Text style={{}}>{item.price}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ ...styles.circle }}>
                            <MinusIcon style={{ marginBottom: 8, marginRight: 2 }} size="3" color="black" />
                        </TouchableOpacity>
                        <Text>2</Text>
                        <TouchableOpacity style={{ ...styles.circle, justifyContent: 'center' }}>
                            <AddIcon size="3" color="black" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{ position: 'absolute', top: 1, right: -20, width: 20, height: 20 }}
                        onPress={() => { removeItem(item) }}>
                        {/* <Image style={{ width: 15, height: 15, resizeMode: 'cover' }} source={icons.heart} /> */}
                        <MinusIcon size="3" mt="0.5" color="black" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => console.log(cart.items[0].uri)}
            >
                <Text style={{ margin: 15 }} fontSize='5xl'>My Bag</Text>
            </TouchableOpacity>
            <View style={{marginBottom: 212}}>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.index}
                // horizontal={true}
                />
            </View>

            <View style={styles.coView}>
                <TouchableOpacity
                    style={styles.coBtn}
                    onPress={() => {

                        // console.log('carttttt',items);

                    }}>
                    <Text style={{ color: colors.white }}>CHECK OUT</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        backgroundColor: colors.lightGray,

    },
    itemView: {
        flex: 1,
        // paddingHorizontal: 15,
        flexDirection: 'row',
        marginHorizontal: 14,
        margin: 8,
        backgroundColor: colors.white,
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 5,
        //   height: 5
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 4,

    },
    coView: {
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 112,
        position: 'absolute',
        bottom: 0,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 5,
        //     height: 5
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 4,
        // elevation: 5,
    },
    coBtn: {
        backgroundColor: colors.green2,
        width: 348,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 5,
        //     height: 5
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 4,
        // elevation: 5,
        borderRadius: 50,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 35,
    }
})

const mapStateToProps = (state: any) => {
    const { cartReducer } = state;
    return { cart: cartReducer };
};
export default connect(mapStateToProps, { changeItem: changeItem })(BagScreen);