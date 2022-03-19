import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useState, useEffect , useReducer , useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Modal, Button, ScrollView} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function App() {

  const getCurrentDate = () => {
    const timeNow = moment().format('MMMM DD, Y');
    return timeNow;
  }

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };



  const [clicked, setClicked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggle = (index) => {
    //Alert.alert("Player 1 is Winner");
    //console.log('toggle')
    if (clicked === index) {
      //console.log('close')
      //if clicked question is already active, then close it
      return setClicked(null);
    }
    setClicked(index);
  };



  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();

  const [Data, setData] = useState([]);

  const handleAddTodo = (date) => {
    console.log(title,desc);
    const data = 
    {
      title: title,
      description: desc,
      favorite: false,
      duedate: date
    }
    setData([...Data, data]);
    setTitle(null);
    setDesc(null);
    console.log(Data)
  }

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleStarClick = (index) => {
    Data[index].favorite = !Data[index].favorite;
    console.log('test');
    if(Data[index].favorite == true){
      const dataTemp = Data[index];
      Data.splice(index,1);
      Data.unshift(dataTemp);
    } else {
      const dataTemp = Data[index];
      Data.splice(index,1);
      Data.push(dataTemp);
    }
  }

  const handleDelete = (index) => {
    setClicked(null)
    Data.splice(index,1)
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={[{position: 'absolute', bottom: 10, right: 10},]} onPress={() => setModalVisible(true)}>
          <Image style={styles.addbutton} source={require('./pictures/add-icon.png')}></Image>
        </TouchableOpacity>

          <View style={styles.headerbg}>
            <Text style={styles.headertext}>My Day</Text>
            <Text style={styles.paragraphtext}>{getCurrentDate()}</Text>
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
                  <TouchableOpacity style={[styles.todo,{alignSelf: 'flex-start'}]} onPress={() => toggle(index)} key='s'>

                    <TouchableOpacity style={[{left: 6, marginTop: 5, marginBottom: 5, marginLeft: 2, marginRight: 2,}]} onPress={() => [handleStarClick(index),console.log(Data),forceUpdate()]}>
                      {todo.favorite ?
                        <Image style={styles.star} source={require('./pictures/goldstar.png')}></Image>
                        : <Image style={styles.star} source={require('./pictures/transstar.png')}></Image>}
                    </TouchableOpacity>

                    <View>
                      <Text style={[styles.todotext,{width: 285, left: 11, marginTop: 5, marginBottom: 8,}]}>{todo.title}</Text>
                    </View>

                    <TouchableOpacity style={[styles.trash]} onPress={() => [handleDelete(index),forceUpdate()]}>
                      <Image style={[{width:23,height:23}]} source={require('./pictures/trash.png')}></Image>
                    </TouchableOpacity>

                  </TouchableOpacity>

                  {clicked == index ? 
                    <View styles={[styles.bordertest,styles.dropdownedit]}>
                      <Text style={[styles.todotext]}>Description: {todo.description}</Text>
                      <Text style={[styles.todotext]}>Due Date: {todo.duedate}</Text>
                    </View> 
                    : null}

                </>
                );
            })}
          </View>

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

              <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
                <View style={{marginBottom: 10,marginTop: 10, marginRight: 10, width: '40%',alignSelf: 'center',}}>
                  <Button style ={{backgroundColor: '#5d2cb8',}} onPress={showDatepicker} title="Pick Due Date" />
                </View>
                <View style={{marginBottom: 10,marginTop: 10, marginLeft: 10, width: '40%',alignSelf: 'center',}}>
                  <Button onPress={showTimepicker} title="Pick Due Time" />
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                  />
                )}
              </View>

              <Text style={[styles.todotext,{textAlign: 'center',marginTop: 5, marginBottom: 5,}]}>Selected: {date.toLocaleString()}</Text>

              <TouchableOpacity style={[styles.submit]} onPress={() => [handleAddTodo(date.toLocaleString()),setModalVisible(!modalVisible)]}>
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
    //position: 'absolute',
    width: 292,
    height: 600,
    alignSelf: 'center',
    //left: 42,
    //top: 199,
    top: '7%',
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
    marginTop: 10,
  },
  trash: {
    height: 23,
    width: 23,
    marginLeft: 15,
  },
});