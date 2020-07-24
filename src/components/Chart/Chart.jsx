import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";

import styles from "./Chart.module.css";

const Chart = ({ data, selectedCamp }) => {
  const [selectedCampData, setselectedCampData] = useState();
  const [weeklyData, setweeklyData] = useState([]);

  useEffect(() => {
    let selectedData = 0;

    if (selectedCamp) {
      data.forEach((camp) => {
        if (camp.name_gr === selectedCamp) {
          camp.recorded_events.forEach((event) => {
            console.log(event.confirmed_cases);
            if (event.confirmed_cases) selectedData += event.confirmed_cases;
          });
        }
      });
      setselectedCampData(selectedData);
    } else {
      let recorded_events = data
        .map(({ recorded_events }) => {
          const cases = recorded_events.filter((weekly_case) => {
            if (
              !weekly_case.case_detection_week ||
              !weekly_case.confirmed_cases
            )
              return false;
            return true;
          });
          return cases;
        })
        .map((array) => {
          if (array.length > 0) return array;
        }).filter(array => {
          if(array) return true
          return false
        })
      //remove zero length arrays
      console.log(recorded_events);
      // const recorded_events_edited = Object.values(recorded_events.reduce((a, b) => { a[b.case_detection_week] = Object.assign(a[b.case_detection_week] || {}, b); return a; }, {}));
      const recorded_events_edited = Object.values([].concat(...recorded_events).reduce((a, {case_detection_week, confirmed_cases}) => {
        a[case_detection_week] = (a[case_detection_week] || {case_detection_week, confirmed_cases: 0});
        a[case_detection_week].confirmed_cases = String(Number(a[case_detection_week].confirmed_cases) + Number(confirmed_cases));
        return a;
      }, {}));
      setweeklyData(recorded_events_edited)
    }
  }, [data, selectedCamp]);

  const barChart =
    selectedCamp && selectedCampData !== undefined ? (
      <Bar
        data={{
          labels: ["Αποτελέσματα COVID19 tests"],
          datasets: [
            {
              label: "Βρέθηκαν με COVID19 ΑΤΟΜΑ",
              backgroundColor: [
                "rgba(255, 0, 0, 0.5)",
              ],
              data: [selectedCampData],
            },
          ],
        }}
        options={{
          legend: { display: false },
          title: { display: true, text: `Τρέχοντα κρούσματα ${selectedCamp}` },
        }}
      />
    ) : null;

  const lineChart = weeklyData[0] ? (
    <Line
      data={{
        labels: weeklyData.map(({ case_detection_week }) => case_detection_week),
        datasets: [
          {
            data: weeklyData.map((data) => data.confirmed_cases),
            label: "Κρούσματα Covid19",
            borderColor: "red",
            fill: true,
          },
        ],
      }}
    />
  ) : null;

  return (
    <div className={styles.container}>
      {selectedCamp ? barChart : lineChart}
    </div>
  );
};

export default Chart;
