"use client"
import { useEffect, useRef, useState } from 'react'
import "./stream.css"
import StreamCard from '@/components/StreamCard'
import axios from "axios"
import random from "../public/randomize-white.png"
import prevtrack from "../public/previous-track-white.png"
import pause from "../public/pause-white.png"
import play from "../public/play-white.png"
import nexttrack from "../public/next-track-white.png"
import repeat from "../public/repeat-button-white.png"
import volume from "../public/volume.png"
import Image from "next/image";

const Page = () => {

  const [masterSong, setMasterSong] = useState({ "title": "Song Name", artist: "Artist" });
  const [songQueue, setSongQueue] = useState();
  const [playState, setPlayState] = useState(true);
  let [songID, setSongID] = useState(-1);
  const apiUrl = `http://localhost:3080/get-buffer?number=50`
  const AudioTag = useRef(null);
  const master__name = useRef(null);

  const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

  /**
   * master Song is the current Playing song.which is 
   * being set by the state manager
   * @component StreamCard.js
   */

  useEffect(() => {
    const Audio = AudioTag.current;
    const masterSong = master__name.current;
    // console.log(Audio)
    console.log("mS = ", masterSong)
    if (Audio) {
      Audio.play();
      Audio.style.display = 'none'
    }
    masterSong.style.backgroundImage = `linear-gradient(90deg, #f7f7f7, ${colorArray[Math.floor(Math.random() * 39)]})`


  }, [masterSong]);


  useEffect(() => {
    const Audio = AudioTag.current;
    if (playState === true) Audio.play();
    else Audio.pause();
  }, [playState])

  useEffect(() => {
    const fetchData = async () => {
      await axios.post(apiUrl)
        .then((response) => {
          console.log("Fetch ke andar  = ", response.data);
          setSongQueue(response.data);
        })
        .catch((error) => {
          alert("Failure");
          console.error('Error:', error);
        });
    }
    fetchData();
  }, [])



  useEffect(() => {
    function playNextTrack() {
      if (songQueue) {
        const nextSong = songQueue[songID];
        const imgLink = `https://d1dgwvpmn80wva.cloudfront.net/${nextSong.thumbnailHash}`;
        const musicLink = `https://d1dgwvpmn80wva.cloudfront.net/${nextSong.musicHash}`
        setMasterSong({ title: nextSong.title, artist: nextSong.artist, "time": nextSong.duration, imgSrc: imgLink, like: nextSong.like, musicSrc: musicLink, uploadedBy: nextSong.uploadedBy })
      }
    }

    playNextTrack();
  }, [songID])

  return (
    <div className='HOLDER'>
      <div style={{ display: 'flex' }} className='image__container'>
        <div>
          <img draggable='false' style={{ marginRight: "34rem" }} className='main__image' src={masterSong?.imgSrc} />
          <h1 ref={master__name} className='master__name'>{masterSong?.title}</h1>
          <h1 className='master__artist'>{masterSong?.artist}<br />Uploaded By: {masterSong?.uploadedBy}</h1>
          <audio ref={AudioTag} controls src={masterSong?.musicSrc}></audio>
        </div>
        <div className='card__holder'>
          {
            songQueue?.map((song, index) => {
              return <StreamCard setMasterSong={setMasterSong} testKey={index} key={index} Song={song.title} musicSrc={song.musicHash} imgSrc={song.thumbnailHash} Artist={song.artist} Time={song.duration} Like={song.like} uploadedBy={song.uploadedBy} />
            })
          }
        </div>
      </div>
      <div class="media-player ">
        <input type="range" id="seeker-bar" value="40" min="0" max="100" step="0.1" />
        <div class="media">
          <div className="false"></div>
          <div class="media-buttons">
            <Image src={random} alt="" class="randomize" />
            <Image src={prevtrack}  alt="" onClick={() => {setSongID(prev=>prev = --prev) }} class="previous" />
            {playState ? (<Image src={pause} alt="" onClick={() => setPlayState(prev => prev = !prev)} id="play" class="play-pause" />) : (<Image src={play} alt="" id="pause" onClick={() => setPlayState(prev => prev = !prev)} class="play-pause" />)}
            <Image src={nexttrack} onClick={() => {setSongID(prev=>prev = ++prev) }} alt="" class="next" />
            <Image src={repeat} alt="" class="repeat" />
          </div>
          <div class="volume">
            <Image src={volume} alt="" />
            <input type="range" value="60" min="0" max="100" id="volume-seeker" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
