import React, { Component } from "react";
import "./Today.css";
import axios from "axios";
import Pusher from "pusher-js";

class Today extends Component {
  state = {
    btcprice: 0,
    ltcprice: 0,
    ethprice: 0
  };

  //let’s create a simple function that takes in an argument and sends it to the backend server API.
  sendPricePusher(data) {
    axios
      .post("/prices/new", {
        prices: data
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  saveStateToLocalStorage = () => {
    localStorage.setItem("today-state", JSON.stringify(this.state));
  };

  restoreStateFromLocalStorage = () => {
    const state = JSON.parse(localStorage.getItem("today-state"));
    this.setState(state);
  };

  // This is called when an instance of a component is being created and inserted into the DOM.
  componentDidMount() {
    if (!navigator.onLine) {
      return this.saveStateToLocalStorage();
    }

    // establish a connection to Pusher
    this.pusher = new Pusher("APP_KEY", {
      cluster: "eu",
      encrypted: true
    });
    // Subscribe to the 'coin-prices' channel
    this.prices = this.pusher.subscribe("coin-prices");

    axios
      .get(
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD"
      )
      .then(({ data: { BTC, ETH, LTC } }) => {
        // Since we're never using responseh or data directly might aswell deconstruct it here

        this.setState(
          {
            btcprice: BTC.USD,
            ethprice: ETH.USD,
            ltcprice: LTC.USD
          },
          this.saveStateToLocalStorage
        ); // You can pass a callback function to setState
      })
      .catch(console.error);

    // Let's store this interval in our class so that we can remove it in componentWillUnmount
    this.cryptoSubscription = setInterval(() => {
      axios
        .get(
          "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD"
        )
        .then(({ data }) => {
          // This is a style question, I prefed doing it this way, to each its own
          this.sendPricePusher(data);
          console.log(data);
          this.setState({
            btcprice: data.BTC.USD,
            ethprice: data.ETH.USD,
            ltcprice: data.LTC.USD
          });
        })
        .catch(console.error);
    }, 10000);
    console.log("111");

    // We bind to the 'prices' event and use the data in it (price information) to update the state values, thus, realtime changes
    this.prices.bind(
      "prices",
      ({ prices: { BTC, ETH, LTC } }) => {
        console.log("bind lai data");

        this.setState(
          {
            btcprice: BTC.USD,
            ethprice: ETH.USD,
            ltcprice: LTC.USD
          },
          this.saveStateToLocalStorage
        );
      },
      this
    );
  }
  componentWillUnmount() {
    clearInterval(this.cryptoSubscription);
  }
  // The render method contains the JSX code which will be compiled to HTML.
  render() {
    return (
      <div className="today--section container">
        <h2>Current Price</h2>
        <div className="columns today--section__box">
          <div className="column btc--section">
            <h5>${this.state.btcprice}</h5>
            <p>1 BTC</p>
          </div>
          <div className="column eth--section">
            <h5>${this.state.ethprice}</h5>
            <p>1 ETH</p>
          </div>
          <div className="column ltc--section">
            <h5>${this.state.ltcprice}</h5>
            <p>1 LTC</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Today;
