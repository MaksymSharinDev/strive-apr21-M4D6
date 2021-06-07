import React from 'react'
import {Card} from 'react-bootstrap'
import '../styles/components/CommentSection.css'
import {Button, Comment, Form} from 'semantic-ui-react'



class CommentSection extends React.Component {

    state = {
        bookID: this.props.bookID,
        visible: this.props.visible,
        comments: []
    }

    getComments = async (bookID) =>
        await fetch('https://striveschool-api.herokuapp.com/api/comments/bookID',
            {
                headers: {
                    "Authorization": "Bearer " +
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
                        ".eyJfaWQiOiI2MGJlMjhiYjhkNGI4MzAwMTVlYz" +
                        "UyMjUiLCJpYXQiOjE2MjMwNzUwMDMsImV4cCI6M" +
                        "TYyNDI4NDYwM30.PGwmDGKB6uP5ZOJyBioKoMdfF" +
                        "7OK000EFHglh9JZGQY"
                }
            }
        ).then(r => r.json()).then( data => data )




    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.visible !== this.props.visible) {
            this.setState({...this.state, comments: await this.getComments()})
        }
    }
    sendComment = async ()=>{
        await fetch('https://striveschool-api.herokuapp.com/api/comments/bookID',
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " +
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
                        ".eyJfaWQiOiI2MGJlMjhiYjhkNGI4MzAwMTVlYz" +
                        "UyMjUiLCJpYXQiOjE2MjMwNzUwMDMsImV4cCI6M" +
                        "TYyNDI4NDYwM30.PGwmDGKB6uP5ZOJyBioKoMdfF" +
                        "7OK000EFHglh9JZGQY"
                },
                method: 'POST',
                body: JSON.stringify({
                    comment: this.state.commentText,
                    rate:  Math.floor(Math.random() * 5) + 1,
                    elementId: this.state.bookID
                }),
            }
        ).then(r => r.json()).then( data => this.setState( { ...this.state } ) )


    }
    trackInput = (e) =>{
        this.setState( { ...this.state, commentText : e.target.value })
        console.log( this.state )
    }
    render() {
        return (
            <div class={"commentSection m-auto"}>
                <Comment.Group>
                    <div style={{overflowY: 'scroll', scrollSnapAlign: "end"}}>
                        { this.state.comments.map(comment =>
                            <Comment>

                                <Comment.Content>
                                    <Comment.Author>Anonymous</Comment.Author>
                                    <Comment.Text>
                                        <p>
                                            { comment.comment }
                                        </p>
                                        <br/>
                                            <p>
                                                { (new Array(comment.rate)).reduce( ( acc, i) => acc+='⭐' , '') }
                                            </p>
                                    </Comment.Text>

                                </Comment.Content>
                            </Comment>
                        )}


                    </div>
                    <Form reply style={{maxHeight: "100px"}}>
                        <Form.TextArea onInput={this.trackInput}/>
                        <Button onClick={ this.sendComment } content='Add Comment' labelPosition='left' icon='edit' primary/>
                    </Form>
                </Comment.Group>
            </div>

        )
    }

}

export default CommentSection


/*
class CommentBox extends React.Component {
    constructor() {
        super();

        this.state = {
            showComments: false,
            comments: [
                {id: 1, author: "landiggity", body: "This is my first comment on this forum so don't be a dick"},
                {id: 2, author: "scarlett-jo", body: "That's a mighty fine comment you've got there my good looking fellow..."},
                {id: 3, author: "rosco", body: "What is the meaning of all of this 'React' mumbo-jumbo?"}
            ]
        };
    }

    render () {
        const comments = this._getComments();
        let commentNodes;
        let buttonText = 'Show Comments';

        if (this.state.showComments) {
            buttonText = 'Hide Comments';
            commentNodes = <div className="comment-list">{comments}</div>;
        }

        return(
            <div className="comment-box">
                <h2>Join the Discussion!</h2>
                <CommentForm addComment={this._addComment.bind(this)}/>
                <button id="comment-reveal" onClick={this._handleClick.bind(this)}>
                    {buttonText}
                </button>
                <h3>Comments</h3>
                <h4 className="comment-count">
                    {this._getCommentsTitle(comments.length)}
                </h4>
                {commentNodes}
            </div>
        );
    } // end render

    _addComment(author, body) {
        const comment = {
            id: this.state.comments.length + 1,
            author,
            body
        };
        this.setState({ comments: this.state.comments.concat([comment]) }); // *new array references help React stay fast, so concat works better than push here.
    }

    _handleClick() {
        this.setState({
            showComments: !this.state.showComments
        });
    }

    _getComments() {
        return this.state.comments.map((comment) => {
            return (
                <Comment
                    author={comment.author}
                    body={comment.body}
                    key={comment.id} />
            );
        });
    }

    _getCommentsTitle(commentCount) {
        if (commentCount === 0) {
            return 'No comments yet';
        } else if (commentCount === 1) {
            return "1 comment";
        } else {
            return `${commentCount} comments`;
        }
    }
}

class CommentForm extends React.Component {
    render() {
        return (
            <form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
                <div className="comment-form-fields">
                    <input placeholder="Name" required ref={(input) => this._author = input}></input><br />
                    <textarea placeholder="Comment" rows="4" required ref={(textarea) => this._body = textarea}></textarea>
                </div>
                <div className="comment-form-actions">
                    <button type="submit">Post Comment</button>
                </div>
            </form>
        );
    } // end render

    _handleSubmit(event) {
        event.preventDefault();   // prevents page from reloading on submit
        let author = this._author;
        let body = this._body;
        this.props.addComment(author.value, body.value);
    }
}

class Comment extends React.Component {
    render () {
        return(
            <div className="comment">
                <p className="comment-header">{this.props.author}</p>
                <p className="comment-body">- {this.props.body}</p>
                <div className="comment-footer">
                    <a href="#" className="comment-footer-delete" onClick={this._deleteComment}>Delete Comment</a>
                </div>
            </div>
        );
    }
}

 */