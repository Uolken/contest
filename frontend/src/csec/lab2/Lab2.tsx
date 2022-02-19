import styles from "./Lab2.module.css"
import axios from "axios"
import { useState } from "react"
import Button from "../../components/Button/Button"
import GenericTable, { Column } from "../../components/GenericTable/GenericTable"

type BenchmarkResult = { algorithm: string, method: string, encryptTime: number, decryptTime: number }

const columns: Array<Column<BenchmarkResult>> = [
  {name: "algorithm", readableName: "Алгоритм", content: b => b.algorithm, sortable: true},
  {name: "method", readableName: "Метод", content: b => b.method, sortable: true},
  {name: "encryptTime", readableName: "Время шифрования", content: b => <span>{b.encryptTime/1_000_000} ms</span>, sortable: true, sortValue: b => b.encryptTime},
  {name: "decryptTime", readableName: "Время расшифровки", content: b => <span>{b.decryptTime/1_000_000} ms</span>, sortable: true, sortValue: b => b.decryptTime}
]

export default () => {
  const [file, setFile] = useState<FileList | null>(null)
  const [benchmarkResult, setBenchmarkResult] = useState<Array<BenchmarkResult>>()

  return <div className={styles.page}>
    <div className={styles.form}>
      <label>
        Выберите файл для измерения скорости шифрования:
        <input type="file" onChange={e => setFile(e.target.files)}/>
      </label>
      <Button action={() => {
        const data = new FormData()
        file?.item(0) && data.append("file", file.item(0)!)

        axios.post("http://localhost:8080/csec/lab2", data, {
          // headers: {
          //   'Content-Type': 'multipart/form-data'
          // }
        })
        .then(r => setBenchmarkResult(r.data))
      }} text={"Запустить"}/>
    </div>

    {benchmarkResult && <GenericTable data={benchmarkResult} hideHeader={false} columns={columns} pageSize={10} keyExtractor={r => r.algorithm + "_" + r.method} linkExtractor={null}/>}
  </div>
}
