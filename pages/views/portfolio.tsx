import { Doughnut} from 'react-chartjs-2'
import ChartCard from 'example/components/Chart/ChartCard'
import PageTitle from 'example/components/Typography/PageTitle'
import Layout from 'example/containers/Layout'
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import axios from 'axios'
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHeader, TableRow } from '@roketid/windmill-react-ui'
import { localeStringOptions } from './dashboard'
function Charts({chartLegends, chartPercentage, backgroundColor, portfolioData, nowDate,}) {
  // if(portfolioData.length === 0){
  //   return (
  //     <Layout>
  //       <PageTitle>포트폴리오</PageTitle>
  //       <div className="grid gap-6 mb-8 md:grid-cols-2">
  //         <ChartCard title="포트폴리오 차트">
  //           "현재 보유하고 있는 코인이 없습니다."
  //         </ChartCard>
  //       </div>
  //     </Layout>
  //   )
  // }
  Chart.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const doughnutOptions = {
  data: {
    datasets: [
      {
        data: chartPercentage,
        backgroundColor: backgroundColor,
        label: 'data',
      },
    ],
    labels : chartLegends?.map((legend)=>legend.title),
  },
  options: {
    responsive: true,
    cutoutPercentage: 80,
  },
  legend: {
    display: false,
  },
}

  return (
    portfolioData.length === 0 ?
    
    <Layout>
      <PageTitle>포트폴리오</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
          "현재 보유하고 있는 코인이 없습니다."
      </div>
    </Layout>
    :
    <Layout>
      <PageTitle>포트폴리오</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="포트폴리오 차트">
          <Doughnut {...doughnutOptions} />
        </ChartCard>
      {/* <PageTitle>보유자산</PageTitle> */}
        <TableContainer style={{overflow : "scroll"}}>
          <Table>
            <TableHeader>
              <tr className='w-full'>
                <TableCell>종목</TableCell>
                <TableCell className='flex flex-grow'>
                  <div className='flex flex-col w-full'>
                    <div style={{ textAlign: 'right' }}  className="m-1" >보유수량</div>
                    <div style={{ textAlign: 'right' }}  className="m-1">평가금액</div>
                  </div>   
                  <div className='flex flex-col w-full'>
                    <div style={{ textAlign: 'right' }}  className="m-1">매수평균가</div>
                    <div style={{ textAlign: 'right' }}  className="m-1">매수금액</div>
                  </div>
                  <div className='flex flex-col w-full'>
                    <div style={{ textAlign: 'right' }}  className="m-1">평가손익</div>
                    <div style={{ textAlign: 'right' }} className="m-1">수익률</div>
                  </div> 
                </TableCell>
              </tr>
            </TableHeader>
            <TableBody>
             {portfolioData.map((portfolio, i) => (
                <TableRow key={i} id={portfolio.market} >
                  <TableCell className='text-xs lg:text-base'>{portfolio.market}</TableCell>
                  <TableCell className='flex flex-grow text-xs lg:text-base'>
                    <div className='flex flex-col w-full'>
                      <div style={{ textAlign: 'right' }}  className="m-1">{((+portfolio.quantity)).toLocaleString('ko-KR',localeStringOptions)}</div>
                      <div style={{ textAlign: 'right' }}  className="m-1">{(+portfolio.evaluatedPrice).toLocaleString('ko-KR',localeStringOptions)}</div>
                    </div>  
                    <div className='flex flex-col w-full'>
                      <div style={{ textAlign: 'right' }}  className="m-1">{(+portfolio.averagePrice).toLocaleString('ko-KR',localeStringOptions)}</div>
                      <div style={{ textAlign: 'right' }}  className="m-1">{(+portfolio.totalInvested).toLocaleString('ko-KR',localeStringOptions)}</div>
                    </div>
                    <div className='flex flex-col w-full'>
                      <div style={{ textAlign: 'right' }}  className="m-1">
                        {
                        portfolio.evaluatedGainAndLoss < 0 ?
                        <div className={"text-red-600"}>
                          {(+portfolio.evaluatedGainAndLoss).toLocaleString('ko-KR',localeStringOptions)}
                        </div>
                        :
                        portfolio.evaluatedGainAndLoss == 0 ?
                        <div > 
                          {(+portfolio.evaluatedGainAndLoss).toLocaleString('ko-KR',localeStringOptions)}
                        </div>
                        :
                        <div className={"text-green-700"}> 
                          {(+portfolio.evaluatedGainAndLoss).toLocaleString('ko-KR',localeStringOptions)}
                        </div>
                      }
                      </div>
                      <div style={{ textAlign: 'right' }}  className="m-1">
                        {
                        +portfolio.profitRate < 0 ?
                        <div className={"text-red-600"}> 
                          {(+portfolio.profitRate).toLocaleString()+"%"}
                        </div>
                        :
                        +portfolio.profitRate === 0 ?
                        <div className={""}>
                          {(+portfolio.profitRate).toLocaleString()+"%"}
                        </div>
                        :
                        <div className={"text-green-700"}>
                          {(+portfolio.profitRate).toLocaleString()+"%"}
                        </div>
                      }
                      </div>
                    </div>
                  </TableCell> 
                </TableRow>
              ))} 
            </TableBody>
          </Table>
          <TableFooter>
            {nowDate} 기준
          </TableFooter>
        </TableContainer>
      </div>

    </Layout>
  )
}
export const getServerSideProps = async(ctx)=>{
  const res = await axios.get('http://localhost:4100/api/user/portfolioChart',{
          headers: { Cookie: ctx.req.headers.cookie },
      }
  )
  const {
    chartLegends, 
    chartPercentage, 
    backgroundColor,
    portfolioData,
    nowDate,
  } = res.data
  return {
    props: {
      chartLegends,
      chartPercentage,
      backgroundColor,
      portfolioData,
      nowDate,
    }
  }
}

export default Charts
