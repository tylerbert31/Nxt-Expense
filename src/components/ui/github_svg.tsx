import Image from "next/image";
import React from "react";

const Github = () => {
  return (
    <a href="https://github.com/tylerbert31" target="_blank">
      <Image
        src="/github-mark.png"
        className="w-[32px] h-[32px]"
        alt="Tyler's Github"
        width={64}
        height={64}
      />
    </a>
  );
};

export default Github;
