import React from 'react';
import { View,  FlatList } from 'react-native';
import { ListItem } from 'react-native-elements'
import moment from 'moment';
import firestore from '@react-native-firebase/firestore'; 
import {connect} from 'react-redux';



class ChatListScreen extends React.Component {
    state = {
        channels: [] 
    }

    getchannels = null

    componentDidMount() {

        this.getchannels = 
            firestore().collection('Chat').orderBy('time','desc')
            .onSnapshot(userRef => {
                const newChannels = []
                userRef.docs.map(doc => {
                         newChannels.push(doc.data())
                    });
                this.setState({channels:newChannels})
            })
    }


    componentWillUnmount() {
        this.getchannels()

    }

    keyExtractor = (item, index) => index.toString()
    
    curDate = new Date()

    renderItem = ({item}) => (
        <ListItem
                rightSubtitleStyle={item.userMessages===true?{color:'#4AC959'}:null}
                badge={item.userMessages===true?{status:'success'}:null}
                title={item.name.toString()}
                titleStyle={{fontWeight:'bold'}}
                subtitle={item.text}
                rightSubtitle={`${item.time?`${new Date().getUTCDate()===new Date(item.time.toDate()).getUTCDate() ? moment(item.time.toDate()).local().format("HH:mm"):moment(item.time.toDate()).local().format("DD/MM/YYYY")} `:''}`}
                bottomDivider
                chevron
                onPress={()=> this.props.navigation.navigate('Chat', {channel:item})}
                />
    )    
        
        
    render() {
    const {route, navigation,...props} =this.props
    const {currentUser} = route.params;
    const {channels} = this.state
    return (
        
        <View>
            
            <FlatList
            keyExtractor={this.keyExtractor}
            data={channels}
            extraData={this.state}
            renderItem={this.renderItem}
            />
        </View>
    )}
}


const mapStateToProps = state => ({
    currentUser: state.user.currentUser
}) 

export default connect(mapStateToProps)(ChatListScreen);