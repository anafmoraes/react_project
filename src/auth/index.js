export const signup = user => {
    return fetch(`${process.env.REACT_APP_API}/signup`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Content-Length": "139",
            "Sec-Fetch-Dest": "empty",
            'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const login = user => {
    return fetch(`${process.env.REACT_APP_API}/login`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Content-Length": "139",
            "Sec-Fetch-Dest": "empty",
            'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const authenticate = (jwt, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next();
    }
};

export const logout = (next) => {
    if (typeof window !== "undefined")
        localStorage.removeItem("jwt");
    next();
    return fetch(`${process.env.REACT_APP_API}/logout`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const isAuthenticated = () => {
    if (typeof window === "undefined") {
        return false;
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem(("jwt")));
    } else {
        return false;
    }
};

export const forgotPassword = email => {
    console.log(`${process.env.REACT_APP_API}/forgot-password`);
    return fetch(`${process.env.REACT_APP_API}/forgot-password`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Content-Length": "139",
            "Sec-Fetch-Dest": "empty",
            'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const resetPassword = resetInfo => {
    return fetch(`${process.env.REACT_APP_API}/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export function follow (userId, token, followId) {
    return fetch(`${process.env.REACT_APP_API}/users/follow`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId, followId })
            })
                .then(response => {
                    return response.json();
                })
                .catch(err => console.log(err));
};

export function unfollow (userId, token, unfollowId) {
   return fetch(`${process.env.REACT_APP_API}/users/unfollow`, {
               method: "PUT",
               headers: {
                   Accept: "application/json",
                   "Content-Type": "application/json",
                   Authorization: `Bearer ${token}`
               },
               body: JSON.stringify({ userId, unfollowId })
           })
               .then(response => {
                   return response.json();
               })
               .catch(err => console.log(err));
};

