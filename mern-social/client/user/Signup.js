import React, {useState} from 'react'
import {
    Card,
    CardActions,
    CardContent,
    Button,
    TextField,
    Typography,
    Icon,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme // TAMBAHKAN INI
} from '@mui/material'
// HAPUS BARIS INI: import { makeStyles } from '@mui/styles'
import {create} from './api-user.js'
import {Link} from 'react-router-dom'

// HAPUS SELURUH BLOK useStyles INI:
// const useStyles = makeStyles(theme => ({ ... }));

export default function Signup (){
  // HAPUS BARIS INI: const classes = useStyles()
  const theme = useTheme() // TAMBAHKAN INI
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: ''
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    debugger
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    }
    create(user).then((data) => {
      debugger
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({ ...values, error: '', open: true})
      }
    })
  }

    return (<div>
      <Card
        sx={{ // GANTI className DENGAN sx:
          maxWidth: 600,
          margin: 'auto',
          textAlign: 'center',
          marginTop: theme.spacing(5),
          paddingBottom: theme.spacing(2)
        }}
      >
        <CardContent>
          <Typography
            variant="h6" // Gunakan variant yang sesuai, `type="title"` sudah deprecated
            sx={{ // GANTI className DENGAN sx:
              marginTop: theme.spacing(2),
              color: theme.palette.openTitle
            }}
          >
            Sign Up
          </Typography>
          <TextField
            id="name"
            label="Name"
            sx={{ // GANTI className DENGAN sx:
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
              width: 300
            }}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          /><br/>
          <TextField
            id="email"
            type="email"
            label="Email"
            sx={{ // GANTI className DENGAN sx:
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
            sx={{ // GANTI className DENGAN sx:
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
              width: 300
            }}
            value={values.password}
            onChange={handleChange('password')}
            margin="normal"
          />
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon
                color="error"
                sx={{ verticalAlign: 'middle' }} // GANTI className DENGAN sx:
              >
                error
              </Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            sx={{ // GANTI className DENGAN sx:
              margin: 'auto',
              marginBottom: theme.spacing(2)
            }}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
      <Dialog open={values.open} disableBackdropClick={true}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>)
}