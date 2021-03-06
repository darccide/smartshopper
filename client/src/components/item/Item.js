import React, { Component } from "react";
import UpdateItem from "./UpdateItem.js";

import "../../App.css";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      description: "",
      purchased: false,
      newDescription: ""
    };
  }

  componentDidMount() {
    this.getItems()
      .then(res => this.setState({ items: res.items }))
      .catch(err => console.log(err));
  }

  getItems = async () => {
    const response = await fetch(`/lists/${this.props.listId}/items/all`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("getItems", body.items);
    return body;
  };

  updateItem = () => {
    this.getItems()
      .then(res => this.setState({ items: res.items }))
      .catch(err => console.log(err));
  };

  onSubmit = async e => {
    e.preventDefault();
    const response = await fetch(`/lists/${this.props.listId}/items/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description: this.state.description,
        purchased: this.state.purchased
      })
    });
    console.log(response);
    this.getItems()
      .then(res => this.setState({ items: res.items }))
      .catch(err => console.log(err));

    this.setState({ description: "" });
  };

  purchasedItem = async (itemId, e) => {
    e.preventDefault();

    const response = await fetch(
      `/lists/${this.props.listId}/items/${itemId}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ purchased: true })
      }
    );
    console.log("purchased", response);
    this.getItems()
      .then(res => this.setState({ items: res.items }))
      .catch(err => console.log(err));
  };

  unpurchasedItem = async (itemId, e) => {
    e.preventDefault();

    const response = await fetch(
      `/lists/${this.props.listId}/items/${itemId}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ purchased: false })
      }
    );
    console.log("unpurchased", response);
    this.getItems()
      .then(res => this.setState({ items: res.items }))
      .catch(err => console.log(err));
  };

  deleteItem = async (itemId, e) => {
    e.preventDefault();

    const response = await fetch(
      `/lists/${this.props.listId}/items/${itemId}/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("destroy", response);
    this.getItems()
      .then(res => this.setState({ items: res.items }))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="container">
        <h3>Items:</h3>
        <div className="items">
          {this.state.items.map((item, index) => (
            <div className="item" key={index}>
              <p className="item" key={index}>
                {item.description}
              </p>
              <div className="item">
                <UpdateItem updateItem={this.updateItem} itemId={item.id} />
              </div>

              {item.purchased ? (
                <button
                  className="btn btn-secondary item unpurchase-btn"
                  type="button"
                  onClick={this.unpurchasedItem.bind(this, item.id)}
                  value="Unmark as Purchased"
                >
                  $
                </button>
              ) : (
                <button
                  className="btn btn-success item purchase-btn"
                  type="button"
                  onClick={this.purchasedItem.bind(this, item.id)}
                  value="Mark as Purchased"
                >
                  $
                </button>
              )}

              <button
                className="btn btn-danger item delete-btn"
                type="button"
                onClick={this.deleteItem.bind(this, item.id)}
                value="Delete Item"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className="newItem">
          <form className="newItemForm" onSubmit={this.onSubmit}>
            <input
              type="text"
              name="description"
              size="40"
              className="new-item-input"
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
              placeholder="Item Description"
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

export default Item;
