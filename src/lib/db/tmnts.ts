import axios from 'axios'
import { prisma } from "@/lib/prisma";
import { baseApi } from '../tools';
import { isValidBtDbId } from '../validation';

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

export const findTmntById = async (tmntId: string) => {
  // const url = 'http://localhost:3000/api/tmnts/tmntid'

  if (!isValidBtDbId(tmntId, 'tmt')) {
    return null;
  }
  const url = baseApi + '/tmnts/' + tmntId  
  try {
    // find tmnt in databaseby id
    const tmnt = await prisma.tmnt.findUnique({
      where: { id: tmntId },
    })
    return (tmnt) ? tmnt : null;
  } catch (error) {
    return null;
  }
}