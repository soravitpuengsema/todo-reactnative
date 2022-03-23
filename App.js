import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useState, useEffect , useReducer , useCallback } from 'react';
import { StatusBar, StyleSheet,View,TouchableOpacity, TextInput, Alert, Modal, ScrollView,Image,} from 'react-native';
import { Button, SocialIcon, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FloatingAction } from "react-native-floating-action";
import TodoListDataService from "./services/todo.service"
//import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function App() {

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const retrieveTodo = () =>{
    console.log('========retrieveTodo=======')
    TodoListDataService.getAll()
    .then(response =>{
        setClicked(null);
        //console.log(response.data);
        if(response.data){
          setData(response.data)
          setDataShow(response.data);
          setNotFound(false);
          forceUpdate();
        } else {
          setNotFound(true);
        }
    })
    .catch(e =>{
        console.log(e);
    })
  }

  useEffect(()=>{
    console.log('=======useEffect======')
    retrieveTodo();
  },[])

  const getCurrentDate = () => {
    const timeNow = moment().format('MMMM DD, Y');
    return timeNow;
  }

  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
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

  const [clicked, setClicked] = useState(null);

  const toggle = (index) => {
    console.log('toggle',index)
    //Alert.alert("Player 1 is Winner");
    //console.log('toggle')
    if (clicked === index) {
      //console.log('close')
      //if clicked question is already active, then close it
      return setClicked(null);
    }
    setClicked(index);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const [Data, setData] = useState([]);
  const [DataShow, setDataShow] = useState([]);

  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();

  const handleAddTodo = (date) => {
    console.log(title);
    var data = 
    {
      title: title,
      description: desc,
      published: false,
      priority: false,
      duedate: date
    }
    setTitle(null);
    setDesc(null);
    setDate(new Date(Date.now()))
    console.log('=====Add=====  ',data);

    TodoListDataService.create(data)
        .then(response => {
            console.log(response.data);

            if (search == ''){
              retrieveTodo();
            } else {
              handlesearch(search)
            }
        })
        .catch(e => {
            console.log(e);
        });
  }

  const handleStarClick = (index) => {

    const getIDStar = DataShow[index].id
    console.log(getIDStar);

    var data = 
    {
      title: DataShow[index].title,
      description: DataShow[index].description,
      published: DataShow[index].published,
      priority: !DataShow[index].priority,
      duedate: DataShow[index].duedate
    }

    console.log(title,desc)
    
    TodoListDataService.update(getIDStar,data)
      .then(response => {
          console.log(response.data);
          setTitle(null);
          setDesc(null);
          setEditInput(null);
          
          if (search == ''){
            retrieveTodo();
          } else {
            handlesearch(search)
          }
      })
      .catch(e => {
          console.log(e);
      });

    
  }

  const handleComplete = (index) => {

    const getIDStar = DataShow[index].id
    console.log(getIDStar);

    var data = 
    {
      title: DataShow[index].title,
      description: DataShow[index].description,
      published: !DataShow[index].published,
      priority: DataShow[index].priority,
      duedate: DataShow[index].duedate
    }

    console.log(title,desc)
    
    TodoListDataService.update(getIDStar,data)
      .then(response => {
          console.log(response.data);
          setTitle(null);
          setDesc(null);
          setEditInput(null);

          if (search == ''){
            retrieveTodo();
          } else {
            handlesearch(search)
          }
      })
      .catch(e => {
          console.log(e);
      });
    
  }

  const [deleteVisible, setDeleteVisible] = useState(false);

  const handleDelete = (index) => {

    setClicked(null);  
    //Data.splice(index,1);
    //DataShow.splice(index,1);
    const getID = DataShow[index].id
    console.log(getID);

    TodoListDataService.delete(getID)
    .then(response => {
        console.log(response.data);
        if (search == ''){
          retrieveTodo();
        } else {
          handlesearch(search)
        }
    })
    .catch(e => {
        console.log(e);
    });
  }

  const [search, setSearch] = useState('');
  const [notFound, setNotFound] = useState(false);


  const handlesearch = (text) => {

    const DataSearch = [];

    if (search == ""){
      retrieveTodo();
      console.log('SEARCH NOTHING')
      return;
    } else {
      TodoListDataService.getAll()
      .then(response => {
        for (var i = 0 ; i < response.data.length ; i++) {
          //console.log(response.data[i].title)
          if ( response.data[i].title == search ){
            console.log('found ',response.data[i].title)
            DataSearch.push(response.data[i]);
          }
        }
        setDataShow(DataSearch);
        forceUpdate();
        console.log('SEARCH ',search,DataSearch);
        if (DataSearch.length == 0) {
          setNotFound(true);
          forceUpdate();
        } else {
          setNotFound(false);
          forceUpdate();
        }
      })
      .catch(e =>{
          console.log(e);
      })
    }
  }

  const [editInput, setEditInput] = useState([])

  const getEditData = (index) => {
    console.log('BEFORE EDIT',DataShow[index].title, DataShow[index].description, DataShow[index].id, DataShow[index].duedate)
    setEditInput([DataShow[index].title, DataShow[index].description, DataShow[index].id, DataShow[index].duedate, 
      DataShow[index].published, DataShow[index].priority])

    setTitle(DataShow[index].title)
    setDesc(DataShow[index].description)

  }

  const [editVisible, setEditVisible] = useState(false);

  const handleEdit = (date) => {
    const getIDEdit = editInput[2]
    console.log(getIDEdit);

    var data = 
    {
      title: title,
      description: desc,
      published: editInput[4],
      priority: editInput[5],
      duedate: date
    }

    console.log(title,desc)
    
    TodoListDataService.update(getIDEdit,data)
      .then(response => {
          console.log(response.data);
          setTitle(null);
          setDesc(null);
          setEditInput(null);

          if (search == ''){
            retrieveTodo();
          } else {
            handlesearch(search)
          }
      })
      .catch(e => {
          console.log(e);
      });
  }

  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      

          <StatusBar hidden={false} ></StatusBar>

          

          <View style={styles.headerbg}>
            <Text style={styles.headertext}>My Day</Text>
            <Text style={styles.paragraphtext}>{getCurrentDate()}</Text>
          </View>

          <View style={[{flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 1, marginTop: 8}]}>

            <TextInput style={[styles.searchbar,{marginLeft: 8,}]} placeholder={'ค้นหารายการ...'} onChangeText={titletext=> setSearch(titletext)}></TextInput>

            <TouchableOpacity onPress={() => [handlesearch(search)]} activeOpacity={0.7}>
              <Image style= {styles.searchicon} source={require('./pictures/search_icon.png')}></Image>
            </TouchableOpacity>

          </View>
        
          <ScrollView >
            <View style={{marginTop:-7,marginBottom:7}}>
                {DataShow.map((todo, index) => {
                  return (
                    <>
                      <TouchableOpacity key={index} style={[styles.todo,{alignSelf: 'flex-start',flexDirection:'row'}]} onPress={() => toggle(index)} activeOpacity={0.7}>

                        <TouchableOpacity style={[{left: 6, marginTop: 5, marginBottom: 5, marginLeft: 2, marginRight: 2,}]} onPress={() => [handleComplete(index)]}>
                          {todo.published ?
                            <Image style={[{width:23,height:23}]} source={require('./pictures/checktrue.png')}></Image>
                            : <Image style={[{width:23,height:23}]} source={require('./pictures/checkfalse.png')}></Image>}
                        </TouchableOpacity>

                        <View>
                          {todo.published ? 
                          <Text style={[styles.todotext,{color:'#7d7d7d',textDecorationLine:'line-through',width: 260, left: 11, marginTop: 5, marginBottom: 8, marginRight:20}]}>{todo.title}</Text>
                          : <Text style={[styles.todotext,{width: 260, left: 11, marginTop: 5, marginBottom: 8, marginRight:20}]}>{todo.title}</Text> 
                          }
                        </View>

                        <TouchableOpacity style={[{width:24,height:24,left:20}]} onPress={() => [handleStarClick(index)]}>
                          {todo.priority ?
                            <Image style={styles.star} source={require('./pictures/goldstar.png')}></Image>
                            : <Image style={styles.star} source={require('./pictures/transstar.png')}></Image>}
                        </TouchableOpacity>


                      </TouchableOpacity>

                      {clicked == index ? 
                      <>
                        <View style={[styles.dropdownedit]}>
                          <Text style={[styles.todotext,{marginTop: 5, width: '90%',alignSelf: 'center',marginBottom: 7,}]}>{todo.description}</Text>
                          <View style={[{flexDirection:'row',alignSelf:'center'}]}>
                            <Text style={[styles.todotext,{marginBottom: 10}]}>Due Date: {todo.duedate}</Text>

                            <TouchableOpacity style={[styles.edit]} onPress={() => [getEditData(index),setEditVisible(true)]}>
                              <Image style={[{width:23,height:23}]} source={require('./pictures/edit.png')}></Image>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.trash]} onPress={() => [setDeleteVisible(true)]}>
                              <Image style={[{width:23,height:23}]} source={require('./pictures/trash.png')}></Image>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Modal animationType='fade' transparent={true} visible={deleteVisible} onRequestClose={() => setDeleteVisible(!deleteVisible)}>
                          <View style={{width:310,height:120,borderRadius:20,backgroundColor:'#EDEDED',position:'absolute',alignSelf:'center',top:'40%',shadowColor: "#000",shadowOffset: {width: 0,height: 2},shadowOpacity: 1,shadowRadius: 4,elevation: 30}}>
                            
                            <Text style={{fontFamily: 'Roboto', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center',marginTop:18,shadowColor: "#000",}}>Do you sure you want to delete?</Text>

                            <View style={{flexDirection:'row',alignSelf:'center'}}>
                              <TouchableOpacity style={[{marginRight:12,backgroundColor: '#ff0000',width: 55,height: 35,borderRadius: 10}]} onPress={() => [handleDelete(index),setDeleteVisible(!deleteVisible)]} activeOpacity={0.7}>
                                <Text style={[{fontSize: 18,fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', color:'#FFF',textAlignVertical:'center',height:'100%'}]}>Yes</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={{borderColor:'#5d2cb8',borderWidth:3,marginLeft:12,backgroundColor: '#EDEDED',width: 55,height: 35,borderRadius: 10}} onPress={() => [setDeleteVisible(!deleteVisible)]} activeOpacity={0.7}>
                                <Text style={[{color:'#5d2cb8',fontSize: 18,fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', textAlignVertical:'center',height:'100%'}]}>No</Text>
                              </TouchableOpacity>
                            </View>

                          </View>
                        </Modal>
                      </>
                        : null}
                    </>
                    );
                })}
                {notFound == true ?
                <View>
                  <Text style={{fontFamily: 'Roboto', fontSize: 14, marginTop: 10}}>Not found</Text>
                </View> 
                : null}
            </View>
            </ScrollView>

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
                  <View style={[{marginBottom: 10,marginTop: 10, marginRight: 3, width: '45%',alignSelf: 'center',borderRadius: 10,}]}>
                    <Button style ={{color: '#5d2cb8',}} onPress={showDatepicker} title="Pick Due Date" />
                  </View>
                  <View style={[{marginBottom: 10,marginTop: 10, marginLeft: 3, width: '45%',alignSelf: 'center',borderRadius: 10,}]}>
                    <Button style ={{color: `'#5d2cb8'`,}} onPress={showTimepicker} title="Pick Due Time" />
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

                <TouchableOpacity style={[styles.submit]} onPress={() => [handleAddTodo(date.toLocaleString()),setModalVisible(!modalVisible)]} activeOpacity={0.7}>
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
                  <View style={[{marginBottom: 10,marginTop: 10, marginRight: 3, width: '45%',alignSelf: 'center',borderRadius: 10,}]}>
                    <Button style ={{color: '#5d2cb8',}} onPress={showDatepicker} title="Pick Due Date" />
                  </View>
                  <View style={[{marginBottom: 10,marginTop: 10, marginLeft: 3, width: '45%',alignSelf: 'center',borderRadius: 10,}]}>
                  <Button style ={{color: '#5d2cb8',}} onPress={showTimepicker} title="Pick Due Time" />
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

                {}
                  <Text style={[styles.todotext,{textAlign: 'center',marginTop: 5, marginBottom: 5,}]}>Selected: {date.toLocaleString()}</Text>

                <TouchableOpacity style={[styles.submit]} onPress={() => [handleEdit(date.toLocaleString()),setEditVisible(!editVisible)]} activeOpacity={0.7}>
                  <Text style={[{fontSize: 20,fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', color:'#FFF', position: 'relative',top: '20%'}]}>Submit</Text>
                </TouchableOpacity>


              </View>
            </Modal>

        <TouchableOpacity style={[styles.addbutton]} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <Image style={[styles.floatingButtonStyle]} source={require('./pictures/add-icon.png')}></Image>
        </TouchableOpacity>

      </View>
      </SafeAreaProvider>
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
    marginLeft: 8,
    marginRight: 8,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
});