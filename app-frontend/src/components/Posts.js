import React, {useState, useEffect} from 'react';
// import { json } from 'react-router-dom';

// API address from enviroment variables
const API = process.env.REACT_APP_API;
let MODE_CREATE = 'MODE_CREATE';
let MODE_EDIT = 'MODE_EDIT';

// Component
export const Posts = () => {

    // State variables
    // Document related
    const [submitMode, setSubmitMode] = useState(MODE_CREATE);
    const [posts, setPosts] = useState([]);

    const [submitButtonText, setSubmitButtonText] = useState('Post');

    // Form fields
    const [postTitle, setPostTitle] = useState('');
    const [postAuthor, setPostAuthor] = useState('');
    const [postBody, setPostBody] = useState('');
    
    // Selected Post Id for editing
    const [postEditId, setPostEditId] = useState('');

    
    // Handler for post/edit button press
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        let noEmptyFields = (postTitle != '') && (postAuthor != '') && (postBody != '');
        let data;
        if (submitMode == MODE_CREATE) {
            if (noEmptyFields) {
                data = await handlePostCreation();
            } else {
                alert('All fields must contain input.');
            }
        
        } else if (submitMode == MODE_EDIT) {
            if (noEmptyFields) {
                data = await handlePostEditing();
            } else {
                alert('All fields must contain input.');
            }
        }


        if (typeof data !== 'undefined') {
            console.log(data);
        }
    }


    const handlePostCreation = async () => {
        // API request to create new post
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

        // Update posts
        await getPosts();

        // Clean inputs
        setPostTitle('');
        setPostAuthor('');
        setPostBody('');
        
        // Return result
        const data = await response.json();
        return data;
    }


    const handlePostEditing = async () => {
        // API request to update current post
        const response = await fetch(`${API}/posts/${postEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: postTitle,
                    author: postAuthor,
                    body: postBody
                }
            )
        });

        // Update posts
        await getPosts();

        // Clean inputs
        setPostTitle('');
        setPostAuthor('');
        setPostBody('');

        // Set form mode to post creation
        setSubmitMode(MODE_CREATE);
        setSubmitButtonText('Post');

        // Return result
        const data = await response.json();
        return data;
    }


    // Function to retrieve all posts via GET to /posts
    const getPosts = async () => {
        const response = await fetch(`${API}/posts`);
        const data = await response.json();
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

    // Function to edit a single post
    const editPost = async (id) => {
        const response = await fetch(`${API}/posts/${id}`, {method: 'GET'});
        const data = await response.json();
        setSubmitMode(MODE_EDIT);
        setSubmitButtonText('Confirm Edit');
        
        setPostTitle(data.title);
        setPostAuthor(data.author);
        setPostBody(data.body);
        setPostEditId(id);
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
                <form onSubmit={handleFormSubmit}>
                    <div className='post-menu-group'>
                        Title <input type='text' onChange={e => setPostTitle(e.target.value)} value={postTitle} />
                        Message <input type='text' onChange={e => setPostBody(e.target.value)} value={postBody} />
                        Author <input type='text' onChange={e => setPostAuthor(e.target.value)} value={postAuthor} />
                    </div>

                    <button>{submitButtonText}</button>
                </form>
            </div>
            
            {/* Post container */}
            <div className="post-container">
            {posts.map((post) => (
                <div className='post' key={post._id}>
                    <div className='post-header'>
                        <h2>{post.title}</h2>

                        <div className='post-controls'>
                            <button onClick={() => editPost(post._id)}>Edit</button>
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