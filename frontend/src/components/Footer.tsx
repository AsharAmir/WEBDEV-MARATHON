// import React from 'react';
// import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, BookOpen } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Footer: React.FC = () => {
//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Company Info */}
//           <div>
//             <Link to="/" className="flex items-center text-2xl font-bold mb-4">
//               <BookOpen className="mr-2" />
//               LearnBeyond
//             </Link>
//             <p className="text-gray-400 mb-4">
//               Transforming education through innovation and technology. Join us on the journey to learn beyond limits.
//             </p>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <Facebook size={20} />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <Twitter size={20} />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <Instagram size={20} />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <Youtube size={20} />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-bold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
//                   Courses
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/tutors" className="text-gray-400 hover:text-white transition-colors">
//                   Our Tutors
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
//                   Pricing
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Categories */}
//           <div>
//             <h3 className="text-lg font-bold mb-4">Categories</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/courses?category=programming" className="text-gray-400 hover:text-white transition-colors">
//                   Programming
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/courses?category=ai" className="text-gray-400 hover:text-white transition-colors">
//                   Artificial Intelligence
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/courses?category=data-science" className="text-gray-400 hover:text-white transition-colors">
//                   Data Science
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/courses?category=design" className="text-gray-400 hover:text-white transition-colors">
//                   Design
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/courses?category=business" className="text-gray-400 hover:text-white transition-colors">
//                   Business
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h3 className="text-lg font-bold mb-4">Contact Us</h3>
//             <ul className="space-y-4">
//               <li className="flex items-start">
//                 <MapPin className="mr-2 mt-1 flex-shrink-0 text-blue-500" size={18} />
//                 <span className="text-gray-400">
//                   123 Education Street<br />
//                   Knowledge City, KS 98765
//                 </span>
//               </li>
//               <li className="flex items-center">
//                 <Phone className="mr-2 flex-shrink-0 text-blue-500" size={18} />
//                 <a href="tel:+15551234567" className="text-gray-400 hover:text-white transition-colors">
//                   (555) 123-4567
//                 </a>
//               </li>
//               <li className="flex items-center">
//                 <Mail className="mr-2 flex-shrink-0 text-blue-500" size={18} />
//                 <a href="mailto:info@learnbeyond.com" className="text-gray-400 hover:text-white transition-colors">
//                   info@learnbeyond.com
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <hr className="border-gray-800 my-8" />

//         <div className="flex flex-col md:flex-row justify-between items-center">
//           <div className="text-gray-500 mb-4 md:mb-0">
//             &copy; {new Date().getFullYear()} LearnBeyond. All rights reserved.
//           </div>
//           <div className="flex space-x-4 text-gray-500">
//             <Link to="/terms" className="hover:text-white transition-colors">
//               Terms of Service
//             </Link>
//             <Link to="/privacy" className="hover:text-white transition-colors">
//               Privacy Policy
//             </Link>
//             <Link to="/cookies" className="hover:text-white transition-colors">
//               Cookies
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
