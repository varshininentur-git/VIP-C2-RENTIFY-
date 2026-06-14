const formatINR = (amount) => {
  const value = Number(amount);
  if (Number.isNaN(value)) return "₹0";
  return `₹${value.toLocaleString("en-IN")}`;
};

export default formatINR;
