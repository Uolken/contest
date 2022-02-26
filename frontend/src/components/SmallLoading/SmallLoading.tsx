import { TailSpin } from "react-loader-spinner"

export default () => {
  return <div style={{
    display: "flex",
    alignItems: "center",
    height: "100%",
    width: "100%",
    justifyContent: "center"
  }}>
    <TailSpin
      height="100"
      width="100"
      color="grey"
      ariaLabel="loading"
    />
  </div>
}
