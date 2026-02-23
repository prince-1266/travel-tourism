const Button = ({ children, ...props }) => {
  return (
    <button {...props} className="px-4 py-2 rounded-lg">
      {children}
    </button>
  );
};

export default Button;
