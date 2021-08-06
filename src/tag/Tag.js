import React from 'react';
import {isAuthenticated} from "../auth";
import {Redirect} from 'react-router-dom'
import {DefaultProfile} from "../img";
import Header from "../core/Header";
import FormatPost from "../post/FormatPost";
import {Heading, Image} from "@chakra-ui/core";
import {Default} from "react-spinners-css";

export default class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: {},
            error: "",
            redirectToLogin: false,
            following: false,
            loading: false
        }
    };

    read = (tagId, token) => {
        return fetch(`${process.env.REACT_APP_API}/tag/${tagId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Content-Length": "139",
                "Sec-Fetch-Dest": "empty",
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Authorization": `Bearer ${token}`
            },
        }).then(response => {
            return response.json();
        }).catch(err => console.log(err));
    };

    init = tagId => {
        const token = isAuthenticated().token;
        this.setState({loading: true});
        this.read(tagId, token)
            .then(data => {
                if (data.error) {
                    this.setState({redirectToLogin: true});
                } else {
                    this.setState({tag: data, loading: false});
                }
            })
            .catch(err => this.setState({error: err}));
    };

    componentDidMount() {
        const tagId = this.props.match.params.tagId;
        this.init(tagId);
    };


    render() {
        const {error, loading} = this.state;
        const {name, _id, posts} = this.state.tag;
        const redirectLogin = this.state.redirectToLogin;
        if (redirectLogin) return <Redirect to="/login"/>;
        const photoUrl = _id
            ? `${process.env.REACT_APP_API}/tag/photo/${_id}?${new Date().getTime()}`
            : 'DefaultProfile';
        return (
            <>
                <Header/>
                <div className="container">
                    <Heading as="h1" className="font-weight-light wrapper"><strong> {name} </strong></Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{this.error}</div>
                    <br/>
                    {
                        loading ?
                            <div className="center"><Default/></div> :
                            <div className="row center">
                                <div className="col-3">
                                    <Image
                                        rounded="full"
                                        size="150px"
                                        src={photoUrl}
                                        alt={name}
                                        className="center"
                                        fallbackSrc={DefaultProfile}
                                    />
                                </div>
                            </div>
                    }
                    <section className="row center">
                        {posts?.map((post, i) => <FormatPost post={post} index={i}/>)}
                    </section>
                </div>
            </>
        )
    }
}