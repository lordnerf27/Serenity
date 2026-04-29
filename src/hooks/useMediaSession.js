/**
 * useMediaSession
 * Sets up the browser Media Session API so audio continues playing
 * when the screen locks and shows controls on the lock screen / notification shade.
 */
export function useMediaSession({ title, artist = 'Serenity', onPlay, onPause, onSeekBack, onSeekForward }) {
  const update = (playing) => {
    if (!('mediaSession' in navigator)) return

    navigator.mediaSession.metadata = new MediaMetadata({ title, artist })
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'

    navigator.mediaSession.setActionHandler('play',         onPlay)
    navigator.mediaSession.setActionHandler('pause',        onPause)
    navigator.mediaSession.setActionHandler('seekbackward', onSeekBack)
    navigator.mediaSession.setActionHandler('seekforward',  onSeekForward)
  }

  const clear = () => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = null
    navigator.mediaSession.playbackState = 'none'
    ;['play','pause','seekbackward','seekforward'].forEach(a => {
      try { navigator.mediaSession.setActionHandler(a, null) } catch (_) {}
    })
  }

  return { update, clear }
}
