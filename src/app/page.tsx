"use client";
import { HeartIcon, Gift, Users, Home } from "lucide-react";
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
          <p className='text-pink-100 text-lg md:text-xl mb-8'>
            Create beautiful, personalized birthday cards for your loved ones
            with messages and photos.
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
              Create fun and casual cards for your friends
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
              Send heartfelt wishes to your family members
            </p>
          </div>

          <div className='bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10'>
            <div className='flex justify-center mb-4'>
              <HeartIcon className='w-10 h-10 text-pink-200' />
            </div>
            <h3 className='text-white text-xl font-semibold mb-2 text-center'>
              For Love
            </h3>
            <p className='text-pink-100 text-center'>
              Express your love with romantic birthday cards
            </p>
          </div>
        </div>

        <div className='flex justify-center'>
          <Link
            href='/create'
            className='group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'>
            <span className='mr-2'>Create Birthday Card</span>
            <Gift className='w-6 h-6 group-hover:animate-bounce' />
          </Link>
        </div>
      </div>
    </div>
  );
}
