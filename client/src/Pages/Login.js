import React from 'react'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'

export default function Login() {
    return (
        <Row>
            <Col className="mx-auto" sm={8} md={6} lg={4}>
                <Card className="p-4 my-5 shadow">
                    <h1>Login</h1>
                    <hr />

                </Card>
            </Col>
        </Row>
    )
}