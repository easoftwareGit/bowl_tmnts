import { formatValue } from "@/lib/currency";
import { LocaleConfig } from "@/lib/currency/components/utils";

export const formatValueSymbSep2Dec = (value: string, localConfig: LocaleConfig): string => {
  return formatValue({
    value,
    groupSeparator: localConfig.groupSeparator,
    decimalSeparator: localConfig.decimalSeparator,
    prefix: localConfig.prefix,
    suffix: localConfig.suffix,
    decimalScale: 2,
    disableGroupSeparators: false,
  });
}

export const formatValue2Dec = (value: string, localConfig: LocaleConfig) => {
  return formatValue({
    value,
    decimalSeparator: localConfig.decimalSeparator,
    decimalScale: 2,
    disableGroupSeparators: true,
  });
}