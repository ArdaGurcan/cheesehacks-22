// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

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
const colRef = collection(db, "Users")

getGraphData()
function getData(snapshot) {
  let nodes = []
  let links = []

  snapshot.docs.forEach((doc) => {
    let user = { name: doc.data().name }
    nodes.push(user)
    doc.data().friends.forEach((friend) => {
      let link = {target: friend, source: doc.data().name, strength: 1}
      links.push(link)
    })
  })
  return [nodes, links]
  // console.log(nodes)
  // console.log(links)
}

function getGraphData() {
  let nodes = []
  let links = []
  getDocs(colRef)// returns a promise
    .then((snapshot) => {
      let data = getData(snapshot);
      nodes = data[0]
      links = data[1]
    })
    .catch(err => {
      console.log(err.message)
    })
}




