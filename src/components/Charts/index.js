import React from 'react'
import { Line,Pie } from '@ant-design/charts';

function ChartComponent({sortedTransactions}) {
 
    const data = sortedTransactions.map((item) => {
        return {date:item.date,amount:item.amount};
    });

     const spendingData = sortedTransactions.filter((transactions) =>{
        if(transactions.type === "expense"){
             return {tag:transactions.tag,amount:transactions.amount}
        }
     })

     let newSpendings = [
        {tag:"food",amount:0},
        {tag:"education",amount:0},
        {tag:"office",amount:0},
    ];

    spendingData.forEach((item) => {
        if(item.tag === "food"){
            newSpendings[0].amount += item.amount;
        }else if(item.tag === "education"){
            newSpendings[1].amount += item.amount;
        }else if(item.tag === "office"){
            newSpendings[2].amount += item.amount;
        }
    })
    const config = {
        data:data,
        xField: 'date',
        yField: 'amount',
        width:600,
      };

      const spendingConfig = {
        data:newSpendings,
        width:400,
        angleField:"amount",
        colorField:"tag",
      }
  return (
    <div className='charts-wrapper'>
    <div >
        <h2>Your Analytics</h2>
        <Line {...config} />
        </div>
        <div>
            <h2>Your Spendings</h2>
            <Pie {...spendingConfig} />
        </div>
        </div>
    
  )
}

export default ChartComponent