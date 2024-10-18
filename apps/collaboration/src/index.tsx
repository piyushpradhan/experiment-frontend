import { Box, Button } from 'design-system'
import Cursors from './components/Cursors'

function Collaboration() {
  const storedUser: string = localStorage.getItem('collaborative-user') || '{}'
  const parsedUser = JSON.parse(storedUser)

  if (Object.keys(parsedUser).length > 0) {
    return (
      <Box direction="column" border="none">
        <Cursors />
      </Box>
    )
  }

  return (
    <Box direction="column" border="none">
      <Button label="Join this collaborative document" primary />
    </Box>
  )
}

export default Collaboration
