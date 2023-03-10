import React, { useState, useEffect } from 'react'
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

function Dashboard(coindData) {
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
  const [data, setData] = useState<any>(coindData.coinData.coinPrice.map(e=>JSON.parse(e)))
  const [coin, setCoin] = useState("BTC")
  const [amount,setAmount] = useState(0)
  const [price,setPrice] = useState(0)
  const [totalPrice,setTotalPrice] = useState(0)
  const [select,setSelect] = useState("매수")
  // pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p: number) {
    setPage(p)
  }

  const onChangeCoin= async (e:any)=>{
    // console.log(e.currentTarget.)
    setCoin(e.currentTarget.id.replace("KRW-",""))    
    const price = Number(e.currentTarget.childNodes[1].innerText.replace(/[^0-9.]/g, ''));
    setPrice(price);
    setTotalPrice(price*amount)
  }

  const onChangeAmount = (e:any) => {
    setAmount(e.target.value.toLocaleString());
    setTotalPrice(e.target.value * price);
  }

  const onChangePrice = (e:any) => {
    let p =e.target.value
    if(typeof p === "string"){
      p=p.replace(",","")
    }
    setPrice(p.toLocaleString());
    setTotalPrice(p * amount);
  }
  const onChangeSelect = (e:any) => {
    setSelect(e.target.value);
  }

  const onblurPrice = (e:any) => {
    const calPrice = calCoinPrice(price);
    setPrice(calPrice);
    setTotalPrice(calPrice * amount);
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
      <PageTitle>Dashboard</PageTitle>

      <CTA />

      {/* <!-- Cards --> */}
      <div className='grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2'>
          <InfoCard title="보유KRW" value="376" className="w-1/2">
            {/* @ts-ignore */}
            <RoundIcon
              icon={CartIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4 "
            />
          </InfoCard>

          <InfoCard title="총 보유자산" value="376" className="w-1/2" >
            {/* @ts-ignore */}
            <RoundIcon
              icon={CartIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="총매수" value="6389">
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="총 평가" value="46,760.89">
          {/* @ts-ignore */}
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="평가손익" value="376">
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="수익률" value="35">
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
        <div className="max-w-2xl md:w-1/2 w-full min-w-max" >
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
            {/* <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={onPageChange}
            /> */}
          </TableFooter>
        </TableContainer>
        </div>
        <div className='max-w-2xl md:w-1/2 w-full min-w-max m-3'>
          <PageTitle>주문</PageTitle>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <Input className="mt-1" value={coin} readOnly/>
        </Label>

        {/* <Label className="mt-4">
          <Input disabled className="mt-1" placeholder="주문가" />
        </Label> */}

        <div className="mt-4">
          {/* TODO: Check if this label is accessible, or fallback */}
          {/* <span className="text-sm text-gray-700 dark:text-gray-400">Account Type</span> */}
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="매수" name="accountType" onClick={onChangeSelect} defaultChecked />
              <span className="ml-2">매수</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="매도" name="accountType" onClick={onChangeSelect} />
              <span className="ml-2">매도</span>
            </Label>
            {/* <Label disabled className="ml-6" radio>
              <Input disabled type="radio" value="disabled" name="accountType" />
              <span className="ml-2">Disabled</span>
            </Label> */}
          </div>
        </div>

        {/* <Label className="mt-4">
          <span>Requested Limit</span>
          <Select className="mt-1">
            <option>$1,000</option>
            <option>$5,000</option>
            <option>$10,000</option>
            <option>$25,000</option>
          </Select>
        </Label>

        <Label className="mt-4">
          <span>Multiselect</span>
          <Select className="mt-1" multiple>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
            <option>Option 4</option>
            <option>Option 5</option>
          </Select>
        </Label> */}

        {/* <Label className="mt-4">
          <span>Message</span>
          <Textarea className="mt-1" rows={3} placeholder="Enter some long form content." />
        </Label> */}
        <span>수량</span>
        <Label>
          <Input className="mt-1" placeholder="수량" value={amount.toLocaleString()} onChange={onChangeAmount} />
        </Label>
        <span>가격</span>
        <Label>
          <Input className="mt-1" placeholder="가격" value={price.toLocaleString()} onChange={onChangePrice} onBlur={onblurPrice}/>
        </Label>
        <span>총액</span>
        <Label>
          <Input className="mt-1" placeholder="총액" value={totalPrice.toLocaleString()} />
        </Label>

        <Label className="mt-6" check>
          <Input type="checkbox" />
          <div>
            <span className="ml-2">
              I agree to the <span className="underline"> policy</span>
            </span>
          </div>
        </Label>
          <div className="right-0">
            <button className="inset-y-0 right-0 px-4 text-sm font-medium leading-10 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
              거래
            </button>
          </div>
        </div>
        <PageTitle>보유자산</PageTitle>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr className=''>
                <TableCell>종목</TableCell>
                <TableCell>평가손익</TableCell>
                <TableCell>수익률</TableCell>
                <TableCell>보유수량</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
            {/* {data.map((user, i) => (
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
                      1 - user.trade_price/user.prev_closing_price > 0?'success'
                      : 1 - user.trade_price/user.prev_closing_price < 0?'danger'
                      : 'neutral'
                      }>{(100 - user.trade_price/user.prev_closing_price*100).toFixed(2)}%</Badge>
                  </TableCell>
                </TableRow>
              ))} */}
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
              <tr className=''>
                <TableCell> </TableCell>
                <TableCell>종목</TableCell>
                <TableCell>주문가격</TableCell>
                <TableCell>주문수량</TableCell>
                <TableCell>주문시간</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
            {/* {data.map((user, i) => (
                <TableRow key={i} id={user.code} onClick={onChangeCoin}>
                  <TableCell> 
                    <Label className="ml-6" radio>
                      <Input type="radio" value="i" name="non-trading"  />
                    </Label>
                  </TableCell>
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
                      1 - user.trade_price/user.prev_closing_price > 0?'success'
                      : 1 - user.trade_price/user.prev_closing_price < 0?'danger'
                      : 'neutral'
                      }>{(100 - user.trade_price/user.prev_closing_price*100).toFixed(2)}%</Badge>
                  </TableCell>
                </TableRow>
              ))} */}
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
      </div>
    </Layout>
  )
}

export const getServerSideProps = async () => {
  try{
      const res = await axios.get('http://localhost:4100/api/coinPrice');
      let {data} = res
      const props ={
        coinData:data
      }
      return {  props }
  }catch(e){
      return console.log('error')
  }
}

export default Dashboard
