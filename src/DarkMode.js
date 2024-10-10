import { useEffect, useState } from "react";

export default function DarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [isDarkMode]);

  function handleToggleMode() {
    setIsDarkMode((mode) => !mode);
  }

  return (
    <button className="btn-toggle" onClick={handleToggleMode}>
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
}
