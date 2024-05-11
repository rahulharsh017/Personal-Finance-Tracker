import React,{useState} from 'react'
import { Table,Select,Radio } from 'antd'
import searchicon from '../../assets/search.svg'
import { unparse,parse } from 'papaparse';
import { toast } from 'react-toastify';

function TransactionTable({transactions,addTransaction,fetchTransactions}) {
    const { Option } = Select;
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");
    const columns = [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
        },
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
        },
        {
          title: "Tag",
          dataIndex: "tag",
          key: "tag",
        },
      ];

      let fillteredTransactions = transactions.filter((item) => (
      item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter) ))

      const sortedTransactions = [...fillteredTransactions].sort((a, b) => {
        if (sortKey === "date") {
          return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
          return a.amount - b.amount;
        } else {
          return 0;
        }
      });

      function ExportToCsv(){
        var csv = unparse({
            "fields": ["name", "type", "date", "amount", "tag"],
            "data": transactions.map((item) => [item.name, item.type, item.date,item.amount,item.tag])
        });
        console.log('Generated CSV:', csv);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "transactions.csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
      function importFromCsv(event) {
        event.preventDefault();
        try {
            parse(event.target.files[0], {
                header: true,
                complete: async function(results) {
                    console.log("Results", results);
                    // Filter out rows with any empty values
                    const nonEmptyRows = results.data.filter(row => Object.values(row).every(value => value !== ""));
                    for (const transaction of nonEmptyRows) {
                        console.log("Transaction", transaction);
                        const newTransaction = {
                            ...transaction,
                            amount: parseFloat(transaction.amount)
                        };
                        await addTransaction(newTransaction, true);
                    }
                },
            });
            toast.success("Transactions imported successfully");
            event.target.files = null;
            fetchTransactions();
        } catch (error) {
            toast.error(error.message);
        }
    }
    
    
  return (
    <>
    <div
      style={{
        width: "100%",
        padding: "0rem 2rem",
      }}
    >
   <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchicon} width="15" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
        
        <div className='my-table'>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={ExportToCsv} >
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue " >
              Import from CSV
            </label>
            <input
              
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
              onChange={importFromCsv}
            />
          </div>
        </div>
    <Table columns={columns} dataSource={sortedTransactions} />
    </div>
    </div>
    </>
    
  )
}

export default TransactionTable