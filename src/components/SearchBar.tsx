function SearchBar() {
  return (
    <>
      <form id="search-wrap">
        <select id="select-region" className="select" required>
          <option value="">select region</option>
          <option value="asia">Asia</option>
        </select>
        <select id="select-country" className="select">
          <option>select country</option>
          <option>Japan</option>
          <option>China</option>
        </select>
        <select id="select-city" className="select">
          <option>select city</option>
          <option>Kyoto</option>
          <option>Tokyo</option>
        </select>
        {/* <input type="text" id="search-bar" placeholder="search for a keyword..."></input> */}
        <button id="find" type="submit">
          Find
        </button>
      </form>
    </>
  );
}

export default SearchBar;
