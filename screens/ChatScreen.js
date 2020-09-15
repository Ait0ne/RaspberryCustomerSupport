import React from 'react';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { sendMessage}  from '../firebase/firebase.utils';
import {GiftedChat,Bubble} from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';



class ChatScreen extends React.Component {
    state = {
        messages: []
    }
    unsubscribeFromMessages = null
    componentDidMount() {
        firestore().collection('Chat').doc(`${this.props.route.params.channel.name}`).update({
            userMessages:false
        })        
        this.unsubscribeFromMessages = firestore().collection('Chat').doc(`${this.props.route.params.channel.name}`).collection(`messages`).where('createdAt','>',1590246123874 ).orderBy('createdAt','desc')
            .onSnapshot((docs) => {

                const messages=[] 
                docs.forEach(function(doc) {
                    messages.push(doc.data());
                });
                this.setState({messages:messages})    
            })
    }
    componentWillUnmount() {
        firestore().collection('Chat').doc(`${this.props.route.params.channel.name}`).update({
            userMessages:false
        })
        this.unsubscribeFromMessages()
        
    }


    renderBubble = (props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor:'white'  ,
                color: 'black',
                marginRight: 60,
              },
            }}
          />
        );
      }

    render() {
        const {currentUser} = this.props
        const {messages} = this.state
        const gidtedMessages = messages.map(message => ({...message,_id:message.id, user:{_id:message.user.id} }))
        const giftedUser = {...currentUser,_id:currentUser.id}
        const chat = <GiftedChat messages={gidtedMessages}
        renderBubble={this.renderBubble}
        renderAvatar={null}
        onSend={(message) => sendMessage(message, this.props.route.params.channel.name, currentUser.id)} user = {giftedUser}/>;
        if (Platform.OS === 'android') {
            return (
                
                <KeyboardAvoidingView
                style={{flex: 1, width:'100%'}}
                
                enabled>
                    {chat}
                </KeyboardAvoidingView>
            )
        }

        return <SafeAreaView style={{flex:1}}>{chat}</SafeAreaView>
        // return (
        //     <View>
        //         {console.log(this.props.route.params.channel.name)}
        //         {
        //             messages.length? messages.map(message => <Text>{message.text}</Text>)
        //             : null
        //         }
        //     </View>
    // )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(ChatScreen);