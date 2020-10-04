import axios from "axios";

const url = "https://covid-19-greece.herokuapp.com/refugee-camps";
const confirmedUrl = 'https://covid-19-greece.herokuapp.com/confirmed'

export const fetchData = async () => {
  try {
    const { data } = await axios.get(url);
    return data["refugee-camps"];
  } catch (error) {
    return error;
  }
};

export const fetchTotalCases = async () => {
  try {
    const confirmed_cases = await axios.get(confirmedUrl)
    return confirmed_cases.data.cases;
  } catch (error) {
    return error;
  }
};