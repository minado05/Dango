function SearchBar() {
  return (
    <>
      <form id="search-wrap">
        <select id="select-region" className="select">
          <option>select region</option>
          <option>Asia</option>
        </select>
        <select id="select-country" className="select">
          <option>select country</option>
          <option>Japan</option>
          <option>China</option>
        </select>
        <input type="text" id="search-bar" placeholder="search for a keyword..."></input>
        <button id="find" type="submit">
          Find
        </button>
      </form>
    </>
  );
}

export default SearchBar;
