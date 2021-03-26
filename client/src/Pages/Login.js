import React, { useState } from 'react'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { gql, useLazyQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

const LOGIN_USER = gql`
  query login(
      $username: String!
      $password: String!
    ) {
      login(
          username: $username 
          password: $password
      ) {
      username 
      createdAt
      token
    }
  }
`

export default function Login(props) {

    const [variables, setVariables] = useState({
        username: '',
        password: '',
    })

    const [errors, setErrors] = useState({})

    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        onCompleted(data) {
            localStorage.setItem('token', data.login.token)
            props.history.push('/')
        }
    })

    const submitLoginForm = (e) => {
        e.preventDefault()
        loginUser({ variables })
    }
    return (
        <Row>
            <Col className="mx-auto" sm={8} md={6} lg={4}>
                <Card className="p-4 my-5 shadow">
                    <h1>Login</h1>
                    <hr />
                    <Form onSubmit={submitLoginForm}>
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
                            <Form.Label className={errors.password && 'text-danger'}>{errors.password ?? 'Password'}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                className={errors.password && 'is-invalid'}
                                value={variables.password}
                                onChange={(e) => setVariables({ ...variables, password: e.target.value })} />
                        </Form.Group>
                        <div className="text-center">
                            <Button className="mt-4 mb-2" variant="success" type="submit" block disabled={loading}>
                                {loading ? 'Loading..' : 'Login'}
                            </Button>
                            <small className="text-muted">Don't have an account? <Link to="/register">Register</Link></small>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}