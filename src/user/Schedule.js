import React, {Component} from 'react';
import Header from "../core/Header";import FormatPost from "../post/FormatPost";
import {Empty} from '../img';
import {isAuthenticated} from "../auth";
import {Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/core";
import {Default} from "react-spinners-css";
import {getSchedule} from "../post/apiPost";
import {Redirect} from "react-router-dom";
import { Heading } from "@chakra-ui/core";

export class Schedule extends Component {

    constructor() {
        super();
        this.state = {
            error: "",
            redirectToLogin: false,
            newPosts: [],
            oldPosts: [],
            loading: true,
        };
    };

    loadPosts(type) {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        getSchedule(userId, token, type)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    this.setState({loading: false, oldPosts: data.oldPosts, newPosts: data.newPosts});
                }
            })
            .catch(err => this.setState({error: err}));
    }

    componentDidMount() {
        this.setState({loading: true});
        if (isAuthenticated()) {
            this.loadPosts();
        } else this.setState({redirectToLogin: true});

    };

    render() {
        let {oldPosts, newPosts, error, loading} = this.state;
        if (this.state.redirectToLogin) return <Redirect to="/login"/>;
        return (
            <>
                <Header/>
                <div class="container">
                    <Heading as="h1" className="font-weight-light wrapper border-bottom"><strong> Minha agenda </strong></Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
                    <Tabs isFitted variant="enclosed" class="m-5">
                        <TabList>
                            <Tab _selected={{ color: "white", bg: "blue.900" }}>Próximos eventos</Tab>
                            <Tab _selected={{ color: "white", bg: "blue.900" }}>Eventos Antigos</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                {loading ? <div className="center"><Default/></div> : newPosts.length ?
                                    <section className="row center mt-5">
                                        {newPosts.map((post, i) => <FormatPost post={post} index={i}/>)}
                                    </section>
                                    : <>
                                        <Heading as="h4" className="font-weight-light wrapper"> Agenda vazia</Heading>
                                        <img src={Empty} alt='Nenhum dado encontrado'
                                             width='20%' className="center"/>
                                    </>
                                }
                            </TabPanel>
                            <TabPanel>
                                {loading ? <div className="center"><Default/></div> : oldPosts.length ?
                                    <section className="row center mt-5">
                                        {oldPosts.map((post, i) => <FormatPost post={post} index={i}/>)}
                                    </section>
                                    : <>
                                        <Heading as="h4" className="font-weight-light wrapper"> Agenda vazia</Heading>
                                        <img src={Empty} alt='Nenhum dado encontrado'
                                             width='20%' className="center"/>
                                    </>
                                }
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </>
        );
    }
}