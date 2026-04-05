export interface CityData {
  city: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

export const CITIES: CityData[] = [
  { city: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125, timezone: "Asia/Dhaka" },
  { city: "Makkah", country: "Saudi Arabia", lat: 21.4225, lng: 39.8262, timezone: "Asia/Riyadh" },
  { city: "Madinah", country: "Saudi Arabia", lat: 24.4672, lng: 39.6024, timezone: "Asia/Riyadh" },
  { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.0060, timezone: "America/New_York" },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai" },
  { city: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lng: 101.6869, timezone: "Asia/Kuala_Lumpur" },
  { city: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, timezone: "Europe/Istanbul" },
  { city: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo" },
  { city: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, timezone: "Asia/Karachi" },
  { city: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, timezone: "Asia/Jakarta" },
  { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, timezone: "America/Toronto" },
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney" },
  { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, timezone: "Europe/Berlin" },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris" },
  { city: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898, timezone: "Africa/Casablanca" },
  { city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, timezone: "Asia/Kolkata" },
  { city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, timezone: "Africa/Lagos" },
  { city: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, timezone: "Africa/Nairobi" },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore" },
];

export const findNearestCityByTimezone = (tz: string): CityData | null => {
  return CITIES.find(c => c.timezone === tz) || null;
};
