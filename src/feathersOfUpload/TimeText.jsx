import Audio from "./Audio";
function TimeText() {
  return (
    <div className="flex flex-col mx-10">
      <div className="flex flex-col">
        <div
          className="flex flex-row rounded-2xl gap-8"
          style={{ backgroundColor: "#F2F2F2", direction: "rtl" }}
        >
          <div>00:02</div>
          <div>00:00</div>
          <div>lili</div>
        </div>
        <div className="flex flex-row rounded-2xl gap-8" style={{ direction: "rtl" }}>
          <div>00:04</div>
          <div>00:02</div>
          <div>lili</div>
        </div>
      </div>
      <Audio />
    </div>
  );
}
export default TimeText;
