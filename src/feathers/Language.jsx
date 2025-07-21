import Select from "react-select";
function Language() {
  const options = [
    { value: "persian", label: "فارسی" },
    { value: "english", label: "انگلیسی" },
  ];
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "2px solid #00b3a1",
      borderBottom: state.isFocused ? "none" : "2px solid #00b3a1",
      direction: "rtl",
      borderRadius: "20px",
      padding: "0px",
      backgroundColor: "white",
      boxShadow: state.isFocused ? "0 0 0 0 #0d9488" : "none", // change the show if is focus
      borderColor: state.isFocused ? "#0d9488" : "#14b8a6", // change the bordercolor
      borderBottomLeftRadius: state.isFocused ? "0px" : "20px",
      borderBottomRightRadius: state.isFocused ? "0px" : "20px",
      "&:hover": {
        borderColor: "#00b3a1",
      },
    }),
    menu: (provided) => ({
      ...provided,
      border: "2px solid #00b3a1",
      borderTop: "none",
      borderTopLeftRadius: "none",
      borderTopRightRadius: "none",
      borderBottomLeftRadius: "20px",
      borderBottomRightRadius: "20px",
      marginTop: "0px",
    }),
    option: (provided, state) => ({
      ...provided,
      width: "min-width",
      margin: "0 10px",
      borderTop: "2px solid #00b3a1",
      backgroundColor: "white",
      color: "#0d9488",
      //color: state.isSelected ? "white" : "#0d9488",
      //borderRadius: "20px",
      direction: "rtl",
      "&:hover": {
        backgroundColor: "#e0f2f1",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#0d9488",
    }),
  };
  const flashComponents = {
    DropdownIndicator: () => (
      <svg
        width="10"
        height="10"
        viewBox="0 0 7 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-2"
      >
        <path
          d="M4.65282 4.12713C4.25404 4.58759 3.53973 4.58759 3.14096 4.12713L1.08888 1.7576C0.528006 1.10995 0.988058 0.102941 1.84481 0.102941L5.94896 0.102942C6.80571 0.102942 7.26577 1.10995 6.70489 1.7576L4.65282 4.12713Z"
          fill="#00BA9F"
        />
      </svg>
    ),
  };
  return (
    <div className="flex mx-73 my-5 items-start w-76">
      <Select
        options={options}
        defaultValue={options[0]}
        className="basic-select mx-2 w-34 "
        classNamePrefix="select"
        styles={customStyles}
        components={flashComponents}
      />
      <p className="w-48 my-1 mx-0" style={{ color: "#969696" }}>
        :زبان گفتار
      </p>
    </div>
  );
}
export default Language;
