import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Item from "../item/Item.js";

import "../../App.css";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      redirect: false,
      newTitle: ""
    };
  }

  componentDidMount() {
    this.getList()
      .then(res => this.setState({ list: res.list }))
      .catch(err => console.log(err));
  }

  getList = async () => {
    const response = await fetch(`/lists/${this.props.match.params.id}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("list", body);
    return body;
  };

  onDelete = async e => {
    e.preventDefault();
    const response = await fetch(
      `/lists/${this.props.match.params.id}/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("delete", response);
    this.setState({ redirect: true });
  };

  editTitle = async e => {
    e.preventDefault();
    const response = await fetch(
      `/lists/${this.props.match.params.id}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: this.state.newTitle })
      }
    );
    console.log("update", response);
    const body = await response.text();
    console.log("update body", body);
    this.setState({ newTitle: "" });
    this.getList()
      .then(res => this.setState({ list: res.list }))
      .catch(err => console.log(err));
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/lists/" />;
    }

    console.log(this.state.list);

    return (
      <div className="container">
        <h3 className="header">{this.state.list.title}</h3>
        <div className="list-container">
          <form className="list-form" onSubmit={this.editTitle}>
            <input
              type="text"
              name="title"
              value={this.state.newTitle}
              onChange={e => this.setState({ newTitle: e.target.value })}
              placeholder="Edit List Name"
            />
            <button type="submit" className="btn btn-warning edit-button">
              Edit
            </button>
          </form>
          <form className="list-form" onSubmit={this.onDelete}>
            <button type="submit" className="btn btn-danger delete-button">
              Delete
            </button>
          </form>
        </div>
        <hr />

        <Item listId={this.props.match.params.id} />
      </div>
    );
  }
}

export default List;
