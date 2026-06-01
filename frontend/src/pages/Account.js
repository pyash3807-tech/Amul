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
  Save
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

  useEffect(() => {
    if (token) {
      fetchSummary();
      fetchTransactions();
    }
  }, [filterType, filterPayment, filterSearch, activeTab, token]);

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

  return (
    <Container>
      <Title theme={theme}>{t('Account')}</Title>
      <Breadcrumb theme={theme}>
        <BreadLink theme={theme} onClick={() => setAppActiveTab('dashboard')}>Dashboard</BreadLink>
        <span>•</span>
        <span>Account</span>
      </Breadcrumb>

      <TopActions>
        <OutlineBtn theme={theme} onClick={() => alert("Bulk Payment Action Triggered")}>
          <Wallet size={16} />
          {t('Bulk Payment')}
        </OutlineBtn>
        <OutlineBtn theme={theme} onClick={() => alert("Account Ledger Action Triggered")}>
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
    </Container>
  );
};

export default Account;
