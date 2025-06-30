import React  from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect } from 'react';
import { useState } from 'react';


const News=(props)=> {

  const[articles,setArticles]=useState([])
  const[loading,setLoading]=useState(true)
  const[page,setPage]=useState(1)
  const[totalResults,setTotalResults]=useState(0)


const capitalizedFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


const updateNews= async()=>{
  props.setProgress(10);
  const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
  setLoading(true)
  let data= await fetch(url);
    props.setProgress(30);
  let parsedData= await data.json()
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.setTotalResults)
    setLoading(false)
  console.log(parsedData+"is working");
props.setProgress(100);
}

useEffect(()=>{
  document.title=`${capitalizedFirstLetter(props.category)} - NewsCloud`;
  updateNews();
  // eslint-disable-next-line 
},[])

/*const handlePrevClick= async ()=>{
setPage(page-1)
updateNews();
}
const handleNextClick= async ()=>{
setPage(page+1)
updateNews()
}*/

const fetchMoreData = async () => {
const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
setPage(page+1)
  let data= await fetch(url);
  let parsedData= await data.json()
  console.log(parsedData+"is working");
  setArticles(articles.concat(parsedData.articles))
  setTotalResults(parsedData.totalResults)
 
  };



  
    return (
      <>
        <h1 style={{marginTop:'210px'}}className='text-center my-3'>Top {capitalizedFirstLetter(props.category)} headlines</h1>
      {loading && <Spinner/>}
      <InfiniteScroll dataLength={articles.length} next={fetchMoreData} hasMore={articles.length !==totalResults} loader={<Spinner/>}>
      <div className="container">
        <div className="row">
            {articles && articles.map((element)=>{
            return <div className="col-md-4 my-3" key={element.url}>
            <NewsItem title={element.title.slice(0,45)} description={element.description ? element.description.slice(0, 80) : "No description available"} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
        })}
        </div>  
        </div>
        </InfiniteScroll>
      </>
    )
  }


  News.propTypes={
    country:PropTypes.string,
    pageSize:PropTypes.number,
    category:PropTypes.string
  }
export default News
