import React, {useState, useEffect} from 'react';
// import { json } from 'react-router-dom';

// API address from enviroment variables
const API = process.env.REACT_APP_API;

// Mode for the post submit button
let MODE_CREATE = 'MODE_CREATE';
let MODE_EDIT = 'MODE_EDIT';

// Limits for maximum post element length
let MAX_POST_TITLE_LENGTH = 50;
let MAX_POST_AUTHOR_LENGTH = 20;
let MAX_POST_BODY_LENGTH = 250;

// Component
export const Posts = ({ loginStatus }) => {

    // State variables
    // Document related
    const [submitMode, setSubmitMode] = useState(MODE_CREATE);
    const [posts, setPosts] = useState([]);

    const [submitButtonStatus, setSubmitButtonStatus] = useState(false);
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

        let data;
        if (submitMode == MODE_CREATE) {
            data = await handlePostCreation();
        } else if (submitMode == MODE_EDIT) {
            data = await handlePostEditing();
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
                    timestamp: (new Date()).toString()
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

    // Function to render the edited post flag
    const renderEditBox = (isEdited) => {
        if (isEdited) {
            return (
                <span className="badge bg-secondary">
                    Edited
                </span>
            )
        }
    }

    const renderPostControls = (post) => {
        if (loginStatus) {
            return (
                <div className="btn-group post-controls" role="group">
                    <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={() => editPost(post._id)}
                    >
                        Edit
                    </button>

                    <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={() => deletePost(post._id)}
                    >
                        Delete
                    </button>
                </div>
            );
        }
    }

    // Renders a timestamp within a post
    const renderTimestamp = (postTimestamp) => {
        var date = new Date(postTimestamp);

        var date_day = date.getDate().toString().padStart(2, '0');
        var date_month = (date.getMonth() + 1).toString().padStart(2, '0');
        var date_year = date.getFullYear()
        var date_hour = date.getHours().toString().padStart(2, '0');
        var date_minute = date.getMinutes().toString().padStart(2, '0');
        
        return (
            <small className="text-body-secondary">
                {`${date_day}/${date_month}/${date_year}, ${date_hour}:${date_minute}`}
            </small>
        );
    }

    
    // Function to enable/disable the submit button when creating/editing posts
    const handleSubmitButtonStatus = () => {
        let conditionTitle = 1 <= postTitle.length && postTitle.length <= 500;
        let conditionAuthor = 1 <= postAuthor.length && postAuthor.length <= 20;
        let conditionBody = 1 <= postBody.length && postBody.length <= 250;
        
        let allowSubmitButton = conditionTitle && conditionAuthor && conditionBody;
        setSubmitButtonStatus(allowSubmitButton);
    }


    // When the component runs, retrieve all the posts
    useEffect(() => {
        getPosts();
    }, []);

    // Handle submit button status (disabled/enabled) based on conditions about field values.
    useEffect(() => { handleSubmitButtonStatus() }, [postTitle]);
    useEffect(() => { handleSubmitButtonStatus() }, [postAuthor]);
    useEffect(() => { handleSubmitButtonStatus() }, [postBody]);

    // Handler for changes in post title input field
    const handlePostTitleChange = (newPostTitle) => {
        if (newPostTitle.length < MAX_POST_TITLE_LENGTH) {
            setPostTitle(newPostTitle);
        }
    }

    // Handler for changes in post author input field
    const handlePostAuthorChange = (newPostAuthor) => {
        if (newPostAuthor.length < MAX_POST_AUTHOR_LENGTH) {
            setPostAuthor(newPostAuthor);
        }
    }

    // Handler for changes in post body input field
    const handlePostBodyChange = (newPostBody) => {
        if (newPostBody.length < MAX_POST_BODY_LENGTH) {
            setPostBody(newPostBody);
        }
    }


    // HTML code
    return (
        <div className='container'>
            
            {/* Post menu container */}
            <div className='container post-menu'>
                <form>
                    <div className="row g-3">
                        <div className="mb-3 form-floating col-md-9">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInputValue-post-title"
                                onChange={e => handlePostTitleChange(e.target.value)}
                                value={postTitle}
                            />
                            
                            <label htmlFor="floatingInputValue-post-title">
                                Title
                            </label>
                        </div>
                        
                        <div className="mb-3 form-floating col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInputValue-post-author"
                                onChange={e => handlePostAuthorChange(e.target.value)}
                                value={postAuthor}
                            />

                            <label htmlFor="floatingInputValue-post-author">
                                Author
                            </label>
                        </div>

                    </div>


                    <div className="mb-3 form-floating">
                        <textarea
                            type="textarea"
                            className="form-control"
                            id="floatingTextarea2-post-message"
                            style={{ height: 150 }}
                            onChange={e => handlePostBodyChange(e.target.value)}
                            value={postBody}
                        />
                        <label htmlFor="floatingTextarea2-post-message">Message</label>
                    </div>

                    <div className="row g-3">
                        <div className='col-md-9'></div>
                        
                        <div className='col-md-3 d-grid col-6 mx-auto"'>
                            <button 
                                type="button" 
                                className="btn btn-block btn-primary"
                                onClick={e => handleFormSubmit(e)}
                                disabled={!submitButtonStatus}
                            >

                                {submitButtonText}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Separator between post menu and posts */}
            <hr className="hr hr-blurry" />
            
            {/* Post container */}
            <div className="container post-container">
                {posts.map((post) => (

                    <div className="card border-secondary mb-3 post" key={post._id} >
                        <div className="card-header post-header">
                            <h2>{post.title}</h2>
                            <small className="text-body-secondary">{post.author}</small>
                        </div>

                        <div className="card-body text-dark post-body">
                            <p className="card-text">
                            {post.body}
                            </p>
                        </div>

                        <div className="card-footer bg-transparent row align-items-center">
                            {/* Post Controls */}
                            <div className='col align-self-start'>
                                {renderPostControls(post)}
                            </div>

                            {/* Edit Flag and Timestamp */}
                            <div className='col-md-1 text-center'>
                                {renderEditBox(post.edited)}
                            </div>

                            <div className='col-auto align-self-end text-center'>
                                {renderTimestamp(post.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
};