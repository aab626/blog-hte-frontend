import React, {useState, useEffect} from 'react';

// API address from enviroment variables
const API = process.env.REACT_APP_API;

// Component
export const Posts = () => {

    // State variables
    const [posts, setPosts] = useState([]);
    
    // Function to retrieve all posts via a GET to /posts
    const getPosts = async () => {
        const response = await fetch(`${API}/posts`);
        const data = await response.json();
        setPosts(data);
    }

    // When the component runs, retrieve all the posts
    useEffect(() => {
        getPosts();
    }, [])

    // console.log(posts);

    // HTML code
    return (
          <div className="container">
            {posts.map((post) => (
                <div className='post-container'>
                    <div className='post-header'>
                        <h2>{post.title}</h2>
                    </div>

                    <div className='post-body'>
                        <p>{post.body}</p>
                    </div>

                    <div className='post-footer'>
                        <div className='author'>
                            {post.author}
                        </div>

                        <div className='date'>
                            {post.timestamp}
                        </div>
                    </div>
                </div>
            ))}
          </div>
    )
};