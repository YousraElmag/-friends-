import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
export default function Register() {
  const navigate=useNavigate()
    const [data, setData]=useState({
        name:'',
        email:'',
        password:'',
    })
    const registeruser=async(e)=>{
        e.preventDefault()
        const {name, email, password}=data;
        try{
        const {data}=await axios.post('https://friends-r1o0.onrender.com/register',{
          name,
          email,
          password
        })
        if(data.error){
          toast.error(data.error)
        }
        else{
          setData({})
          toast.success("login succesfal")
          navigate('/login')
        }
      }catch(err){

      console.log(err)
      }
    }
  return (
    <div>
      <form onSubmit={registeruser}>
        <label>Name</label>
        <input
          type="text"
          placeholder="enter name ..."
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <label htmlFor="">Email</label>
        <input
          type="text"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label htmlFor="">Password</label>
        <input
          type="text"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
