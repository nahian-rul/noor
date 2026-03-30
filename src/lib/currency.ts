export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<string, Currency> = {
  BDT: { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  SAR: { code: "SAR", symbol: "ر.س", name: "Saudi Riyal" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee" },
  PKR: { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
};

export const DEFAULT_CURRENCY = CURRENCIES.USD;

export function detectCurrency(): Currency {
  try {
    const locale = Intl.NumberFormat().resolvedOptions().locale;
    const country = locale.split("-")[1]?.toUpperCase();
    
    const mapping: Record<string, string> = {
      BD: "BDT",
      US: "USD",
      SA: "SAR",
      GB: "GBP",
      AE: "AED",
      IN: "INR",
      PK: "PKR",
      // Add more common ones
    };

    const code = mapping[country] || "USD";
    return CURRENCIES[code] || DEFAULT_CURRENCY;
  } catch (e) {
    return DEFAULT_CURRENCY;
  }
}

export function formatCurrency(value: number, currency: Currency): string {
  return `${currency.symbol} ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
