import { Link } from "react-router-dom"
import styles from "./BreadCrumbs.module.css"
type BreadCrumbsProps = { elements :{name: string, url: string}[] }

const BreadCrumbs = ({elements}: BreadCrumbsProps) => {
  return <div className={styles.breadCrumbs}>
    {elements.map((e,i) =>
      <span key={e.name}>
        <Link to={e.url} className={styles.crumb}>{e.name}</Link>
        {i < elements.length - 1 && <div className={styles.slash}>/</div>}
      </span>
    )}
  </div>
}

export default BreadCrumbs
