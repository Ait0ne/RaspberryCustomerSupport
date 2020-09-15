import firestore from '@react-native-firebase/firestore';





export const createUserProfileDocument = async (userAuth,data) => {
    if (!userAuth) return;
    console.log(userAuth.uid)
    const userRef = await firestore().collection('users').doc(`${userAuth.uid}`)


    const snapshot = await userRef.get();
    console.log('snapshot',snapshot)

    if (!snapshot.exists) {
        const {displayName,email} = userAuth;
        const createdAt = new Date()
        try{
             await userRef.set({
                displayName,
                email,
                createdAt,
                ...data,
            })
        
        } catch (err) {
            console.log('error creating user', err.message)
        }
    }
    return userRef;
}

export const sendMessage = async (message, channel, id) => {

    const chatRef = firestore().collection('Chat').doc(`${channel}`).collection(`messages`).doc(`${new Date()}`)
    try {
        await chatRef.set({
            id:new Date(),
            text:message[0].text,
            createdAt: new Date().getTime(),
            user: {id:id}
        })
    } catch (err) {
        console.log(err.message)
    }


};

export const saveTokenToDatabase = async (token, id) => {

    await firestore()
    .collection('users')
    .doc(`${id}`).
    update({
        tokens: firestore.FieldValue.arrayUnion(token)
    })
}



