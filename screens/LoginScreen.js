import React, { useEffect} from 'react';
import {Alert, View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as yup from 'yup';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation,currentUser}) => {
    
    useEffect(() => {
        if (currentUser) {
            navigation.navigate('ChatList', {currentUser:currentUser.id})
        }
    }

    ) 

    const handleSubmit =  ({email, password}) => {
        auth().signInWithEmailAndPassword(email,password)
        .then(()=> {
            if (currentUser) {
                navigation.navigate('ChatList', {currentUser:currentUser.id})
            } 
        })
        .catch(error => Alert.alert('Login Error', 'email or password were incorrect'))
    }

    
    const validationSchema = yup.object().shape({
        email: yup.string()
        .label('Email')
        .email('Enter a valid email')
        .required('Please enter a registered email'),
        password: yup.string()
        .label('Password')
        .required()
        .min(6, 'Password must have at least 6 characters ')
    })

    return (
        <View style={styles.container}>
        <View style={styles.circle} />
        <View style={{marginTop: 40}}>
            <Image
                source={require('../assets/chat.png')}
                style={{width: 80, height: 80, alignSelf: 'center'}} 
            />
        </View>
        <Formik
        initialValues={{email:'', password:''}}
        onSubmit={values => handleSubmit(values)}
        validationSchema={validationSchema}
        >{({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View style = {{marginHorizontal: 32}}>
                <Text style={styles.header}>Email</Text>
                <TextInput style={styles.input} placeholder='Email'
                onChangeText = {handleChange('email')} 
                onBlur={handleBlur('email')}
                value = {values.email} 
                />
                <Text style={{ color: 'red' }}>{errors.email}</Text>
                <Text style={styles.header}>Password</Text>
                <TextInput style={styles.input} placeholder='Password'
                onChangeText = {handleChange('password')} 
                onBlur={handleBlur('password')}
                value = {values.password} 
                secureTextEntry
                
                />
                <Text style={{ color: 'red' }}>{errors.password}</Text>
                <View style={{alignItems: 'flex-end', marginTop: 64}} >
                    <TouchableOpacity style={styles.continue} 
                    onPress = {handleSubmit}>
                        <Icon 
                        name='arrow-forward-outline' 
                        size={24} 
                        color='#fff'/>
                    </TouchableOpacity>
                </View>
            </View>)}
        </Formik>
    </View>
    )
}

const styles =StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#f4f5f7'
    },
    circle: {
        width:500,
        height: 500,
        borderRadius: 500/2,
        backgroundColor: '#fff',
        position: 'absolute',
        left: -120,
        top: -20
    },
    header: {
        fontWeight: '800',
        fontSize: 30,
        color: '#514e5a',
        marginTop: 20
    },
    input: {
        marginTop: 20,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#bab7c3',
        borderRadius: 30,
        paddingHorizontal: 16,
        color: '#514e5a',
        fontWeight: '600'

    },
    continue: {
        width: 70,
        height: 70,
        borderRadius: 70/2,
        backgroundColor:'#9075e3',
        alignItems: 'center',
        justifyContent: 'center',
    }
})


const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})


export default connect(mapStateToProps)(LoginScreen);