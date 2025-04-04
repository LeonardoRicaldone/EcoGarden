import React from "react";

const About = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-2xl bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
                <p className="text-gray-600 leading-relaxed">
                    Welcome to our application! We are dedicated to providing the best
                    experience for our users. Our team works hard to deliver high-quality
                    features and ensure that everything runs smoothly. Thank you for
                    choosing us!
                </p>
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our mission is to create innovative solutions that make life easier
                        and more enjoyable for everyone. We strive to stay ahead of the
                        curve and continuously improve our services.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;