// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, doc, getDocs, addDoc, getDoc, updateDoc, GeoPoint } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js'

import { getFirestore, collection, doc, getDocs, addDoc, getDoc, updateDoc, GeoPoint } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'
const firebaseConfig = {
  apiKey: "AIzaSyDPJ40d-kw7sPJHgqLpioppem3iSe-aDSQ",
  authDomain: "social-ec643.firebaseapp.com",
  projectId: "social-ec643",
  storageBucket: "social-ec643.appspot.com",
  messagingSenderId: "362501994128",
  appId: "1:362501994128:web:7aafb81cbfc4c0c8e6ca15"
};
initializeApp(firebaseConfig);
const db = getFirestore();
const userRef = collection(db, "Users")

window.getData = getData
window.getGraphData = getGraphData
window.addUser = addUser
window.getFriends = getFriends
window.addFriend = addFriend
window.updateCoordinates =updateCoordinates
window.getCoordinates = getCoordinates
window.getFriendCoordinates = getFriendCoordinates

// addUser("Bob")
// updateCoordinates("Bob", 10, 10)
// getCoordinates("Bob")
// addFriend("Bob", "Kyle")
// addFriend("Bob", "Arda")
// getfriendCoordinates("Bob")

function getData(snapshot) {
  let nodes = []
  let links = []

  snapshot.docs.forEach((doc) => {
    let user = { name: doc.data().name } // user format
    nodes.push(user)
    doc.data().friends.forEach((friend) => {
      let link = {target: friend, source: doc.data().name, strength: 1} // link format
      links.push(link)
    })
  })
  return [nodes, links]
}

function getGraphData() {
  let nodes = []
  let links = []
  getDocs(userRef)// returns a promise
    .then((snapshot) => {
      let data = getData(snapshot); // generate links and nodes
      nodes = data[0]
      links = data[1]
      // return something later or something like that
      //DEBUGGING
      // console.log(nodes)
      // console.log(links)
    })
    .catch(err => { // If everything goes wrong
      console.log(err.message)
    })
}

function addUser(name) {
  addDoc(userRef, {
    name: name,
    friends: [],
    coordinates: new GeoPoint(0,0)
  })
}

function getFriends(name) {
  let friends = []
  getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
        friends = doc.data().friends
        return friends
      }
    })
  })
}


function addFriend(name, friend) {
  let id = ""
  let friends = []
  getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
        id = doc.id
        friends = doc.data().friends
        friends.push(friend)
      }
      })
    let docRef = doc(db, 'Users', id)

    updateDoc(docRef, {
      friends: friends
    })
  })
  console.log(friend + ' added as friend of ' + name);
}

function updateCoordinates(name, x, y) {
  let id = ""
  getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
        id = doc.id
      }
      })
    let docRef = doc(db, 'Users', id)

    updateDoc(docRef, {
        coordinates: new GeoPoint(x, y)
    })
  })
}

function getCoordinates(name) {
  getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
          // console.log([doc.data().coordinates.longitude, doc.data().coordinates.latitude])
          return [doc.data().coordinates.longitude, doc.data().coordinates.latitude]
      }
    })
  })
}

function getFriendCoordinates(name) {
  let friends = []
  getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
        doc.data().friends.forEach((friend) => {
            snapshot.docs.forEach((docFriend) => {
              if(docFriend.data().name == friend) {
                let friendcoords = {
                  name: friend,
                  longitude: docFriend.data().coordinates.longitude,
                  latitude: docFriend.data().coordinates.latitude
                }

                friends.push(friendcoords)
              }
            })
        })
      }
    })
      // console.log(friends)
      return friends
  })
}
