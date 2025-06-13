const Filter = ({ current, setFilter }) => (
  <div>
    {['All', 'Active', 'Completed'].map(type => (
      <button key={type} onClick={() => setFilter(type)} disabled={current === type}>
        {type}
      </button>
    ))}
  </div>
);

export default Filter;
