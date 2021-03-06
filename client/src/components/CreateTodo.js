import React, {Component} from 'react';
import { isAuthenticated } from '../auth';
import Spinner from './Spinner';
export default class CreateTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todo_description: "",
            todo_notes: "",
            todo_priority: "",
            todo_completed: false,
            error: "",
            loading: false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            error: ""
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.setState({ loading: true })
        const newTodo = {
            todo_description: this.state.todo_description,
            todo_notes: this.state.todo_notes,
            todo_priority: this.state.todo_priority,
            todo_completed: false,
            postedBy: isAuthenticated().user._id
        }

        if (!newTodo.todo_description) {
            return this.setState({ error: "Description required", loading: false})
        }
        if (!newTodo.todo_priority) {
            return this.setState({ error: "Priority required", loading: false})
        }
        if (newTodo.todo_notes.length > 50 || newTodo.todo_description.length > 50) {
            return this.setState({ error: "Text fields must be under 50 characters.", loading: false})
        }

        const token = isAuthenticated().token

        fetch('/api/v1/todos/add', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newTodo)
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            this.setState({
                todo_description: '',
                todo_notes: '',
                todo_priority: '',
                todo_completed: false
            })
            this.props.history.push('/');
        })
        .catch(err => console.log(err))
    }
    render() {
        const { todo_description, todo_notes, todo_priority, error, loading } = this.state;
        return (
            <>
                {loading ? (
                    <Spinner/>
                ) : (
                    <>
                        <div style={{marginTop: 10}}>
                        <h3 className="mt-5 mb-5">Create New Todo</h3>
                        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                            {error}
                        </div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Description</label>
                                <input 
                                    type="text"
                                    name="todo_description"
                                    className="form-control"
                                    value={todo_description}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Notes: </label>
                                <input 
                                        type="text" 
                                        name="todo_notes"
                                        className="form-control"
                                        value={todo_notes}
                                        onChange={this.handleChange}
                                        />
                            </div>
                            <div className="form-group">
                                <div className="form-check form-check-inline">
                                    <input  className="form-check-input" 
                                            type="radio" 
                                            name="todo_priority" 
                                            id="priorityLow" 
                                            value="Low"
                                            checked={todo_priority==='Low'} 
                                            onChange={this.handleChange}
                                            />
                                    <label className="form-check-label">Low</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input  className="form-check-input" 
                                            type="radio" 
                                            name="todo_priority" 
                                            id="priorityMedium" 
                                            value="Medium" 
                                            checked={todo_priority==='Medium'} 
                                            onChange={this.handleChange}
                                            />
                                    <label className="form-check-label">Medium</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input  className="form-check-input" 
                                            type="radio" 
                                            name="todo_priority" 
                                            id="priorityHigh" 
                                            value="High" 
                                            checked={todo_priority==='High'} 
                                            onChange={this.handleChange}
                                            />
                                    <label className="form-check-label">High</label>
                                </div>
                            </div>
                            <br />
                            <input type="submit" value="Create Todo" className="btn btn-raised btn-primary" />
                        </form>
                    </div>
                </>
                )}
            </>
        )
    }
}