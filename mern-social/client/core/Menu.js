import React from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import auth from './../auth/auth-helper'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const isActive = (location, path) => {
  if (location.pathname === path)
    return {color: '#ffa726'}
  else
    return {color: '#ffffff'}
}

const Menu = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Periksa apakah auth.isAuthenticated() mengembalikan objek user atau false
  // Jika mengembalikan objek, simpan objek tersebut. Jika false, simpan false.
  const authInfo = auth.isAuthenticated(); // Ini bisa berupa {token, user: {_id, ...}} atau false

  // userId hanya akan ada jika authInfo adalah objek dan punya properti user
  const userId = authInfo && authInfo.user ? authInfo.user._id : null;
  const isAuthenticated = !!authInfo; // Ini akan menjadi true jika authInfo adalah objek (bukan false), dan false jika authInfo adalah false.

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          MERN Social
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" sx={isActive(location, "/")}>
            <HomeIcon/>
          </IconButton>
        </Link>
        {
          // Gunakan isAuthenticated yang baru dihitung
          !isAuthenticated && (<span>
            <Link to="/signup">
              <Button sx={isActive(location, "/signup")}>Sign up
              </Button>
            </Link>
            <Link to="/signin">
              <Button sx={isActive(location, "/signin")}>Sign In
              </Button>
            </Link>
          </span>)
        }
        {
          // Pastikan isAuthenticated adalah true DAN userId ada
          isAuthenticated && userId && (<span>
            <Link to={"/user/" + userId}>
              <Button sx={isActive(location, "/user/" + userId)}>My Profile</Button>
            </Link>
            <Button color="inherit" onClick={() => {
                auth.clearJWT(() => navigate('/signin'))
              }}>Sign out</Button>
          </span>)
        }
      </Toolbar>
    </AppBar>
  )
}

export default Menu;