import { Recycle, Leaf, Users, Target, Award, Heart } from "lucide-react";

export default function OurInitiative() {
  const initiatives = [
    {
      icon: Recycle,
      title: "Zero Waste Goal",
      description: "Working towards a zero-waste Banepa by 2030 through comprehensive recycling and waste reduction programs."
    },
    {
      icon: Leaf,
      title: "Composting Program",
      description: "Converting organic waste into valuable compost, reducing landfill burden and creating nutrient-rich soil."
    },
    {
      icon: Users,
      title: "Community Engagement",
      description: "Educating and involving local communities in sustainable waste management practices."
    },
    {
      icon: Target,
      title: "Efficient Collection",
      description: "Optimized waste collection routes and schedules to ensure timely and efficient service delivery."
    }
  ];

  const achievements = [
    { number: "500+", label: "Households Served" },
    { number: "2000kg", label: "Waste Recycled Monthly" },
    { number: "50+", label: "Community Volunteers" },
    { number: "95%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Initiative</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Building a sustainable future for Banepa through innovative waste management solutions
          </p>
          <div className="flex justify-center">
            <Heart className="h-16 w-16 text-green-200" />
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To create a cleaner, healthier, and more sustainable environment for the people of Banepa 
              through efficient waste management, community engagement, and environmental education.
            </p>
          </div>

          {/* Initiatives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {initiatives.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">Making a difference in our community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 rounded-lg p-6 mb-4">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-gray-700 font-medium">{achievement.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8 md:p-12">
            <div className="text-center">
              <Award className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                We envision Banepa as a model city for sustainable waste management in Nepal, 
                where every citizen actively participates in creating a circular economy. 
                Through innovation, education, and community partnership, we aim to eliminate 
                waste-related environmental challenges and build a cleaner, greener future for generations to come.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Initiative</h2>
          <p className="text-lg mb-6">
            Be part of the change. Together, we can make Banepa a cleaner and more sustainable city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Volunteer With Us
            </button>
            <button className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}