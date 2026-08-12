import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "./ThemeProvider";


export default function ThemeToggle(){

  const {
    theme,
    toggleTheme,
  } = useTheme();


  return (
    <button
      onClick={toggleTheme}
      className="
      rounded-full
      p-2
      hover:bg-muted
      transition
      "
    >

      {
        theme === "light"
        ?
        <Moon size={20}/>
        :
        <Sun size={20}/>
      }

    </button>
  );
}