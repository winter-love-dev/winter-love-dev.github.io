import React, { useState } from 'react';
import { navigate } from 'gatsby';
import { Autocomplete, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import './style.scss';

function PostSearch({ posts }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="search-container">
      <IconButton className="search-toggle-button" onClick={toggleSearch}>
        {isSearchOpen ? (
          <CloseIcon className="search-toggle-icon" />
        ) : (
          <SearchIcon className="search-toggle-icon" />
        )}
      </IconButton>

      {isSearchOpen && (
        <div className="search-dropdown">
          <Autocomplete
            disableClearable
            options={posts}
            onInputChange={(event, value, reason) => {
              if (reason === 'reset' && value) {
                const item = posts.find((item) => item.title === value);
                if (!item) return;
                navigate(item.slug);
                setIsSearchOpen(false);
              }
            }}
            filterOptions={(options, { inputValue }) =>
              options.filter(
                ({ title, categories }) =>
                  title.toLowerCase().includes(inputValue.toLowerCase()) ||
                  categories.some(category => category.toLowerCase().includes(inputValue.toLowerCase())),
              )
            }
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <div className="search-input-wrapper">
                <TextField
                  {...params}
                  className="search-input"
                  variant="standard"
                  size="medium"
                  autoFocus
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <SearchIcon className="search-icon" />,
                  }}
                />
              </div>
            )}
            noOptionsText="해당하는 글이 없습니다."
          />
        </div>
      )}
    </div>
  );
}
export default PostSearch;
