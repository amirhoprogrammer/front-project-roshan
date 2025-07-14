import Select from "react-select";
import { UserIcon, CogIcon } from "@heroicons/react/24/outline";
import "../App.css";
function ChangeTheVoice() {
  const options = [
    {
      value: "user",
      label: (
        <div className="flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
          <span>پروفایل کاربری</span>
        </div>
      ),
    },
    {
      value: "settings",
      label: (
        <div className="flex items-center">
          <CogIcon className="w-5 h-5 mr-2 text-green-500" />
          <span>تنظیمات</span>
        </div>
      ),
    },
  ];
  return (
    <div className="mt-8 mb-4 flex flex-col">
      <Select
        options={options}
        className="basic-select"
        classNamePrefix="select"
        placeholder="یک گزینه انتخاب کنید..."
      />
      {/*<select name="guests" id="" className="border-2 select rounded-xl p-2 mx-6 w-24">
        <option value="guest" className="flex">
          <p>مهمان</p>
          <svg
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.3874 16.1875V14.6458C16.3874 13.8281 16.0626 13.0438 15.4843 12.4656C14.9061 11.8874 14.1218 11.5625 13.3041 11.5625H7.13741C6.31966 11.5625 5.5354 11.8874 4.95716 12.4656C4.37893 13.0438 4.05408 13.8281 4.05408 14.6458V16.1875"
              stroke="#00BA9F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.2207 8.47917C11.9235 8.47917 13.304 7.09871 13.304 5.39583C13.304 3.69296 11.9235 2.3125 10.2207 2.3125C8.51778 2.3125 7.13733 3.69296 7.13733 5.39583C7.13733 7.09871 8.51778 8.47917 10.2207 8.47917Z"
              stroke="#00BA9F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
  </svg>
        </option>
        <option value="guest">خروج</option>
      </select>*/}
      <button>click me</button>
    </div>
  );
}
export default ChangeTheVoice;
