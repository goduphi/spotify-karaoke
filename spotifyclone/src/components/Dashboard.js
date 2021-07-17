import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import SpotifyWebApi from 'spotify-web-api-node';
import { TrackSearchResults } from './TrackSearchResults';
import { Player } from './Player';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
    clientId: '6fdf086484024334a1363d53f936740f'
});

export const Dashboard = ({ code }) =>
{
    const accessToken = useAuth(code);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState('');

    const chooseTrack = (track) =>
    {
        setPlayingTrack(track);
        setSearch('');
        setLyrics('');
    }

    useEffect(() => {
        if(!playingTrack)
            return;
        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics);
        })
    }, [playingTrack]);

    useEffect(() => {
        if(!accessToken)
            return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if(!search)
            return setSearchResults([]);
        if(!accessToken)
            return;

        let cancel = false;
        spotifyApi.searchTracks(search).then(res => {
            if(cancel) return;
            setSearchResults(res.body.tracks.items.map(track => {

                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if(image.height < smallest.height)
                        return image;
                    return smallest;
                }, track.album.images[0]);

                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }));
        });
        return () => cancel = true;
    }, [search, accessToken]);

    const handleSearch = ({ target }) =>
    {
        setSearch(target.value);
    }

    return (
        <div>
            <form>
                <input type='text' value={search} onChange={handleSearch} />
            </form>
            <div>
                {searchResults.map(track => {
                    return <TrackSearchResults track={track} key={track.uri} chooseTrack={chooseTrack} />
                })}
            </div>
            {searchResults.length === 0 && (<div stlye={{ whitespace: 'pre' }}>
                {lyrics}
            </div>)}
            <div><Player accessToken={accessToken} trackUri={playingTrack ? playingTrack.uri : undefined}/></div>
        </div>
    );
}