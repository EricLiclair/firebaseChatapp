import React, { useEffect, useState } from 'react'
import { db } from '../../../index'
import { cyrb53, buildChatKey, createNewChat, sendChat, chatStatusRead } from '../../utility'
import { Input, Button, Form, Row, Col, message } from '../../../Theme'
import { SendOutlined } from '@ant-design/icons'
import { CheckOutlined } from '@ant-design/icons'


const IconMap = {
    sent: <><CheckOutlined style={{ color: "rgba(0, 0, 0, 0.1)" }} /></>,
    delivered: <><CheckOutlined style={{ color: "rgba(0, 0, 0, 0.1)" }} /><CheckOutlined style={{ color: "rgba(0, 0, 0, 0.1)" }} /></>,
    read: <><CheckOutlined style={{ color: "green" }} /><CheckOutlined style={{ color: "green" }} /></>,
}

export default function Chatview({ user, selected }) {
    const [chats, setChats] = useState(null)
    const [senderOnline, setSenderOnline] = useState(false)
    const [chatBoxForm] = Form.useForm()
    const [conversation, setConversation] = useState(null)

    useEffect(() => {
        const chatRef = db.ref(`chats/${cyrb53(buildChatKey(user.email, selected.email))}`)

        if (user && selected) {
            const senderOnlineRef = db.ref(`users/${cyrb53(selected.email)}/online`)
            if (user.chats[cyrb53(buildChatKey(user.email, selected.email))]) {
                const updates = {}
                updates[cyrb53(user.email)] = true
                chatRef.child('members').update(updates)
                chatRef.on('value', (snapshot) => {
                    setChats(snapshot.val())
                })
                senderOnlineRef.on('value', (snapshot) => {
                    setSenderOnline(snapshot.val())
                })
                chatRef.child('messages').on('value', (snapshot) => {
                    setConversation({ ...snapshot.val() })
                })
                chats && Object.keys(chats.messages).map((msg) => {
                    const _msg = chats.messages[msg]
                    if (_msg.sender !== cyrb53(user.email) && msg.status !== 'read') {
                        chatStatusRead(user.email, selected.email, msg)
                        // db.ref(`chats/${cyrb53(buildChatKey(user.email, selected.email))}/messages/${msg}`).update({ ...chats, status: 'read' }).then((res) => { console.log(res) })
                    }
                })
            } else {
                // add chats to both users
                db.ref(`users/${cyrb53(user.email)}/chats/${cyrb53(buildChatKey(user.email, selected.email))}`).set(true)
                db.ref(`users/${cyrb53(selected.email)}/chats/${cyrb53(buildChatKey(user.email, selected.email))}`).set(true)

                // create new chats for both users
                createNewChat(user.email, selected.email)
            }
        }
        return () => {
            const updates = {}
            updates[cyrb53(user.email)] = false
            chatRef.child('members').update(updates)
            chatRef.off()
            chatRef.child('messages').off()
        }
    }, [selected])

    const msgStatus = () => {
        if (senderOnline) {
            if (chats.members[cyrb53(selected.email)]) return "read"
            else return "delivered"
        } else {
            return "sent"
        }
    }
    const msgValid = (txt) => txt && txt.replace(/\s/g, '').length;
    const onFinish = (values) => {
        if (!msgValid(values.newchat)) {
            message.error('empty chat')
            chatBoxForm.resetFields()
            return
        }
        const chatData = {
            sender: cyrb53(user.email),
            message: values.newchat,
            status: msgStatus()
        }
        sendChat(user.email, selected.email, chatData)
        chatBoxForm.resetFields()
    }
    return (
        user ? <div>
            {conversation && Object.keys(conversation).map((_msg) => {
                const msg = conversation[_msg]
                return <div>
                    <p style={{
                        textAlign: msg.sender !== cyrb53(user.email) ? "left" : "right",
                    }}>{msg.message}{" "}{msg.sender === cyrb53(user.email) && <span>{IconMap[msg.status]}</span>}</p>

                </div>
            })}
            <Form
                form={chatBoxForm}
                onFinish={onFinish}
            >
                <Row gutter={[24, 0]}>
                    <Col span={22}>
                        <Form.Item
                            name="newchat"
                        >
                            <Input autoFocus />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item>
                            <Button htmlType="submit" shape="circle" icon={<SendOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
            : <div><p>Select a chat...</p></div>
    )
}
