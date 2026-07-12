import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { 
  ArrowDownRight, 
  ArrowUpLeft, 
  HelpCircle, 
  Wallet, 
  Search, 
  Plus, 
  Layers,
  Calendar,
  Save,
  ArrowLeft,
  X
} from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Container = styled.div`
  font-family: 'Public Sans', 'Inter', sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 4px 0;
`;

const Breadcrumb = styled.div`
  font-size: 13px;
  color: ${props => props.theme.muted};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BreadLink = styled.span`
  cursor: pointer;
  color: ${props => props.theme.text};
  font-weight: 500;
  &:hover {
    color: ${props => props.theme.primary};
    text-decoration: underline;
  }
`;

const TopActions = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const OutlineBtn = styled.button`
  padding: 8px 20px;
  background-color: transparent;
  color: ${props => props.theme.primary};
  border: 1.5px solid ${props => props.theme.primary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => `${props.theme.primary}10`};
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 24px;
  gap: 8px;
`;

const Tab = styled.button`
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? props.theme.primary : props.theme.muted};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

// OVERVIEW SUMMARY CARDS
const SummaryCardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background-color: ${props => props.bgColor};
  color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const CardIcon = styled.div`
  font-size: 28px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

const CardAmount = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const CardLabel = styled.div`
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
`;

// TRANSACTION HISTORY
const HistoryHeader = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 20px;
  color: ${props => props.theme.text};
`;

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px 10px 38px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.muted};
  display: flex;
  align-items: center;
`;

const SelectFilter = styled.select`
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background-color: ${props => props.theme.card};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 14px 16px;
  background-color: ${props => props.theme.isDark ? '#2d3748' : '#f4f6f8'};
  color: ${props => props.theme.muted};
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  border-bottom: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'};
  }
`;

const TypeBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${props => props.bgColor};
  color: ${props => props.colorVal};
`;

// ADD TRANSACTION FORM
const Form = styled.form`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.muted};
  margin-bottom: 8px;
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 12px;
  border: 1.5px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background-color: ${props => props.active ? `${props.theme.primary}10` : 'transparent'};
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  font-weight: 700;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const FormInput = styled.input`
  padding: 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const PrefixInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CurrencyPrefix = styled.span`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: 600;
`;

const FormInputPrefixed = styled(FormInput)`
  padding-left: 28px;
  width: 100%;
`;

const FormSelect = styled.select`
  padding: 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FormTextarea = styled.textarea`
  padding: 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  min-height: 80px;
  resize: vertical;
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SaveTransactionBtn = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px ${props => `${props.theme.primary}24`};
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
  }
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme.border};
    background-color: ${props => props.theme.card};
    color: ${props => props.theme.text};
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary};
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(22, 28, 36, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  width: ${props => props.width || '500px'};
  padding: 24px;
  box-shadow: 0 12px 24px -4px rgba(145, 158, 171, 0.12), 0 0 2px 0 rgba(145, 158, 171, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.muted};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
    color: ${props => props.theme.text};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Account = ({ setActiveTab: setAppActiveTab, token }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState({ debit: 0, credit: 0, adjust: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  
  // Filter States
  const [filterSearch, setFilterSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');

  // Add Transaction Form
  const [transDate, setTransDate] = useState(new Date());
  const [transTo, setTransTo] = useState('');
  const [transType, setTransType] = useState('Debit');
  const [transPayment, setTransPayment] = useState('Cash');
  const [transAmount, setTransAmount] = useState('');
  const [transAdjust, setTransAdjust] = useState('0');
  const [transRef, setTransRef] = useState('');
  const [transRemark, setTransRemark] = useState('');

  const [alertMsg, setAlertMsg] = useState('');

  // Bulk Payment & Ledger states
  const [subView, setSubView] = useState('tabs'); // 'tabs' or 'bulk_payment'
  const [companiesList, setCompaniesList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [bulkRows, setBulkRows] = useState([]);
  
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [ledgerRetailer, setLedgerRetailer] = useState('All');
  const [ledgerFromDate, setLedgerFromDate] = useState(new Date());
  const [ledgerToDate, setLedgerToDate] = useState(new Date());

  const fetchSummary = async () => {
    try {
      const res = await axios.get('/api/accounts/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      let url = `/api/accounts/transactions?type=${filterType}&payment=${filterPayment}&search=${filterSearch}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompaniesList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrdersList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getRetailerBalance = (retailerName, currentOrders, currentTrans) => {
    const targetOrders = currentOrders || ordersList;
    const targetTrans = currentTrans || transactions;

    const retailerOrders = targetOrders.filter(o => o.retailerName === retailerName);
    const totalOrderAmt = retailerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const retailerTrans = targetTrans.filter(t => t.to === retailerName || t.from === retailerName);
    
    let debitTrans = 0;
    let creditTrans = 0;
    let adjustTrans = 0;

    retailerTrans.forEach(t => {
      if (t.type === 'Debit') {
        debitTrans += t.amount || 0;
      } else if (t.type === 'Credit') {
        creditTrans += t.amount || 0;
      } else if (t.type === 'Adjust') {
        adjustTrans += t.amount || 0;
      }
    });

    return (totalOrderAmt + debitTrans) - (creditTrans + adjustTrans);
  };

  const getOpeningBalance = (retailerName, startDate) => {
    const priorOrders = ordersList.filter(o => 
      (retailerName === 'All' || o.retailerName === retailerName) &&
      o.date < startDate
    );
    const totalOrderAmt = priorOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const priorTrans = transactions.filter(t => 
      (retailerName === 'All' || t.to === retailerName || t.from === retailerName) &&
      t.date < startDate
    );

    let debitTrans = 0;
    let creditTrans = 0;
    let adjustTrans = 0;

    priorTrans.forEach(t => {
      if (t.type === 'Debit') {
        debitTrans += t.amount || 0;
      } else if (t.type === 'Credit') {
        creditTrans += t.amount || 0;
      } else if (t.type === 'Adjust') {
        adjustTrans += t.amount || 0;
      }
    });

    return (totalOrderAmt + debitTrans) - (creditTrans + adjustTrans);
  };

  useEffect(() => {
    if (token) {
      fetchSummary();
      fetchTransactions();
      fetchCompanies();
      fetchOrders();
    }
  }, [filterType, filterPayment, filterSearch, activeTab, subView, token]);

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setAlertMsg('');

    if (!transTo || !transAmount) {
      alert('Please fill out "To" and "Amount" fields.');
      return;
    }

    try {
      const formattedDate = transDate.toISOString().split('T')[0];
      await axios.post('/api/accounts/transactions', {
        date: formattedDate,
        from: 'Yash Milk',
        to: transTo,
        type: transType,
        payment: transPayment,
        amount: transAmount,
        adjust: transAdjust,
        reference: transRef,
        remark: transRemark
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear Form
      setTransDate(new Date());
      setTransTo('');
      setTransType('Debit');
      setTransPayment('Cash');
      setTransAmount('');
      setTransAdjust('0');
      setTransRef('');
      setTransRemark('');

      setAlertMsg('Transaction saved successfully!');
      setTimeout(() => setAlertMsg(''), 3000);
      setActiveTab('overview');
    } catch (err) {
      console.error(err);
      alert('Failed to save transaction');
    }
  };

  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case 'Debit':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'Credit':
        return { bg: '#d1fae5', text: '#065f46' };
      default:
        return { bg: '#fef3c7', text: '#92400e' };
    }
  };

  const handleBulkPaymentOpen = () => {
    const activeRetailers = companiesList.filter(comp => comp.companyType === 'Retailer' && comp.status === 'Active');
    const rows = activeRetailers.map(comp => ({
      retailerId: comp._id,
      retailerName: comp.firmName,
      balance: getRetailerBalance(comp.firmName),
      adjustAmount: '',
      type: 'Credit',
      payment: 'Cash',
      reference: '',
      remark: ''
    }));
    setBulkRows(rows);
    setSubView('bulk_payment');
  };

  const handleBulkRowChange = (index, field, value) => {
    setBulkRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveBulkAll = async () => {
    const rowsToSave = bulkRows.filter(row => Number(row.adjustAmount) > 0);
    if (rowsToSave.length === 0) {
      alert('No adjustment amounts entered.');
      return;
    }

    setAlertMsg('Saving bulk payments...');
    try {
      await Promise.all(rowsToSave.map(row => 
        axios.post('/api/accounts/transactions', {
          date: new Date().toISOString().split('T')[0],
          from: 'Yash Milk',
          to: row.retailerName,
          type: row.type,
          payment: row.payment,
          amount: Number(row.adjustAmount),
          adjust: 0,
          reference: row.reference,
          remark: row.remark
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      
      alert('Success! Bulk payments saved successfully.');
      setSubView('tabs');
      setAlertMsg('');
      
      // Force refresh
      fetchTransactions();
      fetchSummary();
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to save some bulk payments');
      setAlertMsg('');
    }
  };

  const generateExcel = (openingBalance, ledgerRows, startDateStr, endDateStr, retailerSel) => {
    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Account Ledger</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #00AB55; color: white; font-weight: bold; }
          .header-row { font-size: 16px; font-weight: bold; background-color: #f4f6f8; text-align: center; }
          .balance-cell { font-weight: bold; color: #1e3a8a; }
          .debit-cell { color: #b91c1c; }
          .credit-cell { color: #047857; }
        </style>
      </head>
      <body>
        <table>
          <tr class="header-row">
            <td colspan="8" style="text-align: center; font-size: 16px; font-weight: bold; padding: 12px;">Account Ledger: ${retailerSel}</td>
          </tr>
          <tr class="header-row">
            <td colspan="8" style="text-align: center; font-size: 14px; padding: 8px;">Period: ${startDateStr} to ${endDateStr}</td>
          </tr>
          <tr>
            <th>Sr. No</th>
            <th>Date</th>
            <th>Particulars</th>
            <th>Voucher Type</th>
            <th>Voucher No</th>
            <th>Debit (Rs.)</th>
            <th>Credit (Rs.)</th>
            <th>Balance (Rs.)</th>
          </tr>
          <tr>
            <td>-</td>
            <td colspan="4" style="font-weight: bold;">Opening Balance</td>
            <td>-</td>
            <td>-</td>
            <td class="balance-cell">${openingBalance.toFixed(2)}</td>
          </tr>
          ${ledgerRows.map((row, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${row.date}</td>
              <td>${row.particulars}</td>
              <td>${row.voucherType}</td>
              <td>${row.voucherNo}</td>
              <td class="debit-cell">${row.debit > 0 ? row.debit.toFixed(2) : '-'}</td>
              <td class="credit-cell">${row.credit > 0 ? row.credit.toFixed(2) : '-'}</td>
              <td class="balance-cell">${row.runningBalance.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;

    const base64 = window.btoa(unescape(encodeURIComponent(tableHtml)));
    const link = document.createElement('a');
    link.href = 'data:application/vnd.ms-excel;base64,' + base64;
    link.download = `Account_Ledger_${retailerSel}_${startDateStr}_to_${endDateStr}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateLedger = () => {
    const fromDateStr = ledgerFromDate.toISOString().split('T')[0];
    const toDateStr = ledgerToDate.toISOString().split('T')[0];

    // 1. Calculate opening balance
    const openingBalance = getOpeningBalance(ledgerRetailer, fromDateStr);

    // 2. Fetch and filter orders in range
    const rangeOrders = ordersList.filter(o =>
      (ledgerRetailer === 'All' || o.retailerName === ledgerRetailer) &&
      o.date >= fromDateStr && o.date <= toDateStr
    ).map(o => ({
      date: o.date,
      particulars: `Order - ${o.retailerName}`,
      voucherType: 'Order',
      voucherNo: o.morningPONumber || o.eveningPONumber || o._id?.substring(0, 8) || 'N/A',
      debit: o.totalAmount || 0,
      credit: 0
    }));

    // 3. Fetch and filter transactions in range
    const rangeTrans = transactions.filter(t =>
      (ledgerRetailer === 'All' || t.to === ledgerRetailer || t.from === ledgerRetailer) &&
      t.date >= fromDateStr && t.date <= toDateStr
    ).map(t => ({
      date: t.date,
      particulars: `${t.type} - ${t.payment} (${t.from} to ${t.to})`,
      voucherType: t.type === 'Debit' ? 'Debit' : (t.type === 'Credit' ? 'Receipt' : 'Adjustment'),
      voucherNo: t.reference || t._id?.substring(0, 8) || 'N/A',
      debit: t.type === 'Debit' ? t.amount : 0,
      credit: (t.type === 'Credit' || t.type === 'Adjust') ? t.amount : 0
    }));

    // 4. Combine and sort ascending to calculate running balance
    const combined = [...rangeOrders, ...rangeTrans].sort((a, b) => a.date.localeCompare(b.date));

    // 5. Calculate running balance chronologically
    let running = openingBalance;
    const rowsWithBalance = combined.map(row => {
      running = running + row.debit - row.credit;
      return { ...row, runningBalance: running };
    });

    // 6. Sort descending by date for final ledger report display
    rowsWithBalance.sort((a, b) => b.date.localeCompare(a.date));

    // 7. Generate Excel XML/HTML download
    generateExcel(openingBalance, rowsWithBalance, fromDateStr, toDateStr, ledgerRetailer);
    
    // 8. Close modal
    setLedgerModalOpen(false);
  };

  return (
    <Container>
      {ledgerModalOpen && (
        <ModalOverlay onClick={() => setLedgerModalOpen(false)}>
          <ModalContent theme={theme} onClick={(e) => e.stopPropagation()} style={{ width: '400px' }}>
            <ModalHeader>
              <ModalTitle theme={theme}>Generate Account Ledger Report</ModalTitle>
              <CloseBtn theme={theme} onClick={() => setLedgerModalOpen(false)}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            
            <FormGroup style={{ marginBottom: '16px' }}>
              <FormLabel theme={theme}>Retailer</FormLabel>
              <FormSelect 
                theme={theme} 
                value={ledgerRetailer} 
                onChange={(e) => setLedgerRetailer(e.target.value)}
              >
                <option value="All">All Retailers</option>
                {companiesList.filter(c => c.companyType === 'Retailer' && c.status === 'Active').map(c => (
                  <option key={c._id} value={c.firmName}>{c.firmName}</option>
                ))}
              </FormSelect>
            </FormGroup>

            <FormRow style={{ marginBottom: '24px' }}>
              <FormGroup>
                <FormLabel theme={theme}>From Date</FormLabel>
                <DatePickerWrapper theme={theme}>
                  <DatePicker 
                    selected={ledgerFromDate} 
                    onChange={(date) => setLedgerFromDate(date)} 
                    dateFormat="yyyy-MM-dd"
                  />
                </DatePickerWrapper>
              </FormGroup>

              <FormGroup>
                <FormLabel theme={theme}>To Date</FormLabel>
                <DatePickerWrapper theme={theme}>
                  <DatePicker 
                    selected={ledgerToDate} 
                    onChange={(date) => setLedgerToDate(date)} 
                    dateFormat="yyyy-MM-dd"
                  />
                </DatePickerWrapper>
              </FormGroup>
            </FormRow>

            <div style={{ display: 'flex', gap: '12px' }}>
              <SaveTransactionBtn theme={theme} onClick={handleGenerateLedger}>
                Generate Report
              </SaveTransactionBtn>
              <OutlineBtn theme={theme} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setLedgerModalOpen(false)}>
                Cancel
              </OutlineBtn>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {subView === 'bulk_payment' ? (
        <>
          <Breadcrumb theme={theme}>
            <BreadLink theme={theme} onClick={() => setAppActiveTab('dashboard')}>Dashboard</BreadLink>
            <span>•</span>
            <BreadLink theme={theme} onClick={() => setSubView('tabs')}>Account</BreadLink>
            <span>•</span>
            <span>Bulk Payment</span>
          </Breadcrumb>

          <HeaderRow>
            <div>
              <Title theme={theme} style={{ margin: 0 }}>Retailer Bulk Payment Management</Title>
            </div>
            <OutlineBtn theme={theme} onClick={() => setSubView('tabs')}>
              <ArrowLeft size={16} /> Back to Account
            </OutlineBtn>
          </HeaderRow>

          <TableWrapper theme={theme}>
            <Table>
              <thead>
                <tr>
                  <Th theme={theme}>Retailer Name</Th>
                  <Th theme={theme}>Balance (Debit)</Th>
                  <Th theme={theme}>Adjust Amount (Rs.)</Th>
                  <Th theme={theme}>Transaction Type</Th>
                  <Th theme={theme}>Payment Type</Th>
                  <Th theme={theme}>Reference</Th>
                  <Th theme={theme}>Remark</Th>
                </tr>
              </thead>
              <tbody>
                {bulkRows.length > 0 ? (
                  bulkRows.map((row, idx) => (
                    <tr key={row.retailerId}>
                      <Td theme={theme} style={{ fontWeight: 600 }}>{row.retailerName}</Td>
                      <Td theme={theme} style={{ fontWeight: 600, color: row.balance > 0 ? '#b91c1c' : '#047857' }}>
                        ₹{row.balance.toLocaleString()}
                      </Td>
                      <Td theme={theme}>
                        <FormInput 
                          type="number" 
                          placeholder="0.00" 
                          value={row.adjustAmount} 
                          onChange={(e) => handleBulkRowChange(idx, 'adjustAmount', e.target.value)} 
                          theme={theme}
                          style={{ width: '90px', padding: '8px' }}
                        />
                      </Td>
                      <Td theme={theme}>
                        <FormSelect 
                          value={row.type} 
                          onChange={(e) => handleBulkRowChange(idx, 'type', e.target.value)} 
                          theme={theme}
                          style={{ padding: '8px', width: '95px' }}
                        >
                          <option value="Credit">Credit</option>
                          <option value="Debit">Debit</option>
                        </FormSelect>
                      </Td>
                      <Td theme={theme}>
                        <FormSelect 
                          value={row.payment} 
                          onChange={(e) => handleBulkRowChange(idx, 'payment', e.target.value)} 
                          theme={theme}
                          style={{ padding: '8px', width: '95px' }}
                        >
                          <option value="Cash">Cash</option>
                          <option value="Bank">Bank</option>
                          <option value="Online">Online</option>
                          <option value="Cheque">Cheque</option>
                        </FormSelect>
                      </Td>
                      <Td theme={theme}>
                        <FormInput 
                          type="text" 
                          placeholder="Reference" 
                          value={row.reference} 
                          onChange={(e) => handleBulkRowChange(idx, 'reference', e.target.value)} 
                          theme={theme}
                          style={{ width: '100px', padding: '8px' }}
                        />
                      </Td>
                      <Td theme={theme}>
                        <FormInput 
                          type="text" 
                          placeholder="Remark" 
                          value={row.remark} 
                          onChange={(e) => handleBulkRowChange(idx, 'remark', e.target.value)} 
                          theme={theme}
                          style={{ width: '120px', padding: '8px' }}
                        />
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <Td colspan="7" style={{ textAlign: 'center', padding: '24px' }}>No active retailers found.</Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <SaveTransactionBtn theme={theme} style={{ width: 'auto', padding: '12px 32px' }} onClick={handleSaveBulkAll}>
              Save All
            </SaveTransactionBtn>
            <OutlineBtn theme={theme} onClick={() => setSubView('tabs')}>
              Cancel
            </OutlineBtn>
          </div>
        </>
      ) : (
        <>
          <Title theme={theme}>{t('Account')}</Title>
          <Breadcrumb theme={theme}>
            <BreadLink theme={theme} onClick={() => setAppActiveTab('dashboard')}>Dashboard</BreadLink>
            <span>•</span>
            <span>Account</span>
          </Breadcrumb>

          <TopActions>
            <OutlineBtn theme={theme} onClick={handleBulkPaymentOpen}>
              <Wallet size={16} />
              {t('Bulk Payment')}
            </OutlineBtn>
            <OutlineBtn theme={theme} onClick={() => setLedgerModalOpen(true)}>
              <Layers size={16} />
              {t('Account Ledger')}
            </OutlineBtn>
            <OutlineBtn theme={theme} onClick={() => alert("Sales/Purchase Register Action Triggered")}>
              <Layers size={16} />
              {t('Sales/Purchase Register')}
            </OutlineBtn>
          </TopActions>

          <TabContainer theme={theme}>
            <Tab active={activeTab === 'overview'} theme={theme} onClick={() => setActiveTab('overview')}>
              {t('Account Overview')}
            </Tab>
            <Tab active={activeTab === 'add_transaction'} theme={theme} onClick={() => setActiveTab('add_transaction')}>
              {t('Add Transaction')}
            </Tab>
          </TabContainer>

      {alertMsg && (
        <div style={{ padding: '12px', backgroundColor: '#e2f9ec', color: '#00AB55', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
          {alertMsg}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          <SummaryCardsRow>
            <SummaryCard bgColor="#ef4444">
              <CardIcon><ArrowDownRight size={28} /></CardIcon>
              <CardAmount>₹{summary.debit.toLocaleString()}</CardAmount>
              <CardLabel>Debit</CardLabel>
            </SummaryCard>

            <SummaryCard bgColor="#22c55e">
              <CardIcon><ArrowUpLeft size={28} /></CardIcon>
              <CardAmount>₹{summary.credit.toLocaleString()}</CardAmount>
              <CardLabel>Credit</CardLabel>
            </SummaryCard>

            <SummaryCard bgColor="#f59e0b">
              <CardIcon><HelpCircle size={28} /></CardIcon>
              <CardAmount>₹{summary.adjust.toLocaleString()}</CardAmount>
              <CardLabel>Adjust</CardLabel>
            </SummaryCard>

            <SummaryCard bgColor="#3b82f6">
              <CardIcon><Wallet size={28} /></CardIcon>
              <CardAmount>
                {summary.balance < 0 ? '-' : ''}₹{Math.abs(summary.balance).toLocaleString()}
              </CardAmount>
              <CardLabel>Balance</CardLabel>
            </SummaryCard>
          </SummaryCardsRow>

          <HistoryHeader theme={theme}>{t('Transaction History')}</HistoryHeader>
          
          <FilterRow>
            <SearchWrapper>
              <SearchIconWrapper theme={theme}>
                <Search size={18} />
              </SearchIconWrapper>
              <SearchInput 
                type="text" 
                placeholder={t('Search')} 
                value={filterSearch} 
                onChange={(e) => setFilterSearch(e.target.value)}
                theme={theme}
              />
            </SearchWrapper>

            <SelectFilter theme={theme} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
              <option value="Adjust">Adjust</option>
            </SelectFilter>

            <SelectFilter theme={theme} value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
              <option value="All">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Online">Online</option>
              <option value="Cheque">Cheque</option>
            </SelectFilter>
          </FilterRow>

          <TableWrapper theme={theme}>
            <Table>
              <thead>
                <tr>
                  <Th theme={theme}>Date</Th>
                  <Th theme={theme}>From</Th>
                  <Th theme={theme}>To</Th>
                  <Th theme={theme}>Type</Th>
                  <Th theme={theme}>Payment</Th>
                  <Th theme={theme}>Amount</Th>
                  <Th theme={theme}>Adjust</Th>
                  <Th theme={theme}>Reference</Th>
                  <Th theme={theme}>Remark</Th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map(t => {
                    const badge = getTypeBadgeStyles(t.type);
                    return (
                      <Tr key={t._id} theme={theme}>
                        <Td>{t.date}</Td>
                        <Td>{t.from}</Td>
                        <Td>{t.to}</Td>
                        <Td>
                          <TypeBadge bgColor={badge.bg} colorVal={badge.text}>
                            {t.type}
                          </TypeBadge>
                        </Td>
                        <Td>{t.payment}</Td>
                        <Td>₹{t.amount.toLocaleString()}</Td>
                        <Td>{t.adjust ? `₹${t.adjust.toLocaleString()}` : '-'}</Td>
                        <Td>{t.reference || '-'}</Td>
                        <Td>{t.remark || '-'}</Td>
                      </Tr>
                    );
                  })
                ) : (
                  <tr>
                    <Td colSpan="9" style={{ textAlign: 'center', padding: '24px' }}>
                      No transactions recorded
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </>
      )}

      {/* ADD TRANSACTION TAB */}
      {activeTab === 'add_transaction' && (
        <Form onSubmit={handleSaveTransaction} theme={theme}>
          <FormGrid>
            <FormGroup>
              <FormLabel theme={theme}>Date</FormLabel>
              <DatePickerWrapper theme={theme}>
                <DatePicker 
                  selected={transDate} 
                  onChange={(date) => setTransDate(date)} 
                  dateFormat="yyyy-MM-dd"
                />
              </DatePickerWrapper>
            </FormGroup>

            <FormGroup>
              <FormLabel theme={theme}>To</FormLabel>
              <FormInput 
                type="text" 
                value={transTo} 
                onChange={(e) => setTransTo(e.target.value)} 
                placeholder="Retailer or Entity name"
                required
                theme={theme}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel theme={theme}>Type</FormLabel>
              <ToggleContainer>
                <ToggleButton 
                  type="button" 
                  active={transType === 'Debit'} 
                  onClick={() => setTransType('Debit')}
                  theme={theme}
                >
                  Debit
                </ToggleButton>
                <ToggleButton 
                  type="button" 
                  active={transType === 'Credit'} 
                  onClick={() => setTransType('Credit')}
                  theme={theme}
                >
                  Credit
                </ToggleButton>
                <ToggleButton 
                  type="button" 
                  active={transType === 'Adjust'} 
                  onClick={() => setTransType('Adjust')}
                  theme={theme}
                >
                  Adjust
                </ToggleButton>
              </ToggleContainer>
            </FormGroup>

            <FormGroup>
              <FormLabel theme={theme}>Payment</FormLabel>
              <FormSelect 
                value={transPayment} 
                onChange={(e) => setTransPayment(e.target.value)}
                theme={theme}
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Online">Online</option>
                <option value="Cheque">Cheque</option>
                <option value="None">None</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel theme={theme}>Amount</FormLabel>
              <PrefixInputWrapper theme={theme}>
                <CurrencyPrefix theme={theme}>₹</CurrencyPrefix>
                <FormInputPrefixed 
                  type="number" 
                  value={transAmount} 
                  onChange={(e) => setTransAmount(e.target.value)} 
                  placeholder="0.00"
                  required
                  theme={theme}
                />
              </PrefixInputWrapper>
            </FormGroup>

            <FormGroup>
              <FormLabel theme={theme}>Adjust</FormLabel>
              <FormInput 
                type="number" 
                value={transAdjust} 
                onChange={(e) => setTransAdjust(e.target.value)} 
                placeholder="0.00"
                theme={theme}
              />
            </FormGroup>

            <FormGroup style={{ gridColumn: 'span 2' }}>
              <FormLabel theme={theme}>Reference</FormLabel>
              <FormInput 
                type="text" 
                value={transRef} 
                onChange={(e) => setTransRef(e.target.value)} 
                placeholder="e.g. T-199 or Bill Reference"
                theme={theme}
              />
            </FormGroup>

            <FormGroup style={{ gridColumn: 'span 2' }}>
              <FormLabel theme={theme}>Remark</FormLabel>
              <FormTextarea 
                value={transRemark} 
                onChange={(e) => setTransRemark(e.target.value)} 
                placeholder="Type remark..."
                theme={theme}
              />
            </FormGroup>
          </FormGrid>

          <SaveTransactionBtn type="submit" theme={theme}>
            <Save size={18} />
            💾 {t('Save Changes')}
          </SaveTransactionBtn>
        </Form>
      )}
        </>
      )}
    </Container>
  );
};

export default Account;
