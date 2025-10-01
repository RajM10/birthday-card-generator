"use client";
import { HeartIcon, Users, Home } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-4'>
      <div className='max-w-3xl w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20'>
        <div className='text-center mb-12'>
          <div className='flex justify-center mb-6'>
            <HeartIcon className='w-16 h-16 text-pink-200 animate-pulse' />
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Birthday Card Generator
          </h1>
          <p className='text-pink-100 text-lg md:text-xl mb-4'>
            Create beautiful, personalized birthday cards for your loved ones
            with messages and photos.
          </p>
          <p className='text-green-200 text-sm md:text-base mb-8 flex items-center justify-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <rect
                x='3'
                y='11'
                width='18'
                height='11'
                rx='2'
                ry='2'></rect>
              <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
            </svg>
            All messages are secured with end-to-end encryption
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-6 mb-12'>
          <div className='bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10'>
            <div className='flex justify-center mb-4'>
              <Users className='w-10 h-10 text-pink-200' />
            </div>
            <h3 className='text-white text-xl font-semibold mb-2 text-center'>
              For Friends
            </h3>
            <p className='text-pink-100 text-center'>
              Create fun and casual cards with encrypted messages
            </p>
          </div>

          <div className='bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10'>
            <div className='flex justify-center mb-4'>
              <Home className='w-10 h-10 text-pink-200' />
            </div>
            <h3 className='text-white text-xl font-semibold mb-2 text-center'>
              For Family
            </h3>
            <p className='text-pink-100 text-center'>
              Send private, secure wishes to your family members
            </p>
          </div>

          <div className='bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10'>
            <div className='flex justify-center mb-4'>
              <HeartIcon className='w-10 h-10 text-pink-200' />
            </div>
            <h3 className='text-white text-xl font-semibold mb-2 text-center'>
              For Special Someone
            </h3>
            <p className='text-pink-100 text-center'>
              Share private romantic wishes with enhanced security
            </p>
          </div>
        </div>

        <div className='flex flex-col items-center gap-4'>
          <Link
            href='/create'
            className='bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity'>
            Create Birthday Card
          </Link>
          <p className='text-pink-100/80 text-sm flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path>
            </svg>
            Protected with AES-256 encryption
          </p>
        </div>
      </div>
    </div>
  );
}
