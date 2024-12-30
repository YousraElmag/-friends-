import React from 'react'
import ChatApp from '../component/Sidebar'
import Logout from '../component/Navbar'
export default function Home() {
  return (
    <div>
    <Logout/>
      <ChatApp/>
    </div>
  )
}
