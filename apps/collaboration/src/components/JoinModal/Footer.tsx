import { Button } from 'design-system'

import './style.scss'

const Footer = () => {
  return (
    <div className="footer-container">
      <Button label="Cancel" />
      <Button label="Submit" primary />
    </div>
  )
}

export default Footer
