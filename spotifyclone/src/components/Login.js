import React from 'react';

const clientId = "6fdf086484024334a1363d53f936740f";
const redirectUri = "http://localhost:3000";

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=" + clientId + "&response_type=code&redirect_uri=" + redirectUri + "&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export const Login = () =>
{
    return (
        <a href={AUTH_URL}>Login</a>
    );
}