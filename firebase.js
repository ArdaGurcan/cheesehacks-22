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

window.getUsers = getUsers
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
// getFriends("Arda")

async function getUsers() {
  let users = []
  await getDocs(userRef)// returns a promise
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      users.push(doc.data().name)
    })
  })
  .catch(err => { // If everything goes wrong
    console.log(err.message)
  })

  return users
}
function getData(snapshot, name) {
  let nodes = []
  let links = []

  snapshot.docs.forEach((doc) => {
    if(doc.data().name == name) {
      let user = { name: doc.data().name } // user format
      nodes.push(user)
      doc.data().friends.forEach((friend) => {
        let friendNode = {name: friend}
        nodes.push(friendNode)
        let link = {target: friend, source: doc.data().name, strength: 1} // link format
        links.push(link)
        snapshot.docs.forEach((docFriend1) => {
          if(docFriend1.data().name == friend) {
            docFriend1.data().friends.forEach((friend1) => {
            let friend1Node = {name: friend1}
            nodes.push(friend1Node)
            let friendlink = {target: friend1, source: docFriend1.data().name, strength: 1} // link format
            links.push(friendlink)
            snapshot.docs.forEach((docFriend2) => {
                if(docFriend2.data().name == friend1) {
                  docFriend2.data().friends.forEach((friend2) => {
                    let friend2Node = {name: friend2}
                    nodes.push(friend2Node)
                    let friendlink = {target: friend2, source: docFriend2.data().name, strength: 1} // link format
                    links.push(friendlink)
                  })
                }
              })
            })
          }
        })
      })
    }
  })
  // links = new Set(links)
  // nodes = new Set(nodes)
  // links = Array.from(links)
  // nodes = Array.from(nodes)
  nodes = Array.from(new Set(nodes.map(a => a.name)))
   .map(name => {
   return nodes.find(a => a.name === name)
 })

  links = links.reduce((acc, current) => {
    const source = acc.find(item => item.source === current.source);
    const target = acc.find(item => item.target === current.target);
    if (!source || !target) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return [nodes, links]
}

async function getGraphData(name) {
  let nodes = []
  let links = []
  await getDocs(userRef)// returns a promise
    .then((snapshot) => {
      let data = getData(snapshot, name); // generate links and nodes
      // console.log(data)
      nodes = data[0]
      links = data[1]
    })
    .catch(err => { // If everything goes wrong
      console.log(err.message)
    })
  return [nodes, links]
}

function addUser(name) {
  addDoc(userRef, {
    name: name,
    friends: [],
    coordinates: new GeoPoint(0,0)
  })
}

async function getFriends(name) {
  let friends = []
  await getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
        friends = doc.data().friends
      }
    })
  })
  return friends
}

async function addFriend(name, friend) {
  let id = ""
  let friends = []
  await getDocs(userRef)
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

async function updateCoordinates(name, x, y) {
  console.log("called")
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
window.updateCoordinates = updateCoordinates;

async function getCoordinates(name) {
  let data = ""
  await getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
          // console.log([doc.data().coordinates.longitude, doc.data().coordinates.latitude])
          data = [doc.data().coordinates.longitude, doc.data().coordinates.latitude]
      }
    })
  })
  return data
}
 export default async function getFriendCoordinates(name) {
  let friends = []
  await getDocs(userRef)
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
  })
  return friends
}
