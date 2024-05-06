import { v4 as uuidv4 } from 'uuid';
import { isValidBtDbType } from './validation';

export const btDbUuid = (type: string): string => {
  if (!isValidBtDbType(type)) return "";
  const uuid = uuidv4().replace(/-/g, '');
  return `${type}_${uuid}`
}