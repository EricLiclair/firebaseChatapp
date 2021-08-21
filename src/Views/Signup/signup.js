import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Form, Row, Col, Input, Button, Typography, message } from '../../Theme'
import firebase from "firebase/app";
import "firebase/auth"
import { writeUserData } from '../utility'

export default function Signup({ userMod }) {
    let history = useHistory();
    const [signUpForm] = Form.useForm()
    const onValuesChange = (changedValues, allValues) => {
    }

    const onFinish = (values) => {
        if (values.password !== values.password2) {
            message.error('Passwords do not match');
            signUpForm.resetFields();
            signUpForm.setFieldsValue({ email: values.email.toString() })
            return;
        }

        firebase
            .auth()
            .createUserWithEmailAndPassword(values.email, values.password)
            .then((userCredential) => {
                writeUserData(userCredential.user.email).then(() => history.push('/'))
            })
            .catch((error) => {
                if (error.code === 'auth/weak-password') {
                    message.error('The password is too weak.');
                } else {
                    message.error(error.message);
                }
                // var errorCode = error.code;
                // var errorMessage = error.message;
                console.log(error)
            });
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                history.push('/')
            }
        })
    }, [])


    return (
        <div style={{ width: "80%" }}>
            <Form
                layout='vertical'
                form={signUpForm}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                requiredMark={true}
                onValuesChange={onValuesChange}
            >
                <Typography.Title level={3}>Sign Up</Typography.Title>
                <Row gutter={[24, 0]}>
                    <Col span={24}>
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
                    <Col span={12}>
                        <Form.Item
                            label='Confirm Password'
                            name='password2'
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
                            <Button type='primary' htmlType='submit'>Sign Up</Button>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Typography.Text type='secondary'>Have an account?{' '}<Link to='/login' >Login</Link></Typography.Text>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Button
                                type='dashed'
                                onClick={() => signUpForm.setFieldsValue({ email: 'testemail@gmail.com', password: 'testpassword', password2: 'testpassword' })}
                            >Test User 1</Button>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Button
                                type='dashed'
                                onClick={() => signUpForm.setFieldsValue({ email: 'someemail@gmail.com', password: 'somepassword', password2: 'somepassword' })}
                            >Test User 2</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div >
    )
}
