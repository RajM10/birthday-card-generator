"use client";
import { motion } from "framer-motion";
import { ChevronDown, Mic, Wind } from "lucide-react";

function Blow() {
  return (
    <div className='absolute bottom-14 left-1/2 tranform -translate-x-1/2 translate-y-1/2 flex flex-col items-center '>
      <p className='font-semibold text-xl text-center flex text-white items-center gap-2'>
        Blow From Mic
        <span className='flex items-center'>
          <Wind /> <Mic />
        </span>
      </p>
      <motion.div
        animate={{ translateY: [10, 0, 10] }}
        transition={{ duration: 4, repeat: Infinity }}>
        <span>
          <ChevronDown className='stroke-white' />
          <ChevronDown className='-mt-3.5 stroke-white' />
        </span>
      </motion.div>
    </div>
  );
}

export default Blow;
