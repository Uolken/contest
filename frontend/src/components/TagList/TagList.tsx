import { Link } from "react-router-dom"
import { Tag } from "../../types"
import styles from "./TagList.module.css"
import tagIcon from '../../images/icons/tag-icon.svg'

type TagListProps = { tags: Array<Tag> }

const TagList = ({ tags }: TagListProps) => {
  if (tags.length == 0) return <div></div>
  return <div className={styles.tagList}>
    <div><img src={tagIcon} alt=""/></div>
    {tags.map((t, i) => <div className={styles.tag} key={t.id}>
      <Link to={`/library?tag=${t.id}`}>{t.name}</Link>
      {i < tags.length - 1 && <span>, </span>}
    </div>)}
  </div>
}

export default TagList
