// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, doc, getDocs, addDoc, getDoc, updateDoc, GeoPoint } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js'

import { getFirestore, collection, doc, getDocs, addDoc, getDoc, updateDoc, GeoPoint } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyBIx0YR9Ihw_tUgEZaWELhVW0WFz86eRiU",
  authDomain: "link-412fb.firebaseapp.com",
  projectId: "link-412fb",
  storageBucket: "link-412fb.appspot.com",
  messagingSenderId: "67367116080",
  appId: "1:67367116080:web:b6eaecc447b6db9a0a3cf5"
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

  links = links.filter((value, index, self) =>
  index === self.findIndex((t) => (
    (t.source === value.source && t.target === value.target) 
    // ||
    // (t.source === value.target && t.target === value.source)
  ))
  )

  // links = links.reduce((acc, current) => {
  //   const source = acc.find(item => item.source === current.source);
  //   const target = acc.find(item => item.target === current.target);
  //   if (!source || !target) {
  //     return acc.concat([current]);
  //   } else {
  //     return acc;
  //   }
  // }, []);

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
          data = [doc.data().coordinates.latitude, doc.data().coordinates.longitude]
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
