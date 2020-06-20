import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Loader from 'react-loader-spinner';

const Todo = props => (
    <tr>
        <td style={{textDecoration: props.todo.todo_completed ? 'line-through' : ''}}>{props.todo.todo_description}</td>
        <td style={{textDecoration: props.todo.todo_completed ? 'line-through' : ''}}>{props.todo.todo_notes}</td>
        <td style={{textDecoration: props.todo.todo_completed ? 'line-through' : ''}}>{props.todo.todo_priority}</td>
        <td>
            <Link className="text-primary" to={"/edit/" + props.todo._id}>Edit</Link> | <a className="text-danger" href="/" onClick={() => { props.deleteTodo(props.todo._id) }}>Delete</a>
        </td>
    </tr>
)

export default class TodosList extends Component {
    constructor(props) {
        super(props);
        this.state = {todos: [], loading: false};
    };

    getTodos = () => {
        this.setState({loading: true})
        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id
        fetch(`/todos/postedBy/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            this.setState({ todos: data, loading: false })
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getTodos()
    };

    deleteTodo = (id) => {
        const token = isAuthenticated().token;

        fetch(`/todos/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            this.props.history.push('/')
        })
        .catch(error => console.log(error));
    };

    todoList = () => {
        return this.state.todos.map((currentTodo, i) => {
            return <Todo deleteTodo={this.deleteTodo} todo={currentTodo} key={i} />
        })
    }

    render() {
        return (
            <div>
                {this.state.loading ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Loader type="ThreeDots" color="#5A5A5A" height="100" width="100" />
                    </div>
                ) : (
                    <>
                    <h3 className="lead">{isAuthenticated().user.name}'s Todos</h3>
                    <table className="table table-striped" style={{marginTop: 20}}>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Notes</th>
                                <th>Priority</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.todoList() }
                        </tbody>
                    </table>
                    </>
                )}
            </div>
        );
    };
};