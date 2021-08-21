import { db } from "..";

const buildChatKey = (email1, email2) => {
    return [email1, email2].sort().join(':')
}

const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);

        // Math.imul allows 32-bit integer multiplication with C-like semantics. Float values are costly because of type conversion
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const getUser = (email) => {
    return db.ref(`users/${cyrb53(email)}`).get()
}

const writeUserData = (email, loginTime = Date.now(), logOutTime = 0) => {
    return db.ref(`users/${cyrb53(email)}`).set({
        email: email,
        last_login_time: loginTime,
        last_logout_time: logOutTime,
        chats: false,
        online: true
    });
}

const updateUserData = (email, login = true) => {
    let updates = null;
    if (login) {
        updates = {
            last_login_time: Date.now(),
            online: true
        }
    } else {
        updates = {
            last_logout_time: Date.now(),
            online: false
        }
    }
    return db.ref(`users/${cyrb53(email)}`).update(updates);
}

const setMessagesStatusDelivered = (email) => {
    const meCode = cyrb53(email)
    const updates = {}
    const userRef = db.ref(`users/${meCode}`)
    const chatRef = db.ref(`chats`)
    userRef.child('chats').get().then((res) => {
        Object.keys(res.val()).map((chatKey) => {
            chatRef.child(chatKey).child('messages').get().then((_msg) => {
                Object.keys(_msg.val()).map((time) => {
                    if (_msg.val()[time].status === 'sent' && _msg.val()[time].sender !== meCode) {
                        updates[`${chatKey}/messages/${time}/status`] = 'delivered'
                    }
                })
            })
        })
    })
    Object.keys(updates).map((path) => {
        return db.ref('chats').child(path).update(updates[path]).then((res) => console.log(res.valu()))
    })
}

const chatStatusRead = (email1, email2, msg) => {
    return db.ref('chats').child(cyrb53(buildChatKey(email1, email2))).child('messages').child(msg).update({ status: 'read' })

}

const chatExists = (email1, email2) => {
    return db.ref(`chats/${cyrb53(buildChatKey(email1, email2))}`)
        .get()
        .then((snapshot) => {
            return snapshot.exists();
        }).catch((error) => {
            console.error(error);
            return -1;
        });
}

const createNewChat = (email1, email2) => {
    // email one is the current user, email2 is the friends email
    const members = {}
    members[cyrb53(email1)] = true

    return db.ref(`chats/${cyrb53(buildChatKey(email1, email2))}`).set({
        members: members,
        messages: false
    })
}

const addChatToUsers = (email1, email2) => {
    db.ref(`users/${cyrb53(email1)}/chats`).set(cyrb53(buildChatKey(email1, email2)))
    db.ref(`users/${cyrb53(email2)}/chats`).set(cyrb53(buildChatKey(email1, email2)))
}

const sendChat = (email1, email2, chatDetails) => {
    return db.ref('/chats')
        .child(cyrb53(buildChatKey(email1, email2)))
        .child('messages')
        .child(Date.now())
        .set(chatDetails)
}

// chat exists?
// create new chat
// add chat to users

export { cyrb53, chatStatusRead, setMessagesStatusDelivered, getUser, writeUserData, updateUserData, chatExists, createNewChat, addChatToUsers, buildChatKey, sendChat };