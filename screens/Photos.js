import { View, Text, Button, Image, TextInput } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

import { useRef, useState } from 'react';

import { getStorage, ref, uploadString, uploadBytes } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAGbAKr040mHRNTHk8K-LLR6Ikac2-m4vs",
  authDomain: "monday-test-3126.firebaseapp.com",
  projectId: "monday-test-3126",
  storageBucket: "monday-test-3126.appspot.com",
  messagingSenderId: "437825696320",
  appId: "1:437825696320:web:19e7870f4b3cf0d7afa5a5"
};


const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export default function Photos() {

    const [permission, requestPermission] = Camera.useCameraPermissions();
    const camRef = useRef();

    const [cap, setCap] = useState({uri:"https://placekitten.com/500/500"});

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const CreateUser = async () => {
        const auth = getAuth();
        const signIn = await createUserWithEmailAndPassword(auth, email, password);

        console.log("signed in", signIn.user.uid);
    }

    const SignIn = async () => {
        const auth = getAuth();
        const signIn = await signInWithEmailAndPassword(auth, email, password);

        console.log("signed in", signIn.user.uid);
    }

    const HandleCapture = async () => {
        const result = await camRef.current.takePictureAsync();
        console.log(result);

        const data = await fetch(result.uri);
        const blob = await data.blob();
        console.log("blob", blob);

        const auth = getAuth();

        if(!auth.currentUser) {
            alert("No!");
            return false;
        }
        console.log("Auth", auth.currentUser.uid);

        const storageRef = ref(storage, `${auth.currentUser.uid}.jpg`)
        const upload = await uploadBytes(storageRef, blob);

        console.log("Uploading image", upload);
        setCap(result);
    }

    const UploadFile = async () => {
        const storageRef = ref(storage, 'myImageNow.jpeg');
        const message = "This is a message";
        const result = await uploadString(storageRef, message);
        console.log("uploaded", result);
    }

    if(!permission || !permission.granted) {
        return <View>
            <Text>No Permission</Text>
            <Button title="Get Camera Permission" onPress={() => requestPermission()}/>
        </View>
    }
    return <View>
        <Text>We have Permission</Text>
        <TextInput onChangeText={(text) => setEmail(text)} placeholder="Email..."/>
        <TextInput onChangeText={(text) => setPassword(text)} placeholder="Password..."/>
        <Button onPress={()=> CreateUser()} title="Register"/>
        <Button onPress={() => SignIn()} title="Sign In"/>

        <Camera ref={camRef} style={{width:100, height: 100}} type={CameraType.back}>
            <Button title="Capture" style={{width: 200, height: 200}} onPress={() => HandleCapture()}/>
        </Camera>

        <Button title="upload file" onPress={() => UploadFile()}/>

        <Image source={cap} style={{width:100, height: 100}}/>
    </View>
}