import styles from "./Lab3.module.css"
import axios from "axios"
import { useState } from "react"
import Button from "../../components/Button/Button"
import { js2xml, json2xml, xml2js, xml2json } from "xml-js"

export default () => {
  const [file, setFile] = useState<FileList | null>(null)
  const [keys, setKeys] = useState<{ private: string, public: string } | null>(null);

  return <div className={styles.page}>
    <div className={styles.form}>
      <Button action={() => {
        axios.get("http://localhost:8080/csec3/generate")
        .then(r => setKeys(r.data))
      }} text={"Сгенерировать ключи"}/>
      <div className={styles.keys}>
        <label>
          Public Key
          <textarea cols={50} rows={7} value={keys?.public || ""} readOnly={true}/>
        </label>
        <label>
          Private Key
          <textarea cols={50} rows={7} value={keys?.private || ""} readOnly={true}/>
        </label>
        <div className={styles.keysButtons}>
          <Button action={() => {
            if (!keys) return
            var xml =
              '<?xml version="1.0" encoding="utf-8"?>' +
              "<keys>" +
              "<private>" + keys!.private + "</private>" +
              "<public>" + keys!.public + "</public>"+
              "</keys>"
            // var result1 = xml2json(xml, {compact: true, spaces: 4});
            // var result2 = xml2json(xml, {compact: false, spaces: 4});
            // console.log(result1)
            const url = window.URL.createObjectURL(new Blob([xml]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', "keys.xml") //or any other extension
            document.body.appendChild(link)
            link.click()
          }} text={"Сохранить ключи"}/>
          <label  className={styles.selectKeyBtn}>
            Загрузить ключи
            <input type="file" onChange={e => {
              if (!e.target.files) return
              const file = e.target.files[0];
              const start = 0;
              const stop = file.size - 1;

              var reader = new FileReader();

              // If we use onloadend, we need to check the readyState.
              reader.onloadend = function(evt) {
                if (evt.target!.readyState == FileReader.DONE) { // DONE == 2
                  const xml = xml2js(evt.target!.result!.toString())
                  const privateKey = xml.elements[0].elements[0].elements[0].text
                  const publicKey = xml.elements[0].elements[1].elements[0].text
                  setKeys({private: privateKey, public: publicKey})

                  // document.getElementById('byte_content').textContent = _.reduce(evt.target.result,
                  //   function(sum, byte) {
                  //     return sum + ' 0x' + String(byte).charCodeAt(0).toString(16);
                  //   }, '');
                  // document.getElementById('byte_range').textContent =
                  //   ['Read bytes: ', start + 1, ' - ', stop + 1,
                  //     ' of ', file.size, ' byte file'].join('');
                }
              };

              var blob = file.slice(start, stop + 1);

              reader.readAsBinaryString(blob);
            }} title={"Загрузить ключи"}/>
          </label>
        </div>
      </div>
      <label>
        Выберите файл:
        <input type="file" onChange={e => setFile(e.target.files)}/>
      </label>
      <div className={styles.fileButtons}>
        <Button action={() => {
          const data = new FormData()
          file?.item(0) && data.append("file", file.item(0)!)
          data.append("publicKey", keys!.public)
          axios.post("http://localhost:8080/csec3/encrypt", data, {
            responseType: 'blob'
          })
          .then(r => {
              const url = window.URL.createObjectURL(new Blob([r.data]))
              const link = document.createElement('a')
              link.href = url
              link.setAttribute('download', file?.item(0)!.name + ".encrypted") //or any other extension
              document.body.appendChild(link)
              link.click()
            }
          )
        }} text={"Зашифровать"}/>
        <Button action={() => {
          const data = new FormData()
          file?.item(0) && data.append("file", file.item(0)!)
          data.append("privateKey", keys!.private)
          axios.post("http://localhost:8080/csec3/decrypt", data, {
            responseType: 'blob'
          })
          .then(r => {
              console.log()
              const url = window.URL.createObjectURL(new Blob([r.data]))
              const link = document.createElement('a')
              link.href = url
              link.setAttribute('download', file?.item(0)!.name.replace(".encrypted", "")!) //or any other extension
              document.body.appendChild(link)
              link.click()
            }
          )
        }} text={"Расшифровать"}/>
      </div>
    </div>

  </div>
}
