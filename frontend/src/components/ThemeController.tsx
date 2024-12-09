const themes = [
    "light",
    "dark",
    "cupcake",
    "emerald",
    "corporate",
    "halloween",
    "garden",
    "forest",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "luxury",
    "autumn",
    "acid",
    "lemonade",
    "night",
    "coffee",
];

export const ThemeController = () => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-base-200 rounded-box z-[1] w-52 p-2 shadow-2xl mt-4"
      >
        {themes.map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label={theme}
              value={theme}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
