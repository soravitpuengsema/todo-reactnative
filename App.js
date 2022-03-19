import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Modal,} from 'react-native';
import { Data } from './components/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [clicked, setClicked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggle = (index) => {
    //Alert.alert("Player 1 is Winner");
    console.log('toggle')
    if (clicked === index) {
      console.log('close')
      //if clicked question is already active, then close it
      return setClicked(null);
    }
    setClicked(index);
  };

  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();

  const handleAddTodo = () => {
    console.log(title,desc);
    const data = {
      title: title,
      description: desc,
      favorite: 0,
    }
    Data.push(data)
    storeData(data);
    getData();
    getMultiple();
  }

  const storeData = async (data) => {
    try {
      const datatostring = JSON.stringify(data)
      await AsyncStorage.setItem('@storage_Key', datatostring)
      console.log('store success')
    } catch (e) {
      // saving error
    }
  }

  const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      // read key error
    }
  
    console.log(keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  }

  const getData = async () => {
    try {
      const gdata = await AsyncStorage.getItem('@storage_Key')
      console.log(JSON.parse(gdata))
      return gdata != null ? JSON.parse(gdata) : null
    } catch(e) {
      // read error
    }
  
  }

  const getMultiple = async () => {

    let values
    try {
      values = await AsyncStorage.multiGet(['@storage_Key', '@MyApp_key'])
    } catch(e) {
      // read error
    }
    console.log(values)
  
    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
  }


  return (
    <View style={styles.container}>

      <View style={styles.headerbg}>
        <Text style={styles.headertext}>My Day</Text>
        <Text style={styles.paragraphtext}>Friday, March 18</Text>
      </View>

      <View style={[{flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 1, marginTop: 8}]}>

        <TextInput style={[styles.searchbar,{marginLeft: 8,}]} placeholder={'ค้นหารายการ...'}></TextInput>

        <TouchableOpacity>
          <Image style= {styles.searchicon} source={require('./pictures/search_icon.png')}></Image>
        </TouchableOpacity>

      </View>

      <View>
        {Data.map((todo, index) => {
          return (
            <>
              <TouchableOpacity style={[styles.todo,{alignSelf: 'flex-start'}]} onPress={() => toggle(index)} key={index}>

                <TouchableOpacity style={[{left: 6, marginTop: 5, marginBottom: 5, marginLeft: 2, marginRight: 2,}]}>
                  <Image style={styles.star} source={require('./pictures/transstar.png')}></Image>
                </TouchableOpacity>

                <Text style={[styles.todotext,{width: 310, left: 11, marginTop: 5, marginBottom: 8,}]}>{todo.title}</Text>

              </TouchableOpacity>

              {clicked == index ? 
                <View styles={[styles.bordertest,styles.dropdownedit]}>
                  <Text style={[styles.todotext]}>{todo.description}</Text>
                  <Text style={[styles.todotext]}>{todo.favorite}</Text>
                </View> 
                : null}

            </>
            );
        })}
      </View>
      
      <TouchableOpacity style={{position: 'absolute',top: 600,left: 280}} onPress={() => setModalVisible(true)}>
        <Image style={styles.addbutton} source={require('./pictures/add-icon.png')}></Image>
      </TouchableOpacity>

      <Modal animationType='fade' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={[styles.modalcontainer]}>

          <TouchableOpacity style={[{height: 28, width: 28, left: 265}]} onPress={() => setModalVisible(!modalVisible)}>
            <Image style={styles.modalexit} source={require('./pictures/exit.png')}></Image>        
          </TouchableOpacity>

          <Text style={{fontFamily: 'Roboto', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center'}}>Add To Do</Text>
          
          <View style={{flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
            
            <Text style={styles.modalheader}>Title</Text>
            <TextInput style={[styles.modaltextinput,{marginBottom: 15}]} placeholder={'title...'} onChangeText={title=> setTitle(title)}></TextInput>

          </View>

          <View style={{flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
            
            <Text style={styles.modalheader}>Description</Text>
            <TextInput style={[styles.modaltextinput,{marginBottom: 15}]} placeholder={'description...'} onChangeText={desc=> setDesc(desc)}></TextInput>

          </View>

          <TouchableOpacity style={styles.submit} onPress={() => handleAddTodo()}>
            <Text style={{fontSize: 20,fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', top: 2, color:'#FFF'}}>Submit</Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  bordertest: {
    borderStyle: 'solid',
    borderColor: '#000000',
    borderWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  headerbg: {
    backgroundColor: '#5d2cb8',
    width: '100%',
    height: 100,
  },
  headertext: {
    fontWeight: 'bold',
    width: '100%',
    top: 10,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: 35,
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: 4,
    color: '#ffffff',
  },
  paragraphtext: {
    width: '100%',
    top: 10,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: 22,
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: 4,
    color: '#ffffff',
  },
  searchbar: {
    backgroundColor: '#fff',
    borderRadius: 20,
    //top: 20,
    width: 320,
    height: 32,
    //right: 20,
    paddingHorizontal: 15,
  },
  searchicon: {
    height: 50,
    width: 50,
  },
  addbutton: {
    height: 100,
    width: 100,
  },
  todo: {
    width: 358,
    //height: 41,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 7,
    marginBottom: 7,
    flexDirection: "row",
    alignItems: "center", 
    //display: 'flex',
    //justifyContent: 'space-between',
  },
  todotext: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  star: {
    height:  22,
    width: 22,
  },
  dropdownedit: {
    width: 358,
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 14,
    alignItems: "center", 
  },
  modalcontainer:{
    position: 'absolute',
    width: 292,
    height: 285,
    left: 42,
    top: 199,
    borderRadius: 15,
    backgroundColor: '#ededed',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 30
  },
  modalexit: {
    height: 25,
    width: 25,
  },
  modalheader: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modaltextinput: {
    width: 236,
    height: 32,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  submit: {
    backgroundColor: '#5d2cb8',
    width: 80,
    height: 35,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 4,
  }
});
