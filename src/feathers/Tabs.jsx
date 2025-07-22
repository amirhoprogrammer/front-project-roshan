import React, { useState } from "react";
import { transcribeFiles } from "../services/Api";
import "@fontsource/vazir";
function Tabs() {
  const [mediaUrl, setMediaUrl] = useState("");
  //const [result, setResult] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await transcribeFiles([mediaUrl]);
      //setResult(data);
      const textSegments = data[0].segments
        .filter((segment) => segment.text.trim() !== "")
        .map((segment) => segment.text)
        .join("\n");
      setTranscription(textSegments);
      setShowForm(false);
      setLoading(false);
    } catch (err) {
      setError(`خطا در تبدیل فایل:${err.message}`);
      setLoading(false);
    }
  };
  const handleReset = () => {
    setShowForm(true);
    setTranscription(null);
    setMediaUrl("");
    setError(null);
  };
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      label: (
        <div className="flex items-center rounded-2xl m-0 p-0" style={{ direction: "rtl" }}>
          <svg
            width="13"
            height="22"
            viewBox="0 0 13 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.50212 0L5.97738 0.0317415L5.46322 0.129082L4.96598 0.281441L4.48779 0.497284L4.03923 0.768145L3.62663 1.08979L3.25635 1.46011L2.93473 1.87275L2.66602 2.31925L2.44808 2.79749L2.29574 3.29689L2.19841 3.8111L2.16667 4.33589V11.9179L2.19841 12.4406L2.29574 12.9527L2.44808 13.4542L2.66602 13.9324L2.93473 14.3789L3.25635 14.7915L3.62663 15.1619L4.03923 15.4835L4.48779 15.7544L4.96598 15.9702L5.46322 16.1247L5.97738 16.2178L6.50212 16.2517L7.02262 16.2178L7.5389 16.1247L8.03825 15.9702L8.51432 15.7544L8.96501 15.4835L9.37337 15.1619L9.74365 14.7915L10.0695 14.3789L10.3382 13.9324L10.5519 13.4542L10.7085 12.9527L10.8037 12.4406L10.8333 11.9179V4.33589L10.8037 3.8111L10.7085 3.29689L10.5519 2.79749L10.3382 2.31925L10.0695 1.87275L9.74365 1.46011L9.37337 1.08979L8.96501 0.768145L8.51432 0.497284L8.03825 0.281441L7.5389 0.129082L7.02262 0.0317415L6.50212 0ZM6.27995 1.09402H6.72428L7.16227 1.15328L7.58968 1.27178L7.99593 1.44953L8.37467 1.68018L8.71956 1.95739L9.02214 2.28327L9.27816 2.64513L9.48128 3.04084L9.62939 3.45771L9.72038 3.89151L9.75212 4.33589V11.9179L9.72038 12.3623L9.62939 12.7939L9.48128 13.2129L9.27816 13.6044L9.02214 13.9705L8.71956 14.2943L8.37467 14.5736L7.99593 14.8042L7.58968 14.9799L7.16227 15.1005L6.72428 15.1598H6.27995L5.83984 15.1005L5.41244 14.9799L5.00407 14.8042L4.62533 14.5736L4.28255 14.2943L3.97998 13.9705L3.72396 13.6044L3.51872 13.2129L3.37061 12.7939L3.28385 12.3623L3.25212 11.9179V4.33589L3.28385 3.89151L3.37061 3.45771L3.51872 3.04084L3.72396 2.64513L3.97998 2.28327L4.28255 1.95739L4.62533 1.68018L5.00407 1.44953L5.41244 1.27178L5.83984 1.15328L6.27995 1.09402ZM0 11.9179L0.0296224 12.521L0.112142 13.1177L0.25179 13.7081L0.444336 14.2795L0.689779 14.8318L0.986003 15.3587L1.33089 15.8538L1.7181 16.3173L2.14762 16.7447L2.61312 17.1256L3.11458 17.4642L3.64355 17.7562L4.1958 17.9974L4.77132 18.1815L5.36165 18.317L5.95833 18.3953V20.5854H2.16667V21.6689H10.8333V20.5854H7.04378V18.3953L7.64046 18.317L8.23079 18.1815L8.8042 17.9974L9.36068 17.7562L9.88965 17.4642L10.3911 17.1256L10.8566 16.7447L11.284 16.3173L11.6733 15.8538L12.0161 15.3587L12.3123 14.8318L12.5557 14.2795L12.7503 13.7081L12.89 13.1177L12.9746 12.521L13 11.9179H11.9188L11.887 12.4829L11.7982 13.0436L11.6543 13.5917L11.4491 14.1207L11.193 14.6265L10.882 15.1026L10.5265 15.5406L10.1245 15.9427L9.68441 16.3003L9.20833 16.6072L8.70475 16.8674L8.17578 17.0685L7.62565 17.2166L7.06917 17.3055L6.50212 17.333L5.93506 17.3055L5.37435 17.2166L4.82845 17.0685L4.29948 16.8674L3.79167 16.6072L3.31771 16.3003L2.87549 15.9427L2.47347 15.5406L2.118 15.1026L1.8112 14.6265L1.55306 14.1207L1.34993 13.5917L1.20182 13.0436L1.11296 12.4829L1.08545 11.9179H0Z"
              fill="currentColor"
            />
          </svg>
          <span className="mx-2 font-light">ضبط صدا</span>
        </div>
      ),
      content: (
        <div
          className="flex flex-col rounded-2xl p-8 items-center justify-center"
          style={{ direction: "rtl" }}
        >
          <div className="rounded-full px-4 py-2" style={{ backgroundColor: "#00B3A1" }}>
            <svg
              width="20"
              height="34"
              viewBox="0 0 20 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="items-center justify-center"
            >
              <path
                d="M10 0.638916L9.20755 0.686849L8.43103 0.833843L7.68008 1.06392L6.95789 1.38987L6.28044 1.79889L5.65731 2.28461L5.0981 2.84383L4.61238 3.46696L4.20654 4.14122L3.8774 4.86341L3.64733 5.61755L3.50033 6.39407L3.4524 7.18656V18.6361L3.50033 19.4254L3.64733 20.1988L3.8774 20.9561L4.20654 21.6783L4.61238 22.3525L5.0981 22.9757L5.65731 23.5349L6.28044 24.0206L6.95789 24.4296L7.68008 24.7556L8.43103 24.9889L9.20755 25.1295L10 25.1806L10.7861 25.1295L11.5658 24.9889L12.32 24.7556L13.039 24.4296L13.7196 24.0206L14.3364 23.5349L14.8956 22.9757L15.3877 22.3525L15.7935 21.6783L16.1163 20.9561L16.3527 20.1988L16.4965 19.4254L16.5413 18.6361V7.18656L16.4965 6.39407L16.3527 5.61755L16.1163 4.86341L15.7935 4.14122L15.3877 3.46696L14.8956 2.84383L14.3364 2.28461L13.7196 1.79889L13.039 1.38987L12.32 1.06392L11.5658 0.833843L10.7861 0.686849L10 0.638916ZM9.66451 2.291H10.3356L10.997 2.38048L11.6425 2.55943L12.2561 2.82785L12.8281 3.17617L13.349 3.59478L13.8059 4.08689L14.1926 4.63333L14.4993 5.23089L14.723 5.86041L14.8604 6.5155L14.9084 7.18656V18.6361L14.8604 19.3072L14.723 19.9591L14.4993 20.5918L14.1926 21.183L13.8059 21.7358L13.349 22.2247L12.8281 22.6465L12.2561 22.9948L11.6425 23.2601L10.997 23.4422L10.3356 23.5317H9.66451L8.99984 23.4422L8.35434 23.2601L7.7376 22.9948L7.1656 22.6465L6.64793 22.2247L6.19097 21.7358L5.80431 21.183L5.49434 20.5918L5.27065 19.9591L5.13964 19.3072L5.0917 18.6361V7.18656L5.13964 6.5155L5.27065 5.86041L5.49434 5.23089L5.80431 4.63333L6.19097 4.08689L6.64793 3.59478L7.1656 3.17617L7.7376 2.82785L8.35434 2.55943L8.99984 2.38048L9.66451 2.291ZM0.180176 18.6361L0.224913 19.5469L0.349539 20.448L0.560444 21.3396L0.851237 22.2024L1.22192 23.0364L1.66929 23.8321L2.19016 24.5798L2.77495 25.2796L3.42364 25.9251L4.12665 26.5003L4.884 27.0116L5.68288 27.4526L6.51691 27.8169L7.3861 28.0949L8.27765 28.2994L9.17879 28.4177V31.725H3.4524V33.3611H16.5413V31.725H10.8181V28.4177L11.7192 28.2994L12.6108 28.0949L13.4768 27.8169L14.3172 27.4526L15.1161 27.0116L15.8734 26.5003L16.5764 25.9251L17.2219 25.2796L17.8099 24.5798L18.3276 23.8321L18.775 23.0364L19.1424 22.2024L19.4364 21.3396L19.6473 20.448L19.7752 19.5469L19.8135 18.6361H18.1806L18.1327 19.4893L17.9984 20.3362L17.7812 21.1638L17.4712 21.9627L17.0845 22.7264L16.6148 23.4454L16.0779 24.1069L15.4708 24.714L14.8061 25.2541L14.0871 25.7174L13.3266 26.1105L12.5277 26.4141L11.6969 26.6377L10.8564 26.772L10 26.8135L9.14364 26.772L8.29682 26.6377L7.47237 26.4141L6.67349 26.1105L5.90656 25.7174L5.19077 25.2541L4.5229 24.714L3.91575 24.1069L3.3789 23.4454L2.91555 22.7264L2.52569 21.9627L2.21892 21.1638L1.99524 20.3362L1.86102 19.4893L1.81948 18.6361H0.180176Z"
                fill="white"
              />
            </svg>
          </div>
          <p className="mt-2" style={{ textAlign: "center", color: "#626262" }}>
            برای شروع به صحبت، دکمه را فشار دهید متن پیاده شده آن، در اینجا ظاهر شود
          </p>
        </div>
      ),
    },
    {
      label: (
        <div className="flex items-center rounded-2xl m-0 p-0" style={{ direction: "rtl" }}>
          <svg
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5044 11.8314L10.1711 8.49805L6.83777 11.8314"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.1711 8.49805V15.998"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.1628 13.823C17.9756 13.3798 18.6176 12.6787 18.9877 11.8301C19.3577 10.9816 19.4346 10.034 19.2063 9.13686C18.9779 8.23974 18.4573 7.44421 17.7267 6.87582C16.996 6.30744 16.0968 5.99856 15.1711 5.99795H14.1211C13.8689 5.02232 13.3987 4.11656 12.7461 3.34878C12.0934 2.58099 11.2751 1.97116 10.3529 1.56512C9.43057 1.15909 8.42823 0.967418 7.42121 1.00452C6.41418 1.04162 5.42867 1.30654 4.53876 1.77934C3.64885 2.25214 2.8777 2.92054 2.28329 3.73427C1.68889 4.548 1.28668 5.4859 1.10693 6.47745C0.927168 7.469 0.97453 8.48839 1.24545 9.459C1.51638 10.4296 2.00381 11.3262 2.67111 12.0813"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.5044 11.8314L10.1711 8.49805L6.83777 11.8314"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mx-2 font-light">بارگزاری فایل</span>
        </div>
      ),
      content: (
        <div
          className="flex flex-col rounded-2xl p-4 items-center justify-center"
          style={{ direction: "rtl" }}
        >
          <div className="rounded-full" style={{ backgroundColor: "#118AD3" }}>
            <svg
              width="62"
              height="62"
              viewBox="0 0 62 62"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="31" cy="31" r="31" fill="#118AD3" />
              <path
                d="M36.7187 35.6195L31.2801 30.1809L25.8415 35.6195"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M31.2797 30.1809V42.4177"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M42.6869 38.8689C44.0131 38.146 45.0607 37.002 45.6644 35.6175C46.2681 34.233 46.3936 32.6869 46.0211 31.2232C45.6485 29.7595 44.7991 28.4615 43.607 27.5341C42.4148 26.6068 40.9478 26.1028 39.4374 26.1018H37.7242C37.3127 24.51 36.5456 23.0322 35.4807 21.7795C34.4158 20.5268 33.0808 19.5318 31.576 18.8693C30.0712 18.2068 28.4359 17.8941 26.7928 17.9546C25.1498 18.0152 23.5418 18.4474 22.0899 19.2188C20.6379 19.9902 19.3797 21.0808 18.4099 22.4084C17.4401 23.7361 16.7838 25.2664 16.4906 26.8842C16.1973 28.5019 16.2745 30.1652 16.7166 31.7488C17.1586 33.3324 17.9539 34.7952 19.0426 36.0273"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M36.7187 35.6195L31.2801 30.1809L25.8415 35.6195"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mt-2" style={{ textAlign: "center", color: "#626262" }}>
            برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید متن پیاده شده آن، در اینجا
            ظاهر می شود
          </p>
        </div>
      ),
    },
    {
      label: (
        <div className="flex items-center rounded-2xl m-0 p-0" style={{ direction: "rtl" }}>
          <svg
            width="17"
            height="21"
            viewBox="0 0 17 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.80607 4.14507L10.0299 1.92129C11.4361 0.678582 13.529 0.809393 14.7717 2.18291C15.9163 3.42561 15.9163 5.35507 14.7717 6.63048L12.5153 8.85427L13.202 9.54103L15.4585 7.28454C17.1263 5.6167 17.0609 2.86967 15.3604 1.20183C13.6926 -0.400609 11.0436 -0.400609 9.3758 1.20183L7.11931 3.42561C5.45147 5.12615 5.45147 7.84048 7.11931 9.54102L7.80607 8.85427C6.53066 7.54616 6.53066 5.45318 7.80607 4.14507Z"
              fill="currentColor"
            />
            <path
              d="M7.41365 19.0575L9.67014 16.8337C11.338 15.1331 11.338 12.4188 9.67014 10.751L8.98338 11.4377C10.2915 12.7458 10.2915 14.8388 8.98338 16.1469L6.72689 18.3707C5.41878 19.6788 3.32581 19.6788 2.0177 18.3707C0.70959 17.0626 0.70959 14.9696 2.0177 13.6615L4.27419 11.4377L3.58743 10.751L1.36364 12.9748C-0.369601 14.6099 -0.467709 17.3242 1.16743 19.0575C2.80257 20.7907 5.51689 20.8888 7.25014 19.2537C7.31554 19.1556 7.38095 19.1229 7.41365 19.0575Z"
              fill="currentColor"
            />
            <path
              d="M11.4833 7.79553L10.7896 7.10181L5.37857 12.5128L6.07229 13.2066L11.4833 7.79553Z"
              fill="currentColor"
            />
          </svg>
          <span className="mx-2 font-light">لینک</span>
        </div>
      ),
      content: (
        <div
          className="flex flex-col rounded-2xl p-8 items-center justify-center"
          style={{ direction: "rtl" }}
        >
          {showForm ? (
            <>
              <div
                className="rounded-full flex flex-row-reverse p-1"
                style={{ border: "1px solid #FF1654" }}
              >
                <form onSubmit={handleSubmit} className="flex flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="p-1.5 rounded-3xl"
                    style={{
                      backgroundColor: "#FF1654",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    <svg
                      width="14"
                      height="16"
                      viewBox="0 0 14 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.91027 3.40673L8.63166 1.68534C9.72018 0.723395 11.3403 0.824653 12.3023 1.88786C13.1883 2.84981 13.1883 4.34336 12.3023 5.33063L10.5556 7.05201L11.0872 7.58361L12.8339 5.83691C14.1249 4.54588 14.0743 2.41946 12.7579 1.12843C11.4669 -0.111982 9.4164 -0.111982 8.12537 1.12843L6.37867 2.84981C5.08763 4.16616 5.08763 6.26726 6.37867 7.58361L6.91027 7.05201C5.92301 6.03943 5.92301 4.41931 6.91027 3.40673Z"
                        fill="white"
                      />
                      <path
                        d="M6.6065 14.95L8.35319 13.2286C9.64423 11.9123 9.64423 9.81118 8.35319 8.52014L7.82159 9.05174C8.83417 10.0643 8.83417 11.6844 7.82159 12.697L6.07489 14.4184C5.06231 15.431 3.44219 15.431 2.42961 14.4184C1.41703 13.4058 1.41703 11.7857 2.42961 10.7731L4.17631 9.05174L3.6447 8.52014L1.92332 10.2415C0.581654 11.5072 0.505712 13.6083 1.77143 14.95C3.03716 16.2917 5.13826 16.3676 6.47992 15.1019C6.53055 15.026 6.58118 15.0006 6.6065 14.95Z"
                        fill="white"
                      />
                      <path
                        d="M9.75684 6.23243L9.21985 5.69543L5.03128 9.884L5.56828 10.421L9.75684 6.23243Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="example.com/sample.mp3"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    required
                    className="rounded-2xl p-1 mb-1"
                  />
                </form>
              </div>
              <p className="mt-2" style={{ textAlign: "center", color: "#626262" }}>
                نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد و دکمه را فشار دهید
              </p>
              {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
            </>
          ) : (
            <div>
              <h2 style={{ marginTop: "5px" }}>نتیجه:</h2>
              <p
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "10px",
                  lineHeight: "0.5",
                  fontFamily: "Vazir, sans-serif",
                }}
              >
                {transcription}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 p-2 rounded-3xl"
                style={{ backgroundColor: "#FF1654", color: "white" }}
              >
                تلاش دوباره
              </button>
            </div>
          )}
          {/*<div
            className="rounded-full flex flex-row-reverse p-1"
            style={{ border: "1px solid #FF1654" }}
          >
            <form onSubmit={handleSubmit} className="flex flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="p-1.5 rounded-3xl"
                style={{ backgroundColor: "#FF1654", cursor: loading ? "not-allowed" : "pointer" }}
              >
                <svg
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.91027 3.40673L8.63166 1.68534C9.72018 0.723395 11.3403 0.824653 12.3023 1.88786C13.1883 2.84981 13.1883 4.34336 12.3023 5.33063L10.5556 7.05201L11.0872 7.58361L12.8339 5.83691C14.1249 4.54588 14.0743 2.41946 12.7579 1.12843C11.4669 -0.111982 9.4164 -0.111982 8.12537 1.12843L6.37867 2.84981C5.08763 4.16616 5.08763 6.26726 6.37867 7.58361L6.91027 7.05201C5.92301 6.03943 5.92301 4.41931 6.91027 3.40673Z"
                    fill="white"
                  />
                  <path
                    d="M6.6065 14.95L8.35319 13.2286C9.64423 11.9123 9.64423 9.81118 8.35319 8.52014L7.82159 9.05174C8.83417 10.0643 8.83417 11.6844 7.82159 12.697L6.07489 14.4184C5.06231 15.431 3.44219 15.431 2.42961 14.4184C1.41703 13.4058 1.41703 11.7857 2.42961 10.7731L4.17631 9.05174L3.6447 8.52014L1.92332 10.2415C0.581654 11.5072 0.505712 13.6083 1.77143 14.95C3.03716 16.2917 5.13826 16.3676 6.47992 15.1019C6.53055 15.026 6.58118 15.0006 6.6065 14.95Z"
                    fill="white"
                  />
                  <path
                    d="M9.75684 6.23243L9.21985 5.69543L5.03128 9.884L5.56828 10.421L9.75684 6.23243Z"
                    fill="white"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="example.com/sample.mp3"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                required
                className="rounded-2xl p-1 mb-1"
              />
            </form>
          </div>
          <p className="mt-2" style={{ textAlign: "center", color: "#626262" }}>
            نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد و دکمه را فشار دهید
          </p>
          {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
          {transcription && (
            <div>
              <h2 style={{ marginTop: "5px" }}>نتیجه:</h2>
              <p
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "10px",
                  lineHeight: "0.5",
                  fontFamily: "Vazir, sans-serif",
                }}
              >
                {transcription}
              </p>
            </div>
              )}*/}
        </div>
      ),
    },
  ];
  const Tab1 = ({ isActive, onClick }) => (
    <button
      className={`px-2 py-2 font-medium ${
        isActive ? "active rounded-t-2xl" : "deactive rounded-2xl"
      }`}
      onClick={onClick}
    >
      {tabs[0].label}
    </button>
  );
  const Tab2 = ({ isActive, onClick }) => (
    <button
      className={`px-2 py-2 font-medium ${
        isActive ? "active2 rounded-t-2xl" : "deactive rounded-2xl"
      }`}
      onClick={onClick}
    >
      {tabs[1].label}
    </button>
  );
  const Tab3 = ({ isActive, onClick }) => (
    <button
      className={`px-2 py-2 font-medium ${
        isActive ? "active3 rounded-t-2xl" : "deactive rounded-2xl"
      }`}
      onClick={onClick}
    >
      {tabs[2].label}
    </button>
  );
  const TabContent1 = ({ isActive }) => (
    <div
      className={`border-2 rounded-2xl ${
        isActive ? "rounded-tr-none activecont1" : "deactivecont1 rounded-tr-2xl"
      }`}
    >
      <div className={`p-20 ${isActive ? "block" : "hidden"}`}>{tabs[0].content}</div>
    </div>
  );
  const TabContent2 = ({ isActive }) => (
    <div className={`border-2 rounded-2xl ${isActive ? "activecont2" : "deactivecont2"} `}>
      <div className={`p-20 ${isActive ? "block" : "hidden"}`}>{tabs[1].content}</div>
    </div>
  );
  const TabContent3 = ({ isActive }) => (
    <div className={`border-2 rounded-2xl ${isActive ? "activecont3" : "deactivecont3"} `}>
      <div className={`p-20 ${isActive ? "block" : "hidden"}`}>{tabs[2].content}</div>
    </div>
  );
  return (
    <div>
      <div className="flex" style={{ direction: "rtl" }}>
        {tabs.map(
          (tab, index) =>
            (index === 0 && (
              <Tab1
                key={index}
                label={tab}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            )) ||
            (index === 1 && (
              <Tab2
                key={index}
                label={tab}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            )) ||
            (index === 2 && (
              <Tab3
                key={index}
                label={tab}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            ))
        )}
      </div>
      {tabs.map(
        (tab, index) =>
          (index === 0 && (
            <TabContent1
              key={index}
              isActive={activeTab === index}
              content={tab}
              onClick={() => setActiveTab(index)}
            />
          )) ||
          (index === 1 && (
            <TabContent2
              key={index}
              isActive={activeTab === index}
              content={tab}
              onClick={() => setActiveTab(index)}
            />
          )) ||
          (index === 2 && (
            <TabContent3
              key={index}
              isActive={activeTab === index}
              content={tab}
              onClick={() => setActiveTab(index)}
            />
          ))
      )}
    </div>
  );
}
export default Tabs;
