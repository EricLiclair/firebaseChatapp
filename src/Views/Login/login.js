import React, { useEffect } from 'react'
import { Form, Row, Col, Button, message, Input, Typography } from '../../Theme'
import { Link, useHistory } from 'react-router-dom'
import firebase from 'firebase'
import { updateUserData } from '../utility'
export default function Login() {
    let history = useHistory()
    const [loginForm] = Form.useForm()
    const onFinish = (values) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(values.email, values.password)
            .then((userCredentials) => {
                updateUserData(userCredentials.user.email, true).then(() => history.push('/'))
            })
            .catch((error) => {
                message.error(error.message);
                // var errorCode = error.code;
                // var errorMessage = error.message;
                console.log(error)
            });
        // firebase
        //     .auth()
        //     .createUserWithEmailAndPassword(values.email, values.password)
        //     .then((userCredential) => {
        //         writeUserData(userCredential.user.email).then(() => history.push('/'))

        //     })
        //     .catch((error) => {
        //         if (error.code === 'auth/weak-password') {
        //             message.error('The password is too weak.');
        //         } else {
        //             message.error(error.message);
        //         }
        //         // var errorCode = error.code;
        //         // var errorMessage = error.message;
        //         console.log(error)
        //     });
    }
    const onValuesChange = () => {
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                history.push('/')
            }
        })
    })

    return (
        <div style={{ width: "80%" }}>
            <Form
                layout='vertical'
                form={loginForm}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                requiredMark={true}
                onValuesChange={onValuesChange}
                style={{ width: "90%" }}
            >
                <Typography.Title level={3}>Log In</Typography.Title>
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item
                            label='Email'
                            name='email'
                            rules={[{
                                required: true,
                                message: 'required'
                            }]}
                            required={false}
                        >
                            <Input type='email' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Password'
                            name='password'
                            rules={[{
                                required: true,
                                message: 'required'
                            }]}
                            required={false}
                        >
                            <Input type='password' />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Button type='primary' htmlType='submit'>Log In</Button>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Typography.Text type='secondary'>No account?{' '}<Link to='/signup' >Signup</Link></Typography.Text>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Button
                                type='dashed'
                                onClick={() => loginForm.setFieldsValue({ email: 'testemail@gmail.com', password: 'testpassword' })}
                            >Test User 1</Button>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Button
                                type='dashed'
                                onClick={() => loginForm.setFieldsValue({ email: 'someemail@gmail.com', password: 'somepassword' })}
                            >Test User 2</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
