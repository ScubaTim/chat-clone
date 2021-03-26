import React, { useState } from 'react'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'

const REGISTER_USER = gql`
    mutation register(
        $username: String! 
        $email: String! 
        $password: String! 
        $confirmPassword: String!
    ) {
        register(
            username: $username 
            email: $email 
            password: $password 
            confirmPassword: $confirmPassword
        ) {
            username 
            email 
            createdAt
        }
    }
`

export default function Register(props) {
    const [variables, setVariables] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState({})

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, __) {
            props.history.push('/login')
        }, onError(err) {
            console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors)
        }
    })

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
                            <Form.Label className={errors.username && 'text-danger'}>{errors.username ?? 'Username'}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                className={errors.username && 'is-invalid'}
                                value={variables.username}
                                onChange={(e) => setVariables({ ...variables, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className={errors.email && 'text-danger'}>{errors.email ?? 'Email Address'}</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                className={errors.email && 'is-invalid'}
                                value={variables.email}
                                onChange={(e) => setVariables({ ...variables, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className={errors.password && 'text-danger'}>{errors.password ?? 'Password'}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                className={errors.password && 'is-invalid'}
                                value={variables.password}
                                onChange={(e) => setVariables({ ...variables, password: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className={errors.confirmPassword && 'text-danger'}>{errors.confirmPassword ?? 'Confirm Password'}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                className={errors.confirmPassword && 'is-invalid'}
                                value={variables.confirmPassword}
                                onChange={(e) => setVariables({ ...variables, confirmPassword: e.target.value })} />
                        </Form.Group>
                        <div className="text-center">
                            <Button className="mt-4 mb-2" variant="success" type="submit" block disabled={loading}>
                                {loading ? 'Loading..' : 'Register'}
                            </Button>
                            <small className="text-muted">Already have an account? <Link to="/login">Login</Link></small>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}