import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { POSTS } from '../../Redux/types';
import { Scrollbars } from 'rc-scrollbars'
import './Homepage.scss';


const Homepage = ({ dispatch, user }) => {
    const [posts, setPosts] = useState([]);
    const [terms, setTerms] = useState('')  // Para borrar los inputs una vez se ha producido el submit


    const useInterval = (callback, delay) => {
        const savedCallback = useRef();
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [callback, delay]);

    }
    useInterval(async () => {
        console.log('Refreshing Timeline')
        let res = await axios.get('http://localhost:3000/readallposts')
        setPosts(res.data)
        dispatch({ type: POSTS, payload: res.data })
    }, 1000)




    const submitPost = async (event) => {
        try {
            event.preventDefault();
            const options = { headers: { Authorization: `Bearer ${user.token}` } };
            const newPost = {
                text: event.target.text.value,
                postedBy: user._id
            };
            await axios.post('http://localhost:3000/post', newPost, options);
        } catch (error) {
            console.log(error)
        }

    }

    const makeComment = (text, _id) => {
        axios('http://localhost:3000/commentpost/' + _id
            , {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                data: JSON.stringify({

                    text: text
                })
            })
            .then(result => {
                console.log(result)
                const newPost = posts.map(post => {
                    if (post._id === result._id) {
                        return result
                    } else {
                        return post
                    }
                })
                setPosts(newPost)

            }).catch(err => {
                console.log(err)
            })
    }


    const submitLike = (_id) => {
        axios('http://localhost:3000/likepost/' + _id
            , {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            })
            .then(result => {
                console.log(result)
                const newPost = posts.map(post => {
                    if (post._id === result._id) {
                        return result
                    } else {
                        return post
                    }
                })
                setPosts(newPost)

            }).catch(err => {
                console.log(err)
            })
    }



    return (
        <div className='homepage'>
            <div className='mainContainer'>

                <div className='profile'>
                    <div className="headerProfile"><h2>My Profile</h2></div>
                    <div className='photoProfile'>
                        <img src={user.photo}></img></div>
                    <div className='infoProfile'><h4><div>{user.name}&nbsp;{user.surname}</div><div>Age: {user.age}</div><div>{user.address}</div></h4><div>"{user.bio}"</div></div>
                </div>

                <div className='TLContainer'>
                    <div className="header"><h2>What are people talking about?</h2></div>
                    <Scrollbars style={{ width: 1000, height: 450 }}>
                        <div className="posts">
                            {posts?.map(post =>
                                <div className="cardPost" key={post._id}>
                                    <div className="cardPostHeader"><h3>Posted by:</h3> <b>{post.name} {post.surname}</b></div>
                                    <div className="cardPostText">{post.text}</div>
                                    <div className="cardCommentHeader"><h4>Leave your comment</h4></div>
                                    <div className="cardPostComment">{post.comments.map(comment =>
                                        <div className="cardMapComment" key={comment._id}>
                                            <div className="cardCommentText"><b>{comment.name} {comment.surname}</b> commented: <em>"{comment.text}"</em></div></div>)}</div>
                                    <div className="inputBox">
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            makeComment(e.target[0].value, post._id)
                                        }}>
                                            <input className="inputComment" type="text" placeholder="Hit enter to add a comment " />
                                        </form>


                                        <button type="button" className="likeButton" onClick={() => { submitLike(post._id) }} >Like Post ({post.likeCount})</button>

                                    </div>

                                </div>)}
                        </div>
                    </Scrollbars>
                    <div className="newPostBox">
                        <form onSubmit={submitPost}>

                            <textarea className="newPost" type="text" name='text' placeholder="And you? What you're thinking about?"></textarea>
                            <button type="submit" className="newPostButton"><h3>Share your wisdom</h3></button>

                        </form>
                    </div>

                </div>
            </div>
        </div>



    )
}

const mapStateToProps = state => {

    return {
        user: state.user,
        posts: state.posts
    }
}


export default connect(mapStateToProps)(Homepage);

