import React from 'react';
import {connect} from 'react-redux';
import {setCurrentUser} from '../redux/user/user.actions';
import {createUserProfileDocument, saveTokenToDatabase} from '../firebase/firebase.utils';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';  
import {navigate} from '../RootNAvigation'

class Auth extends React.Component {
    unsubscribeFromAuth = null

    componentDidMount() {
      const {currentUser, setCurrentUser} = this.props
      this.unsubscribeFromAuth = auth().onAuthStateChanged(async  userAuth => {
        if (userAuth) {
          const userRef = await createUserProfileDocument(userAuth);
          userRef.onSnapshot(snapShot => {
            setCurrentUser({
                id: snapShot.id,
                ...snapShot.data()
            })

            messaging()
            .getToken()
            .then(token => {
              
              saveTokenToDatabase(token, snapShot.id);
            })            
            });
          }
        setCurrentUser(userAuth);
        
      });
      messaging().onNotificationOpenedApp(remoteMessage => {
        const channel = {
          name: remoteMessage.notification.title
        }
        console.log('cu',currentUser)
        if (currentUser){
          console.log(1)
          navigate('Chat', {channel: channel} )
        }
      }) 

    }
  
    componentWillUnmount() {
      this.unsubscribeFromAuth();
      messaging().onTokenRefresh(token => {
        saveTokenToDatabase(token);
      })
      
    }
    render() {
        console.log(this.props.currentUser)
        return null
    }
}


const mapStateToProps = state => ({
    currentUser: state.user.currentUser
  })
  
  const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
  })
  
  export default connect(mapStateToProps,mapDispatchToProps)(Auth);