import React from 'react'
import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex gap-6">
        <Link to="/login" className="hover:underline">Login Page</Link>
        <Link to="/student/dashboard" className="hover:underline">Student Dashboard</Link>
        <Link to="/clerk/dashboard" className="hover:underline">Clerk Dashboard</Link>
        <Link to="/warden/dashboard" className="hover:underline">Warden Dashboard</Link>
      </div>
    </nav>
  )
}