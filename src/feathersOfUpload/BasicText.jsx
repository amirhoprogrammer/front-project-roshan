import { useState, useRef } from "react";
import Audio from "./Audio";
import "../App.css";
import "@fontsource/vazir";
function BasicText() {
  return (
    <div className="flex flex-col">
      <div>
        {/*<p
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "10px",
            lineHeight: "0.5",
            fontFamily: "Vazir, sans-serif",
            direction: "rtl",
          }}
        >
          {transcription}
        </p>*/}
        <p className="p-2 m-0" style={{ direction: "rtl" }}>
          [با][---][---] [با] و[---][---] [با][---][---][---][---] کجایی تو [خوش] می دیدی من خسته
          شدم [ما را] [به] این [زودی] چه جوری شد [عشق شدی] به این است[---] [آخرش] سی با فکر [و] چقدر
          [نزار می خوام] که [چشم تو] [و با رفت][---][---][---][---][---][---][---][---] سخت [آرام]
          ولی ازت می خوام[---] بر نگردی هر کسی که به [تو] باشه[---] کاشکی تو منو [بردی] [که
          چشمک][---] با[---][---][---][---][---] [ابو][---] [با] و و و و و [او]
        </p>
      </div>
      <Audio />
    </div>
  );
}
export default BasicText;
