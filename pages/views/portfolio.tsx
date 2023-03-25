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

function Charts({chartLegends, chartPercentage, backgroundColor}) {
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
    <Layout>
      <PageTitle>포트폴리오</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="포트폴리오 차트">
          <Doughnut {...doughnutOptions} />
        </ChartCard>
      </div>
    </Layout>
  )
}
export const getServerSideProps = async(ctx)=>{
  const res = await axios.get('http://localhost:4100/api/user/portfolioChart',{
          headers: { Cookie: ctx.req.headers.cookie },
      }
  )
  const {chartLegends, chartPercentage, backgroundColor} = res.data
  return {
    props: {
      chartLegends,
      chartPercentage,
      backgroundColor
    }
  }
}

export default Charts
