import React from 'react'

import { Card, CardBody } from '@roketid/windmill-react-ui'
import PageTitle from 'example/components/Typography/PageTitle'
import SectionTitle from 'example/components/Typography/SectionTitle'
import CTA from 'example/components/CTA'
import InfoCard from 'example/components/Cards/InfoCard'
import RoundIcon from 'example/components/RoundIcon'
import Layout from 'example/containers/Layout'
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon } from 'icons'
import axios from 'axios'
function Cards(props :any) {
  return (
    <Layout>
      <PageTitle>코인 뉴스</PageTitle>

      <Card className="mb-8 shadow-md">
        {
        props.news.map((item:any) => (
          <CardBody>
            <a href={item.url}>
              <p className="text-base text-gray-600 dark:text-gray-400">
                {item.title}
              </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 " style={{ textAlign: 'right' }} >{item.time}</p>
            </a>
          </CardBody>
        ))        
        }
      </Card>

    </Layout>
  )
}
export const getServerSideProps = async (ctx) => {
  try{
    const res = await axios.get('http://localhost:4100/api/news',{
        headers: { Cookie: ctx.req.headers.cookie },
    })
    return {
      props: {
        news: res.data.news,
      },
    }
  }catch(e){
    return console.log(e)
  }
}
export default Cards
