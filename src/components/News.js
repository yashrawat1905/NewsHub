import React, { useState, useEffect } from 'react';
import NewsItem from './Newsitem'; // Ensure the correct import casing
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const location = useLocation();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    setLoading(true);
    const { country, category, apiKey, pageSize } = props;
  
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    if (category === 'search') {
      const query = new URLSearchParams(location.search).get('query');
      url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&pageSize=${pageSize}&page=${page}`;
    }
  
    try {
      let data = await fetch(url);
      if (!data.ok) {
        throw new Error('Failed to fetch');
      }
      let parsedData = await data.json();
      setArticles(parsedData.articles || []);
      setTotalResults(parsedData.totalResults || 0);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Handle error state or display error message to the user
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    document.title = `NewsHub - ${capitalizeFirstLetter(props.category)}`;
    updateNews();
    // eslint-disable-next-line
  }, [location.pathname, location.search, page]);

  const handlePrevClick = async () => {
    setPage(page - 1);
  };

  const handleNextClick = async () => {
    setPage(page + 1);
  };

  return (
    <div className='container my-3'>
      <h1 className='text-center' style={{ margin: '35px 0px', marginTop: '90px' }}>
        NewsHub - Top {capitalizeFirstLetter(props.category === 'search' ? 'Search Results' : props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <div className='row mt-5'>
        {!loading && articles.length > 0 && articles.map((element) => {
          return (
            <div className='col-md-4' key={element.url}>
              <NewsItem
                title={element.title ? element.title.slice(0, 45) : ""}
                description={element.description ? element.description.slice(0, 88) : ""}
                imageUrl={element.urlToImage}
                newsUrl={element.url}
                author={element.author}
                date={element.publishedAt}
                source={element.source.name}
              />
            </div>
          );
        })}
        {!loading && articles.length === 0 && <p>No articles found.</p>}
      </div>
      <div className='container d-flex justify-content-between'>
        <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick}>
          &larr; Previous
        </button>
        <button disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

News.defaultProps = {
  country: 'in',
  pageSize: 10,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
};

export default News;
