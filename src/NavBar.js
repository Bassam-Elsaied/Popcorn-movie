function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Resault({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies ? movies.length : 0}</strong> results
    </p>
  );
}

export { NavBar, Resault };
