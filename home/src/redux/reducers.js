const reducer = (name = "VICMIE LLC" /*init state */, { type, payload }) => {
  switch (type) {
    case "FOO":
      return (name = "BAA");
    default:
      return name;
  }
};

export default reducer;
