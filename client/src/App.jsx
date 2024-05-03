import { useRef } from "react"
import Player from "./Player"

function App() {
  const playerRef = useRef(null)
  const vidLink = 'http://localhost:6300/uploads/courses/f9420472-54a1-4e2f-a344-7e2e7d547739/index.m3u8'
  return (
    <>
      <h1>
        Video Player
      </h1>
      <Player
        options={{
          controls: true,
          responsive: true,
          fluid: true,
          sources: [{
            src: vidLink,
            type: 'application/x-mpegURL'
          }]
        }}
        onReady={(player) => {
          playerRef.current = player;
          // handle player events here, example:
          player.on("waiting", () => {
            // eslint-disable-next-line no-undef
            videojs.log("player is waiting");
          });
          player.on("dispose", () => {
            // eslint-disable-next-line no-undef
            videojs.log("player will dispose");
          });
        }} />
    </>
  )
}

export default App