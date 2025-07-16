// client/theme.js
import { createTheme } from '@mui/material/styles'; // Pastikan ini dari @mui/material/styles (untuk v5+)

const theme = createTheme({
  palette: {
    primary: {
      light: '#757de8',
      main: '#3f51b5',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff79b0',
      main: '#ff4081',
      dark: '#c60055',
      contrastText: '#fff',
    },
    openTitle: '#3f4771',
    protectedTitle: '#5d83ae',
    mode: 'light'
  },
  // ... properti tema lainnya
});

export default theme;