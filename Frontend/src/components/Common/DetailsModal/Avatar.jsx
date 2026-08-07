const Avatar = ({
  text = "",
  size = "lg",
  bgColor = "bg-indigo-600",
}) => {
  const initials = text
    ?.split(" ")
    .map(word => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizes = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-xl",
    lg: "w-24 h-24 text-3xl",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        ${bgColor}
        rounded-full
        text-white
        font-bold
        flex
        items-center
        justify-center
        shadow-lg
      `}
    >
      {initials}
    </div>
  );
};

export default Avatar;