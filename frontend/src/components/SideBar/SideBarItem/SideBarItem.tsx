import { NavLink } from 'react-router-dom'
import React, { FunctionComponent, SVGProps } from 'react'
import styles from './SideBarItem.module.css'
import sideBar from '../../../store/components/sideBar'

export class SideBarItemProps {
  name: string

  page: string

  isOpened: boolean

  Icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined; }>

  constructor(
    name: string,
    page: string,
    isOpened: boolean,
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string | undefined }>,
  ) {
    this.name = name
    this.page = page
    this.isOpened = isOpened
    this.Icon = Icon
  }
}

const SideBarItem = ({
  name, page, isOpened, Icon,
}: SideBarItemProps) => {
  const state = isOpened ? styles.opened : styles.closed
  return (
    <li>
      {/* eslint-disable-next-line no-return-assign */}
      <NavLink to={page} className={`${styles.sideBarElement} ${state}`} activeClassName={styles.selectedElement}>
        <div className={styles.icon}>
          <Icon className={styles.test} />
        </div>
        <div className={styles.name}>{name}</div>
      </NavLink>
    </li>
  )
}

export default SideBarItem
