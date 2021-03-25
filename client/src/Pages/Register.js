import React, { useState } from 'react'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client';

const REGISTER_USER = gql`
  mutation register($username: String! $email: String! $password: String! $confirmPassword: String!) {
    register(username: $username email: $email password: $password confirmPassword: $confirmPassword) {
      username email createdAt
    }
  }
`;


export default function Register() {
    const [variables, setVariables] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    })

    const [registerUser, { data }] = useMutation(REGISTER_USER, {
        update(_, res) {
            console.log(res)
        }, onError(err) {
            console.log(err)
        }
    });

    const submitRegisterForm = (e) => {
        e.preventDefault()

        registerUser({ variables })
    }

    return (
        <Row>
            <Col className="mx-auto" sm={8} md={6} lg={4}>
                <Card className="p-4 my-5 shadow">
                    <h1>Register</h1>
                    <hr />
                    <Form onSubmit={submitRegisterForm}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={variables.username}
                                onChange={(e) => setVariables({ ...variables, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={variables.email}
                                onChange={(e) => setVariables({ ...variables, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={variables.password}
                                onChange={(e) => setVariables({ ...variables, password: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                value={variables.confirmPassword}
                                onChange={(e) => setVariables({ ...variables, confirmPassword: e.target.value })} />
                        </Form.Group>
                        <div className="text-center">
                            <Button className="mt-4" variant="success" type="submit" block>Register</Button>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}