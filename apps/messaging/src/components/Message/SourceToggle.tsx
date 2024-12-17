import { useDispatch } from 'react-redux'
import { setSource } from '@messaging/store/actions/source'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@messaging/components/ui/toggle-group'
import { Source } from '@messaging/types'

const SourceToggle = () => {
  const dispatch = useDispatch()

  const handleSourceChange = (value: string) => {
    dispatch(setSource(value as Source))
  }

  return (
    <ToggleGroup
      type="single"
      defaultValue="socket"
      onValueChange={handleSourceChange}
    >
      <ToggleGroupItem value="socket">Socket</ToggleGroupItem>
      <ToggleGroupItem value="kafka">Kafka</ToggleGroupItem>
    </ToggleGroup>
  )
}

export default SourceToggle
