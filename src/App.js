import React from "react";
import { Chart, CampPicker } from "./components";
import { Typography } from '@material-ui/core';
import { fetchData } from "./api/";
import styles from "./App.module.css";


class App extends React.Component {
  state = {
    data: [],
    selectedCamp: "",
    camps: [],
  };

  async componentDidMount() {
    const data = await fetchData();
    const camps = data.map((camp) => camp.name_gr);
    
    this.setState({ data, camps });
  }

  handleCampChange = async (selectedCamp) => {
    this.setState({ selectedCamp });
  };



  render() {
    const { data, camps, selectedCamp } = this.state;

    return (
      <div className={styles.container}>
         <Typography color="textSecondary">
              Menu
            </Typography>
        <h2>Κρούσματα COVID19 ανα δομή φιλοξενίας</h2>
       
        <CampPicker camps={camps} handleCampChange={this.handleCampChange} />
        
        <Chart
          selectedCamp={selectedCamp}
          data={data}
        />
        <h4>Εβδομαδιαία κατανομή Κρουσμάτων COVID19</h4>
      </div>
    );
  }
}

export default App;
