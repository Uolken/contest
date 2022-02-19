import styles from "./Button.module.css"
import classNames from "classnames"

export enum ButtonType {
  Blue,
  Red,
  White,

}

type ButtonProps = { text: string, action: () => void, type?: ButtonType }

const Button = ({
                  text,
                  action,
                  type
                }: ButtonProps) => {
  return <button
    className={classNames(styles.button, {
      [styles.blueButton]: type == undefined || type == ButtonType.Blue,
      [styles.redButton]: type == ButtonType.Red,
      [styles.whiteButton]: type == ButtonType.White,
    })}
    onClick={e => {
      action()
      e.preventDefault()
    }}>{text}</button>
}

export default Button
