import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import moment from "moment";

import styles from "./Chart.module.css";

const Chart = ({ data, selectedCamp, totalCases }) => {
  const [selectedCampData, setselectedCampData] = useState([]);
  const [weeklyData, setweeklyData] = useState([]);
  const [totalCasesFormated, settotalCasesFormated] = useState([]);

  useEffect(() => {
    let cases = [];

    if (selectedCamp) {
      let selectedData = data.map((camp) => {
        if (camp.name_gr === selectedCamp) {
          camp.recorded_events.forEach((event) => {
            if (event.confirmed_cases) {
              cases.push({
                case_detection_week: event.case_detection_week,
                confirmed_cases: event.confirmed_cases,
              });
            }
          });
        }
      });
      setselectedCampData(cases);
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
        })
        .filter((array) => {
          if (array) return true;
          return false;
        });

      recorded_events.forEach((event) => {
        event.forEach((item) => {
          let case_detection_week = item.case_detection_week;
          let str = case_detection_week.split("-");
          const newStr =
            moment(str[0], "DD/MM/YYYY").format("DD/MM/YYYY") +
            " - " +
            moment(str[1], "DD/MM/YYYY").format("DD/MM/YYYY");
          item.case_detection_week = newStr;
        });
      });
      //remove zero length arrays
      // const recorded_events_edited = Object.values(recorded_events.reduce((a, b) => { a[b.case_detection_week] = Object.assign(a[b.case_detection_week] || {}, b); return a; }, {}));
      const recorded_events_edited = Object.values(
        []
          .concat(...recorded_events)
          .reduce((a, { case_detection_week, confirmed_cases }) => {
            a[case_detection_week] = a[case_detection_week] || {
              case_detection_week,
              confirmed_cases: 0,
            };
            a[case_detection_week].confirmed_cases = String(
              Number(a[case_detection_week].confirmed_cases) +
                Number(confirmed_cases)
            );
            return a;
          }, {})
      );

      // recorded_events_edited.sort((a, b) => a.case_detection_week.localeCompare(b.case_detection_week));

      recorded_events_edited.sort(function (a, b) {
        let date1 = a.case_detection_week.split("-")[0];
        let date2 = b.case_detection_week.split("-")[0];
        return moment(date1, "DD/MM/YYYY") - moment(date2, "DD/MM/YYYY");
      });

      let cases = new Array(recorded_events_edited.length).fill(0);
      recorded_events_edited.map(({ case_detection_week }, index) => {
        const dates = case_detection_week.split("-");
        const startDate = moment(dates[0], "DD/MM/YYYY");
        const endDate = moment(dates[1], "DD/MM/YYYY");
        totalCases.forEach((item) => {
          const itemDate = moment(item.date, "YYYY-MM-DD");
          if (
            itemDate.isBetween(startDate, endDate) ||
            itemDate.isSame(startDate) ||
            itemDate.isSame(endDate)
          ) {
            cases[index] = cases[index] + item.confirmed;
          }
        });
      });
      settotalCasesFormated(cases);
      setweeklyData(recorded_events_edited);
    }
  }, [data, selectedCamp]);

  const barChart = selectedCampData[0] ? (
    <Line
      options={{
        title: {
          display: true,
          text: `Επιβεβαιωμένα κρούσματα δομής ${selectedCamp}`,
        },
      }}
      data={{
        labels: selectedCampData.map(
          ({ case_detection_week }) => case_detection_week
        ),
        datasets: [
          {
            data: selectedCampData.map((data) => data.confirmed_cases),
            label: "Κρούσματα Covid19",
            borderColor: "rgba(255, 0, 0, 0.5)",
            fill: true,
          },
        ],
      }}
    />
  ) : (
    <span style={{ marginBottom: "35px" }}>
      Δεν υπάρχουν καταγεγραμμένα κρούσματα στη δομή {selectedCamp}.
    </span>
  );

  const lineChart = weeklyData[0] ? (
    <Line
      options={{
        title: {
          display: true,
          text: "Συνολικά επιβεβαιωμένα κρούσματα δομών",
        },
      }}
      data={{
        labels: weeklyData.map(
          ({ case_detection_week }) => case_detection_week
        ),
        datasets: [
          {
            data: weeklyData.map((data) => data.confirmed_cases),
            label: "Κρούσματα Covid19",
            borderColor: "red",
            fill: true,
          },
          {
            data: totalCasesFormated,
            label: "Συνολικά κρούσματα της χώρας",
            borderColor: "green",
            fill: true,
          },
        ],
      }}
    />
  ) : null;

  return (
    <>
      <div className={styles.container}>
        {selectedCamp ? barChart : lineChart}
      </div>
      {selectedCamp && selectedCampData[0] ? (
        <h4>Εβδομαδιαία κατανομή Κρουσμάτων COVID19</h4>
      ) : null}
      {!selectedCamp && <h4>Εβδομαδιαία κατανομή Κρουσμάτων COVID19</h4>}
    </>
  );
};

export default Chart;
