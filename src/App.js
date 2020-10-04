import React from "react";
import { Chart, CampPicker } from "./components";
import { Typography } from "@material-ui/core";
import { fetchData, fetchTotalCases } from "./api/";
import styles from "./App.module.css";

class App extends React.Component {
  state = {
    data: [],
    selectedCamp: "",
    totalCases: [],
    camps: [],
  };

  async componentDidMount() {
    const data = await fetchData();
    const totalCases = await fetchTotalCases();
    const camps = data.map((camp) => camp.name_gr);
    this.setState({ totalCases: totalCases });
    this.setState({ data, camps });
  }

  handleCampChange = async (selectedCamp) => {
    this.setState({ selectedCamp });
  };

  render() {
    const { data, camps, selectedCamp, totalCases } = this.state;

    return (
      <div className={styles.container_outer}>
        <div className={styles.container}>
          <Typography color="textSecondary">
            <div>
              <a href="https://camps.covid19response.gr">
                <img
                  class="alignleft"
                  src="https://devpap.co.uk/wp-content/uploads/2020/07/icon1.png"
                  alt=""
                  width="22"
                  height="22"
                />
              </a>
              <a href="https://camps.covid19response.gr"> Πίσω στην Αρχική</a>
            </div>
          </Typography>
          <h2>Κρούσματα COVID19 ανά δομή φιλοξενίας</h2>
          <CampPicker camps={camps} handleCampChange={this.handleCampChange} />

          <Chart
            selectedCamp={selectedCamp}
            data={data}
            totalCases={totalCases}
          />
        </div>
        <footer>
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a id="pagelink" href="https://www.covid19response.gr/">
              Covid-19 Response Greece
            </a>
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
