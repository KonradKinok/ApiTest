import { useState } from "react";

export const useToggle = (initialState = false) => {
  const [value, setIsValue] = useState(initialState);

  const enable = () => setIsValue(true);

  const disable = () => setIsValue(false);
  const toggle = () => setIsValue((prev) => !prev);
  return { value, enable, disable, toggle };
};

//Example:
// const {
//   value: isExpandedArticle,
//   enable: expandArticle,
//   disable: collpseArticle,
//   toggle: toggleExpand,
// } = useToggle();