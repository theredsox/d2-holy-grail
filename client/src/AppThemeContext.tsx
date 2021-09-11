import { createContext } from "react";
import { purple, green, brown, grey, blue } from "@material-ui/core/colors";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export const AppThemeContext = createContext<{
  appTheme: IAppTheme;
  setAppTheme: (theme?: IAppTheme) => any;
  toggleDarkTheme: () => unknown;
}>(null);

export interface IAppTheme {
  theme: ThemeOptions;
  title: string;
}

export const defaultTheme: IAppTheme = {
  theme: {
    typography: {},
    palette: {
      primary: purple,
      secondary: green
    },
    overrides: {
      MuiPaper: {
        root: {
            margin: '10px'
        },
      },
    }
  },
  title: "Diablo II - Holy Grail"
};

export const ethTheme: IAppTheme = {
  theme: {
    typography: {},
    palette: {
      primary: brown,
      secondary: grey
    }
  },
  title: "Diablo II - Eth Grail"
};

export const runewordTheme: IAppTheme = {
  theme: {
    typography: {},
    palette: {
      primary: grey,
      secondary: brown
    }
  },
  title: "Diablo II - Runeword Grail"
};

export const partyTheme: IAppTheme = {
  theme: {
    typography: {},
    palette: {
      primary: blue,
      secondary: grey
    }
  },
  title: "Diablo II - Holy Grail Party"
};
