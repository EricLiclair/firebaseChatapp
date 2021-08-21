import React, { useEffect, useState } from 'react'
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';
import { updateUserData } from '../utility';
import { db } from '../..';
import { getUser, setMessagesStatusDelivered } from '../utility';
import { Button, Layout, Menu } from '../../Theme';
import { Chatview } from '../Components';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    CheckCircleFilled,
    PlusCircleFilled
} from '@ant-design/icons';
import './dashboard.css'


const { Header, Content, Sider } = Layout;


export default function Dashboard() {
    let history = useHistory();
    const [user, setUser] = useState(null)
    const [allUsers, setAllUsers] = useState({})
    const [currUser, setCurrUser] = useState(null)
    const [selected, setSelected] = useState(null)
    const [collapsed, setCollapsed] = useState(false)
    const signOut = () => {
        firebase.auth().signOut().then(() => {
            updateUserData(user.email, false)
            console.log('logged out', user.email)
        });
    }
    const toggle = () => {
        setCollapsed(!collapsed)
    }
    // check if user exists
    const userRef = db.ref('/users')
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setCurrUser(user)
                setMessagesStatusDelivered(user.email)
                getUser(user.email).then(res => setUser(res.val()))

                userRef.on('value', (snapshot) => {
                    for (const [key, value] of Object.entries(snapshot.val())) {
                        if (value.email !== user.email) {
                            allUsers[key] = value
                        }
                    }
                    setAllUsers({ ...allUsers })
                })

                // ...
            } else {
                setUser(null)
                history.push('/login');
            }
        });
        return () => {
            userRef.off()
        }
    }, [currUser])

    console.log("changes")
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <Menu theme="dark" mode="inline" onSelect={({ key, ...rest }) => { setSelected(allUsers[key]) }}>
                    {Object.keys(allUsers).map(_usr => {
                        return <Menu.Item key={_usr} icon={allUsers[_usr]['online'] ? <CheckCircleFilled style={{ color: "#0F9D58" }} /> : <PlusCircleFilled rotate={45} style={{ color: "#DB4437" }} />} >
                            {allUsers[_usr]['email']}
                        </Menu.Item>
                    })}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: "0" }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                        style: { margin: "0 1rem" }
                    })}
                    <Button onClick={signOut} type="primary">Sign Out</Button>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {selected && <Chatview user={user} selected={selected} />}
                    {selected?.email}
                </Content>
            </Layout>
        </Layout>
    )
}
