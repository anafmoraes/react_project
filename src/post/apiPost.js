export const create = (userId, token, post) => {
    return fetch(`${process.env.REACT_APP_API}/post/new/${userId}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "Authorization": `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const edit = (postId, token, post) => {
    return fetch(`${process.env.REACT_APP_API}/post/edit/${postId}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "Authorization": `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const list = (token, page, limit, search, filter, order, city, state) => {
    return fetch(`${process.env.REACT_APP_API}/posts/?page=${page}&limit=${limit}&search=${search}&filter=${filter}&order=${order}&city=${city}&state=${state}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
    }).then(response => {
        return response.json();
    }).catch(err => console.log(err));
};

export const listByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API}/post/by/${userId}`, {
        method: "GET",
        headers: {
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

export const singlePost = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API}/post/${postId}`, {
        method: "GET",
        headers: {
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

export const like = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API}/post/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const unlike = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API}/post/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const schedule = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API}/user/${userId}/schedule`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const unschedule = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API}/user/${userId}/unschedule`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const comment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API}/post/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const uncomment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API}/post/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const rating = (userId, token, postId, rate) => {
    return fetch(`${process.env.REACT_APP_API}/post/${postId}/rating`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, rate })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getSchedule = (userId, token, type) => {
    return fetch(`${process.env.REACT_APP_API}/user/${userId}/schedule/?type=${type}`, {
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
    }).catch(err => {
        return err;
    });
};

