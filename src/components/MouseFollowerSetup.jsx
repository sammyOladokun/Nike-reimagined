import { useEffect } from 'react'
import { useControlOptions } from 'react-mouse-follower'

const MouseFollowerSetup = () => {
  const { addOptionLayer } = useControlOptions()

  useEffect(() => {
    addOptionLayer({
      visible: false,
    })
  }, [addOptionLayer])

  return null
}

export default MouseFollowerSetup
