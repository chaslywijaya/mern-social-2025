import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Typography,
  useTheme,
  Box, // Import Box for easier styling of plain div elements
} from '@mui/material'
import { ImageList, ImageListItem } from '@mui/material'

export default function FollowGrid(props) {
  const theme = useTheme()

  return (
    // Use Box component for convenient sx prop usage on a div-like element
    <Box
      sx={{
        paddingTop: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        background: theme.palette.background.paper,
      }}
    >
      <ImageList
        cols={4}
        sx={{
          width: 500,
          height: 220, // This height combined with rowHeight will control the layout
        }}
        // rowHeight is crucial for ImageList. Set it to accommodate your content.
        // If your avatar is 60px and you want some space for text, 120-160px is reasonable.
        rowHeight={160} // Adjusted to allow space for both avatar and name
      >
        {props.people.map((person, i) => (
          <ImageListItem
            key={i}
            // You can remove the explicit height on ImageListItem if rowHeight on ImageList is sufficient
            // If you need more granular control per item, you can use sx here,
            // but ensure it aligns with ImageList's rowHeight.
            // For now, let ImageList control the height based on rowHeight.
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center', // Center content vertically
                padding: theme.spacing(1), // Add some padding around each item
            }}
          >
            <Link to={"/user/" + person._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Avatar
                src={'/api/users/photo/' + person._id}
                sx={{
                  width: 60,
                  height: 60,
                  margin: 'auto', // Centering the avatar
                }}
              />
              <Typography
                sx={{
                  textAlign: 'center',
                  // Adjust margin to ensure it fits within the item and doesn't overlap
                  // Considering avatar height is 60px, and padding.
                  // You might need to experiment with this value.
                  marginTop: theme.spacing(1), // Use theme spacing for consistency
                  fontSize: '0.875rem', // Smaller font size for names if needed
                }}
              >
                {person.name}
              </Typography>
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  )
}

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
}