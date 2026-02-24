import { Leaf, Users, Award, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-6">About Us</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Bringing fresh, organic food from local farms to your table
        </p>

        <div className="prose prose-lg max-w-none mb-16">
          <p className="text-lg leading-relaxed">
            Welcome to Organic Food Store, your trusted source for 100% certified organic products. 
            Since our founding, we've been committed to providing the freshest, healthiest food options 
            while supporting local farmers and sustainable agriculture practices.
          </p>
          <p className="text-lg leading-relaxed">
            We believe that everyone deserves access to high-quality, nutritious food that's good for 
            both people and the planet. That's why we carefully select every product in our store, 
            ensuring it meets our strict organic and quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-green-50 p-8 rounded-xl">
            <Leaf size={48} className="text-green-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">100% Organic</h3>
            <p className="text-gray-700">
              All our products are certified organic, grown without synthetic pesticides or GMOs.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-xl">
            <Users size={48} className="text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Local Farmers</h3>
            <p className="text-gray-700">
              We partner with local farmers to bring you the freshest produce while supporting our community.
            </p>
          </div>

          <div className="bg-purple-50 p-8 rounded-xl">
            <Award size={48} className="text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Quality Assured</h3>
            <p className="text-gray-700">
              Every product undergoes rigorous quality checks to ensure you get only the best.
            </p>
          </div>

          <div className="bg-red-50 p-8 rounded-xl">
            <Heart size={48} className="text-red-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Health First</h3>
            <p className="text-gray-700">
              We're passionate about promoting healthy living through nutritious, organic food.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl leading-relaxed">
            To make organic, sustainable food accessible to everyone while supporting local agriculture 
            and promoting environmental stewardship. We're not just selling food – we're building a 
            healthier, more sustainable future for our community and our planet.
          </p>
        </div>
      </div>
    </div>
  )
}
