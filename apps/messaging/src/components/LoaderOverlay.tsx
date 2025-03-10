import {
  LOADING_MESSAGE,
  FAILED_TO_LOAD_MESSAGE,
} from '@messaging/lib/contants'
import './style.css'

type Props = {
  message: string
  onHide: () => void
}

const LoaderOverlay = ({ message, onHide }: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        {message === LOADING_MESSAGE && <div className="loader"></div>}
        <p className="text-white mt-4">{message}</p>
        {onHide && message === FAILED_TO_LOAD_MESSAGE && (
          <button
            onClick={onHide}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Hide
          </button>
        )}
      </div>
    </div>
  )
}

export default LoaderOverlay
