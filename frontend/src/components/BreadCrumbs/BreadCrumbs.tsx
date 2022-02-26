import { Link } from "react-router-dom"
import styles from "./BreadCrumbs.module.css"
import ContentLoader from "react-content-loader"

type BreadCrumbsProps = { elements: ({ name: string, url: string } | undefined)[] }

const BreadCrumbs = ({ elements }: BreadCrumbsProps) => {
  return <div className={styles.breadCrumbs}>
    {elements.map((e, i) => {
        return <>{
          e ? <span key={e.name}>
          <Link to={e.url} className={styles.crumb}>{e.name}</Link>
        </span> : <ContentLoader backgroundColor={'#bbb'}
                                 foregroundColor={'#ddd'}
                                 height={18} width={120}
          >
            <rect x="0" y="0" rx="4" ry="4" width="120" height="18"/>
          </ContentLoader>}
          {i < elements.length - 1 && <div className={styles.slash}>/</div>}
        </>

      }
    )}
  </div>
}

export default BreadCrumbs
