import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../../App.css";

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      listTitle: ""
    };
  }

  componentDidMount() {
    this.getAllLists()
      .then(res => this.setState({ lists: res.lists }))
      .catch(err => console.log(err));
  }

  getAllLists = async () => {
    const response = await fetch("/lists/all");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("getAllLists", body.lists);
    return body;
  };

  onSubmit = async e => {
    e.preventDefault();
    const response = await fetch("/lists/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: this.state.listTitle })
    });
    console.log(response);
    this.getAllLists()
      .then(res => this.setState({ lists: res.lists }))
      .catch(err => console.log(err));

    this.setState({ listTitle: "" });
  };

  render() {
    return (
      <div className="container-lists">
        <h4 className="lists-header"> CURRENT SMARTSHOPPER LISTS: </h4>
        <div className="lists">
          {this.state.lists.map((list, index) => (
            <Link to={`/lists/${list.id}`} key={index} className="list-link">
              <p className="list-title">{list.title}</p>
            </Link>
          ))}
        </div>
        <div className="newList">
          <form className="newListForm" onSubmit={this.onSubmit}>
            <input
              type="text"
              name="title"
              className="new-title-form"
              value={this.state.listTitle}
              onChange={e => this.setState({ listTitle: e.target.value })}
              placeholder="New List Title"
            />
            <button type="submit" className="btn btn-dark">
              {" "}
              +
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Lists;
