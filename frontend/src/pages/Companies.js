import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Plus, 
  Download, 
  Search, 
  X, 
  Edit2, 
  Layers, 
  Sun, 
  Moon, 
  Check, 
  ArrowLeft,
  Clock,
  User
} from 'lucide-react';
import axios from 'axios';

const Container = styled.div`
  font-family: 'Public Sans', 'Inter', sans-serif;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const LeftActions = styled.div`
  display: flex;
  gap: 12px;
`;

const OutlineBtn = styled.button`
  padding: 10px 20px;
  background-color: transparent;
  color: ${props => props.theme.primary};
  border: 1.5px solid ${props => props.theme.primary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => `${props.theme.primary}10`};
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 280px;

  @media (max-width: 480px) {
    width: 100%;
  }
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

// TABLE SYSTEM
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background-color: ${props => props.theme.card};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: ${props => props.dense ? '10px 16px' : '16px'};
  background-color: ${props => props.theme.isDark ? '#2d3748' : '#f4f6f8'};
  color: ${props => props.theme.muted};
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Td = styled.td`
  padding: ${props => props.dense ? '8px 16px' : '14px 16px'};
  font-size: 14px;
  border-bottom: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const ActiveName = styled.span`
  font-weight: 700;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  color: ${props => props.colorVal || props.theme.text};
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  }
`;

const StyledSwitchContainer = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  user-select: none;
`;

const StyledSwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const StyledSwitchTrack = styled.div`
  width: 32px;
  height: 18px;
  background-color: ${props => props.checked ? '#00AB55' : props.theme.border};
  border-radius: 9px;
  position: relative;
  transition: background-color 0.2s;
`;

const StyledSwitchThumb = styled.div`
  width: 12px;
  height: 12px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: ${props => props.checked ? '17px' : '3px'};
  transition: left 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
`;

const TypePill = styled.span`
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${props => props.theme.primary};
  color: ${props => props.theme.primary};
`;

const StatusPill = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${props => props.active ? '#e2f9ec' : '#ffe8e6'};
  color: ${props => props.active ? '#00AB55' : '#ff4842'};
`;

// FOOTER
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  flex-wrap: wrap;
  gap: 16px;
  background-color: ${props => props.theme.card};
  border-top: 1px solid ${props => props.theme.border};
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.muted};
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text};
`;

const DenseToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
`;

// MANAGE PRODUCTS SUBVIEW
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

const SelectAllRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
`;

const SelectedCountBanner = styled.div`
  background-color: ${props => props.theme.isDark ? '#1a202c' : '#f4f6f8'};
  color: ${props => props.theme.muted};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductSelectionCard = styled.div`
  background-color: ${props => props.checked ? `${props.theme.primary}10` : props.theme.card};
  border: 1.5px solid ${props => props.checked ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const CheckIcon = styled.div`
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
`;

const SaveBtn = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px ${props => `${props.theme.primary}24`};
  display: flex;
  align-items: center;
  gap: 8px;
  float: right;

  &:hover {
    filter: brightness(0.95);
  }
`;

// PRODUCT RATE CARD
const RateCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ProductImageContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`;

const RateCardName = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-align: center;
  color: ${props => props.theme.text};
`;

const ShiftRatesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
`;

const ShiftBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ShiftRateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.muted};
`;

const BaseRateLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.primary};
  font-weight: 700;
  margin-bottom: 2px;
`;

const RateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const RateSymbol = styled.span`
  position: absolute;
  left: 8px;
  font-size: 12px;
  color: ${props => props.theme.text};
`;

const RateInput = styled.input`
  width: 100%;
  padding: 6px 6px 6px 20px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

// MODAL
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  width: 480px;
  max-width: 90%;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
  overflow: hidden;
  padding: 24px;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.muted};
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px;
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

const Select = styled.select`
  padding: 10px;
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

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

const CancelBtn = styled.button`
  padding: 10px 20px;
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: ${props => props.theme.muted};
`;

const PrimaryBtn = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 10px ${props => `${props.theme.primary}24`};
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
  }
`;

const EditContainer = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 24px 0 16px 0;
  width: 100%;
  border-bottom: 1.5px solid ${props => props.theme.border};
  padding-bottom: 8px;
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 12px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  cursor: pointer;
  user-select: none;

  input {
    width: 18px;
    height: 18px;
    accent-color: ${props => props.theme.primary};
    cursor: pointer;
  }
`;

const FieldContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const FieldLabel = styled.span`
  position: absolute;
  top: -8px;
  left: 12px;
  background-color: ${props => props.theme.card};
  padding: 0 6px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.muted};
  transition: all 0.2s;
  z-index: 1;
`;

const OutlinedInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const OutlinedSelect = styled.select`
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  box-sizing: border-box;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const OutlinedTextarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FieldIconWrapper = styled.div`
  position: absolute;
  right: 14px;
  top: 13px;
  color: ${props => props.theme.muted};
  display: flex;
  align-items: center;
`;

// Helper to return beautiful PNG illustrations for Amul products
const getProductIllustration = (name, size = 64) => {
  const lower = name.toLowerCase();
  let src = '/assets/amul_taaza.png'; // Default fallback
  
  if (lower.includes('taaza')) {
    src = '/assets/amul_taaza.png';
  } else if (lower.includes('gold')) {
    src = '/assets/amul_gold.png';
  } else if (lower.includes('buffalo')) {
    src = '/assets/amul_buffalo.png';
  } else if (lower.includes('cow')) {
    src = '/assets/amul_cow.png';
  } else if (lower.includes('mazza')) {
    src = '/assets/amul_mazza.png';
  } else if (lower.includes('dahi') || lower.includes('curd')) {
    src = '/assets/amul_dahi.png';
  } else if (lower.includes('bm') || lower.includes('sour') || lower.includes('butter')) {
    src = '/assets/amul_buttermilk.png';
  } else if (lower.includes('paneer')) {
    src = '/assets/amul_paneer.png';
  } else if (lower.includes('tea') || lower.includes('spe.')) {
    src = '/assets/amul_taaza.png'; // fallback or similar
  }

  return (
    <img 
      src={src} 
      alt={name} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        objectFit: 'contain',
        filter: 'drop-shadow(0px 6px 8px rgba(0, 0, 0, 0.15))' 
      }} 
    />
  );
};


const Companies = ({ setActiveTab: setAppActiveTab, token }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  // Navigation Subviews
  const [subView, setSubView] = useState('list'); // 'list', 'manage_products', or 'edit'
  const [activeTab, setActiveTab] = useState('product_manage'); // 'product_manage' or 'product_rate_manage'
  const [editTab, setEditTab] = useState('company_info'); // 'company_info', 'contact_info', 'address_info', 'payment_info', 'other_info'
  
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // Modals States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    companyCode: '',
    firmName: '',
    firmNameGujarati: '',
    companyType: 'Retailer',
    status: 'Active',
    accountName: '',
    lockType: 'None',
    panCard: '',
    gst: '',
    foodLicense: '',
    parentCompany: 'Yash Milk Marketing-Rajkot-1007459M',
    whatsapp: '',
    mobile1: '',
    mobile2: '',
    email: '',
    address: '',
    state: 'Gujarat',
    city: 'Rajkot',
    pincode: '',
    shippingAddressSame: true,
    shippingAddress: '',
    shippingState: 'Gujarat',
    shippingCity: 'Rajkot',
    shippingPincode: '',
    bankName: '',
    branch: '',
    accountNumber: '',
    accountType: 'Current',
    branchAddress: '',
    ifsc: '',
    upiCode: '',
    customerMorningTime: '09:10',
    customerEveningTime: '00:00',
    reportMorningTime: '09:45',
    reportEveningTime: '14:30',
    distributionChannel: '0',
    rateSettings: 'InnerCity',
    appAccounting: true,
    accountLedger: true,
    salesPurchaseRegister: false,
    isOrderInCrate: true
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  const handleStatusToggle = async (company) => {
    const nextStatus = company.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`/api/companies/${company._id}`, {
        ...company,
        status: nextStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      companyCode: '',
      firmName: '',
      firmNameGujarati: '',
      companyType: 'Retailer',
      status: 'Active'
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (company) => {
    setSelectedCompany(company);
    setFormData({
      companyCode: company.companyCode || '',
      firmName: company.firmName || '',
      firmNameGujarati: company.firmNameGujarati || '',
      companyType: company.companyType || 'Retailer',
      status: company.status || 'Active',
      accountName: company.accountName || '',
      lockType: company.lockType || 'None',
      panCard: company.panCard || '',
      gst: company.gst || '',
      foodLicense: company.foodLicense || '',
      parentCompany: company.parentCompany || 'Yash Milk Marketing-Rajkot-1007459M',
      whatsapp: company.whatsapp || '',
      mobile1: company.mobile1 || '',
      mobile2: company.mobile2 || '',
      email: company.email || '',
      address: company.address || '',
      state: company.state || 'Gujarat',
      city: company.city || 'Rajkot',
      pincode: company.pincode || '',
      shippingAddressSame: company.shippingAddressSame !== undefined ? company.shippingAddressSame : true,
      shippingAddress: company.shippingAddress || '',
      shippingState: company.shippingState || 'Gujarat',
      shippingCity: company.shippingCity || 'Rajkot',
      shippingPincode: company.shippingPincode || '',
      bankName: company.bankName || '',
      branch: company.branch || '',
      accountNumber: company.accountNumber || '',
      accountType: company.accountType || 'Current',
      branchAddress: company.branchAddress || '',
      ifsc: company.ifsc || '',
      upiCode: company.upiCode || '',
      customerMorningTime: company.customerMorningTime || '09:10',
      customerEveningTime: company.customerEveningTime || '00:00',
      reportMorningTime: company.reportMorningTime || '09:45',
      reportEveningTime: company.reportEveningTime || '14:30',
      distributionChannel: company.distributionChannel || '0',
      rateSettings: company.rateSettings || 'InnerCity',
      appAccounting: company.appAccounting !== undefined ? company.appAccounting : true,
      accountLedger: company.accountLedger !== undefined ? company.accountLedger : true,
      salesPurchaseRegister: company.salesPurchaseRegister !== undefined ? company.salesPurchaseRegister : false,
      isOrderInCrate: company.isOrderInCrate !== undefined ? company.isOrderInCrate : true
    });
    setSubView('edit');
    setEditTab('company_info');
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/companies', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddModalOpen(false);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding company');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/companies/${selectedCompany._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubView('list');
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating company');
    }
  };

  const handleManageProducts = (company) => {
    setSelectedCompany(company);
    setSubView('manage_products');
    setActiveTab('product_manage');
    setProductSearch('');
  };

  // Toggle selection on specific product
  const handleProductToggle = (prodIndex) => {
    const updatedProducts = [...selectedCompany.products];
    updatedProducts[prodIndex] = {
      ...updatedProducts[prodIndex],
      selected: !updatedProducts[prodIndex].selected
    };
    setSelectedCompany(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const handleSelectAllProducts = (checked) => {
    const updatedProducts = selectedCompany.products.map(p => ({
      ...p,
      selected: checked
    }));
    setSelectedCompany(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const handleSaveProductSelection = async () => {
    try {
      await axios.put(`/api/companies/${selectedCompany._id}`, {
        ...selectedCompany,
        products: selectedCompany.products
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product list saved successfully!');
      fetchCompanies();
    } catch (err) {
      alert('Failed to save products');
    }
  };

  const handleRateChange = (prodIndex, shift, val) => {
    const rateVal = parseFloat(val) || 0;
    const updatedProducts = [...selectedCompany.products];
    updatedProducts[prodIndex] = {
      ...updatedProducts[prodIndex],
      [shift]: rateVal
    };
    setSelectedCompany(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const handleSaveRates = async () => {
    try {
      await axios.put(`/api/companies/${selectedCompany._id}`, {
        ...selectedCompany,
        products: selectedCompany.products
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Rates updated successfully!');
      fetchCompanies();
    } catch (err) {
      alert('Failed to save rates');
    }
  };

  // Listings selectors
  const filteredCompanies = companies.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.firmName?.toLowerCase().includes(term) ||
      c.firmNameGujarati?.toLowerCase().includes(term) ||
      c.companyCode?.toLowerCase().includes(term) ||
      c.companyType?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage) || 1;
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Render Subview: Manage Products
  if (subView === 'manage_products' && selectedCompany) {
    const selectedCount = selectedCompany.products.filter(p => p.selected).length;
    const isAllSelected = selectedCompany.products.length === selectedCount;

    const filteredProds = selectedCompany.products.map((p, originalIndex) => ({ ...p, originalIndex }))
      .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

    const activeOnlyProds = selectedCompany.products.map((p, originalIndex) => ({ ...p, originalIndex }))
      .filter(p => p.selected && p.name.toLowerCase().includes(productSearch.toLowerCase()));

    return (
      <Container>
        <Breadcrumb theme={theme}>
          <BreadLink theme={theme} onClick={() => setAppActiveTab('dashboard')}>{t('Dashboard')}</BreadLink>
          <span>•</span>
          <BreadLink theme={theme} onClick={() => setSubView('list')}>{t('Companies')}</BreadLink>
          <span>•</span>
          <span>Manage Products</span>
        </Breadcrumb>

        <HeaderRow>
          <div>
            <Title theme={theme}>Manage Products</Title>
            <p style={{ margin: '4px 0 0 0', color: theme.muted, fontSize: '14px', fontWeight: 600 }}>
              Company: {selectedCompany.firmName} ({selectedCompany.companyCode})
            </p>
          </div>
          <OutlineBtn theme={theme} onClick={() => setSubView('list')}>
            <ArrowLeft size={16} /> Back to Companies
          </OutlineBtn>
        </HeaderRow>

        <TabContainer theme={theme}>
          <Tab active={activeTab === 'product_manage'} theme={theme} onClick={() => setActiveTab('product_manage')}>
            Product Manage
          </Tab>
          <Tab active={activeTab === 'product_rate_manage'} theme={theme} onClick={() => setActiveTab('product_rate_manage')}>
            Product Rate Manage
          </Tab>
        </TabContainer>

        {activeTab === 'product_manage' ? (
          <>
            <SelectAllRow theme={theme}>
              <SearchWrapper style={{ margin: 0, width: '320px' }}>
                <SearchIconWrapper theme={theme}><Search size={18} /></SearchIconWrapper>
                <SearchInput 
                  type="text" 
                  placeholder="Search products..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  theme={theme}
                />
              </SearchWrapper>
              
              <DenseToggle>
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAllProducts(e.target.checked)}
                />
                <span style={{ fontWeight: 700, color: theme.primary, border: `1.5px solid ${theme.primary}`, padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Select All
                </span>
              </DenseToggle>
            </SelectAllRow>

            <SelectedCountBanner theme={theme}>
              Selected: {selectedCount} / 33 products
            </SelectedCountBanner>

            <ProductsGrid>
              {filteredProds.map((p) => (
                <ProductSelectionCard 
                  key={p.name} 
                  checked={p.selected} 
                  theme={theme}
                  onClick={() => handleProductToggle(p.originalIndex)}
                >
                  <CardLeft>
                    <input 
                      type="checkbox" 
                      checked={p.selected} 
                      onChange={() => {}} // Controlled click on card
                    />
                    {getProductIllustration(p.name, 32)}
                    <CardText theme={theme}>{p.name}</CardText>
                  </CardLeft>
                  {p.selected && (
                    <CheckIcon theme={theme}><Check size={18} strokeWidth={3} /></CheckIcon>
                  )}
                </ProductSelectionCard>
              ))}
            </ProductsGrid>

            <div style={{ overflow: 'auto' }}>
              <SaveBtn theme={theme} onClick={handleSaveProductSelection}>
                <Check size={18} /> Save Changes
              </SaveBtn>
            </div>
          </>
        ) : (
          <>
            <SelectAllRow theme={theme}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 700, border: `1px solid ${theme.primary}`, color: theme.primary, padding: '4px 12px', borderRadius: '15px', fontSize: '13px' }}>
                  {selectedCount} Products
                </span>
                <SearchWrapper style={{ margin: 0, width: '280px' }}>
                  <SearchIconWrapper theme={theme}><Search size={18} /></SearchIconWrapper>
                  <SearchInput 
                    type="text" 
                    placeholder="Search products..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    theme={theme}
                  />
                </SearchWrapper>
              </div>
            </SelectAllRow>

            <ProductsGrid>
              {activeOnlyProds.map((p) => (
                <RateCard key={p.name} theme={theme}>
                  <ProductImageContainer>
                    {getProductIllustration(p.name)}
                  </ProductImageContainer>
                  <RateCardName theme={theme}>{p.name}</RateCardName>
                  
                  <ShiftRatesContainer>
                    <ShiftBox>
                      <ShiftRateHeader theme={theme}>
                        <Sun size={14} color="#00AB55" /> Morning Rate
                      </ShiftRateHeader>
                      <BaseRateLabel theme={theme}>₹{p.baseRate.toFixed(4)}</BaseRateLabel>
                      <RateInputWrapper>
                        <RateSymbol theme={theme}>₹</RateSymbol>
                        <RateInput 
                          type="number"
                          step="0.01"
                          value={p.morningRate}
                          onChange={(e) => handleRateChange(p.originalIndex, 'morningRate', e.target.value)}
                          theme={theme}
                        />
                      </RateInputWrapper>
                    </ShiftBox>

                    <ShiftBox>
                      <ShiftRateHeader theme={theme}>
                        <Moon size={14} color="#919eab" /> Evening Rate
                      </ShiftRateHeader>
                      <BaseRateLabel theme={theme}>₹{p.baseRate.toFixed(4)}</BaseRateLabel>
                      <RateInputWrapper>
                        <RateSymbol theme={theme}>₹</RateSymbol>
                        <RateInput 
                          type="number"
                          step="0.01"
                          value={p.eveningRate}
                          onChange={(e) => handleRateChange(p.originalIndex, 'eveningRate', e.target.value)}
                          theme={theme}
                        />
                      </RateInputWrapper>
                    </ShiftBox>
                  </ShiftRatesContainer>
                </RateCard>
              ))}
            </ProductsGrid>

            <div style={{ overflow: 'auto' }}>
              <SaveBtn theme={theme} onClick={handleSaveRates}>
                <Check size={18} /> Save Rate Changes
              </SaveBtn>
            </div>
          </>
        )}
      </Container>
    );
  }

  // Render Subview: Edit Company
  if (subView === 'edit' && selectedCompany) {
    return (
      <Container>
        <Breadcrumb theme={theme}>
          <BreadLink theme={theme} onClick={() => setAppActiveTab('dashboard')}>{t('Dashboard')}</BreadLink>
          <span>•</span>
          <BreadLink theme={theme} onClick={() => setSubView('list')}>{t('Companies')}</BreadLink>
          <span>•</span>
          <span>{formData.firmName}</span>
        </Breadcrumb>

        <HeaderRow>
          <div>
            <Title theme={theme} style={{ margin: 0 }}>Edit Company</Title>
          </div>
          <OutlineBtn theme={theme} onClick={() => setSubView('list')}>
            <ArrowLeft size={16} /> Back to Companies
          </OutlineBtn>
        </HeaderRow>

        <TabContainer theme={theme}>
          <Tab active={editTab === 'company_info'} theme={theme} onClick={() => setEditTab('company_info')}>
            Company Info
          </Tab>
          <Tab active={editTab === 'contact_info'} theme={theme} onClick={() => setEditTab('contact_info')}>
            Contact Info
          </Tab>
          <Tab active={editTab === 'address_info'} theme={theme} onClick={() => setEditTab('address_info')}>
            Address Info
          </Tab>
          <Tab active={editTab === 'payment_info'} theme={theme} onClick={() => setEditTab('payment_info')}>
            Payment Info
          </Tab>
          <Tab active={editTab === 'other_info'} theme={theme} onClick={() => setEditTab('other_info')}>
            Other Info
          </Tab>
        </TabContainer>

        <form onSubmit={handleEditSubmit}>
          <EditContainer theme={theme}>
            {editTab === 'company_info' && (
              <FormGrid>
                <FieldContainer>
                  <FieldLabel theme={theme}>Company Code</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="companyCode" 
                    value={formData.companyCode} 
                    onChange={handleFormChange} 
                    required 
                    theme={theme} 
                  />
                </FieldContainer>
                
                <FieldContainer>
                  <FieldLabel theme={theme}>Firm Name (English)</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="firmName" 
                    value={formData.firmName} 
                    onChange={handleFormChange} 
                    required 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Firm Name (Gujarati)</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="firmNameGujarati" 
                    value={formData.firmNameGujarati} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Account Name</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="accountName" 
                    value={formData.accountName} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Company Type</FieldLabel>
                  <OutlinedSelect 
                    name="companyType" 
                    value={formData.companyType} 
                    onChange={handleFormChange} 
                    theme={theme}
                  >
                    <option value="Retailer">Retailer</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Distributor">Distributor</option>
                  </OutlinedSelect>
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Lock Type</FieldLabel>
                  <OutlinedSelect 
                    name="lockType" 
                    value={formData.lockType} 
                    onChange={handleFormChange} 
                    theme={theme}
                  >
                    <option value="None">None</option>
                    <option value="Locked">Evening Lock</option>
                  </OutlinedSelect>
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>PAN Card</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="panCard" 
                    value={formData.panCard} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>GST</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="gst" 
                    value={formData.gst} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Food License</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="foodLicense" 
                    value={formData.foodLicense} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Parent Company</FieldLabel>
                  <OutlinedSelect 
                    name="parentCompany" 
                    value={formData.parentCompany} 
                    onChange={handleFormChange} 
                    theme={theme}
                  >
                    <option value="Yash Milk Marketing-Rajkot-1007459M">Yash Milk Marketing-Rajkot-1007459M</option>
                  </OutlinedSelect>
                </FieldContainer>
              </FormGrid>
            )}

            {editTab === 'contact_info' && (
              <FormGrid>
                <FieldContainer>
                  <FieldLabel theme={theme}>WhatsApp Number</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="whatsapp" 
                    value={formData.whatsapp} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                  <FieldIconWrapper theme={theme}>
                    <User size={18} />
                  </FieldIconWrapper>
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Mobile Number 1</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="mobile1" 
                    value={formData.mobile1} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                  <FieldIconWrapper theme={theme}>
                    <User size={18} />
                  </FieldIconWrapper>
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Mobile Number 2</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="mobile2" 
                    value={formData.mobile2} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                  <FieldIconWrapper theme={theme}>
                    <User size={18} />
                  </FieldIconWrapper>
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Email</FieldLabel>
                  <OutlinedInput 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>
              </FormGrid>
            )}

            {editTab === 'address_info' && (
              <div>
                <SectionTitle theme={theme}>Company Address</SectionTitle>
                <FieldContainer>
                  <FieldLabel theme={theme}>Address</FieldLabel>
                  <OutlinedTextarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>
                
                <FormGrid>
                  <FieldContainer>
                    <FieldLabel theme={theme}>State</FieldLabel>
                    <OutlinedSelect 
                      name="state" 
                      value={formData.state} 
                      onChange={handleFormChange} 
                      theme={theme}
                    >
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </OutlinedSelect>
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel theme={theme}>City</FieldLabel>
                    <OutlinedSelect 
                      name="city" 
                      value={formData.city} 
                      onChange={handleFormChange} 
                      theme={theme}
                    >
                      <option value="Rajkot">Rajkot</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Surat">Surat</option>
                      <option value="Vadodara">Vadodara</option>
                    </OutlinedSelect>
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel theme={theme}>Pincode</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                </FormGrid>

                <SectionTitle theme={theme}>Shipping Address</SectionTitle>
                <div style={{ marginBottom: '20px' }}>
                  <StyledCheckboxLabel theme={theme}>
                    <input 
                      type="checkbox" 
                      name="shippingAddressSame"
                      checked={formData.shippingAddressSame} 
                      onChange={(e) => setFormData(prev => ({ ...prev, shippingAddressSame: e.target.checked }))}
                    />
                    <span>Same as Company Address</span>
                  </StyledCheckboxLabel>
                </div>

                {!formData.shippingAddressSame && (
                  <>
                    <FieldContainer>
                      <FieldLabel theme={theme}>Shipping Address</FieldLabel>
                      <OutlinedTextarea 
                        name="shippingAddress" 
                        value={formData.shippingAddress} 
                        onChange={handleFormChange} 
                        theme={theme} 
                      />
                    </FieldContainer>
                    <FormGrid>
                      <FieldContainer>
                        <FieldLabel theme={theme}>Shipping State</FieldLabel>
                        <OutlinedSelect 
                          name="shippingState" 
                          value={formData.shippingState} 
                          onChange={handleFormChange} 
                          theme={theme}
                        >
                          <option value="Gujarat">Gujarat</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Rajasthan">Rajasthan</option>
                        </OutlinedSelect>
                      </FieldContainer>

                      <FieldContainer>
                        <FieldLabel theme={theme}>Shipping City</FieldLabel>
                        <OutlinedSelect 
                          name="shippingCity" 
                          value={formData.shippingCity} 
                          onChange={handleFormChange} 
                          theme={theme}
                        >
                          <option value="Rajkot">Rajkot</option>
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Surat">Surat</option>
                        </OutlinedSelect>
                      </FieldContainer>

                      <FieldContainer>
                        <FieldLabel theme={theme}>Shipping Pincode</FieldLabel>
                        <OutlinedInput 
                          type="text" 
                          name="shippingPincode" 
                          value={formData.shippingPincode} 
                          onChange={handleFormChange} 
                          theme={theme} 
                        />
                      </FieldContainer>
                    </FormGrid>
                  </>
                )}
              </div>
            )}

            {editTab === 'payment_info' && (
              <FormGrid>
                <FieldContainer>
                  <FieldLabel theme={theme}>Bank Name</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="bankName" 
                    value={formData.bankName} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Branch Name</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="branch" 
                    value={formData.branch} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Account Number</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="accountNumber" 
                    value={formData.accountNumber} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>Account Type</FieldLabel>
                  <OutlinedSelect 
                    name="accountType" 
                    value={formData.accountType} 
                    onChange={handleFormChange} 
                    theme={theme}
                  >
                    <option value="Current">Current</option>
                    <option value="Savings">Savings</option>
                  </OutlinedSelect>
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 2' }}>
                  <FieldLabel theme={theme}>Branch Address</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="branchAddress" 
                    value={formData.branchAddress} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>IFSC Code</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="ifsc" 
                    value={formData.ifsc} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel theme={theme}>UPI Code</FieldLabel>
                  <OutlinedInput 
                    type="text" 
                    name="upiCode" 
                    value={formData.upiCode} 
                    onChange={handleFormChange} 
                    theme={theme} 
                  />
                </FieldContainer>
              </FormGrid>
            )}

            {editTab === 'other_info' && (
              <div>
                <SectionTitle theme={theme} style={{ marginTop: 0 }}>Timing Settings</SectionTitle>
                <FormGrid>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Customer Morning Time</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="customerMorningTime" 
                      value={formData.customerMorningTime} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                    <FieldIconWrapper theme={theme}>
                      <Clock size={18} />
                    </FieldIconWrapper>
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel theme={theme}>Customer Evening Time</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="customerEveningTime" 
                      value={formData.customerEveningTime} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                    <FieldIconWrapper theme={theme}>
                      <Clock size={18} />
                    </FieldIconWrapper>
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel theme={theme}>Report Morning Time</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="reportMorningTime" 
                      value={formData.reportMorningTime} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                    <FieldIconWrapper theme={theme}>
                      <Clock size={18} />
                    </FieldIconWrapper>
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel theme={theme}>Report Evening Time</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="reportEveningTime" 
                      value={formData.reportEveningTime} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                    <FieldIconWrapper theme={theme}>
                      <Clock size={18} />
                    </FieldIconWrapper>
                  </FieldContainer>
                </FormGrid>

                <SectionTitle theme={theme}>Business Settings</SectionTitle>
                <FormGrid>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Distribution Channel</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="distributionChannel" 
                      value={formData.distributionChannel} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel theme={theme}>Rate Settings</FieldLabel>
                    <OutlinedSelect 
                      name="rateSettings" 
                      value={formData.rateSettings} 
                      onChange={handleFormChange} 
                      theme={theme}
                    >
                      <option value="InnerCity">InnerCity</option>
                      <option value="OuterCity">OuterCity</option>
                    </OutlinedSelect>
                  </FieldContainer>
                </FormGrid>

                <SectionTitle theme={theme}>Application Settings</SectionTitle>
                <CheckboxGrid>
                  <StyledCheckboxLabel theme={theme}>
                    <input 
                      type="checkbox" 
                      checked={formData.appAccounting} 
                      onChange={(e) => setFormData(prev => ({ ...prev, appAccounting: e.target.checked }))}
                    />
                    <span>App Accounting</span>
                  </StyledCheckboxLabel>

                  <StyledCheckboxLabel theme={theme}>
                    <input 
                      type="checkbox" 
                      checked={formData.accountLedger} 
                      onChange={(e) => setFormData(prev => ({ ...prev, accountLedger: e.target.checked }))}
                    />
                    <span>Account Ledger</span>
                  </StyledCheckboxLabel>

                  <StyledCheckboxLabel theme={theme}>
                    <input 
                      type="checkbox" 
                      checked={formData.salesPurchaseRegister} 
                      onChange={(e) => setFormData(prev => ({ ...prev, salesPurchaseRegister: e.target.checked }))}
                    />
                    <span>Sales/Purchase Register</span>
                  </StyledCheckboxLabel>

                  <StyledCheckboxLabel theme={theme}>
                    <input 
                      type="checkbox" 
                      checked={formData.isOrderInCrate} 
                      onChange={(e) => setFormData(prev => ({ ...prev, isOrderInCrate: e.target.checked }))}
                    />
                    <span>Is Order In Crate</span>
                  </StyledCheckboxLabel>
                </CheckboxGrid>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <PrimaryBtn type="submit" theme={theme} style={{ padding: '12px 24px' }}>
                <Check size={18} /> Save Changes
              </PrimaryBtn>
            </div>
          </EditContainer>
        </form>
      </Container>
    );
  }

  // Render View: Standard List
  return (
    <Container>
      <Title theme={theme}>{t('Companies')}</Title>
      <Breadcrumb theme={theme}>
        <BreadLink theme={theme} onClick={() => setAppActiveTab('dashboard')}>{t('Dashboard')}</BreadLink>
        <span>•</span>
        <span>{t('Companies')}</span>
      </Breadcrumb>

      <ActionsRow>
        <LeftActions>
          <OutlineBtn theme={theme} onClick={handleOpenAdd}>
            <Plus size={16} />
            Add New Company
          </OutlineBtn>
          <OutlineBtn theme={theme} onClick={() => alert("Import Companies triggered!")}>
            <Download size={16} />
            Import Companies
          </OutlineBtn>
        </LeftActions>

        <SearchWrapper>
          <SearchIconWrapper theme={theme}>
            <Search size={18} />
          </SearchIconWrapper>
          <SearchInput 
            type="text" 
            placeholder="Search company..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            theme={theme}
          />
        </SearchWrapper>
      </ActionsRow>

      {/* Grid Table pagination & dense control row above table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px', flexWrap: 'wrap', gap: '12px' }}>
        <DenseToggle style={{ userSelect: 'none' }}>
          <input 
            type="checkbox" 
            checked={dense} 
            onChange={(e) => setDense(e.target.checked)} 
          />
          <span style={{ fontWeight: '600', color: theme.text }}>Dense</span>
        </DenseToggle>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: theme.muted, fontWeight: '600' }}>
            <span>Rows per page:</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{ 
                padding: '4px 8px', 
                border: `1px solid ${theme.border}`, 
                borderRadius: '6px', 
                backgroundColor: theme.card, 
                color: theme.text,
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none'
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <PageInfo theme={theme} style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>
            {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, filteredCompanies.length)} of ${filteredCompanies.length}`}
          </PageInfo>
          
          <NavArrows>
            <ArrowBtn 
              theme={theme} 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              ◀
            </ArrowBtn>
            <ArrowBtn 
              theme={theme} 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              ▶
            </ArrowBtn>
          </NavArrows>
        </div>
      </div>

      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              <Th theme={theme} dense={dense}></Th>
              <Th theme={theme} dense={dense}>Company Name (Eng.)</Th>
              <Th theme={theme} dense={dense}>Company Name (Guj.)</Th>
              <Th theme={theme} dense={dense}>Code &uarr;</Th>
              <Th theme={theme} dense={dense}>Type</Th>
              <Th theme={theme} dense={dense}>Status</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map(comp => (
                <tr key={comp._id}>
                  <Td theme={theme} dense={dense}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ActionIcon theme={theme} colorVal="#00AB55" onClick={() => handleOpenEdit(comp)}>
                        <Edit2 size={16} />
                      </ActionIcon>
                      <ActionIcon theme={theme} colorVal="#2065D1" onClick={() => handleManageProducts(comp)}>
                        <Layers size={16} />
                      </ActionIcon>
                      <StyledSwitchContainer>
                        <StyledSwitchInput 
                          type="checkbox" 
                          checked={comp.status === 'Active'}
                          onChange={() => handleStatusToggle(comp)}
                        />
                        <StyledSwitchTrack checked={comp.status === 'Active'} theme={theme}>
                          <StyledSwitchThumb checked={comp.status === 'Active'} />
                        </StyledSwitchTrack>
                      </StyledSwitchContainer>
                    </div>
                  </Td>
                  <Td theme={theme} dense={dense}>
                    <ActiveName theme={theme} onClick={() => handleManageProducts(comp)}>
                      {comp.firmName}
                    </ActiveName>
                  </Td>
                  <Td theme={theme} dense={dense}>{comp.firmNameGujarati || '-'}</Td>
                  <Td theme={theme} dense={dense}>{comp.companyCode}</Td>
                  <Td theme={theme} dense={dense}>
                    <TypePill theme={theme}>{comp.companyType}</TypePill>
                  </Td>
                  <Td theme={theme} dense={dense}>
                    <StatusPill active={comp.status === 'Active'}>
                      {comp.status}
                    </StatusPill>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                  No companies found
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>

      {/* ADD COMPANY MODAL */}
      {addModalOpen && (
        <ModalOverlay>
          <ModalContent theme={theme}>
            <ModalHeader>
              <ModalTitle>Add New Company</ModalTitle>
              <CloseBtn theme={theme} onClick={() => setAddModalOpen(false)}><X size={20} /></CloseBtn>
            </ModalHeader>
            <form onSubmit={handleAddSubmit}>
              <FormGroup>
                <Label theme={theme}>Company Code</Label>
                <Input type="text" name="companyCode" value={formData.companyCode} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Firm Name (English)</Label>
                <Input type="text" name="firmName" value={formData.firmName} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Firm Name (Gujarati)</Label>
                <Input type="text" name="firmNameGujarati" value={formData.firmNameGujarati} onChange={handleFormChange} theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Company Type</Label>
                <Select name="companyType" value={formData.companyType} onChange={handleFormChange} theme={theme}>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributor">Distributor</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Status</Label>
                <Select name="status" value={formData.status} onChange={handleFormChange} theme={theme}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </FormGroup>
              <ButtonRow>
                <CancelBtn type="button" theme={theme} onClick={() => setAddModalOpen(false)}>{t('Cancel')}</CancelBtn>
                <PrimaryBtn type="submit" theme={theme}>Add Company</PrimaryBtn>
              </ButtonRow>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* EDIT COMPANY MODAL */}
      {editModalOpen && (
        <ModalOverlay>
          <ModalContent theme={theme}>
            <ModalHeader>
              <ModalTitle>Edit Company</ModalTitle>
              <CloseBtn theme={theme} onClick={() => setEditModalOpen(false)}><X size={20} /></CloseBtn>
            </ModalHeader>
            <form onSubmit={handleEditSubmit}>
              <FormGroup>
                <Label theme={theme}>Company Code</Label>
                <Input type="text" name="companyCode" value={formData.companyCode} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Firm Name (English)</Label>
                <Input type="text" name="firmName" value={formData.firmName} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Firm Name (Gujarati)</Label>
                <Input type="text" name="firmNameGujarati" value={formData.firmNameGujarati} onChange={handleFormChange} theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Company Type</Label>
                <Select name="companyType" value={formData.companyType} onChange={handleFormChange} theme={theme}>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributor">Distributor</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Status</Label>
                <Select name="status" value={formData.status} onChange={handleFormChange} theme={theme}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </FormGroup>
              <ButtonRow>
                <CancelBtn type="button" theme={theme} onClick={() => setEditModalOpen(false)}>{t('Cancel')}</CancelBtn>
                <PrimaryBtn type="submit" theme={theme}>Save Changes</PrimaryBtn>
              </ButtonRow>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const NavArrows = styled.div`
  display: flex;
  gap: 8px;
`;

const ArrowBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:disabled {
    color: ${props => props.theme.muted};
    cursor: not-allowed;
  }
`;

export default Companies;
