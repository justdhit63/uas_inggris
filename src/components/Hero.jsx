import React from 'react'
import LoginPage from './LoginPage'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div>
            <section className="bg-white">
                <div className="max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-12">
                    <div className="flex items-center">
                        <img className='w-12 h-12 mr-3' src="logo.svg" alt="LearnSphere logo" />
                        <h2 className='text-2xl text-red-600'><span className='font-bold'>Learn</span>Sphere</h2>
                    </div>
                </div>
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:pt-8 lg:grid-cols-12">
                    <div className="mr-auto place-self-center lg:col-span-6">
                        <h1 className="max-w-2xl mb-4 text-4xl font-bold tracking-tight leading-none md:text-5xl xl:text-6xl">Online learning you can access anyway easily </h1>
                        <p className="max-w-2xl mb-6 font-light text-black lg:mb-8 md:text-lg lg:text-xl">a Solution for easy and flexible online learning, you can study anywhere through this platform</p>
                        <Link to="/login" href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white border border-gray-300 rounded-4xl hover:bg-orange-300 focus:ring-4 focus:ring-gray-100 bg-red-600">
                            Get Started
                        </Link>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-6 lg:flex">
                        <img src="hero-photo.png" alt="mockup" />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Hero
