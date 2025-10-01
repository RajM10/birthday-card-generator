"use client";
import { message } from "@/const/Message";
import { useState } from "react";
export default function LetterPage() {
const [isOpen, setIsOpen] = useState<boolean>(false);
const lines = message.letter;
const btnStyles =
"font-medium border-2 border-solid border-[#d9534f] rounded-md uppercase px-10 py-3 hover:bg-[#d9534f] hover:text-white m-[5px] min-w-[120px] text-[#d9534f]";

return (
<div className='h-dvh flex items-center flex-col justify-around bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400'>
<div className='relative'>
<div
onClick={() => setIsOpen((curr) => !curr)}
className={`relative rounded-b-md w-[280px] mx-auto mt-[150px] bg-[#d9534f] shadow-lg transition-all duration-500 ${
isOpen ? "open" : "close"
}`}>
{/* Flap */}
<div
className={`absolute ${
isOpen
? "rotate-x-180 z-0 transition-[transform_0.4s_ease]"
: "rotate-x-0 z-10 transition-[transform_0.4s_0.6s_ease]"
} transform w-0 h-0 border-l-[140px] border-r-[140px] border-l-transparent border-r-transparent border-b-[82px] border-b-transparent border-t-[98px] border-t-[#d9534f] origin-top flap`}></div>

{/* Pocket */}
<div
className={`absolute w-0 h-0 z-10 border-l-[140px] border-r-[140px] border-l-[#f5a3a2] border-r-[#f5a3a2] border-b-[90px] border-b-[#ff6f61] border-t-[90px] border-t-transparent rounded-b-md pocket`}></div>

{/* Letter */}
<div
className={`${
isOpen
? "transform -translate-y-full z-10 transition-all duration-500"
: "transform translate-y-0 z-0 transition-all duration-500"
} h-auto px-3 py-2 relative w-[90%] mx-auto bg-white rounded-md shadow-md overflow-hidden`}>
<div
className={`transition-all duration-500 ${
isOpen ? "max-h-[500px]" : "max-h-0"
}`}>
{lines.map((line, index) => (
<div
key={index}
className='text-pink-900'>
{line}
</div>
))}
</div>
</div>

{/* Hearts */}
<div className='absolute top-[90px] left-0 right-0 z-[2] hearts'>
<div className='heart a1'></div>
<div className='heart a2'></div>
<div className='heart a3'></div>
</div>
</div>
</div>

<div className='text-center'>
<button
className={btnStyles}
onClick={() => setIsOpen(true)}>
Open
</button>
<button
className={btnStyles}
onClick={() => setIsOpen(false)}>
Close
</button>
</div>
</div>
);
}
