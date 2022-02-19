import { FunctionComponent, SVGProps } from "react"
import styles from "./Card.module.css"
import { Link } from "react-router-dom"

type CardProps =  {
  Icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined; }>
  name: string
  value: string
  bottomLinkText: string
  bottomLink?: string
}
const Card = ({Icon, name, value, bottomLink, bottomLinkText}: CardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.main}>
        <div className={styles.icon}>
          <Icon/>
        </div>
        <div className={styles.content}>
          <div className={styles.name}>{name}</div>
          <div className={styles.value}>{value}</div>
        </div>
      </div>
      {bottomLink && <div className={styles.bottomLink}>
        <Link to={bottomLink}>{bottomLinkText}</Link>
      </div> }
    </div>
  )
}
export default Card
