import React, { useState, useEffect, HTMLAttributes } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import {calCoinPrice} from '../../utils/calCoinPrice'
import CTA from 'example/components/CTA'
import InfoCard from 'example/components/Cards/InfoCard'
import ChartCard from 'example/components/Chart/ChartCard'
import ChartLegend from 'example/components/Chart/ChartLegend'
import PageTitle from 'example/components/Typography/PageTitle'
import RoundIcon from 'example/components/RoundIcon'
import Layout from 'example/containers/Layout'
import response, { ITableData } from 'utils/demo/tableData'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from 'icons'
import { convertDate } from '../../utils/convertDate'
import {numberWithCommas} from '../../utils/numberWithCommas'
import {roundToFiveDecimalPlaces} from '../../utils/roundToFiveDecimalPlaces'
import {roundToNineDecimalPlaces} from '../../utils/roundToNineDecimalPlaces'

import io from 'socket.io-client';
import axios from 'axios'
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Label,
  HelperText,
  Input,
  Textarea,
  Select
} from '@roketid/windmill-react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from 'utils/demo/chartsData'

import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import SectionTitle from 'example/components/Typography/SectionTitle'
interface HTMLDivElementWithAlign extends HTMLAttributes<HTMLDivElement> {
  align?: string;
}
const localeStringOptions = { minimumFractionDigits: 0, maximumFractionDigits: 8 };

function Dashboard(coinData) {
  // console.log(coindData.coinData.coinPrice)
  Chart.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const [page, setPage] = useState(1)
  const [data, setData] = useState<any>(coinData.coinPrice.map(e=>JSON.parse(e)))
  const [coin, setCoin] = useState("BTC")
  const [amount,setAmount] = useState(0)
  const [price,setPrice] = useState(0)
  const [tmpPrice,setTmpPrice] = useState(0);
  const [totalPrice,setTotalPrice] = useState(0)
  const [select,setSelect] = useState("매수")
  const [balance,setBalance] = useState(coinData.balance)
  const [availableBalance,setAvailableBalance] = useState(coinData.availableBalance)
  const [totalPurchase, setTotalPurchase] = useState(coinData.totalPurchase)
  const [totalValue, setTotalValue] = useState (coinData.totalEvaluated)
  const [gainsAndLoses,setGainsAndLoses] = useState(coinData.totalGainAndLoss)
  const [profitRate,setProfitRate] = useState(coinData.profitRate)
  const [totalAsset,setTotalAsset] = useState(+balance+ +totalValue)
  const [portfolioData,setPortfolioDara] = useState(coinData.portfolioData)
  const [transactionData,setTransactionData] = useState(coinData.transactionData)
  const [cancleData,setCancleData] = useState("")
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p: number) {
    setPage(p)
  }

  const onChangeCoin= async (e:any)=>{

    // console.log(e.currentTarget.)
    setCoin(e.currentTarget.id.replace("KRW-",""))  
    if(select==="매도"){
      setAmount(0)
      setPrice(e.currentTarget.childNodes[1].innerText.replace(/[^0-9.]/g, ''))
      return setTotalPrice(0)
    }  
    let price = Number(e.currentTarget.childNodes[1].innerText.replace(/[^0-9.]/g, ''));
    let amount = Number((balance/price).toFixed(8))
    let totalPrice = price * +amount;
    while(totalPrice >balance){
      amount = +amount - 0.00000001
      totalPrice = price*amount
    }
    setAmount(amount);
    setPrice(price);
    setTmpPrice(price)
    setTotalPrice(totalPrice)
  }

  const onChangeAmount = (e:any) => {
      const inputValue = +e.target.value;
      setAmount(inputValue);

      const newTotalPrice = inputValue * price;

      if (newTotalPrice > balance) {
        setTotalPrice(balance);
      } else {
        setTotalPrice(newTotalPrice);
      }
    
  }

  const onChangePrice = (e:any) => {
    let p =e.target.value
    if(typeof p === "string"){
      p = p.replace(",","")
      console.log(p)
    }
    // if(p>tmpPrice) p = tmpPrice
    // console.log(tmpPrice)
    setPrice(p);
    setTotalPrice(p * amount);
  }

  const onChangeSelect = (e:any) => {
    if(e.target.value==="매도"){
      setAmount(0)
      setTotalPrice(0)
    }
    setSelect(e.target.value);
  }
  const onblurAmount = (e:any) => {
    const calAmount = balance/price;
    setAmount(+(+e.target.value).toFixed(8));
    setTotalPrice(price * amount);
  }
  const onblurPrice = (e:any) => {
    let calPrice = roundToNineDecimalPlaces(calCoinPrice(price));
    let totalPrice = calPrice *amount
    setPrice( calPrice);
    setTotalPrice(totalPrice);
  }
  const onOrderClick = async (e:any) =>{
    e.preventDefault();
    
    if(amount===0 || price===0){
      return alert("주문 수량 또는 가격을 입력해주세요.")
    }

    if(amount*price<5000){
      return alert("최소 주문 금액은 5,000원 입니다.")
    }
    const res = await axios.post('/api/order',{
      coinName:"KRW-"+coin,
      transactionType:select,
      amount:amount,
      price:price
    })
    if(res.status===201){
      return location.reload();
    }
    return alert("주문에 실패하였습니다.")

  }
  const onCancleRadioClick = (e:any) =>{
    setCancleData(e.currentTarget.id)
    console.log(cancleData)
  }
  const onCancleClick = async (e:any) =>{
    e.preventDefault();
    if(cancleData===""){
      return alert("취소할 주문을 선택해주세요.")
    }
    const res = await axios.delete('/api/transaction',{
      data:{
        transactionId: cancleData
    }})
    if(res.status===200){
      return location.reload(); 
    }
    return alert("주문 취소에 실패하였습니다.")
  }

  const onPortfolioClick = async (e:any, quantity:any) =>{
    e.preventDefault();
    setCoin(e.currentTarget.id.replace("KRW-",""))  
    if(select==="매도"){
      setAmount(+quantity)
      setPrice(+data.find((d:any)=>d.code===e.currentTarget.id).trade_price)
      return setTotalPrice(+quantity* +price)
      // setAmount(0)
      // setPrice(e.currentTarget.childNodes[1].innerText.replace(/[^0-9.]/g, ''))
      // return setTotalPrice(0)
    }  
    return setPrice(data.find((d:any)=>d.code===e.currentTarget.id).trade_price)
    // let price = Number(e.currentTarget.childNodes[1].innerText.replace(/[^0-9.]/g, ''));
    // let amount = Number((balance/price).toFixed(8))
    // let totalPrice = price * +amount;
    // while(totalPrice >balance){
    //   amount = +amount - 0.00000001
    //   totalPrice = price*amount
    // }
    // setAmount(amount);
    // setPrice(price);
    // setTmpPrice(price)
    // setTotalPrice(totalPrice)
  }


  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
     //WebSocket 서버와 연결합니다.
    const socket = io('/ws-coin-price');
    socket.on('connect', () => {
      console.log('Socket connected');
      // socket.emit('subscribe', 'coinPrice');
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    // 코인 가격 정보를 받으면, 화면에 업데이트합니다.
    socket.on('coinPriceUpdate', (data) => {
      // setData(data.slice((page - 1) * resultsPerPage, page * resultsPerPage))
      // setCoinPrice(data);
      const response = data.map((item:any)=>JSON.parse(item!.toString()))
      setData(response);
      // console.log(response);
    });
    return () => {
      // 페이지가 unmount 될 때, WebSocket 연결을 종료합니다.
      socket.close();
    };
  }, [page])

  return (
    <Layout>
      <PageTitle>Aldrich Financial</PageTitle>

      {/* <CTA /> */}

      {/* <!-- Cards --> */}
      <div className='grid gap-3 mb-8 md:grid-cols-1 xl:grid-cols-3'>
          <InfoCard title="총 보유자산" value={roundToFiveDecimalPlaces(+totalAsset).toLocaleString()} className="md:w-full lg:w-1/2" >
            {/* @ts-ignore */}
            <RoundIcon
              icon={CartIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
          <InfoCard title="보유KRW" value={roundToFiveDecimalPlaces(+balance).toLocaleString()} className="w-1/2">
            {/* @ts-ignore */}
            <RoundIcon
              icon={CartIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4 "
            />
          </InfoCard>
          <InfoCard title="가용KRW" value={roundToFiveDecimalPlaces(+availableBalance).toLocaleString()} className="w-1/2">
            {/* @ts-ignore */}
            <RoundIcon
              icon={CartIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4 "
            />
          </InfoCard>
        </div>
      <div className="grid gap-3 mb-8 md:grid-cols-1 xl:grid-cols-4">
        <InfoCard title="총매수" value={roundToFiveDecimalPlaces((+totalPurchase)).toLocaleString()}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="총 평가" value={roundToFiveDecimalPlaces((+totalValue)).toLocaleString()}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="평가손익" value={roundToFiveDecimalPlaces(+gainsAndLoses).toLocaleString()}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="수익률" value={profitRate +"%"}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>

      </div>
      <div className='sm:flex sm:w-full sm:flex-row '>
        <div className=" lg:w-1/2 w-full " >
        <TableContainer>
          <Table>
            <TableHeader>
              <tr className=''>
                <TableCell>종목</TableCell>
                <TableCell>현재가</TableCell>
                <TableCell>전일대비</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
            {data.map((user, i) => (
                <TableRow key={i} id={user.code} onClick={onChangeCoin}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{user.code.replace("KRW-","")}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.trade_price.toLocaleString()} KRW</span>
                  </TableCell>
                  <TableCell>
                    <Badge type={
                      user.trade_price/user.prev_closing_price - 1 > 0?'success'
                      : 1 - user.trade_price/user.prev_closing_price - 1 < 0?'danger'
                      : 'neutral'
                      }>{(user.trade_price/user.prev_closing_price*100-100).toFixed(2)}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
          </TableFooter>
        </TableContainer>
        </div>
        <div className='max-w-xl md:w-1/2 w-full sm:m-3'>
          <PageTitle>주문</PageTitle>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <Input className="mt-1" value={coin} readOnly/>
        </Label>

        <div className="mt-4">
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="매수" name="accountType" onClick={onChangeSelect} defaultChecked />
              <span className="ml-2">매수</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="매도" name="accountType" onClick={onChangeSelect} />
              <span className="ml-2">매도</span>
            </Label>

          </div>
        </div>
        <span>수량</span>
        <Label>
          <Input className="mt-1" type="number" placeholder="수량" value={parseFloat(amount.toFixed(8))} onChange={onChangeAmount} onBlur={onblurAmount} />
        </Label>
        <span>가격</span>
        <Label>
          <Input className="mt-1" type="number" placeholder="가격" value={price} onChange={onChangePrice} onBlur={onblurPrice}/>
        </Label>
        <span>총액</span>
        <Label>
          <Input className="mt-1" placeholder="총액" value={totalPrice.toLocaleString()} />
        </Label>

        <Label className="mt-6" check>
          {/* <Input type="checkbox" />
          <div>
            <span className="ml-2">
              I agree to the <span className="underline"> policy</span>
            </span>
          </div> */}
        </Label>
          <div className="right-0"style={{textAlign:'right'}}  >
            <button style={{textAlign:'right'}} className="inset-y-0 right-0 px-4 text-sm font-medium leading-10 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            onClick={onOrderClick}>
              거래
            </button>
          </div>
        </div>
        <PageTitle>보유자산</PageTitle>
        <TableContainer>
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
                <TableRow key={i} id={portfolio.market} onClick={e=>onPortfolioClick(e,portfolio.quantity,portfolio.averagePrice)} >
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
            {/* <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={onPageChange}
            /> */}
          </TableFooter>
        </TableContainer>
                <PageTitle>미체결 거래</PageTitle>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr className='text-xs lg:text-base'>
                <TableCell> </TableCell>
                <TableCell>종목</TableCell>
                <TableCell>주문가격</TableCell>
                <TableCell>주문수량</TableCell>
                <TableCell>주문시간</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
            {transactionData.map((transaction, i) => (
                <TableRow key={transaction.id} id={transaction.market} >
                  <TableCell> 
                    <Label className="ml-6" radio>
                      <Input type="radio" id={transaction.id} name="non-trading"  onClick={onCancleRadioClick} />
                    </Label>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {transaction.market}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm"> {(roundToFiveDecimalPlaces(+transaction.price)).toLocaleString('ko-KR',localeStringOptions)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm"> {(roundToNineDecimalPlaces(+transaction.quantity)).toLocaleString('ko-KR',localeStringOptions)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm"> {convertDate(transaction.createdAt)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            <div className="right-0">
              <button onClick={onCancleClick} className="inset-y-0 right-0 px-4 text-sm font-medium leading-10 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                거래취소
              </button>
            </div>
          </TableFooter>
        </TableContainer>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  try{
      const res = await axios.get('http://localhost:4100/api/coinPrice', {
          headers: { Cookie: ctx.req.headers.cookie },
      });
      let {
        coinPrice, 
        balance, 
        availableBalance, 
        transactionData, 
        portfolioData,
        totalEvaluated,
        totalPurchase,
        totalGainAndLoss,
        profitRate
      } = res.data
      const props ={
        coinPrice,
        balance,
        availableBalance,
        transactionData,
        portfolioData,
        totalEvaluated,
        totalPurchase,
        totalGainAndLoss,
        profitRate
      }
      return { props }
  }catch(e: any){
      return console.log(e.data)
  }
}

export default Dashboard
