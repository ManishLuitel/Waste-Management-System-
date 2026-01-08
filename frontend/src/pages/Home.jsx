import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      img: "https://cdn-icons-png.flaticon.com/512/753/753318.png",
      title: "Weekly Schedule",
      desc: "Check when and what type of waste will be collected in your area.",
      color: "bg-green-100"
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/744/744922.png",
      title: "Special Requests",
      desc: "Need extra help? Send a request for special waste pickup easily.",
      color: "bg-blue-100"
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/809/809957.png",
      title: "Compost Contacts",
      desc: "Connect with farmers who reuse biodegradable waste for compost.",
      color: "bg-amber-100"
    },
    
    {
      img: "https://cdn-icons-png.flaticon.com/512/1570/1570906.png",
      title: "Waste Tips",
      desc: "Learn how to properly sort and dispose of different waste types.",
      color: "bg-cyan-100"
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/3079/3079172.png",
      title: "Community Reports",
      desc: "View and report waste-related issues in your neighborhood.",
      color: "bg-red-100"
    }
  ];

  return (
    <div className="font-sans text-gray-800 min-h-screen flex flex-col">
    
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-700 to-green-900 text-white py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/70 to-green-600/70 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20 z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto transform transition-all duration-500 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Clean Banepa, <span className="text-green-300">Green</span> Banepa 🌿
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Join us in creating a cleaner, more sustainable community through smart waste management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/special-request"
              className="inline-block bg-white text-green-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              ➕ Make a Special Request
            </Link>
            <Link
              to="/schedule"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              📅 View Collection Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "1.2K+", label: "Households Served" },
              { number: "95%", label: "Coverage Area" },
              { number: "24/7", label: "Support Available" },
              { number: "3.5K+", label: "Requests Handled" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl md:text-4xl font-bold text-green-700 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive waste management solutions tailored for Banepa's needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ img, title, desc, color }, index) => (
              <div
                key={index}
                className={`${color} rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mb-6 flex items-center justify-center bg-white rounded-full shadow-sm">
                  <img src={img} alt={title} className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-green-700 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-green-200 max-w-2xl mx-auto">
              Hear from residents who've experienced our services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "The special request system saved us during our home renovation. They picked up all the construction waste promptly!",
                author: "Rajesh Shrestha",
                role: "Homeowner, Ward 5"
              },
              {
                quote: "I love how easy it is to check the collection schedule. The compost program has also helped reduce our kitchen waste significantly.",
                author: "Sunita Gurung",
                role: "Local Restaurant Owner"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-green-800/50 p-8 rounded-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl text-green-300 mb-4">"</div>
                <p className="text-lg mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-green-300">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Our Work in Action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how we're making a difference in Banepa's waste management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=500&q=80",
                title: "Community Clean-up Drive",
                desc: "Monthly community participation in waste collection"
              },
              {
                img: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=500&q=80",
                title: "Recycling Center",
                desc: "State-of-the-art sorting and recycling facility"
              },
              {
                img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&q=80",
                title: "Composting Program",
                desc: "Converting organic waste into valuable compost"
              },
              {
                img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80",
                title: "Collection Trucks",
                desc: "Modern fleet ensuring efficient waste pickup"
              },
              {
                img: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?auto=format&fit=crop&w=500&q=80",
                title: "Educational Programs",
                desc: "Teaching proper waste segregation to students"
              },
              {
                img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=500&q=80",
                title: "Green Initiatives",
                desc: "Promoting sustainable practices in the community"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make Banepa cleaner?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of residents in our mission for better waste management
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
           
            <Link
              to="/contact"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🌱</span> Banepa Waste
            </h3>
            <p className="text-green-300">
              Committed to a cleaner, greener Banepa through innovative waste management solutions.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-green-300 hover:text-white transition">Home</Link></li>
              <li><Link to="/schedule" className="text-green-300 hover:text-white transition">Schedule</Link></li>
              <li><Link to="/special-request" className="text-green-300 hover:text-white transition">Special Request</Link></li>
              <li><Link to="/contact" className="text-green-300 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-green-300">
              <li>Banepa Municipality Office</li>
              <li>Phone: 01-66XXXXX</li>
              <li>Email: waste@banepa.gov.np</li>
              <li>Hours: Sun-Fri, 7AM-5PM</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition"
                  aria-label={social}
                >
                  <span className="text-lg">{social === 'facebook' ? '📘' : social === 'twitter' ? '🐦' : '📷'}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-green-800 text-center text-sm text-green-400">
          <p>&copy; 2025 Banepa Municipality Waste Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;