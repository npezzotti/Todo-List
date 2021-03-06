import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { signin, authenticate } from '../auth';
import Spinner from './Spinner';
export default class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirect: false,
            loading: false
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value, error: "" })
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.setState({ loading: true })
        const { email, password } = this.state;
        const user = {
            email,
            password
        }
        signin(user)
        .then(data => {
            if (data.error) {
                this.setState({ error: data.error, loading: false })
            } else {
                authenticate(data, () => {
                    this.setState({ redirect: true })
                })
            }
        })
    }

    signupForm = (email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} value={email} type="email" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} value={password} type="password" className="form-control" />
            </div>
            <button onClick={this.onSubmit} className="btn btn-raised btn-primary">Submit</button>
        </form>
    )

    render() {
        const { email, password, error, redirect, loading } = this.state
        if (redirect) {
            return <Redirect to='/' />
        }
        return (
            <div className="container">
                {loading ? (
                    <Spinner/>
                ) : (
                    <>
                        <h2 className="mt-5">Sign in</h2>
                        <p className="mb-5">New user? <Link to='/signup'>Sign up here.</Link> </p>
                        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                            {error}
                        </div>
                        {loading ? (
                            <div className="jumbotron text-center">
                                <h2>Loading</h2>
                            </div> 
                        ) : (
                            ""
                        )}
                        {this.signupForm(email, password)}
                        <p>
                            <Link to="/forgot-password" className="text-danger">
                                Forgot Password
                            </Link>
                        </p>
                    </>
                )}
            </div>
        )
    }
}
