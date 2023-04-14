import { Doughnut, Line, Bar } from 'react-chartjs-2'
import ChartCard from 'example/components/Chart/ChartCard'
import ChartLegend from 'example/components/Chart/ChartLegend'
import PageTitle from 'example/components/Typography/PageTitle'
import Layout from 'example/containers/Layout'
import {
} from 'utils/demo/chartsData'
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
function MyHistory(props :any) {
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


  return (
    <Layout>
      <PageTitle>내 거래내역</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
      {/* <PageTitle>보유자산</PageTitle> */}
        <TableContainer style={{overflow : "scroll"}}>
          <Table>
            <TableHeader>
              <tr className='w-full'>
                <TableCell style={{ textAlign: 'center' }} >구분</TableCell>
                <TableCell style={{ textAlign: 'center' }}>종목</TableCell>
                <TableCell className='flex flex-grow'>
                  <div className='flex flex-col w-full'>
                    <div style={{ textAlign: 'center' }}  className="m-1" >가격</div>
                    <div style={{ textAlign: 'center' }}  className="m-1">수량</div>
                  </div>   
                  <div className='flex flex-col w-full'>
                    <div style={{ textAlign: 'center' }}  className="m-1">총금액</div>
                    <div style={{ textAlign: 'center' }}  className="m-1">거래시간</div>
                  </div>
                </TableCell>
                {/* <TableCell >
                  가격
                  <br/>
                  수량
                  </TableCell>
                <TableCell >
                  총금액
                  <br/>
                  거래시간
                </TableCell> */}
              </tr>
            </TableHeader>
            <TableBody>
              {props.buyData?.map((data: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={{ textAlign: 'center' }}>
                      <span className="text-sm text-green-400"  >{data?.transactionType}</span>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <span className="text-sm"  >{data?.market}</span>
                    </TableCell>
                    <TableCell className='flex flex-grow'>
                      <div className='flex flex-col w-full'>
                        <div style={{ textAlign: 'center' }}  className="m-1" >{(+data?.price).toLocaleString('ko-KR',localeStringOptions)}</div>
                        <div style={{ textAlign: 'center' }}  className="m-1">{(+data?.quantity).toLocaleString('ko-KR',localeStringOptions)}</div>
                      </div>   
                      <div className='flex flex-col w-full'>
                        <div style={{ textAlign: 'center' }}  className="m-1">{(+data?.totalPrice).toLocaleString('ko-KR',localeStringOptions)}</div>
                        <div style={{ textAlign: 'center' }}  className="m-1">{data?.doneAt}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }
              )
            }
            </TableBody>
          </Table>
          <TableFooter>
            {/* <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={onPageChange}
            /> */}
          </TableFooter>
        </TableContainer>
        <TableContainer style={{overflow : "scroll"}}>
          <Table>
            <TableHeader>
              <tr className='w-full'>
                <TableCell style={{ textAlign: 'center' }} >구분</TableCell>
                <TableCell style={{ textAlign: 'center' }}>종목</TableCell>
                <TableCell className='flex flex-grow'>
                  <div className='flex flex-col w-full'>
                    <div style={{ textAlign: 'center' }}  className="m-1" >가격</div>
                    <div style={{ textAlign: 'center' }}  className="m-1">수량</div>
                  </div>   
                  <div className='flex flex-col w-full'>
                    <div style={{ textAlign: 'center' }}  className="m-1">총금액</div>
                    <div style={{ textAlign: 'center' }}  className="m-1">거래시간</div>
                  </div>
                </TableCell>
                {/* <TableCell >
                  가격
                  <br/>
                  수량
                  </TableCell>
                <TableCell >
                  총금액
                  <br/>
                  거래시간
                </TableCell> */}
              </tr>
            </TableHeader>
            <TableBody>
              {props.sellData?.map((data: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={{ textAlign: 'center' }}>
                      <span className="text-sm text-red-400"  >{data?.transactionType}</span>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <span className="text-sm"  >{data?.market}</span>
                    </TableCell>
                    <TableCell className='flex flex-grow'>
                      <div className='flex flex-col w-full'>
                        <div style={{ textAlign: 'center' }}  className="m-1" >{(+data?.price).toLocaleString('ko-KR',localeStringOptions)}</div>
                        <div style={{ textAlign: 'center' }}  className="m-1">{(+data?.quantity).toLocaleString('ko-KR',localeStringOptions)}</div>
                      </div>   
                      <div className='flex flex-col w-full'>
                        <div style={{ textAlign: 'center' }}  className="m-1">{(+data?.totalPrice).toLocaleString('ko-KR',localeStringOptions)}</div>
                        <div style={{ textAlign: 'center' }}  className="m-1">{data?.doneAt}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }
              )
            }
            </TableBody>
          </Table>
          <TableFooter>
            {/* <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={onPageChange}
            /> */}
          </TableFooter>
        </TableContainer>
      </div>

    </Layout>
  )
}
export const getServerSideProps = async(ctx)=>{
  
  try{
    const props = ctx.query.props
    return { props }
  }catch(e: any){
    return console.log(e.data)
  }
}

export default MyHistory
