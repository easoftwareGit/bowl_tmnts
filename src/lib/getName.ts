import { brktType, divType, elimType, potType } from "@/lib/types/types";

const findDiv = (id: string, divs: divType[]): divType | undefined => {
  return divs.find((div) => div.id === id);
}

export const getPotName = (pot: potType, divs: divType[]): string => {
  const foundDiv: divType | undefined = findDiv(pot.div_id, divs)
  return (foundDiv)
    ? pot.pot_type + ' - ' + foundDiv.div_name
    : '';
}

export const getBrktOrElimName = (id: string, features: brktType[] | elimType[]): string => {
  const found: brktType | elimType | undefined = features.find((feat) => feat.id === id)
  return (found)
    ? found.div_name + ': ' + found.start + '-' + (found.start + found.games - 1)
    : '';
}
