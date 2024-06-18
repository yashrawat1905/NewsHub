/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react'

export class Newsitem extends Component {
  render() {
    let {title, description, imageUrl, newsUrl, author, date, source} = this.props;
    return (
    <div className='my-3'>
        <div className="card">
          <span className='badge rounded-pill bg-danger' style={{display: 'flex', justifyContent: 'flex-end', right: '0', position:'absolute'}}> {source} </span>
            <img src={imageUrl} className="card-img-top" alt=""/>
            <div className="card-body">
                <h5 className="card-title">{title}...</h5>
                <p className="card-text">{description}...</p>
                <p className='card-text'><small className='text-muted'>By {!author?"Unknown": author} on {new Date(date).toGMTString()}</small></p>
                <a href={newsUrl} target='blank' className="btn btn-sm btn-dark">Read More</a>
            </div>
        </div>
    </div>
    )
  }
}

export default Newsitem
