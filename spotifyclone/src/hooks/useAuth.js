import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = (code) =>
{
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresInToken, setExpiresInToken] = useState();

    useEffect(() => {
        axios.post('http://localhost:3001/login', {
            code
        }).then((res) => {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresInToken(res.data.expiresIn);
            window.history.pushState({}, null, '/');
        }).catch(() => {
            window.location = '/';
        });
    }, [code]);

    useEffect(() => {
        if(!refreshToken || !expiresInToken)
            return;

        const interval = setInterval(() => {
            axios.post('http://localhost:3001/refresh', {
                refreshToken
            }).then((res) => {
                setAccessToken(res.data.accessToken);
                setExpiresInToken(res.data.expiresIn);
                window.history.pushState({}, null, '/');
            }).catch(() => {
                window.location = '/';
            });
        }, (expiresInToken - 60) * 1000);

        return () => clearInterval(interval);
        
    }, [refreshToken, expiresInToken]);

    return accessToken;
}