
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, DollarSign, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 hero-overlay">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070"
            alt="Travel destination"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-md">
                Plan Smart, Travel Smarter
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
                Create unforgettable journeys with personalized itineraries and expert recommendations.
              </p>
              <Button size="lg" className="bg-coral hover:bg-coral/90 text-white" asChild>
                <Link to="/planner">Start Your Journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-navy">How Journey Genie Works</h2>
            <p className="text-lg text-muted-foreground">
              Your personal travel assistant that helps you plan, explore, and book with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Destination</h3>
              <p className="text-muted-foreground">
                Select from thousands of destinations worldwide for your next adventure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Set Your Dates</h3>
              <p className="text-muted-foreground">
                Choose when you want to travel and for how long.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Add Travelers</h3>
              <p className="text-muted-foreground">
                Traveling solo, as a couple, or with family? We'll customize your experience.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Set Budget</h3>
              <p className="text-muted-foreground">
                Tell us your budget and we'll create the perfect itinerary that fits.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-coral hover:bg-coral/90 text-white" asChild>
              <Link to="/planner" className="inline-flex items-center">
                Plan Your Trip <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-navy">Popular Destinations</h2>
            <p className="text-lg text-muted-foreground">
              Explore some of our most loved travel destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Destination 1 */}
            <div className="group relative rounded-xl overflow-hidden h-72 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=2070"
                alt="Paris"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">Paris</h3>
                <p className="text-sm text-gray-200">France</p>
                <Link to="/planner" className="mt-3 inline-flex items-center text-coral hover:text-coral/80">
                  Plan a trip <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Destination 2 */}
            <div className="group relative rounded-xl overflow-hidden h-72 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070"
                alt="Santorini"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">Santorini</h3>
                <p className="text-sm text-gray-200">Greece</p>
                <Link to="/planner" className="mt-3 inline-flex items-center text-coral hover:text-coral/80">
                  Plan a trip <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Destination 3 */}
            <div className="group relative rounded-xl overflow-hidden h-72 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=2071"
                alt="Kyoto"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">Kyoto</h3>
                <p className="text-sm text-gray-200">Japan</p>
                <Link to="/planner" className="mt-3 inline-flex items-center text-coral hover:text-coral/80">
                  Plan a trip <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-teal/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-navy">What Travelers Say</h2>
            <p className="text-lg text-muted-foreground">
              Read what our community has to say about their experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-coral rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070"
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Sarah Thompson</h4>
                  <p className="text-sm text-muted-foreground">Tokyo, Japan</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Journey Genie made planning my trip to Japan so easy! The itinerary was perfect for my budget and interests."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-coral rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070"
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Michael Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Barcelona, Spain</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The heritage sites exploration feature was incredible. I discovered places I never knew existed!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-coral rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070"
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Emily Chen</h4>
                  <p className="text-sm text-muted-foreground">Bali, Indonesia</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "From planning to booking, everything was seamless. I'll definitely use Journey Genie for all my future travels!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
            <p className="text-lg mb-8">
              Start planning your journey today and create memories that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-coral hover:bg-coral/90" asChild>
                <Link to="/planner">Plan Your Trip</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/explore">Explore Destinations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
