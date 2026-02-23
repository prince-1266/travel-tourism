const Label = ({ children, htmlFor, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
