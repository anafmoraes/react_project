import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {
    faCalendar,
    faHeart,
    faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import {isAuthenticated} from "../auth";
import {Image, Box} from "@chakra-ui/core";
import LikeTagButton from "./LikeTagButton";

export default class FormatTag extends Component {

    constructor() {
        super();
        this.state = {
            tag: {},
            like: false,
        }
    };

    componentDidMount() {
        this.setState({
            tag: this.props.tag,
            like: this.checkLike(this.props.tag),
        });
    };

    checkLike = tag => {
        if (!tag.likes) return false;
        const jwt = isAuthenticated();
        return tag.likes.find(like => {
            return like === jwt.user._id || like._id === jwt.user._id;
        });
    };

    clickLikeButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.tag._id).then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({tag: data, like: !this.state.like});
            }
        });
    };

    tagCard() {
        const {_id, name, likes, posts} = this.state.tag;
        return <Box maxW="sm" borderWidth="1px" rounded="lg" overflow="hidden" m={3} p={2} borderColor={'gray.300'}>
            <Image
                   size="150px"
                   margin='auto'
                   src={`${process.env.REACT_APP_API}/tag/photo/${_id}?${new Date().getTime()}`}
                   alt={name}
                   fallbackSrc='https://via.placeholder.com/200'/>
            <Box p="2">
                <Box mt="1"
                     fontWeight="semibold"
                     lineHeight="tight"
                     isTruncated>
                    {name}
                </Box>
            </Box>
            <Box d="inline" m="2" alignItems="center">
                <FontAwesomeIcon icon={faHeart} color='red'/>
                <Box as="span" ml="2" color="gray.600" fontSize="sm">
                    {likes?.length} Curtidas
                </Box>
            </Box>
            <Box d="inline" m="2" alignItems="center">
                <FontAwesomeIcon icon={faCalendar} color='gray'/>
                <Box as="span" ml="2" color="gray.600" fontSize="sm">
                    {posts?.length} Eventos
                </Box>
            </Box>
            <Box d="block" m="2" alignItems="center">
                <Link to={`/tag/${_id}`} className="btn btn-primary m-1" data-toggle="tooltip" data-placement="top" title="Detalhes">
                    <FontAwesomeIcon icon={faInfoCircle}/>
                </Link>
                <LikeTagButton
                    like={this.state.like}
                    onButtonClick={this.clickLikeButton}/>
            </Box>

        </Box>
    }

    render() {
        return this.tagCard();
    }
};