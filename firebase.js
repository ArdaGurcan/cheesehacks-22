// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, doc, getDocs, addDoc, getDoc, updateDoc, GeoPoint } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js'

import { getFirestore, collection, doc, getDocs, addDoc, getDoc, updateDoc, GeoPoint, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'
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
window.updatePfp = updatePfp
window.getPfp = getPfp
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
    pfp: "data:image/jpeg;base64,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",
    friends: [],
    coordinates: new GeoPoint(0,0)
  })
}

async function updatePfp(name, image) {
  let id = ""
  await getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
        id = doc.id
      }
      })
    let docRef = doc(db, 'Users', id)

    updateDoc(docRef, {
      pfp: image
    })
  })
}
async function getPfp(name) {
  let pfp = ""
  await getDocs(userRef)
    .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
        pfp = doc.data().pfp
      }
    })
  })
  return pfp
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
  //console.log("called")
  let id = ""
  // getDocs(userRef)
  //   .then((snapshot) => {
  //   snapshot.docs.forEach((doc) => {
  //     if(doc.data().name == name) {
  //       id = doc.id
  //     }
  //     })
  //   let docRef = doc(db, 'Users', id)

  //   updateDoc(docRef, {
  //       coordinates: new GeoPoint(x, y)
  //   })
  // })

  onSnapshot(userRef, (snapshot) => {
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
  await onSnapshot(userRef, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      if(doc.data().name == name) {
          // console.log([doc.data().coordinates.longitude, doc.data().coordinates.latitude])
          data = [doc.data().coordinates.latitude, doc.data().coordinates.longitude]
      }
    })
  })
  return data
}
 export default async function getFriendCoordinates(name) {
  let friends = []
  await onSnapshot(userRef, (snapshot) => {
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
