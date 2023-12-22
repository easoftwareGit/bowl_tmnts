import axios from 'axios'
import { baseApi } from '../tools';

export const getTmntResults = async () => {
  // const url = 'http://localhost:3000/api/tmnts/results'
  const url = baseApi + '/tmnts/results'  
  try {
    const response = await axios.get(url)
    if (response.status === 200 && response.data) {
      return response.data; // response.data is already JSON'ed
    } else {
      console.log('Tmnt Results - Non error return, but not status 200');
      return [];
    }
  } catch (error) {
    return [];
  }
}

export const getTmntUpcoming = async () => {
  // const url = 'http://localhost:3000/api/tmnts/upcoming'
  const url = baseApi + '/tmnts/upcoming'  
  try {
    const response = await axios.get(url)
    if (response.status === 200 && response.data) {
      return response.data; // response.data is already JSON'ed
    } else {
      console.log('Tmnt Upcoming - Non error return, but not status 200');
      return [];
    }
  } catch (error) {
    return [];
  }
}