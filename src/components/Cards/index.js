import React from 'react'
import { Card, Row } from 'antd'
import './style.css'
import Button from '../Button'

function Cards({
    income,
    expense,
    onClick,
    currentBalance,
    showIncomeModal,
    showExpenseModal}) {


  return (
    <div>
        <Row className='my-row'>
           <Card className='my-card' title="Current Balance">
            <p>₹{currentBalance}</p>
            <Button text="Reset Balance" blue={true} onClick={onClick} />
           </Card>
           <Card className='my-card' title="Total Income">
            <p>₹{income}</p>
            <Button text="Add Income" blue={true} onClick={showIncomeModal} />
           </Card>
           <Card className='my-card' title="Total Expenses">
            <p>₹{expense}</p>
            <Button text="Add Expenses" blue={true} onClick={showExpenseModal} />
           </Card>
        </Row>
    </div>
  )
}

export default Cards