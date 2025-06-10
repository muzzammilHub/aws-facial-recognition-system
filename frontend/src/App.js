import { useState } from "react";
import './App.css';
const uuid = require('uuid');



function App(){
    const [image, setImage] = useState('');
    const [uploadResultMessage, setUploadResultMessage] = useState('Upload an image to authenticate');
    const [visitorName, setVisitorName] = useState('placeholder.jpeg')
    const [isAuth, setAuth] = useState(false);


    function sendImage(e){
        e.preventDefault();
        setVisitorName(image.name);
        const visitorImageName = uuid.v4();
        console.log("**********",visitorImageName)
        fetch(`https://zuljt6fqdj.execute-api.ap-south-1.amazonaws.com/dev/project-visitor-images-bucket/${visitorImageName}.jpeg`,{
          method: 'PUT',
          headers:{
            'Content-Type': 'image/jpeg'
          },
          body:image
        }).then(async ()=>{
            console.log('1.Muzzammil Hussain');
            const response = await authenticate(visitorImageName);
            console.log('Response******',response);
            if(response.Message === 'Success'){
                setAuth(true);
                setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, warm welcome`);
            }
            else{
                setAuth(false);
                setUploadResultMessage('Image not matched with the image stored into database');
            }
        }).catch(error => {
            console.log('2.Muzzammil Hussain');
            setAuth(false);
            setUploadResultMessage('There is an error during authentication: try again');
            console.error(error);
        })
    }

    async function authenticate(visitorImageName){
        console.log("*************", visitorImageName);
        const requestUrl = 'https://zuljt6fqdj.execute-api.ap-south-1.amazonaws.com/dev/employee?' + new URLSearchParams({
            objectKey: `${visitorImageName}.jpeg`
        });
        console.log("**********", requestUrl);
        return await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then((data)=>{
            return data;
        }).catch(error => {
            console.log('3.Muzzammil Hussain');
            console.error(error);
        });
    }


    return(
        <div className = "App">
            <p>Facial Recognition System</p>
            <form onSubmit={sendImage} className="image-input-container">
                <input type='file' name='image' onChange={e => setImage(e.target.files[0])} className="input-img"/>
                <button type="submit" className="input-btn">Authenticate</button>
            </form>
            <div className={isAuth ? 'Success' : 'Fail'} style={{fontSize: "1rem", fontFamily:"sans-serif"}}>{uploadResultMessage}</div>
            <img src={require(`./visitors/${visitorName}`)} height={250} width={250} alt="photo"/>
        </div>
    )
}

export default App;