/* eslint-disable react/prop-types */

export default function InputField({ type, value, label, id, onChange, readOnly = false }) {
  return (
    <div className='flex items-end gap-2 text-sm'>
      <label htmlFor={id || label.toLowerCase()} className="font-bold">
        {label}:
      </label>
      <input
        type={type || 'text'}
        id={id || label.toLowerCase()}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="border-b"
      />
    </div>
  );
}
