import React from "react";

const InputGroup = ({ label, name, type = "text", ...rest }) => {
  return (
    <div className="relative z-0 w-full mb-6 group">
      <input
        type={type}
        id={name}
        name={name}
        className={`peer block py-3 px-1 w-full text-lg text-gray-900 bg-transparent border-0 border-b-[3px] border-gray-600 focus:outline-none focus:ring-0 focus:border-[#34b1aa] transition-all duration-200 ease-in-out`}
        placeholder=" "
        {...rest}
      />
      <label
        htmlFor={name}
        className="absolute text-lg text-gray-500 font-semibold duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
      >
        {label}
      </label>
    </div>
  );
};

export default InputGroup;
