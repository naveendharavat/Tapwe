import { useState, type InputHTMLAttributes, type Ref } from 'react'
import { Icon } from '../ui/Icon'
import { Input } from '../ui/Input'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  invalid?: boolean
  ref?: Ref<HTMLInputElement>
}

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="pwd">
      <Input {...props} type={visible ? 'text' : 'password'} />
      <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible((v) => !v)}>
        <Icon name={visible ? 'eyeoff' : 'eye'} />
      </button>
    </div>
  )
}
