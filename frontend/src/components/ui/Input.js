const Input = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 ${className}`}
    />
  );
};

export default Input;
