import React from "react";
import {Route, Switch} from 'react-router-dom';
import Home from "./core/Home";
import Signup from "./user/Signup";
import Login from "./user/Login";
import Profile from "./user/Profile";
import UserProfile from "./user/UserProfile";
import Users from "./user/Users";
import {PrivateRoute} from "./auth/PrivateRoute";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import NewPost from "./post/NewPost";
import Posts from "./post/Posts";
import {Post} from "./post/Post";
import EditPost from "./post/EditPost"
import {Schedule} from "./user/Schedule";
import Admins from "./user/Admins";
import Tags from "./tag/Tags";
import Tag from "./tag/Tag";

const MainRouter = () =>
    <>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/signup" component={Signup}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/user/:userId" component={UserProfile}/>
            <Route exact path="/users" component={Users}/>
            <Route exact path="/forgot-password" component={ForgotPassword}/>
            <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword}/>
            <PrivateRoute exact path="/post/edit/:postId" component={EditPost}/>
            <PrivateRoute exact path="/user/edit/:userId" component={Profile}/>
            <PrivateRoute exact path="/posts" component={Posts}/>
            <PrivateRoute exact path="/posts/create" component={NewPost}/>
            <Route exact path="/post/:postId" component={Post}/>
            <Route exact path="/schedule/:userId" component={Schedule}/>
            <Route exact path="/user/manage/:userId" component={Admins}/>
            <Route exact path="/tags" component={Tags}/>
            <Route exact path="/tag/:tagId" component={Tag}/>
        </Switch>
    </>;

export default MainRouter;