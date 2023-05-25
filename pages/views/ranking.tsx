import React from 'react'

import { Card, CardBody } from '@roketid/windmill-react-ui'
import PageTitle from 'example/components/Typography/PageTitle'
import Layout from 'example/containers/Layout'
import axios from 'axios'

//이메일 앞부분 3자리 이외에는 ****로 표시
function emailMasking(email:string){
  let emailFront = email.slice(0,3)
  return emailFront + '****'
}


function Cards(props :any) {
  return (
    <Layout>
      <PageTitle>유저 순위</PageTitle>

      <Card className="mb-8 shadow-md">
        {
        props.ranking.map((user:any, index) => (
          <CardBody>
            <span className='text-3xl'> {index+1}위 {emailMasking(user.email)}</span>

              <p className="text-base text-gray-600">
                총 매수 : {(user.totalInvested).toLocaleString()}
              </p>
              <p className="text-base text-gray-600">
                보유 KRW :{(+user.balance).toLocaleString()}
              </p>
              <p className="text-base text-gray-600">
                종합점수 : {(user.totalScore).toLocaleString()}
              </p>
            {/* <p className="text-sm text-gray-600 dark:text-gray-400 " style={{ textAlign: 'right' }} >{item.time}</p> */}
          </CardBody>
        ))        
        }
      </Card>

    </Layout>
  )
}
export const getServerSideProps = async (ctx) => {
  try{
    const res = await axios.get('http://localhost:4100/api/user/ranking',{
        headers: { Cookie: ctx.req.headers.cookie },
    })
    return {
      props: {
        ranking: res.data,
      },
    }
  }catch(e){
    return console.log(e)
  }
}
export default Cards
