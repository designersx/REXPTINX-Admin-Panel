import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import style from '../css/AgentDetails.module.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AgentDetailsCards from '../components/AgentDetailsCards'
function AgentDetails() {
const parmas = useParams()

const id = parmas.userId
const [data , setData] = useState()

    const getAgents = async()=>{
        let res = await axios.get(`${process.env.REACT_APP_API_URL}agent/${id}`)
        console.log(res.data)
        setData(res.data)
    }
    useEffect(()=>{
        getAgents()
    } , [id])
  return (
    <>
    <Layout> 

        <h1 className={style.header}>Agents Details</h1>
        <AgentDetailsCards data = {data}/>
    </Layout>
    </>
  )
}

export default AgentDetails