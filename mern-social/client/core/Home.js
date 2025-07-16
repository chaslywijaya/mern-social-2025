// client/core/Home.js
import React, {useState, useEffect} from 'react'
// HAPUS BARIS INI: import { makeStyles } from '@mui/styles'
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    useTheme // TAMBAHKAN INI UNTUK MENGAKSES TEMA MUI V5
} from '@mui/material'
import unicornbikeImg from './../assets/images/unicornbike.jpg'
import auth from './../auth/auth-helper'
import FindPeople from './../user/FindPeople'
import Newsfeed from './../post/Newsfeed'
import { useLocation } from 'react-router-dom';

// HAPUS SELURUH BLOK useStyles INI:
// const useStyles = makeStyles(theme => ({
//   root: {
//     flexGrow: 1,
//     margin: 30,
//   },
//   card: {
//     maxWidth: 600,
//     margin: 'auto',
//     marginTop: theme.spacing(5),
//     marginBottom: theme.spacing(5)
//   },
//   title: {
//     padding: theme.spacing(3, 2.5, 2),
//     color: theme.palette.text.secondary
//   },
//   media: {
//     minHeight: 400
//   },
//   credit: {
//     padding: 10,
//     textAlign: 'right',
//     backgroundColor: '#ededed',
//     borderBottom: '1px solid #d0d0d0',
//     '& a':{
//       color: '#3f4771'
//     } 
//   }
// }))

export default function Home(){ 
  // GANTI BARIS INI: const classes = useStyles();
  const theme = useTheme(); // GANTI DENGAN INI UNTUK MENGAKSES TEMA
  const location = useLocation();
  const [defaultPage, setDefaultPage] = useState(false);

  useEffect(() => {
    setDefaultPage(auth.isAuthenticated());
  }, [location.key, auth.isAuthenticated().token]);

    return (
      // GANTI className DENGAN sx:
      <div sx={{ flexGrow: 1, margin: 30 }}>
        { !defaultPage &&
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Card 
                // GANTI className DENGAN sx:
                sx={{
                  maxWidth: 600,
                  margin: 'auto',
                  marginTop: theme.spacing(5),
                  marginBottom: theme.spacing(5)
                }}
              >
                <Typography 
                  variant="h6" 
                  // GANTI className DENGAN sx:
                  sx={{
                    padding: theme.spacing(3, 2.5, 2),
                    color: theme.palette.text.secondary
                  }}
                >
                  Home Page
                </Typography>
                {/* GANTI className DENGAN sx: */}
                <CardMedia sx={{ minHeight: 400 }} image={unicornbikeImg} title="Unicorn Bicycle"/>
                <Typography 
                  variant="body2" 
                  component="p" 
                  // GANTI className DENGAN sx:
                  sx={{
                    padding: theme.spacing(1.25), // Misalnya, jika 1.25 * 8px = 10px
                    textAlign: 'right',
                    backgroundColor: '#ededed',
                    borderBottom: '1px solid #d0d0d0',
                    '& a':{
                      color: '#3f4771'
                    } 
                  }}
                  color="textSecondary"
                >Photo by <a href="https://unsplash.com/@boudewijn_huysmans" target="_blank" rel="noopener noreferrer">Boudewijn Huysmans</a> on Unsplash</Typography>
                <CardContent>
                  <Typography type="body1" component="p">
                    Welcome to the MERN Social home page. 
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        }
        {defaultPage &&
          <Grid container spacing={8}>
            <Grid item xs={8} sm={7}>
              <Newsfeed/>
            </Grid>
            <Grid item xs={6} sm={5}>
              <FindPeople/>
            </Grid>
          </Grid>
        }
      </div>
    );
}