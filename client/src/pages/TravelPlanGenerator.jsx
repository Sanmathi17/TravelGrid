import React, { useState } from "react";
import { Calendar, MapPin, Clock, Download, Map, Star } from "lucide-react";
import Navbar from "../components/Custom/Navbar";
import { useNavigate } from "react-router-dom";
import { generateTravelPlanPDF } from "../utils/pdfGenerator";
import { fastTravelPlanner } from "../utils/fastTravelPlanner";

const TravelPlanGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: "",
    destination: "",
    numberOfDays: 3,
    startDate: "",
    interests: []
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const travelInterests = [
    { id: "nature", label: "Nature", icon: "🌲" },
    { id: "adventure", label: "Adventure", icon: "🏔️" },
    { id: "museums", label: "Museums", icon: "🏛️" },
    { id: "beaches", label: "Beaches", icon: "🏖️" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "food", label: "Food", icon: "🍽️" },
    { id: "culture", label: "Culture", icon: "🎭" },
    { id: "nightlife", label: "Nightlife", icon: "🌃" },
    { id: "relaxation", label: "Relaxation", icon: "🧘" },
    { id: "photography", label: "Photography", icon: "📸" }
  ];

  // Country-based destination structure
  const destinationsByCountry = {
    "France": ["Paris", "Lyon", "Nice", "Marseille", "Bordeaux"],
    "United Kingdom": ["London", "Edinburgh", "Manchester", "Liverpool", "Birmingham"],
    "Italy": ["Rome", "Milan", "Florence", "Venice", "Naples"],
    "Spain": ["Barcelona", "Madrid", "Seville", "Valencia", "Granada"],
    "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    "Japan": ["Tokyo", "Kyoto", "Osaka", "Yokohama", "Nagoya"],
    "Thailand": ["Bangkok", "Phuket", "Chiang Mai", "Pattaya", "Krabi"],
    "Singapore": ["Singapore"],
    "Indonesia": ["Bali", "Jakarta", "Yogyakarta", "Surabaya", "Bandung"],
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
    "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
    "Qatar": ["Doha"],
    "Turkey": ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa"],
    "United States": ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    "India": ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"]
  };

  const countries = Object.keys(destinationsByCountry);

  const handleInterestChange = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleCountryChange = (country) => {
    setFormData(prev => ({
      ...prev,
      country: country,
      destination: "" // Reset destination when country changes
    }));
  };

  const handleDestinationChange = (destination) => {
    setFormData(prev => ({
      ...prev,
      destination: destination
    }));
  };

  const generateTravelPlan = () => {
    if (!formData.country || !formData.destination || formData.interests.length === 0) {
      alert("Please select a country, destination, and at least one interest");
      return;
    }

    setIsGenerating(true);
    
    // Performance test for demonstration
    fastTravelPlanner.performanceTest();
    
    // Instant generation - no delay needed
    const plan = createTravelPlan(formData);
    setGeneratedPlan(plan);
    setIsGenerating(false);
  };

  const createTravelPlan = (data) => {
    const { destination, numberOfDays, startDate, interests } = data;
    
    // Use AI-powered travel planner to generate intelligent plan
    return fastTravelPlanner.generateTravelPlan(destination, numberOfDays, interests, startDate);
  };

  const downloadPDF = () => {
    generateTravelPlanPDF(generatedPlan);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 overflow-x-hidden">
      <Navbar />
      <main className="flex flex-col flex-1 w-full items-center pt-24">
        <section className="w-full py-12 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 mt-6">
            Create Your <span className="text-pink-400">Travel Plan</span>
            </h1>
          <p className="text-lg md:text-xl text-pink-200 max-w-2xl mx-auto mb-4">
            Generate personalized day-by-day travel itineraries based on your preferences.
          </p>
          <p className="text-sm text-pink-300 max-w-2xl mx-auto">
            ⚡ Select your country and city for ultra-fast instant travel planning!
          </p>
        </section>

        <div className="max-w-6xl w-full px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Plan Details</h2>
              
              <div className="space-y-6">
                {/* Country Selection */}
                <div>
                  <label className="block text-pink-300 font-semibold mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-black/30 border border-pink-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400"
                  >
                    <option value="">Select a country</option>
                    {countries.map(country => (
                      <option key={country} value={country} className="bg-black text-white">
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination/City Selection */}
                <div>
                  <label className="block text-pink-300 font-semibold mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    City/Destination
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    disabled={!formData.country}
                    className="w-full bg-black/30 border border-pink-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.country ? "Select a city" : "Select a country first"}
                    </option>
                    {formData.country && destinationsByCountry[formData.country]?.map(dest => (
                      <option key={dest} value={dest} className="bg-black text-white">
                        {dest}
                      </option>
                    ))}
                  </select>
                  {formData.country && !formData.destination && (
                    <p className="text-pink-300 text-sm mt-1">
                      Available cities in {formData.country}
                    </p>
                  )}
                  
                  {/* Selected Location Display */}
                  {formData.country && formData.destination && (
                    <div className="mt-3 p-3 bg-pink-600/20 border border-pink-400/30 rounded-lg">
                      <p className="text-white text-sm">
                        <span className="text-pink-300">Selected:</span> {formData.destination}, {formData.country}
                      </p>
                    </div>
                  )}
                </div>

                {/* Number of Days */}
                <div>
                  <label className="block text-pink-300 font-semibold mb-2">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Number of Travel Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.numberOfDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfDays: parseInt(e.target.value) }))}
                    className="w-full bg-black/30 border border-pink-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-pink-300 font-semibold mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full bg-black/30 border border-pink-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400"
                  />
                </div>

                {/* Travel Interests */}
                <div>
                  <label className="block text-pink-300 font-semibold mb-3">
                    <Star className="inline w-4 h-4 mr-2" />
                    Travel Interests
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {travelInterests.map((interest) => (
                      <label
                        key={interest.id}
                        className="flex items-center space-x-2 cursor-pointer p-3 bg-black/20 border border-pink-400/20 rounded-lg hover:bg-pink-400/10 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest.id)}
                          onChange={() => handleInterestChange(interest.id)}
                          className="w-4 h-4 text-pink-400 bg-black/30 border-pink-400/30 rounded focus:ring-pink-400"
                        />
                        <span className="text-lg">{interest.icon}</span>
                        <span className="text-white text-sm">{interest.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateTravelPlan}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating your itinerary...
                    </span>
                  ) : (
                    "⚡ Generate Instant Travel Plan"
                  )}
                </button>
              </div>
            </div>

            {/* Generated Plan Section */}
            <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Travel Plan</h2>
              
              {generatedPlan ? (
                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="bg-black/20 rounded-lg p-4">
                    <h3 className="text-xl font-bold text-pink-400 mb-2">
                      {generatedPlan.destination}, {formData.country}
                    </h3>
                    <div className="flex items-center space-x-4 text-pink-200 text-sm">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {generatedPlan.numberOfDays} Days
                      </span>
                      {generatedPlan.startDate && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(generatedPlan.startDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Daily Plans */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {generatedPlan.days.map((day) => (
                      <div key={day.day} className="bg-black/20 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-pink-300 mb-3">
                          {day.title}
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-pink-400 font-medium text-sm">Activities:</h5>
                            <ul className="text-white text-sm space-y-1 mt-1">
                              {day.activities.map((activity, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div>
                              <span className="text-pink-400 font-medium">Breakfast:</span>
                              <span className="text-white ml-2">{day.meals.breakfast}</span>
                            </div>
                            <div>
                              <span className="text-pink-400 font-medium">Lunch:</span>
                              <span className="text-white ml-2">{day.meals.lunch}</span>
                            </div>
                            <div>
                              <span className="text-pink-400 font-medium">Dinner:</span>
                              <span className="text-white ml-2">{day.meals.dinner}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={downloadPDF}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download as PDF
                  </button>
                </div>
              ) : (
                <div className="text-center text-pink-300 py-12">
                  <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and generate your personalized travel plan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TravelPlanGenerator; 