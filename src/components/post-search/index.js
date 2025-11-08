import React, { useState } from 'react';
import { navigate } from 'gatsby';
import { Autocomplete, TextField, IconButton, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import './style.scss';

function PostSearch({ posts, isHeaderVisible }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // 헤더가 숨겨질 때 검색창도 닫기
  React.useEffect(() => {
    if (!isHeaderVisible) {
      setIsSearchOpen(false);
    }
  }, [isHeaderVisible]);

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
                ({ title, categories, tags }) =>
                  title.toLowerCase().includes(inputValue.toLowerCase()) ||
                  categories.some(category => category.toLowerCase().includes(inputValue.toLowerCase())) ||
                  tags.some(tag => tag.toLowerCase().includes(inputValue.toLowerCase())),
              )
            }
            getOptionLabel={(option) => option.title}
            renderOption={(props, option) => (
              <li {...props} className="search-result-item">
                <div className="search-result-content">
                  <Chip
                    icon={option.isInsight ? <LightbulbIcon /> : <ArticleIcon />}
                    label={option.isInsight ? 'Insight' : 'Article'}
                    size="small"
                    className={`search-result-badge ${option.isInsight ? 'search-result-badge--insight' : 'search-result-badge--article'}`}
                  />
                  <span className="search-result-title">{option.title}</span>
                </div>
              </li>
            )}
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
            componentsProps={{
              paper: {
                className: 'search-results-paper'
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
export default PostSearch;
