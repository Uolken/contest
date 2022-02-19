import styles from "./PageSelector.module.css"
import classNames from "classnames"
import {ReactComponent as LeftSwitch} from '../../images/icons/left-switch.svg'
import {ReactComponent as RightSwitch} from '../../images/icons/right-switch.svg'
import React from "react"

const PageSelector = ({
                        currentPage,
                        pagesCount,
                        setPage
                      }: { currentPage: number, pagesCount: number, setPage: (page: number) => void }) => {
  const backButtonActive = currentPage > 0
  const nextButtonActive = currentPage < pagesCount - 1

  return <div className={styles.pageSelector}>
    <div
      className={classNames({ [styles.active]: backButtonActive,  [styles.inactive]: !backButtonActive })}
      onClick={() => backButtonActive && setPage(currentPage - 1)}>
      <LeftSwitch height={35} width={35} />
    </div>
    <div className={styles.pages}>
      {currentPage > 0 && <Page page={1} isCurrent={false} setPage={setPage}/>}
      {currentPage > 1 && <Page page={2} isCurrent={false} setPage={setPage}/>}
      {currentPage == 5 && <Page page={3} isCurrent={false} setPage={setPage}/>}
      {currentPage > 5 && <div>...</div>}
      {currentPage > 3 && <Page page={currentPage - 1} isCurrent={false} setPage={setPage}/>}
      {currentPage > 2 && <Page page={currentPage} isCurrent={false} setPage={setPage}/>}

      <Page page={currentPage + 1} isCurrent={true} setPage={setPage}/>

      {currentPage < pagesCount - 3 &&
          <Page page={currentPage + 2} isCurrent={false} setPage={setPage}/>}
      {currentPage < pagesCount - 4 &&
          <Page page={currentPage + 3} isCurrent={false} setPage={setPage}/>}
      {currentPage == pagesCount - 6 &&
          <Page page={currentPage + 4} isCurrent={false} setPage={setPage}/>}
      {currentPage < pagesCount - 6 && <div>...</div>}
      {currentPage < pagesCount - 2 &&
          <Page page={pagesCount - 1} isCurrent={false} setPage={setPage}/>}
      {currentPage < pagesCount - 1 &&
          <Page page={pagesCount} isCurrent={false} setPage={setPage}/>}
    </div>
    <div className={classNames(styles.page, { [styles.active]: nextButtonActive, [styles.inactive]: !nextButtonActive })}
         onClick={() => nextButtonActive && setPage(currentPage + 1)}>
      <RightSwitch height={35} width={35} />
    </div>
  </div>
}

const Page = ({
                page,
                isCurrent,
                setPage
              }: { page: number, isCurrent: boolean, setPage: (page: number) => void }) => {
  return <div className={classNames(styles.page, { [styles.active]: !isCurrent, [styles.currentPage]: isCurrent })}
              onClick={() => !isCurrent && setPage(page - 1)}>
    {page}
  </div>

}

export default PageSelector
