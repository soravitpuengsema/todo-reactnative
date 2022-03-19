import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { Data } from './components/data';

export default function App() {

  //const [todo, setTodo] = useState();
  //const [todos, setTodos] = useState([]);
  const [clicked, setClicked] = useState(false);

  const toggle = index => {
    console.log('toggle')
    if (clicked === index) {
      console.log('close')
      //if clicked question is already active, then close it
      return setClicked(null);
    }

    setClicked(index);
  };


  return (
    <View style={styles.container}>

      <View style={styles.headerbg}>
        <Text style={styles.headertext}>My Day</Text>
        <Text style={styles.paragraphtext}>Friday, March 18</Text>
      </View>

      <View style={[{flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 15, marginTop: 6}]}>

        <TextInput style={[styles.searchbar,{marginLeft: 8,}]} placeholder={'ค้นหารายการ...'}></TextInput>

        <TouchableOpacity>
          <Image style= {styles.searchicon} source={require('./pictures/search_icon.png')}></Image>
        </TouchableOpacity>

      </View>

      <View style={styles.todolist}>
        {Data.map((todo, index) => {
          return (
          <>
            <TouchableOpacity style={[styles.todo,{alignSelf: 'flex-start'}]} onClick={() => toggle(index)} key={index}>

              <TouchableOpacity style={{left: 6, marginTop: 5, marginBottom: 5, marginLeft: 2, marginRight: 2,}}>
                <Image style={styles.star} source={require('./pictures/transstar.png')}></Image>
              </TouchableOpacity>

              <Text style={[styles.todotext,{width: 310, left: 11, marginTop: 5, marginBottom: 8,}]}>{todo.title}</Text>

            </TouchableOpacity>
            {clicked === index ? (
              <View styles={styles.dropdownedit}>
                <Text>{todo.description}</Text>
                <Text>{todo.favorite}</Text>
              </View>
            ) : null}
            </>
          );
        })}
      </View>
      
      <TouchableOpacity style={{position: 'absolute',top: 600,left: 280}}>
        <Image style={styles.addbutton} source={require('./pictures/add-icon.png')}></Image>
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
    height: 100,
    width: 100,
  },
  todolist: {
    bottom: 8,
  },
  todo: {
    width: 358,
    //height: 41,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 14,
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

  },
});
