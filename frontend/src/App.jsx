import React, { useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./App.css";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Bar, Pie } from "react-chartjs-2";

function App() {
  const [month, setMonth] = React.useState(3);
  const [page_num, setPageNum] = React.useState(1);
  const [search_query, setSearchQuery] = React.useState(null);
  const [per_page, setPerPage] = React.useState(10);

  const [items, setItems] = React.useState([]);
  const [barchartinfo, setBarChartInfo] = React.useState({
    zeroToHundred: 0,
    HundredToTwoHundred: 0,
    TwoHundredToThreeHundred: 0,
    ThreeHundredToFourHundred: 0,
    FourHundredToFiveHundred: 0,
    FiveHundredToSixHundred: 0,
    SixHundredToSevenHundred: 0,
    SevenHundredToEightHundred: 0,
    EightHundredToNineHundred: 0,
    AboveNineHundred: 0,
  });
  const [piechartinfolabels, setPieChartInfoLabels] = React.useState([]);
  const [piechartinfovalues, setPieChartInfoValues] = React.useState([]);

  async function getItems() {
    let url = `http://localhost:8080/api/search/${page_num}/${month}/${search_query}/${per_page}`;
    let api_resp = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    setItems(api_resp.data.items);
    console.log(api_resp);
  }

  async function getBarChartInfo() {
    let url = `http://localhost:8080/api/bar-chart-info/${month}`;
    let api_resp = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    setBarChartInfo({
      zeroToHundred: api_resp.data.zeroToHundred,
      HundredToTwoHundred: api_resp.data.HundredToTwoHundred,
      TwoHundredToThreeHundred: api_resp.data.TwoHundredToThreeHundred,
      ThreeHundredToFourHundred: api_resp.data.ThreeHundredToFourHundred,
      FourHundredToFiveHundred: api_resp.data.FourHundredToFiveHundred,
      FiveHundredToSixHundred: api_resp.data.FiveHundredToSixHundred,
      SixHundredToSevenHundred: api_resp.data.SixHundredToSevenHundred,
      SevenHundredToEightHundred: api_resp.data.SevenHundredToEightHundred,
      EightHundredToNineHundred: api_resp.data.EightHundredToNineHundred,
      AboveNineHundred: api_resp.data.AboveNineHundred,
    });
    console.log(api_resp);
    console.log(barchartinfo);
  }

  async function getPieChartInfo() {
    let url = `http://localhost:8080/api/pie-chart-info/${month}`;
    let api_resp = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let label_array = [];
    let values_array = [];

    let api_items = api_resp.data.items;

    for (let i = 0; i < api_items.length; i++) {
      label_array.push(api_items[i]._id);
      values_array.push(api_items[i].count);
    }

    setPieChartInfoLabels(label_array);
    setPieChartInfoValues(values_array);
  }

  useEffect(() => {
    getBarChartInfo();
    getPieChartInfo();
  }, [month]);

  useEffect(() => {
    getItems();
  }, [page_num, month, search_query, per_page]);

  function monthChangeHandler(event) {
    setMonth(event.target.value);
  }

  function searchChangeHandler(event) {
    setSearchQuery(event.target.value == "" ? null : event.target.value);
  }

  function pagesChange(event) {
    setPerPage(event.target.value);
  }

  function increasePage() {
    setPageNum((page_num) => page_num + 1);
    console.log(page_num);
  }

  function decreasePage() {
    setPageNum((page_num) => {
      page_num = page_num - 1;
      if (page_num < 1 || page_num == undefined) {
        page_num = 1;
      }
      return page_num;
    });
  }

  return (
    <>
      <div className="main-heading">
        <p>Transaction Dashboard</p>
      </div>

      <div className="header">
        <div className="search-container">
          <p className="text-heading">Search: </p>
          <input
            onChange={searchChangeHandler}
            type="text"
            name="search_input"
            id="search_input"
            value={search_query}
            placeholder="Search..."
          />
        </div>

        <div className="month-container">
          <p className="text-heading">Select Month: </p>
          <select
            name="month-selector"
            id="month-selector"
            onChange={monthChangeHandler}
          >
            <option value="3">Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>

          <tbody>
            {items.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.sold == 0 ? "false" : "true"}</td>
                  <td>
                    <img className="item-img" src={item.image} alt="" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="table-buttons-container">
        <p className="text-heading">Page No: {page_num}</p>

        <div className="table-buttons">
          <button onClick={decreasePage}>Prev</button>
          <button onClick={increasePage}>Next</button>
        </div>

        <div className="pagination">
          <p className="text-heading">Set Per Page:</p>
          <input
            type="number"
            value={per_page}
            name="per_page_setter"
            onChange={pagesChange}
            id="per_page_setter"
          />
          <p className="text-heading">Per Page: {per_page}</p>
        </div>
      </div>

      <div className="barchart-container">
        <p className="text-heading">Bar Chart Based on Monthly Transactions</p>
        <Bar
          data={{
            labels: [
              "0 to 100",
              "101 to 200",
              "201 to 300",
              "301 to 400",
              "401 to 500",
              "501 to 600",
              "601 to 700",
              "701 to 800",
              "801 to 900",
              "900+",
            ],
            datasets: [
              {
                label: "Items Count",
                data: [
                  barchartinfo.zeroToHundred,
                  barchartinfo.HundredToTwoHundred,
                  barchartinfo.TwoHundredToThreeHundred,
                  barchartinfo.ThreeHundredToFourHundred,
                  barchartinfo.FourHundredToFiveHundred,
                  barchartinfo.FiveHundredToSixHundred,
                  barchartinfo.SixHundredToSevenHundred,
                  barchartinfo.SevenHundredToEightHundred,
                  barchartinfo.EightHundredToNineHundred,
                  barchartinfo.AboveNineHundred,
                ],
              },
            ],
          }}
        />
      </div>

      <div className="piechart-container">
        <p className="text-heading">Pie Chart based on monthly transactions</p>
        <Pie
          data={{
            labels: piechartinfolabels,
            datasets: [{ label: "Items count", data: piechartinfovalues }],
          }}
        />
      </div>
    </>
  );
}

export default App;
