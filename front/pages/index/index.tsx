import Styled from 'styled-components';
import Axiso from 'axios';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useEffect, useState } from 'react';

const Container = Styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const strMonth = ('0' + month).slice(-2);
  const strDay = ('0' + day).slice(-2);

  return `${year}-${strMonth}-${strDay}`;
};

const Index = () => {
  let period = 10;
  let date = new Date();
  let initChartData = [{ name: getDateString(date) }];

  for (let i = 0; i < period; i++) {
    date.setDate(date.getDate() - 1);

    let temp = getDateString(date);
    initChartData.push({
      name: getDateString(date),
    });
  }

  const [data, setData] = useState<Array<any>>(initChartData);
  const [chartLabels, setChartLabels] = useState<Array<string>>([]);

  useEffect(() => {
    Axiso.get('http://127.0.0.1/users/commits')
      .then(response => {
        let chartDatas = [...data];
        let labels: Array<string> = [];
        response.data.map((serverData: IUsersCommitsData, index: number) => {
          const dataDate = serverData.date.split('T')[0];
          chartDatas.map((chartData, index) => {
            if (dataDate === chartData.name) {
              const addName = `${serverData.name}_add`;
              const delName = `${serverData.name}_del`;

              labels.push(addName);
              labels.push(delName);

              chartData[addName] = serverData.additions;
              chartData[delName] = -serverData.deletions;
            }
          });
        });
        // setData(chartDatas);
        setChartLabels(labels);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <BarChart
        width={1200}
        height={1000}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {chartLabels.map((charLabel, index) => {
          return (
            <Bar
              key={index}
              dataKey={charLabel}
              stackId={charLabel}
              fill={'#' + Math.floor(Math.random() * 16777215).toString(16)}
            />
          );
        })}
      </BarChart>
    </Container>
  );
};

export default Index;
