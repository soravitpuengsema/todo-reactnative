import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useState, useEffect , useReducer , useCallback } from 'react';
import { StatusBar, StyleSheet,View,TouchableOpacity, TextInput, Alert, Modal, ScrollView,Image,} from 'react-native';
import { Button, SocialIcon, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingAction } from "react-native-floating-action";
//import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function App() {

  const getCurrentDate = () => {
    const timeNow = moment().format('MMMM DD, Y');
    return timeNow;
  }

  const [date, setDate] = useState(new Date(Date.now()));
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

  const [DataShow, setDataShow] = useState([]);

  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();

  const [Data, setData] = useState([]);

  const [idnum, setID] = useState(1);

  const handleAddTodo = (date) => {
    console.log(title,idnum);
    const data = 
    {
      id: idnum,
      title: title,
      description: desc,
      favorite: false,
      duedate: date
    }
    setID(idnum+1);
    setData([...Data, data]);
    setTitle(null);
    setDesc(null);
    setDate(new Date(Date.now()))
    //console.log(data);
    setDataShow([...DataShow, data]);
    //console.log('DataShow',DataShow);
    console.log('Data',Data);
  }

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleStarClick = (index) => {
    const getIDStar = DataShow[index].id
    console.log(getIDStar);
    const indexDataStar = Data.findIndex((o => o.id == getIDStar))
    Data[indexDataStar].favorite = !Data[indexDataStar].favorite

    if(Data[indexDataStar].favorite == true){
      const dataTemp = Data[indexDataStar];
      Data.splice(indexDataStar,1);
      Data.unshift(dataTemp);

      DataShow.splice(0, DataShow.length);

      for (var j = 0 ; j < Data.length ; j++) {
        DataShow.push(Data[j]);
      }
  
      if (search != ''){
        handleSearch(search);
      }
  
      forceUpdate();

    } else {
      const dataTemp = Data[indexDataStar];
      Data.splice(indexDataStar,1);
      Data.push(dataTemp);

      DataShow.splice(0, DataShow.length);

      for (var j = 0 ; j < Data.length ; j++) {
        DataShow.push(Data[j]);
      }
  
      if (search != ''){
        handleSearch(search);
      }
  
      forceUpdate();

    }
  }

  const handleDelete = (index) => {
    setClicked(null);  
    //Data.splice(index,1);
    //DataShow.splice(index,1);
    const getID = DataShow[index].id
    console.log(getID);
    const indexData = Data.findIndex((o => o.id == getID))
    Data.splice(indexData,1);

    DataShow.splice(0, DataShow.length);

    for (var j = 0 ; j < Data.length ; j++) {
      DataShow.push(Data[j]);
    }

    if (search != ''){
      handleSearch(search);
    }

    forceUpdate();
  }

  const [search, setSearch] = useState('');

  const handleSearch = (text) => {
    console.log(text);

    if ( text == '' ){

      DataShow.splice(0, DataShow.length);
      for (var i = 0 ; i < Data.length ; i++) {
        DataShow.push(Data[i])
      }
      console.log('SEARCH NULL',DataShow);
      forceUpdate();

    } else { //มีการ search

      DataShow.splice(0, DataShow.length);
      console.log(Data)

      for (var j = 0 ; j < Data.length ; j++) {
        if (Data[j].title == text){
          DataShow.push(Data[j]);
        }
      }
      console.log('SEARCH ',text,DataShow);
      forceUpdate();
    }
  }

  const [editInput, setEditInput] = useState([])

  const getEditData = (index) => {
    console.log('BEFORE EDIT',DataShow[index].title, DataShow[index].description, DataShow[index].id, DataShow[index].duedate)
    setEditInput([DataShow[index].title, DataShow[index].description, DataShow[index].id, DataShow[index].duedate])

    setTitle(DataShow[index].title)
    setDesc(DataShow[index].description)

  }

  const [editVisible, setEditVisible] = useState(false);

  const handleEdit = () => {
    const getIDEdit = editInput[2]
    console.log(getIDEdit);
    const indexDataEdit = Data.findIndex((o => o.id == getIDEdit))

    console.log(title,desc)
    
    Data[indexDataEdit].title = title;
    Data[indexDataEdit].description = desc;
    Data[indexDataEdit].duedate = date.toLocaleString();

    setTitle(null);
    setDesc(null);

    DataShow.splice(0, DataShow.length);

    for (var j = 0 ; j < Data.length ; j++) {
      DataShow.push(Data[j]);
    }

    if (search != ''){
      handleSearch(search);
    }

    forceUpdate();
  }

  return (
    <View style={styles.container}>

          <StatusBar hidden={false} ></StatusBar>

          

          <View style={styles.headerbg}>
            <Text style={styles.headertext}>My Day</Text>
            <Text style={styles.paragraphtext}>{getCurrentDate()}</Text>
          </View>

          <View style={[{flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 1, marginTop: 8}]}>

            <TextInput style={[styles.searchbar,{marginLeft: 8,}]} placeholder={'ค้นหารายการ...'} onChangeText={titletext=> setSearch(titletext)}></TextInput>

            <TouchableOpacity onPress={() => handleSearch(search)}>
              <Image style= {styles.searchicon} source={require('./pictures/search_icon.png')}></Image>
            </TouchableOpacity>

          </View>
        <SafeAreaView style={{maxHeight: 530}}>
          <ScrollView>
          
            <View style={{marginTop: -7}}>
              {DataShow.map((todo, index) => {
                return (
                  <>
                    <TouchableOpacity style={[styles.todo,{alignSelf: 'flex-start'}]} onPress={() => toggle(index)} activeOpacity={0.7}>

                      <TouchableOpacity style={[{left: 6, marginTop: 5, marginBottom: 5, marginLeft: 2, marginRight: 2,}]} onPress={() => [handleStarClick(index),console.log(Data),forceUpdate()]}>
                        {todo.favorite ?
                          <Image style={styles.star} source={require('./pictures/goldstar.png')}></Image>
                          : <Image style={styles.star} source={require('./pictures/transstar.png')}></Image>}
                      </TouchableOpacity>

                      <View>
                        <Text style={[styles.todotext,{width: 260, left: 11, marginTop: 5, marginBottom: 8,}]}>{todo.title}</Text>
                      </View>

                      <TouchableOpacity style={[styles.edit]} onPress={() => [getEditData(index),setEditVisible(true)]}>
                        <Image style={[{width:23,height:23}]} source={require('./pictures/edit.png')}></Image>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.trash]} onPress={() => [handleDelete(index),forceUpdate()]}>
                        <Image style={[{width:23,height:23}]} source={require('./pictures/trash.png')}></Image>
                      </TouchableOpacity>

                    </TouchableOpacity>

                    {clicked == index ? 
                      <View style={[styles.dropdownedit]}>
                        <Text style={[styles.todotext,{marginTop: 5, width: '90%',alignSelf: 'center',marginBottom: 7,}]}>{todo.description}</Text>
                        <Text style={[styles.todotext,{textAlign: 'center',marginBottom: 10}]}>Due Date: {todo.duedate}</Text>
                      </View> 
                      : null}

                  </>
                  );
              })}
            </View>
            </ScrollView>
        </SafeAreaView>


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
                <Text style={[{fontSize: 20,fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', color:'#FFF', position: 'relative',top: '20%'}]}>Submit</Text>
              </TouchableOpacity>

            </View>
          </Modal>



          <Modal animationType='fade' transparent={true} visible={editVisible} onRequestClose={() => setEditVisible(!editVisible)}>
            <View style={[styles.modalcontainer]}>

              <TouchableOpacity style={[{height: 28, width: 28, left: 265}]} onPress={() => setEditVisible(!editVisible)}>
                <Image style={styles.modalexit} source={require('./pictures/exit.png')}></Image>        
              </TouchableOpacity>

              <Text style={{fontFamily: 'Roboto', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center'}}>Edit To Do</Text>
              
              <View style={{flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
                
                <Text style={styles.modalheader}>Title</Text>
                <TextInput style={[styles.modaltextinput,{marginBottom: 15}]} placeholder={'title...'} value={title} editable={true} onChangeText={title=> setTitle(title)}></TextInput>

              </View>

              <View style={{flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
                
                <Text style={styles.modalheader}>Description</Text>
                <TextInput style={[styles.modaltextinput,{marginBottom: 15}]} placeholder={'description...'} value={desc} editable={true} onChangeText={desc=> setDesc(desc)}></TextInput>

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

              <TouchableOpacity style={[styles.submit]} onPress={() => [handleEdit(date),setEditVisible(!editVisible)]}>
                <Text style={[{fontSize: 20,fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', color:'#FFF', position: 'relative',top: '20%'}]}>Submit</Text>
              </TouchableOpacity>

            </View>
          </Modal>

          <TouchableOpacity style={[styles.addbutton]} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
            <Image style={[styles.floatingButtonStyle]} source={require('./pictures/add-icon.png')}></Image>
          </TouchableOpacity>

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
    height: 55,
    width: 55,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 10,
  },
  todo: {
    width: 358,
    //height: 41,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 14,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    //alignItems: "center", 
  },
  modalcontainer:{
    //position: 'absolute',
    width: 292,
    height: 430,
    alignSelf: 'center',
    //left: 42,
    //top: 199,
    position: 'absolute',
    top: '20%',
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
    width: 85,
    height: 40,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  trash: {
    height: 23,
    width: 23,
  },
  edit: {
    height: 23,
    width: 23,
    marginLeft: 15,
    marginRight: 4,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
});