import styles from "./Lab5.module.css"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { xml2js } from "xml-js"
import Button from "../../components/Button/Button"
import { Link } from "react-router-dom"

export default () => {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  // useEffect(() => {
  //   const data = new FormData()
  //   if (!file) return
  //   data.append("file", file)
  //   data.append("message", message)

  //   axios.post("http://localhost:8080/csec5", data, { responseType: 'blob' })
  //   .then(r => {
  //     console.log(r)
  //     }
  //   )
  // }, [file, password])


  // setFile(files)
  const start = 0;
  const stop = (file?.size || 0)  - 1;

  var reader = new FileReader();

  const blob = file?.slice(start, stop + 1)

  return <div className={styles.page}>
    <div className={styles.forms}>

      <label>
        Пароль:
        <input type="text" value={password} onChange={e => setPassword(e.target.value)}/>
      </label>
    </div>
    <label>
      Выберите файл:
      <input type="file" onChange={e => {
        const files = e.target.files
        if (!files) return
        const file = files[0]
        setFile(file)
      }}/>
    </label>
    {/*<div className={styles.fileButtons}>*/}
      <Button action={() => {
        const data = new FormData()
        if (!file) return
        data.append("file", file)
        data.append("password", password)
        axios.post("http://localhost:8080/csec5/decrypt", data)
        .then(r => { setMessage(r.data.data)})
          .catch(r => setMessage(""))
      }} text={"Расшифровать"}/>
    <div className={styles.images}>
      <div>
        {!blob ? "" : <img src={URL.createObjectURL(blob)}/>}
      </div>
      <label>
        Сообщение:
        <input type="text" value={message} readOnly={true}/>
      </label>
    </div>

    <Link to={"/csec5"}>Зашифровать</Link>
  </div>
}
