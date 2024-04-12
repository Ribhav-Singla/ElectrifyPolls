// PollOption.js

import { RiDeleteBinLine } from "react-icons/ri";

export default function PollOption({ index, value, onChange, onDelete }) {
  const handleInputChange = (e) => {
    onChange(index, e.target.value);
  };

  const handleDeleteOption = () => {
    onDelete(); // Call onDelete function when delete icon is clicked
  };

  return (
    <>
      <div className="mt-2">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label
            htmlFor={`pollOption-${index}`}
            className="fw-bold text-secondary form-label"
          >
            Poll option
          </label>
          <RiDeleteBinLine size={23} color="red" style={{ cursor: "pointer" }} onClick={handleDeleteOption} />
        </div>
        <input
          type="text"
          id={`pollOption-${index}`}
          name={`pollOption-${index}`}
          placeholder={`Eg. Option`}
          className="form-control fs-5"
          required
          value={value}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
}
