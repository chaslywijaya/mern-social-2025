import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {
    Card,
    CardActions,
    CardContent,
    Button,
    TextField,
    Typography,
    Icon,
    useTheme // TAMBAHKAN INI
} from '@mui/material'
// HAPUS BARIS INI: import { makeStyles } from '@mui/styles'
import auth from './../auth/auth-helper'
import { Navigate, useLocation } from 'react-router-dom'
import {signin} from './api-auth.js'

export default function Signin() { // Hapus `props` karena tidak digunakan lagi di sini
  // HAPUS BARIS INI: const classes = useStyles()
  const theme = useTheme() // TAMBAHKAN INI
  const location = useLocation()

  const [values, setValues] = useState({
      email: '',
      password: '',
      error: '',
      redirectToReferrer: false
  })

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '',redirectToReferrer: true})
        })
      }
    })
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const {from} = location.state || {
      from: {
        pathname: '/'
      }
  }
  const {redirectToReferrer} = values
    if (redirectToReferrer) {
      return (<Navigate to={from}/>)
  }

  return (
      <Card 
        sx={{ // Ganti className dengan sx
          maxWidth: 600,
          margin: 'auto',
          textAlign: 'center',
          marginTop: theme.spacing(5),
          paddingBottom: theme.spacing(2)
        }}
      >
        <CardContent>
          <Typography 
            variant="h6" 
            sx={{ // Ganti className dengan sx
              marginTop: theme.spacing(2),
              color: theme.palette.openTitle
            }}
          >
            Sign In
          </Typography>
          <TextField 
            id="email" 
            type="email" 
            label="Email" 
            sx={{ // Ganti className dengan sx
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
              width: 300
            }} 
            value={values.email} 
            onChange={handleChange('email')} 
            margin="normal"
          /><br/>
          <TextField 
            id="password" 
            type="password" 
            label="Password" 
            sx={{ // Ganti className dengan sx
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
              width: 300
            }} 
            value={values.password} 
            onChange={handleChange('password')} 
            margin="normal"
          />
          <br/> {
            values.error && (
              <Typography 
                component="p" 
                color="error"
                sx={{ verticalAlign: 'middle' }} // Ganti className dengan sx
              >
                <Icon color="error" sx={{ verticalAlign: 'middle' }}>error</Icon> {/* Ganti className dengan sx */}
                {values.error}
              </Typography>
            )
          }
        </CardContent>
        <CardActions>
          <Button 
            color="primary" 
            variant="contained" 
            onClick={clickSubmit} 
            sx={{ // Ganti className dengan sx
              margin: 'auto',
              marginBottom: theme.spacing(2)
            }}
          >Submit</Button>
        </CardActions>
      </Card>
    )
}

// Tambahkan ini jika Anda sebelumnya memiliki PropTypes
Signin.propTypes = {
  // location: PropTypes.object.isRequired // Hapus ini jika `props` dihapus dari fungsi Signin
}