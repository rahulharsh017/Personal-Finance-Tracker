import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import NoTransactions from '../components/NoTransactions.js'
import AddExpenseModal from '../components/Modals/addExpense.js'
import AddIncomeModal from '../components/Modals/addIncome.js'
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc,collection,getDocs,query,deleteDoc,doc} from 'firebase/firestore';
import { db,auth } from '../firebase.js';
import { toast } from 'react-toastify';

import TransactionTable from '../components/TransactionsTable/index.js';
import ChartComponent from '../components/Charts/index.js'

function Dashboard() {

  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const[transactions,setTransactions] = useState([])
  const[loading,setLoading] = useState(false)
  const [income, setIncome] = useState(0);
  const [expense, setExpenses] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0)
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type:type,
      date:values.date.format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
    };
    addTransaction(newTransaction);
  };
  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
     
        if(!many) toast.success("Transaction Added!");
        let newArr = transactions;
        newArr.push(transaction);
        setTransactions(newArr);
        calculateBalance();
      
    } catch (e) {
      console.error("Error adding document: ", e);
      
       if(!many) toast.error("Couldn't add transaction");
      
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  },[transactions])

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("transactionsArray", transactionsArray);
      toast.success("Transactions Fetched!");
    }
    
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a,b) =>{
    return new Date(a.date ) - new Date(b.date);
  })


  const resetbalance = async (e) => {
    e.preventDefault();

    
    setIncome(0);
    setExpenses(0);
    setCurrentBalance(0);
    setTransactions([]);

    try {
       
        const user = auth.currentUser;
        if (!user) {
            console.error('No user authenticated');
            return;
        }

        
        const userDocRef = doc(db, 'users', user.uid);

        
        const transactionsCollectionRef = collection(userDocRef, 'transactions');

        
        const querySnapshot = await getDocs(transactionsCollectionRef);

       
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

       
        console.log('All transaction documents deleted successfully from Firestore');
    } catch (error) {
        
        console.error('Error deleting transaction documents:', error);
    }
}
  
  return (
    <div>
      <Header />
      {loading ? ( <p>Loading...</p>) : (<>
        <Cards
        income={income}
        expense={expense}
        currentBalance={currentBalance}
      showExpenseModal={showExpenseModal}
      showIncomeModal={showIncomeModal}
      onClick={resetbalance} />
    
         {transactions.length != 0 ?<ChartComponent sortedTransactions={sortedTransactions}/> : <NoTransactions />}
        <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />

          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          /> 
          <TransactionTable
           transactions={transactions}
           addTransaction={addTransaction}
           fetchTransactions={fetchTransactions}
           />
      </>)}
     

    </div>
  )
}

export default Dashboard