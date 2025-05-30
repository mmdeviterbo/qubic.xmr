import { FC, memo } from 'react'

interface AdvancedModeProps {
  [x: string]: string;
}

const AdvancedMode: FC<AdvancedModeProps> = () => {
  return (
    <div>AdvancedMode</div>
  )
}

export default memo<AdvancedModeProps>(AdvancedMode)