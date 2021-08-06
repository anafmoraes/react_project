export const getTags = (token, search = '') => {
    return fetch(`${process.env.REACT_APP_API}/tags/?search=${search}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Content-Length": "139",
            "Sec-Fetch-Dest": "empty",
            'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
            'Authorization': `Bearer ${token}`,
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site"
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const createTag = (token, data) => {
    return fetch(`${process.env.REACT_APP_API}/tags`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Content-Length": "139",
            "Sec-Fetch-Dest": "empty",
            'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
            'Authorization': `Bearer ${token}`,
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site"
        },
        body: data
     })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const like = (userId, token, tagId) => {
    return fetch(`${process.env.REACT_APP_API}/tag/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, tagId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const unlike = (userId, token, tagId) => {
    return fetch(`${process.env.REACT_APP_API}/tag/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, tagId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};