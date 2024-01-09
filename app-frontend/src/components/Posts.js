import React, {useState, useEffect} from 'react';
// import { json } from 'react-router-dom';

// API address from enviroment variables
const API = process.env.REACT_APP_API;

// Component
export const Posts = () => {

    // State variables
    // Document related
    const [posts, setPosts] = useState([]);

    const [postTitle, setPostTitle] = useState('');
    const [postAuthor, setpostAuthor] = useState('');
    const [postBody, setpostBody] = useState('');

    // Handler for post submit
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        
        // Allow actions only if none of the fields are empty
        let allowPost = (postTitle != '') && (postAuthor != '') && (postBody != '');        
        if (allowPost) {
           const response = await fetch(`${API}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        title: postTitle,
                        author: postAuthor,
                        body: postBody,
                        timestamp: (new Date()).toISOString()
                    }
                )
            });

            await getPosts();
            // todo do something/? with data
            const data = await response.json();
            console.log(data); 
        } else {
            alert('All fields must contain input.');
        }
    };


    // Function to retrieve all posts via GET to /posts
    const getPosts = async () => {
        const response = await fetch(`${API}/posts`);
        const data = await response.json();
        console.log('getPosts', data);
        
        setPosts(data);
    };

    // Function to delete a single post
    const deletePost = async (id) => {
        // Ask user for confirmation
        const userResponse = window.confirm('Confirm post deletion');
        if (userResponse) {
            const response = await fetch(`${API}/posts/${id}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}});
            const data = await response.json();
            console.log(data);
            
            await getPosts();
        }
    };


    // When the component runs, retrieve all the posts
    useEffect(() => {
        getPosts();
    }, []);

    // HTML code
    return (
        <div className='container'>
            {/* Post control menu */}
            <div className='post-menu'>
                <form onSubmit={handlePostSubmit}>
                    <div className='post-menu-group'>
                        <input type='text' onChange={e => setPostTitle(e.target.value)} value={postTitle} />
                        <input type='text' onChange={e => setpostAuthor(e.target.value)} value={postAuthor} />
                        <input type='text' onChange={e => setpostBody(e.target.value)} value={postBody} />
                    </div>

                    <button>Create</button>
                </form>
            </div>
            
            {/* Post container */}
            <div className="post-container">
            {posts.map((post) => (
                <div className='post' key={post._id}>
                    <div className='post-header'>
                        <h2>{post.title}</h2>

                        <div className='post-controls'>
                            {/* <button>Edit</button> */}
                            <button onClick={() => deletePost(post._id)}>Delete</button>
                        </div>
                        
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

        </div>
    )
};