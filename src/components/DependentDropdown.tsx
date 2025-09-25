import { useState } from "react";
import { regions, countries, cities } from "../data/locations";

const DependentDropdown = () => {
  //states to hold selected region, country, city, and other region, country
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(e.target.value);
    setAvailableCountries(countries[region] || []);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setAvailableCities(cities[country] || []);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  return (
    <div>
      {/* region dropdown */}
      <select id="region" value={selectedRegion} onChange={handleRegionChange}>
        <option value="">Select a region</option>
        {regions.map((region) => (
          <option key={region.id} value={region.name}></option>
        ))}
      </select>
      {/* country dropdown */}
      <select id="country" value={selectedCountry} onChange={handleCountryChange}>
        <option value="">Select a country</option>
        {availableCountries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {/* city dropdown */}
      <select id="city" value={selectedCity} onChange={handleCityChange}>
        <option value="">Select a city</option>
        {availableCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DependentDropdown;
